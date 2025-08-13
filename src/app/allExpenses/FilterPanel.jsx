"use client";

export default function FilterPanel({
  priorityFilters,
  statusFilters,
  togglePriorityFilter,
  toggleStatusFilter,
}) {
  return (
    <div className="flex items-center space-x-4">
      {/* Priority Filters */}
      <div className="flex flex-col space-y-1">
        <span className="text-sm font-medium">Priority:</span>
        <div className="flex space-x-2">
          {Object.entries(priorityFilters).map(([priority, checked]) => (
            <label key={priority} className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => togglePriorityFilter(priority)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm">{priority}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex flex-col space-y-1">
        <span className="text-sm font-medium">Status:</span>
        <div className="flex space-x-2">
          {Object.entries(statusFilters).map(([status, checked]) => (
            <label key={status} className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleStatusFilter(status)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm">{status}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}