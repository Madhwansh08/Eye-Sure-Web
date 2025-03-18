import React from "react";

const RgbToggles = ({ adjustments, handleRGBChange }) => {
  return (
    <div className="mt-8">
      <h3 className="text-3xl mt-5 font-semibold gradient-text">RGB Toggle</h3>
      
      {/* Red Slider */}
      <div className="mb-4 mt-4">
        <label htmlFor="rgb-red" className="text-secondary font-semibold block mb-1">
          Red: {adjustments.rgbRed}
        </label>
        <input
          id="rgb-red"
          type="range"
          min="0"
          max="1"
          value={adjustments.rgbRed}
          onChange={(e) => handleRGBChange("rgbRed", e.target.value)}
          className="w-full bg-transparent cursor-pointer appearance-none disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden
            [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:-mt-0.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:shadow-[0_0_0_4px_rgba(37,99,235,1)] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:transition-all
            [&::-webkit-slider-thumb]:duration-150 [&::-webkit-slider-thumb]:ease-in-out dark:[&::-webkit-slider-thumb]:bg-neutral-700
            [&::-moz-range-thumb]:w-2.5 [&::-moz-range-thumb]:h-2.5 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-4
            [&::-moz-range-thumb]:border-blue-600 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:transition-all
            [&::-moz-range-thumb]:duration-150 [&::-moz-range-thumb]:ease-in-out
            [&::-webkit-slider-runnable-track]:w-full [&::-webkit-slider-runnable-track]:h-2
            [&::-webkit-slider-runnable-track]:bg-gray-100 [&::-webkit-slider-runnable-track]:rounded-full dark:[&::-webkit-slider-runnable-track]:bg-neutral-700
            [&::-moz-range-track]:w-full [&::-moz-range-track]:h-2 [&::-moz-range-track]:bg-gray-100 [&::-moz-range-track]:rounded-full"
        />
      </div>

      {/* Green Slider */}
      <div className="mb-4 mt-4">
        <label htmlFor="rgb-green" className="text-secondary  font-semibold block mb-1">
          Green: {adjustments.rgbGreen}
        </label>
        <input
          id="rgb-green"
          type="range"
          min="0"
          max="1"

          value={adjustments.rgbGreen}
          onChange={(e) => handleRGBChange("rgbGreen", e.target.value)}
          className="w-full bg-transparent cursor-pointer appearance-none disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden
            [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:-mt-0.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:shadow-[0_0_0_4px_rgba(37,99,235,1)] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:transition-all
            [&::-webkit-slider-thumb]:duration-150 [&::-webkit-slider-thumb]:ease-in-out dark:[&::-webkit-slider-thumb]:bg-neutral-700
            [&::-moz-range-thumb]:w-2.5 [&::-moz-range-thumb]:h-2.5 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-4
            [&::-moz-range-thumb]:border-blue-600 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:transition-all
            [&::-moz-range-thumb]:duration-150 [&::-moz-range-thumb]:ease-in-out
            [&::-webkit-slider-runnable-track]:w-full [&::-webkit-slider-runnable-track]:h-2
            [&::-webkit-slider-runnable-track]:bg-gray-100 [&::-webkit-slider-runnable-track]:rounded-full dark:[&::-webkit-slider-runnable-track]:bg-neutral-700
            [&::-moz-range-track]:w-full [&::-moz-range-track]:h-2 [&::-moz-range-track]:bg-gray-100 [&::-moz-range-track]:rounded-full"
        />
      </div>

      {/* Blue Slider */}
      <div className="mb-4">
        <label htmlFor="rgb-blue" className="text-secondary font-bold block mb-1">
          Blue: {adjustments.rgbBlue}
        </label>
        <input
          id="rgb-blue"
          type="range"
          min="0"
          max="1"
          value={adjustments.rgbBlue}
          onChange={(e) => handleRGBChange("rgbBlue", e.target.value)}
          className="w-full bg-transparent cursor-pointer appearance-none disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden
            [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:-mt-0.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:shadow-[0_0_0_4px_rgba(37,99,235,1)] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:transition-all
            [&::-webkit-slider-thumb]:duration-150 [&::-webkit-slider-thumb]:ease-in-out dark:[&::-webkit-slider-thumb]:bg-neutral-700
            [&::-moz-range-thumb]:w-2.5 [&::-moz-range-thumb]:h-2.5 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-4
            [&::-moz-range-thumb]:border-blue-600 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:transition-all
            [&::-moz-range-thumb]:duration-150 [&::-moz-range-thumb]:ease-in-out
            [&::-webkit-slider-runnable-track]:w-full [&::-webkit-slider-runnable-track]:h-2
            [&::-webkit-slider-runnable-track]:bg-gray-100 [&::-webkit-slider-runnable-track]:rounded-full dark:[&::-webkit-slider-runnable-track]:bg-neutral-700
            [&::-moz-range-track]:w-full [&::-moz-range-track]:h-2 [&::-moz-range-track]:bg-gray-100 [&::-moz-range-track]:rounded-full"
        />
      </div>
    </div>
  );
};

export default RgbToggles;
