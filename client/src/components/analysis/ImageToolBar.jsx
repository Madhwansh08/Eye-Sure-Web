import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FiSun, FiSliders, FiMoon, FiZoomIn, FiToggleLeft, FiRefreshCw } from "react-icons/fi";
import { RiPaletteFill } from "react-icons/ri";

const ImageToolBar = ({ onToggle, onAdjust, onResetPan }) => {
  // Local state for image adjustments.
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [negative, setNegative] = useState(false);
  const [zoom, setZoom] = useState(1);
  // RGB channel states.
  const [rgbEnabled, setRgbEnabled] = useState(false);
  const [rgbRed, setRgbRed] = useState(true);
  const [rgbGreen, setRgbGreen] = useState(true);
  const [rgbBlue, setRgbBlue] = useState(true);
  // activeFilter tracks which slider is open ("brightness", "contrast", "zoom", or null)
  const [activeFilter, setActiveFilter] = useState(null);

  // Refs for the toolbar and slider container.
  const toolbarRef = useRef(null);
  const sliderRef = useRef(null);

  // Update adjustments and notify parent.
  const updateAdjustments = (newValues) => {
    const updated = {
      brightness,
      contrast,
      negative,
      zoom,
      rgbRed,
      rgbGreen,
      rgbBlue,
      ...newValues,
    };
    if (newValues.hasOwnProperty("brightness")) {
      setBrightness(newValues.brightness);
    }
    if (newValues.hasOwnProperty("contrast")) {
      setContrast(newValues.contrast);
    }
    if (newValues.hasOwnProperty("negative")) {
      setNegative(newValues.negative);
    }
    if (newValues.hasOwnProperty("zoom")) {
      setZoom(newValues.zoom);
    }
    if (newValues.hasOwnProperty("rgbRed")) {
      setRgbRed(newValues.rgbRed);
    }
    if (newValues.hasOwnProperty("rgbGreen")) {
      setRgbGreen(newValues.rgbGreen);
    }
    if (newValues.hasOwnProperty("rgbBlue")) {
      setRgbBlue(newValues.rgbBlue);
    }
    if (onAdjust) {
      onAdjust(updated);
    }
  };

  // Toggle the slider for a given filter.
  const toggleFilter = (filterName) => {
    setActiveFilter((prev) => (prev === filterName ? null : filterName));
  };

  // Reset all adjustments to default and trigger pan reset.
  const resetAdjustments = () => {
    updateAdjustments({
      brightness: 0,
      contrast: 0,
      negative: false,
      zoom: 1,
      rgbRed: true,
      rgbGreen: true,
      rgbBlue: true,
    });
    if (onResetPan) {
      onResetPan();
    }
  };

  // When toggling toolbar, reset adjustments before switching.
  const handleToggle = () => {
    resetAdjustments();
    onToggle();
  };

  // Close slider if clicking outside both the toolbar and slider container.
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        toolbarRef.current &&
        sliderRef.current &&
        !toolbarRef.current.contains(e.target) &&
        !sliderRef.current.contains(e.target)
      ) {
        setActiveFilter(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div
        ref={toolbarRef}
        className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50 flex items-end space-x-4 px-6 py-3 bg-[#030811]/80 rounded-full shadow-lg"
      >
        <motion.button
          onClick={() => toggleFilter("brightness")}
          whileHover={{ scale: 1.1 }}
          className="p-2 rounded-full bg-gray-200 hover:bg-blue-500 hover:text-white transition"
        >
          <FiSun size={20} />
        </motion.button>
        <motion.button
          onClick={() => toggleFilter("contrast")}
          whileHover={{ scale: 1.1 }}
          className="p-2 rounded-full bg-gray-200 hover:bg-blue-500 hover:text-white transition"
        >
          <FiSliders size={20} />
        </motion.button>
        <motion.button
          onClick={() => updateAdjustments({ negative: !negative })}
          whileHover={{ scale: 1.1 }}
          className={`p-2 rounded-full transition ${negative ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          <FiMoon size={20} />
        </motion.button>
        <motion.button
          onClick={() => toggleFilter("zoom")}
          whileHover={{ scale: 1.1 }}
          className="p-2 rounded-full bg-gray-200 hover:bg-blue-500 hover:text-white transition"
        >
          <FiZoomIn size={20} />
        </motion.button>
        <motion.button
          onClick={() => setRgbEnabled((prev) => !prev)}
          whileHover={{ scale: 1.1 }}
          className={`p-2 rounded-full transition ${rgbEnabled ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          <RiPaletteFill size={20} />
        </motion.button>
        {/* Reset button */}
        <motion.button
          onClick={resetAdjustments}
          whileHover={{ scale: 1.1 }}
          className="p-2 rounded-full bg-gray-200 hover:bg-blue-500 hover:text-white transition"
        >
          <FiRefreshCw size={20} />
        </motion.button>
        <motion.button
          onClick={handleToggle}
          whileHover={{ scale: 1.1 }}
          className="p-2 rounded-full bg-gray-200 hover:bg-blue-500 hover:text-white transition"
        >
          <FiToggleLeft size={20} />
        </motion.button>
      </div>
      {/* Slider container rendered separately for brightness, contrast, and zoom */}
      {activeFilter && (
        <motion.div
          ref={sliderRef}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 bg-white p-3 rounded shadow-lg"
        >
          {activeFilter === "brightness" && (
            <input
              type="range"
              min="-1"
              max="1"
              step="0.1"
              value={brightness}
              onChange={(e) =>
                updateAdjustments({ brightness: parseFloat(e.target.value) })
              }
              className="w-64"
            />
          )}
          {activeFilter === "contrast" && (
            <input
              type="range"
              min="-2"
              max="2"
              step="0.1"
              value={contrast}
              onChange={(e) =>
                updateAdjustments({ contrast: parseFloat(e.target.value) })
              }
              className="w-64"
            />
          )}
          {activeFilter === "zoom" && (
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={zoom}
              onChange={(e) =>
                updateAdjustments({ zoom: parseFloat(e.target.value) })
              }
              className="w-64"
            />
          )}
        </motion.div>
      )}
      {/* RGB checkboxes container */}
      {rgbEnabled && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-36 left-1/2 transform -translate-x-1/2 z-50 bg-white p-4 rounded shadow-lg"
        >
          <div className="flex space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={rgbRed}
                onChange={(e) => {
                  setRgbRed(e.target.checked);
                  updateAdjustments({ rgbRed: e.target.checked });
                }}
              />
              <span className="ml-1">Red</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={rgbGreen}
                onChange={(e) => {
                  setRgbGreen(e.target.checked);
                  updateAdjustments({ rgbGreen: e.target.checked });
                }}
              />
              <span className="ml-1">Green</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={rgbBlue}
                onChange={(e) => {
                  setRgbBlue(e.target.checked);
                  updateAdjustments({ rgbBlue: e.target.checked });
                }}
              />
              <span className="ml-1">Blue</span>
            </label>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default ImageToolBar;
