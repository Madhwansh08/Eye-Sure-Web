// src/components/common/ImageModal.jsx
import React from "react";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";

const ZoomModal = ({ isOpen, imageSrc, onClose }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-90 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="relative w-screen h-screen flex items-center justify-center">
        <button
          className="absolute top-4 right-4 text-white hover:text-gray-300"
          onClick={onClose}
        >
          <IoMdClose size={32} />
        </button>
        <img
          src={imageSrc}
          alt="Zoomed View"
          className="w-[60%] h-[60%] object-contain"
        />
      </div>
    </motion.div>
  );
};

export default ZoomModal;