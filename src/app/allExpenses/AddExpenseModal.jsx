"use client";

import { useState, useRef, useEffect } from "react";
import ColorBadge from "@/components/ColorBadge";

const priorityOptions = ["High", "Medium", "Low"];
const statusOptions = ["Pending", "In Progress", "Completed"];

export default function AddExpenseModal({ onClose, onAdd }) {
  const modalRef = useRef();

  const [form, setForm] = useState({
    expenseName: "",
    estimatedCost: 0,
    priority: "Medium",
    status: "Pending",
    color: getRandomLightColor(),
  });

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.expenseName.trim()) {
      alert("Expense Name is required");
      return;
    }
    onAdd(form);
  };

  function getRandomLightColor() {
  const r = Math.floor(127 + Math.random() * 128);
  const g = Math.floor(127 + Math.random() * 128);
  const b = Math.floor(127 + Math.random() * 128);
  const toHex = (x) => x.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <form
        ref={modalRef}
        onSubmit={handleSubmit}
        className="bg-white rounded-md shadow-lg max-w-md w-full p-6 relative border-2 border-black-100"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
          aria-label="Close Add Expense Modal"
        >
          &times;
        </button>

        <div className="mb-4">
          <ColorBadge color={form.color}>
            <div className="text-xl font-semibold">
              {form.expenseName || "New Expense"}
            </div>
          </ColorBadge>
        </div>

        <label className="block mb-2 font-medium">Expense Name</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2 mb-4"
          value={form.expenseName}
          onChange={(e) => handleChange("expenseName", e.target.value)}
          autoFocus
          required
        />

        <label className="block mb-2 font-medium">Estimated Cost</label>
        <input
          type="number"
          step="0.01"
          min="0"
          className="w-full border rounded px-3 py-2 mb-4"
          value={form.estimatedCost}
          onChange={(e) => handleChange("estimatedCost", e.target.value)}
        />

        <label className="block mb-2 font-medium">Priority</label>
        <select
          className="w-full border rounded px-3 py-2 mb-4"
          value={form.priority}
          onChange={(e) => handleChange("priority", e.target.value)}
        >
          {priorityOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        <label className="block mb-2 font-medium">Status</label>
        <select
          className="w-full border rounded px-3 py-2 mb-4"
          value={form.status}
          onChange={(e) => handleChange("status", e.target.value)}
        >
          {statusOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        <label className="block mb-2 font-medium">Color</label>
        <input
          type="color"
          className="w-20 h-10 p-0 mb-4 cursor-pointer border rounded"
          value={form.color}
          onChange={(e) => handleChange("color", e.target.value)}
          title="Pick color"
        />

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white rounded px-4 py-2 w-full"
        >
          Add Expense
        </button>
      </form>
    </div>
  );
}
