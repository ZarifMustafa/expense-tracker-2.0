"use client";

import { useState } from "react";
import ColorBadge from "@/components/ColorBadge";

const priorityOptions = ["High", "Medium", "Low"];
const statusOptions = ["Pending", "In Progress", "Completed"];

export default function ExpensesTable({
  expenses,
  onUpdateField,
  onExpenseNameClick,
}) {
  const [editingCell, setEditingCell] = useState(null); // {expenseNo, field}

  const handleCellDoubleClick = (expenseNo, field) => {
    if (field === "expenseName") return; // not editable inline here
    setEditingCell({ expenseNo, field });
  };

  const handleInputChange = (e, expenseNo, field) => {
    onUpdateField(expenseNo, field, e.target.value);
  };

  const handleInputBlur = () => {
    setEditingCell(null);
  };

  return (
    <table className="min-w-full border border-gray-300 rounded-md">
      <thead className="bg-gray-100">
        <tr>
          <th className="border px-4 py-2">Expense Name</th>
          <th className="border px-4 py-2">Estimated Cost</th>
          <th className="border px-4 py-2">Priority</th>
          <th className="border px-4 py-2">Status</th>
        </tr>
      </thead>
      <tbody>
        {expenses.map(
          ({
            expenseNo,
            expenseName,
            estimatedCost,
            priority,
            status,
            color,
          }) => (
            <tr key={expenseNo} className="hover:bg-gray-50 cursor-pointer">
              <td className="border px-4 py-2 text-center">
                <ColorBadge
                  color={color}
                  onClick={() =>
                    onExpenseNameClick({
                      expenseNo,
                      expenseName,
                      estimatedCost,
                      priority,
                      status,
                      color,
                    })
                  }
                >
                  {expenseName}
                </ColorBadge>
              </td>

              {/* Estimated Cost */}
              <td
                className="border px-4 py-2"
                onDoubleClick={() =>
                  handleCellDoubleClick(expenseNo, "estimatedCost")
                }
              >
                {editingCell?.expenseNo === expenseNo &&
                editingCell.field === "estimatedCost" ? (
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-full border border-blue-400 rounded px-1 py-0.5"
                    value={estimatedCost}
                    onChange={(e) =>
                      handleInputChange(e, expenseNo, "estimatedCost")
                    }
                    onBlur={handleInputBlur}
                    autoFocus
                  />
                ) : Number.isFinite(estimatedCost) ? (
                  estimatedCost.toFixed(2)
                ) : (
                  "0.00"
                )}
              </td>

              {/* Priority */}
              <td
                className="border px-4 py-2"
                onDoubleClick={() =>
                  handleCellDoubleClick(expenseNo, "priority")
                }
              >
                {editingCell?.expenseNo === expenseNo &&
                editingCell.field === "priority" ? (
                  <select
                    className="w-full border border-blue-400 rounded px-1 py-0.5"
                    value={priority}
                    onChange={(e) =>
                      handleInputChange(e, expenseNo, "priority")
                    }
                    onBlur={handleInputBlur}
                    autoFocus
                  >
                    {priorityOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  priority
                )}
              </td>

              {/* Status */}
              <td
                className="border px-4 py-2"
                onDoubleClick={() => handleCellDoubleClick(expenseNo, "status")}
              >
                {editingCell?.expenseNo === expenseNo &&
                editingCell.field === "status" ? (
                  <select
                    className="w-full border border-blue-400 rounded px-1 py-0.5"
                    value={status}
                    onChange={(e) => handleInputChange(e, expenseNo, "status")}
                    onBlur={handleInputBlur}
                    autoFocus
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  status
                )}
              </td>
            </tr>
          )
        )}
      </tbody>
    </table>
  );
}
