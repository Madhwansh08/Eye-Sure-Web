import React from "react";
import { motion } from "framer-motion";

const RightPanelToggle = ({ activeTab, setActiveTab }) => {
  return (
    <div className="relative flex items-center bg-white border border-[#387AA4] rounded-full overflow-hidden max-w-lg w-full shadow-sm mb-4">
      <motion.div
        className="absolute top-0 left-0 h-full w-1/2 bg-[#387AA4] rounded-full transition-transform duration-500 ease-in-out"
        animate={{ x: activeTab === "Explainable AI" ? "100%" : "0%" }}
      ></motion.div>
      <button
        className={`relative z-10 flex-1 px-4 py-2 text-sm font-semibold transition-colors duration-300 ${
          activeTab === "Clahe Images"
            ? "text-white"
            : "text-gray-800 hover:text-[#387AA4]"
        }`}
        onClick={() => setActiveTab("Clahe Images")}
        aria-label="Clahe Images"
      >
        Clahe Images
      </button>
      <button
        className={`relative z-10 flex-1 px-4 py-2 text-sm font-semibold transition-colors duration-300 ${
          activeTab === "Explainable AI"
            ? "text-white"
            : "text-gray-800 hover:text-[#387AA4]"
        }`}
        onClick={() => setActiveTab("Explainable AI")}
        aria-label="Explainable AI"
      >
        Explainable AI
      </button>
    </div>
  );
};

export default RightPanelToggle;
