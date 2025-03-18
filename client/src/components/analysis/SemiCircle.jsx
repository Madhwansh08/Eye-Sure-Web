import React from "react";

// Utility to classify percentage -> label + color
function getCriticalityLevel(pct) {
  if (pct <= 30) return { label: "Low", color: "#10b981" };     // Green
  if (pct <= 70) return { label: "Medium", color: "#facc15" };  // Yellow
  if (pct <= 90) return { label: "High", color: "#f59e0b" };    // Orange
  return { label: "Critical", color: "#ef4444" };               // Red
}

/**
 * SemiCircle
 * Displays an animated half-circle arc from left to right, with text in the center.
 *
 * @param {number} percentage - e.g. 75 means 75% fill
 */
const SemiCircle = ({ percentage = 0 }) => {
  const finalPct = Math.max(0, Math.min(100, percentage)); // clamp [0..100]
  const { label, color } = getCriticalityLevel(finalPct);

  // Define geometry for a half-circle with radius 100
  const radius = 100;
  const diameter = radius * 2;
  // The length of the half-circle arc is π * R
  const arcLength = Math.PI * radius;

  // For the stroke animation, we use dasharray = arcLength
  // and dashoffset from arcLength (empty) to arcLength*(1 - finalScale) (full).
  const finalScale = finalPct / 100; // 0..1

  // We'll store the arc path from (0, radius) to (diameter, radius)
  // This draws a half-circle above the line from left to right.
  const arcPath = `M 0,${radius} A ${radius},${radius} 0 0 1 ${diameter},${radius}`;

  return (
    <div className="flex items-center justify-center w-[150px] h-[120px]">
      <svg
        width={diameter}
        height={radius + 20} // a bit of extra vertical space
        viewBox={`0 0 ${diameter} ${radius + 20}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Glow effect matching the criticality color */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={color} floodOpacity="0.5" />
          </filter>
        </defs>

        {/* Background arc: same path, but a light color or dark grey */}
        <path
          d={arcPath}
          fill="none"
          stroke="#2d2d2d"
          strokeWidth="15"
          strokeLinecap="round"
        />

        {/* Foreground arc: color-coded, animated via strokeDashoffset */}
        <path
          d={arcPath}
          fill="none"
          stroke={color}
          strokeWidth="15"
          strokeLinecap="round"
          strokeDasharray={arcLength}
          strokeDashoffset={arcLength}
          filter="url(#glow)"
          style={{
            animation: `semiCircleGrow 1.5s ease-out forwards`
          }}
        />

        {/* The text label in the center; place it near the bottom of the arc */}
        <text
          x={radius}
          y={radius * 0.7}  // about 70% down the radius
          textAnchor="middle"
          fill="white"
          fontSize="25"
          fontWeight="bold"
        >
          {label}
        </text>

        {/* Keyframes to animate the strokeDashoffset */}
        <style>
          {`
            @keyframes semiCircleGrow {
              0% {
                stroke-dashoffset: ${arcLength};
              }
              100% {
                stroke-dashoffset: ${arcLength - arcLength * finalScale};
              }
            }
          `}
        </style>
      </svg>
    </div>
  );
};

export default SemiCircle;
