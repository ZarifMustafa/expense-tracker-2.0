"use client";

import { useEffect, useRef } from "react";
import ColorBadge from "@/components/ColorBadge";

const priorityOptions = ["High", "Medium", "Low"];
const statusOptions = ["Pending", "In Progress", "Completed"];

export default function ExpenseModal({ expense, onClose, onUpdateField }) {
  const modalRef = useRef();

  // Close modal if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Update field handler
  const handleChange = (field, value) => {
    onUpdateField(expense.expenseNo, field, value);
  };

  return (
    // Transparent overlay so background page is visible
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-md shadow-lg max-w-md w-full p-6 relative border-2 border-black-100"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
          aria-label="Close Modal"
        >
          &times;
        </button>
        <div className="mb-4">
          <ColorBadge color={expense.color}>
            <div className="text-xl font-semibold">{expense.expenseName}</div>
          </ColorBadge>
        </div>

        {/* Expense Name with background color */}
        <label className="block mb-2 font-medium">Expense Name</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2 mb-4"
          value={expense.expenseName}
          onChange={(e) => handleChange("expenseName", e.target.value)}
          autoFocus
        />

        {/* Estimated Cost */}
        <label className="block mb-2 font-medium">Estimated Cost</label>
        <input
          type="number"
          step="0.01"
          min="0"
          className="w-full border rounded px-3 py-2 mb-4"
          value={expense.estimatedCost}
          onChange={(e) => handleChange("estimatedCost", e.target.value)}
        />

        {/* Priority */}
        <label className="block mb-2 font-medium">Priority</label>
        <select
          className="w-full border rounded px-3 py-2 mb-4"
          value={expense.priority}
          onChange={(e) => handleChange("priority", e.target.value)}
        >
          {priorityOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        {/* Status */}
        <label className="block mb-2 font-medium">Status</label>
        <select
          className="w-full border rounded px-3 py-2 mb-4"
          value={expense.status}
          onChange={(e) => handleChange("status", e.target.value)}
        >
          {statusOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        {/* Color Picker */}
        <label className="block mb-2 font-medium">Color</label>
        <input
          type="color"
          className="w-20 h-10 p-0 mb-4 cursor-pointer border rounded"
          value={expense.color}
          onChange={(e) => handleChange("color", e.target.value)}
          title="Pick color"
        />
      </div>
    </div>
  );
}
