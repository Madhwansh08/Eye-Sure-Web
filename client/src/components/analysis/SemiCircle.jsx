import React from "react";

// Function to determine label & color based on percentage or DR classification
function getCriticalityLevel({ percentage, className }) {
  if (!isNaN(percentage)) {
    // Case 1: Glaucoma (use percentage)
    if (percentage <= 25) return { label: "Low", color: "#22c55e" }; // Green
    if (percentage <= 60) return { label: "Moderate", color: "#facc15" }; // Yellow
    return { label: "High", color: "#ef4444" }; // Red
  } else if (className) {
    // Case 2: DR Analysis (use class_name)

    if (className.includes("NO DR")) return { label: "No DR", color: "#6b7280" }; // Grey (NO-DR)
    if (className.includes("MILD DR")) return { label: "Low", color: "#22c55e" }; // Green (0-25)
    if (className.includes("MODERATE DR")) return { label: "Moderate", color: "#facc15" }; // Yellow (25-60)
    if (className.includes("severe") || className.includes("proliferate"))
      return { label: "High", color: "#ef4444" }; // Red (60-100)
  }

  return { label: "Low", color: "#22c55e" }; // Default: Low (Green)
}

/**
 * SemiCircle Component
 * Handles both Glaucoma (percentage-based) and DR Analysis (classification-based).
 */
const SemiCircle = ({ percentage, className }) => {
  // Determine classification level based on percentage or DR classification
  const { label, color } = getCriticalityLevel({ percentage, className });

  // SVG Geometry
  const radius = 100;
  const diameter = radius * 2;
  const arcLength = Math.PI * radius; // Length of the half-circle

  // Path for the semicircle
  const arcPath = `M 0,${radius} A ${radius},${radius} 0 0 1 ${diameter},${radius}`;

  return (
    <div className="flex items-center justify-center w-[150px] h-[120px]">
      <svg
        width={diameter}
        height={radius + 20} // Extra vertical space
        viewBox={`0 0 ${diameter} ${radius + 20}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Glow effect for the stroke */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={color} floodOpacity="0.6" />
          </filter>
        </defs>

        {/* Background Arc (Grey) */}
        <path
          d={arcPath}
          fill="none"
          stroke="#374151" // Tailwind Gray-700
          strokeWidth="15"
          strokeLinecap="round"
        />

        {/* Foreground Arc (Animated Stroke) */}
        <path
          d={arcPath}
          fill="none"
          stroke={color} // Dynamic color
          strokeWidth="15"
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
          x={radius}
          y={radius * 0.7} // Positioning inside the arc
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
              0% {
                stroke-dashoffset: ${arcLength};
              }
              100% {
                stroke-dashoffset: 0;
              }
            }
          `}
        </style>
      </svg>
    </div>
  );
};

export default SemiCircle;
