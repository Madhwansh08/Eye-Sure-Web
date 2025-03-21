import React from "react";
 
// Function to determine label & color based on Glaucoma classification or DR classification
function getCriticalityLevel({ classNameGlaucoma, classNameDR }) {
  if (classNameGlaucoma) {
    const normalizedGlaucoma = classNameGlaucoma.toLowerCase();
    if (normalizedGlaucoma.includes("non glaucoma")) return { label: "Low", color: "#22c55e" }; // Green
    if (normalizedGlaucoma.includes("suspect glaucoma")) return { label: "Medium", color: "#facc15" }; // Yellow
    if (normalizedGlaucoma.includes("glaucoma")) return { label: "High", color: "#ef4444" }; // Red
  }
  
  if (classNameDR) {
    const normalizedDR = classNameDR.toLowerCase();
    if (normalizedDR.includes("no dr")) return { label: "No DR", color: "#6b7280" }; // Grey
    if (normalizedDR.includes("mild dr")) return { label: "Mild DR", color: "#22c55e" }; // Green
    if (normalizedDR.includes("moderate dr")) return { label: "Moderate DR", color: "#facc15" }; // Yellow
    if (normalizedDR.includes("severe dr") || normalizedDR.includes("proliferative dr"))
      return { label: "Proliferate", color: "#ef4444" }; // Red
  }
 
  return { label: "Low", color: "#22c55e" }; // Default
}
 
/**
* SemiCircle Component
* Handles both Glaucoma and DR Analysis
*/
const SemiCircle = ({ classNameGlaucoma = "", classNameDR = "" }) => {
  const { label, color } = getCriticalityLevel({ classNameGlaucoma, classNameDR });
 
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