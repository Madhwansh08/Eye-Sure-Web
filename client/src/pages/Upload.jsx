import React, { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Header from "../components/common/Header";
import { TfiUpload } from "react-icons/tfi";
import InstructionSlider from "../components/upload/InstructionSlider";
import CropModal from "../components/upload/CropModal";
import {
  setCroppingImage,
  clearCroppingImage,
  setLeftImage,
  setRightImage,
} from "../redux/slices/imageSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import API_URL from "../utils/config";

const Upload = () => {
  const dispatch = useDispatch();
  const navigate=useNavigate();
  const { croppingImage, croppingSide, leftImage, rightImage } = useSelector(
    (state) => state.images
  );

  const leftInputRef = useRef(null);
  const rightInputRef = useRef(null);

  // Convert File -> Base64
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (e, side) => {
    const file = e.target.files[0];
    if (file) {
      // Convert file to Base64
      const base64String = await convertFileToBase64(file);
      // Dispatch base64 to Redux
      dispatch(setCroppingImage({ image: base64String, side }));
    }
  };

  const openFilePicker = (side) => {
    if (side === "left" && leftInputRef.current) {
      leftInputRef.current.click();
    } else if (side === "right" && rightInputRef.current) {
      rightInputRef.current.click();
    }
  };

  const handleCropSave = (croppedUrl) => {
    // croppedUrl is the final cropped image (object URL or base64)
    if (croppingSide === "left") {
      dispatch(setLeftImage(croppedUrl));
    } else if (croppingSide === "right") {
      dispatch(setRightImage(croppedUrl));
    }
    dispatch(clearCroppingImage());
  };

  const handleClose = () => {
    dispatch(clearCroppingImage());
  };

  const handleAnalyze = async () => {
    // Validation: Ensure both images are present
    if (!leftImage || !rightImage) {
      alert("Please upload and crop both images before analyzing.");
      return;
    }
    
    try {
      // Create a FormData instance and append both images under the key "file"
      const formData = new FormData();
  
      // Convert Base64 images to Blob objects.
      const leftBlob = await (await fetch(leftImage)).blob();
      const rightBlob = await (await fetch(rightImage)).blob();
  
      // Append both files using the same key ("file") as required by your Node API.
      formData.append("file", leftBlob, "left_image.jpg");
      formData.append("file", rightBlob, "right_image.jpg");
  
      // Send POST request to your Node server endpoint.
      const response = await axios.post(`${API_URL}/api/image/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" ,
        "Access-Control-Allow-Origin": "*",

         },
         withCredentials: true

       
      });
  
      // Assuming the API returns an object like { prediction: "0" } or { prediction: "1" }
      const { prediction } = response.data;
      console.log("Prediction Result:", prediction);
  
      if (prediction.trim() === "0") {
        toast.error("Invalid images uploaded");
      } else {
        toast.success("Images successfully uploaded!");
        // Open DetailModal by setting state (or navigate, as needed)
        setShowDetailModal(true);
        // Optionally, navigate to the analysis page if that is desired:
        // navigate('/analysis');
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Error uploading images. Check console for details.");
    }
  };

  return (
    <div className="bg-primary flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-col items-center mt-20 pt-10 max-h-screen dark:bg-[#030811] bg-[#fdfdfd] text-[#f2ebe3] relative">
        <h1 className="text-center text-8xl font-bold mb-8 mx-auto dark:text-[#f2ebe3] text-[#030811]">
          <span className="text-primary">Retina</span> Analysis
        </h1>
        <p className="text-center text-3xl font-semibold mb-8 mx-auto mt-2 dark:text-[#f2ebe3] text-[#030811]">
          Kindly Upload Both Images
        </p>

        {/* Two-column layout */}
        <div className="flex flex-row w-full mt-5 px-5 gap-5">
          {/* Left Column: Instruction Slider */}
          <div className="w-1/2">
            <InstructionSlider />
          </div>

          {/* Right Column: Upload Buttons side by side */}
          <div className="w-1/2 flex flex-col items-center gap-4">
            {/* Row for the two upload sections */}
            <div className="flex flex-row items-start justify-center gap-8">
              {/* Left Image Upload */}
              <div className="flex flex-col items-center">
                <button
                  className="cursor-pointer dark:bg-[#030811] bg-[#fdfdfd] border-2 shadow-lg shadow-[#c5865c] border-[#c5865c] dark:text-[#f2ebe3] text-[#030811] py-4 px-10 rounded-full text-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#c5865c]/50 flex items-center gap-2"
                  onClick={() => openFilePicker("left")}
                >
                  Upload Left Image
                  <TfiUpload className="dark:text-[#f2ebe3] text-[#030811] m-1 pl-1 text-xl" />
                </button>
                <input
                  type="file"
                  ref={leftInputRef}
                  accept=".jpg,.png,.jpeg"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, "left")}
                />
                {leftImage && (
                  <img
                    src={leftImage}
                    alt="Left Preview"
                    className="mt-2 max-w-xs border border-gray-300"
                  />
                )}
              </div>

              {/* Right Image Upload */}
              <div className="flex flex-col items-center">
                <button
                  className="cursor-pointer dark:bg-[#030811] bg-[#fdfdfd] border-2 shadow-lg shadow-[#c5865c] border-[#c5865c] dark:text-[#f2ebe3] text-[#030811] py-4 px-10 rounded-full text-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#c5865c]/50 flex items-center gap-2"
                  onClick={() => openFilePicker("right")}
                >
                  Upload Right Image
                  <TfiUpload className="dark:text-[#f2ebe3] text-[#030811] m-1 pl-1 text-xl" />
                </button>
                <input
                  type="file"
                  ref={rightInputRef}
                  accept=".jpg,.png,.jpeg"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, "right")}
                />
                {rightImage && (
                  <img
                    src={rightImage}
                    alt="Right Preview"
                    className="mt-2 max-w-xs border border-gray-300"
                  />
                )}
              </div>
            </div>

            {/* Show Analyze button only if both images exist */}
            {leftImage && rightImage && (
              <button
                onClick={handleAnalyze}
                className="bg-secondary text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-secondary/90 transition"
              >
                Analyze
              </button>
            )}
          </div>
        </div>

        {/* Crop Modal (if a base64 string is set for cropping) */}
        {croppingImage && (
          <CropModal
            image={croppingImage} // base64 string
            side={croppingSide}
            onCropSave={handleCropSave}
            onClose={handleClose}
          />
        )}
      </div>
    </div>
  );
};

export default Upload;
