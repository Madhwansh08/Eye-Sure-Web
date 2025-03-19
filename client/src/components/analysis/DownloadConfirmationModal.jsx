import React, { useEffect } from "react";

const DownloadConfirmationModal = ({ onYes, onNo, timeout = 5000 }) => {
  // Calculate circumference for a circle of radius 45
  const circumference = 2 * Math.PI * 45;

  useEffect(() => {
    // Auto-close after timeout (simulate "No" click)
    const timer = setTimeout(() => {
      onNo();
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout, onNo]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/45 bg-opacity-50 z-50">
      <div className="relative">
        {/* SVG with animated circular ring */}
        <svg
          width="100"
          height="100"
          className="absolute -top-4 -left-4 z-[-1]"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#4A90E2"
            strokeWidth="5"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: 0,
              animation: `countdown ${timeout}ms linear forwards`
            }}
          />
        </svg>
        <div className="bg-white p-6 rounded shadow-md max-w-sm w-full">
          <p className="mb-4 text-xl font-semibold">
            Do you want to edit something before downloading?
          </p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={onYes}
              className="px-4 py-2 bg-blue-500 text-white rounded-full"
            >
              Yes
            </button>
            <button
              onClick={onNo}
              className="px-4 py-2 bg-gray-500 text-white rounded-full"
            >
              No
            </button>
          </div>
        </div>
        <style>{`
          @keyframes countdown {
            from {
              stroke-dashoffset: 0;
            }
            to {
              stroke-dashoffset: ${circumference}px;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default DownloadConfirmationModal;
