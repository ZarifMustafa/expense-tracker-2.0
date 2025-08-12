"use client";

import { useState, useEffect, useCallback } from "react";
import ExpensesTable from "./ExpensesTable";
import ExpenseModal from "./ExpenseModal";
import AddExpenseModal from "./AddExpenseModal"; // new modal import

export default function AllExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [addingExpense, setAddingExpense] = useState(false); // new state

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

    // Persist update
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


  const closeModal = () => setSelectedExpense(null);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">All Expenses</h1>
        <button
          onClick={() => setAddingExpense(true)}
          className="bg-green-600 hover:bg-green-700 text-white rounded px-4 py-2"
          aria-label="Add Expense"
        >
          + Add Expense
        </button>
      </div>

      <ExpensesTable
        expenses={expenses}
        onUpdateField={updateExpenseField}
        onExpenseNameClick={setSelectedExpense}
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
