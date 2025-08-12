"use client";

import { useState, useEffect, useCallback } from "react";
import ExpensesTable from "./ExpensesTable";
import ExpenseModal from "./ExpenseModal";
import AddExpenseModal from "./AddExpenseModal";

export default function AllExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [addingExpense, setAddingExpense] = useState(false);
  const [prioritySortOrder, setPrioritySortOrder] = useState(null); // "asc" | "desc" | null

  // Fetch expenses
  useEffect(() => {
    async function fetchExpenses() {
      const res = await fetch("/api/expenses");
      const data = await res.json();
      const parsed = data.map((e) => ({
        ...e,
        estimatedCost: e.estimatedCost !== null ? Number(e.estimatedCost) : 0,
      }));
      setExpenses(parsed);
    }
    fetchExpenses();
  }, []);

  // Update expense (edit)
  const updateExpenseField = useCallback(async (expenseNo, field, value) => {
    setExpenses((prev) =>
      prev.map((e) =>
        e.expenseNo === expenseNo
          ? {
              ...e,
              [field]: field === "estimatedCost" ? parseFloat(value) || 0 : value,
            }
          : e
      )
    );

    setSelectedExpense((prev) =>
      prev && prev.expenseNo === expenseNo
        ? {
            ...prev,
            [field]: field === "estimatedCost" ? parseFloat(value) || 0 : value,
          }
        : prev
    );

    try {
      await fetch(`/api/expenses/${expenseNo}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field, value }),
      });
    } catch (err) {
      console.error("Failed to update expense:", err);
    }
  }, []);

  // Add new expense
  const addExpense = async (newExpense) => {
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newExpense),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("API error response:", errorText);
        throw new Error(`Failed to add expense: ${res.status} ${res.statusText}`);
      }

      const createdExpense = await res.json();
      setExpenses((prev) => [
        ...prev,
        {
          ...createdExpense,
          estimatedCost: Number(createdExpense.estimatedCost) || 0,
        },
      ]);
      setAddingExpense(false);
    } catch (error) {
      console.error(error);
      alert("Failed to add expense");
    }
  };

  // Sorting function
  const sortByPriority = () => {
    const order = prioritySortOrder === "asc" ? "desc" : "asc";
    setPrioritySortOrder(order);

    const priorityRank = { High: 3, Medium: 2, Low: 1 };

    setExpenses((prev) =>
      [...prev].sort((a, b) => {
        return order === "asc"
          ? priorityRank[a.priority] - priorityRank[b.priority]
          : priorityRank[b.priority] - priorityRank[a.priority];
      })
    );
  };

  const closeModal = () => setSelectedExpense(null);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">All Expenses</h1>
        <button
          onClick={() => setAddingExpense(true)}
          className="bg-green-600 hover:bg-green-700 text-white rounded px-4 py-2"
        >
          + Add Expense
        </button>
      </div>

      <ExpensesTable
        expenses={expenses}
        onUpdateField={updateExpenseField}
        onExpenseNameClick={setSelectedExpense}
        onSortPriority={sortByPriority}
        prioritySortOrder={prioritySortOrder}
      />

      {selectedExpense && (
        <ExpenseModal
          expense={selectedExpense}
          onClose={closeModal}
          onUpdateField={updateExpenseField}
        />
      )}

      {addingExpense && (
        <AddExpenseModal
          onClose={() => setAddingExpense(false)}
          onAdd={addExpense}
        />
      )}
    </>
  );
}
