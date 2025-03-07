import React from "react";

const SemiCircle = ({ percentage }) => {
  // Set the overall dimensions for the bar.
  const width = 300;
  const height = 40;
  
  // Determine criticality level based on the percentage
  const getCriticalityLevel = (pct) => {
    if (pct <= 30) return { label: "Low", color: "#10b981" }; // Green
    if (pct <= 70) return { label: "Medium", color: "#facc15" }; // Yellow
    if (pct <= 90) return { label: "High", color: "#f59e0b" }; // Orange
    return { label: "Critical", color: "#ef4444" }; // Red
  };

  const { label, color } = getCriticalityLevel(percentage);
  const finalScale = percentage / 100; // determines how much the bar fills

  return (
    <div className="relative w-[300px] h-[40px] flex items-center justify-center">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Define a glow effect matching the criticality color */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={color} floodOpacity="0.5" />
          </filter>
        </defs>

        {/* Background bar */}
        <rect x="0" y="5" width={width} height="30" rx="15" fill="#2d2d2d" />

        {/* Animated progress bar */}
        <rect
          x="0"
          y="5"
          width={width}
          height="30"
          rx="15"
          fill={color}
          filter="url(#glow)"
          style={{
            transformOrigin: "0 0",
            transform: "scaleX(0)",
            animation: `growAnimation 1.8s ease-out forwards`
          }}
        />

        {/* Centered text label */}
        <text x={width / 2} y="26" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
          {label}
        </text>

        {/* Keyframes for the progress bar animation */}
        <style>
          {`
            @keyframes growAnimation {
              from {
                transform: scaleX(0);
              }
              to {
                transform: scaleX(${finalScale});
              }
            }
          `}
        </style>
      </svg>
    </div>
  );
};

export default SemiCircle;
