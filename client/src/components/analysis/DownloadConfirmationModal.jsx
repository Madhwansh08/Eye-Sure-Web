import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

const DownloadConfirmationModal = ({ onYes, onNo, timeout = 5000 }) => {
  const modalRef = useRef(null);
  const [circumference, setCircumference] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect();
      setDimensions({ width: rect.width, height: rect.height });
      setCircumference(2 * (rect.width + rect.height));
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      onNo();
    }, timeout);
    return () => clearTimeout(timer);
  }, [timeout, onNo]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/45 bg-opacity-50 z-50">
      <div className="relative">
        <svg
          className="absolute inset-0 z-0 overflow-visible"
          width="100%"
          height="100%"
        >
          <path
            d={`M0,0 L${dimensions.width},0 L${dimensions.width},${dimensions.height} L0,${dimensions.height} L0,0`}
            fill="none"
            stroke="#4A90E2"
            strokeWidth="3"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: 0,
              animation: `countdown ${timeout}ms linear forwards`,
            }}
          />
        </svg>
        <div ref={modalRef} className="bg-primary p-6 rounded shadow-md max-w-sm w-full relative">
          <p className="mb-4 text-xl text-secondary font-semibold">
            Do you want to edit something before downloading?
          </p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={onYes}
              className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
            >
              Yes
            </button>
            <button
              onClick={onNo}
              className="px-4 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors"
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