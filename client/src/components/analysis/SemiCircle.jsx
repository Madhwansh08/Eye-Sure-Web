import React from "react";

// Function to determine label & color based on percentage or DR classification
function getCriticalityLevel({ percentage, className }) {
  if (!isNaN(percentage)) {
    // Case 1: Glaucoma (percentage-based)
    if (percentage <= 25) return { label: "Low", color: "#22c55e" }; // Green
    if (percentage <= 60) return { label: "Moderate", color: "#facc15" }; // Yellow
    return { label: "High", color: "#ef4444" }; // Red
  } else if (className) {
    // Case 2: DR Analysis (classification-based)
    if (className.includes("NO DR")) return { label: "No DR", color: "#6b7280" }; // Grey (NO-DR)
    if (className.includes("MILD DR")) return { label: "Low", color: "#22c55e" }; // Green
    if (className.includes("MODERATE DR")) return { label: "Moderate", color: "#facc15" }; // Yellow
    if (className.includes("SEVERE") || className.includes("PROLIFERATE"))
      return { label: "High", color: "#ef4444" }; // Red
  }

  return { label: "Low", color: "#22c55e" }; // Default
}

/**
 * SemiCircle Component
 * Handles both Glaucoma (percentage-based) and DR Analysis (classification-based).
 */
const SemiCircle = ({ percentage, className }) => {
  const { label, color } = getCriticalityLevel({ percentage, className });

  // SVG Configuration
  const radius = 100;
  const strokeWidth = 15;
  const diameter = radius * 2;
  const centerX = radius + strokeWidth;
  const centerY = radius + strokeWidth;
  const arcLength = Math.PI * radius; // Length of the half-circle

  // Arc Path (Semi-circle from left to right)
  const arcPath = `
    M ${strokeWidth},${centerY}
    A ${radius},${radius} 0 0 1 ${diameter + strokeWidth},${centerY}
  `;

  return (
    <div className="flex items-center justify-center w-[200px] h-[120px]">
      <svg
        width={diameter + strokeWidth * 2}
        height={radius + strokeWidth * 2}
        viewBox={`0 0 ${diameter + strokeWidth * 2} ${radius + strokeWidth * 2}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Glow effect */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={color} floodOpacity="0.6" />
          </filter>
        </defs>

        {/* Background Arc (Static Grey) */}
        <path
          d={arcPath}
          fill="none"
          stroke="#374151"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Foreground Arc (Animated Fill) */}
        <path
          d={arcPath}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={arcLength}
          strokeDashoffset={arcLength}
          filter="url(#glow)"
          style={{
            animation: `semiCircleGrow 1.5s ease-out forwards`
          }}
        />

        {/* Center Label */}
        <text
          x={centerX}
          y={centerY - radius * 0.3}
          textAnchor="middle"
          fill="white"
          fontSize="22"
          fontWeight="bold"
        >
          {label}
        </text>

        {/* Animation Keyframes */}
        <style>
          {`
            @keyframes semiCircleGrow {
              0% { stroke-dashoffset: ${arcLength}; }
              100% { stroke-dashoffset: 0; }
            }
          `}
        </style>
      </svg>
    </div>
  );
};

export default SemiCircle;
