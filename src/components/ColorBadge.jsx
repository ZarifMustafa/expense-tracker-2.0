"use client";

export default function ColorBadge({ color = "#888888", onClick, children }) {
  // Defensive: fallback to default color if input invalid
  const safeColor = isValidHexColor(color) ? color : "#888888";

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      className="inline-flex items-center px-3 py-1 rounded-full border cursor-pointer select-none"
      style={{
        backgroundColor: safeColor,
        color: getContrastYIQ(safeColor),
      }}
      title={`Color: ${safeColor}`}
      aria-label="Open expense modal"
    >
      {children}
    </div>
  );
}

// Check if a string is a valid hex color (3 or 6 digits)
function isValidHexColor(str) {
  return /^#([0-9A-F]{3}){1,2}$/i.test(str);
}

// Determine black or white text for contrast on a hex background color
function getContrastYIQ(hexcolor) {
  if (!hexcolor || !isValidHexColor(hexcolor)) return "#000"; // fallback black text
  const r = parseInt(hexcolor.substr(1, 2), 16);
  const g = parseInt(hexcolor.substr(3, 2), 16);
  const b = parseInt(hexcolor.substr(5, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "#000" : "#fff";
}
