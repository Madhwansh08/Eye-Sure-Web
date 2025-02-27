// src/components/analysis/AnnotationToolBar.jsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTool, undoAnnotation, redoAnnotation, resetAnnotations } from "../../redux/slices/annotationSlice";
import { FiSquare, FiCircle, FiTarget, FiSave, FiToggleRight, FiRefreshCw } from "react-icons/fi";
import { CiUndo, CiRedo } from "react-icons/ci";
import axios from "axios";
import { motion } from "framer-motion";

const buttonVariants = {
  hover: {
    scale: 1.1,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
  tap: { scale: 0.9 },
};

const AnnotationToolBar = ({ onToggle, activeSide = "left" }) => {
  const dispatch = useDispatch();
  const currentTool = useSelector((state) => state.annotation.currentTool);
  const annotationState = useSelector((state) => state.annotation);

  const handleSetTool = (tool) => {
    dispatch(setTool(tool));
  };

  const handleSaveAnnotations = async () => {
    try {
      const response = await axios.post("/saveAnnotations", annotationState);
      console.log("Annotations saved:", response.data);
      alert("Annotations saved successfully!");
    } catch (error) {
      console.error("Error saving annotations:", error);
      alert("Failed to save annotations");
    }
  };

  const handleUndo = () => {
    dispatch(undoAnnotation({ side: activeSide }));
  };

  const handleRedo = () => {
    dispatch(redoAnnotation({ side: activeSide }));
  };

  const handleReset = () => {
    dispatch(resetAnnotations());
  };

  return (
    <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50 flex items-center space-x-4 px-6 py-3 bg-white rounded-full shadow-lg">
      <motion.button
        onClick={() => handleSetTool("rectangle")}
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className={`p-2 rounded-full transition ${
          currentTool === "rectangle" ? "bg-secondary text-[#fdfdfd]" : "bg-gray-100 hover:bg-[#030811] text-primary"
        }`}
      >
        <FiSquare size={20} />
      </motion.button>
      <motion.button
        onClick={() => handleSetTool("oval")}
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className={`p-2 rounded-full transition ${
          currentTool === "oval" ? "bg-secondary text-[#fdfdfd]" : "bg-gray-100 hover:bg-[#030811] text-primary"
        }`}
      >
        <FiCircle size={20} />
      </motion.button>
      <motion.button
        onClick={() => handleSetTool("point")}
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className={`p-2 rounded-full transition ${
          currentTool === "point" ? "bg-secondary text-[#fdfdfd]" : "bg-gray-100 hover:bg-[#030811] text-primary"
        }`}
      >
        <FiTarget size={20} />
      </motion.button>
      <motion.button
        onClick={handleUndo}
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className="p-2 rounded-full transition bg-gray-100 hover:bg-[#030811] text-primary"
      >
        <CiUndo size={20} />
      </motion.button>
      <motion.button
        onClick={handleRedo}
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className="p-2 rounded-full transition bg-gray-100 hover:bg-[#030811] text-primary"
      >
        <CiRedo size={20} />
      </motion.button>
      <motion.button
        onClick={handleReset}
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className="p-2 rounded-full transition bg-gray-100 hover:bg-[#030811] text-primary"
      >
        <FiRefreshCw size={20} />
      </motion.button>
      <motion.button
        onClick={handleSaveAnnotations}
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className="p-2 rounded-full transition bg-green-500 text-white hover:bg-green-600"
      >
        <FiSave size={20} />
      </motion.button>
      <motion.button
        onClick={onToggle}
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className="p-2 rounded-full transition bg-gray-200 hover:bg-blue-500 hover:text-white"
      >
        <FiToggleRight size={20} />
      </motion.button>
    </div>
  );
};

export default AnnotationToolBar;
