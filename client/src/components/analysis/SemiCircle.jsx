import React from "react";

const SemiCircle = ({ percentage }) => {
  const radius = 60;
  const strokeWidth = 14;
  const circumference = Math.PI * radius;

  // Determine criticality level based on the percentage
  const getCriticalityLevel = (pct) => {
    if (pct <= 30) return { label: "Low", color: "#10b981" }; // Green
    if (pct <= 70) return { label: "Medium", color: "#facc15" }; // Yellow
    if (pct <= 90) return { label: "High", color: "#f59e0b" }; // Orange
    return { label: "Critical", color: "#ef4444" }; // Red
  };

  const { label, color } = getCriticalityLevel(percentage);
  const dashOffset = (1 - percentage / 100) * circumference;

  return (
    <div className="relative w-[300px] h-[160px] flex items-center justify-center">
      <svg
        width="200"
        height="120"
        viewBox="0 0 160 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Drop shadow/glow filter using the same color */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="6"
              floodColor={color}
              floodOpacity="0.5"
            />
          </filter>
        </defs>

        {/* Static background arc */}
        <path
          d="M20,80 A60,60 0 1,1 140,80"
          fill="none"
          stroke="#2d2d2d"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Animated arc with solid stroke matching the label color */}
        <path
          d="M20,80 A60,60 0 1,1 140,80"
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          filter="url(#glow)"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          style={{
            animation: `dashAnimation 1.8s ease-out forwards`
          }}
        />

        {/* Keyframes for the dash animation */}
        <style>
          {`
            @keyframes dashAnimation {
              from {
                stroke-dashoffset: ${circumference};
              }
              to {
                stroke-dashoffset: ${dashOffset};
              }
            }
          `}
        </style>
      </svg>

      {/* Display only the label in the center */}
      <div className="absolute mt-10 flex flex-col items-center">
        <p
          className="text-2xl font-extrabold"
          style={{ color }}
        >
          {label}
        </p>
      </div>
    </div>
  );
};

export default SemiCircle;
