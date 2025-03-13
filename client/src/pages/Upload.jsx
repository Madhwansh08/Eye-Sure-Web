// src/pages/Upload.jsx
import React, { useRef, useState } from "react";
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
import DetailModal from "../components/upload/DetailModal";
import { MdTableRows } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import RecentReportsDrawer from "../components/upload/RecentReportsDrawer";

const Upload = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { croppingImage, croppingSide, leftImage, rightImage } = useSelector(
    (state) => state.images
  );

  // Local states to store the file names for left and right images
  const [leftFileName, setLeftFileName] = useState("");
  const [rightFileName, setRightFileName] = useState("");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const leftInputRef = useRef(null);
  const rightInputRef = useRef(null);

  // Helper function to truncate file names if they are too long.
  const truncateFileName = (name, maxLength = 15) => {
    return name.length <= maxLength ? name : name.substring(0, maxLength) + '...';
  };

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
      const base64String = await convertFileToBase64(file);
      // Store the file name locally so that we can display it after cropping
      if (side === "left") {
        setLeftFileName(file.name);
      } else if (side === "right") {
        setRightFileName(file.name);
      }
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
    if (!leftImage || !rightImage) {
      alert("Please upload and crop both images before analyzing.");
      return;
    }

    try {
      // Create separate FormData instances for each image.
      const formDataLeft = new FormData();
      const formDataRight = new FormData();

      // Convert Base64 images to Blob objects.
      const leftBlob = await (await fetch(leftImage)).blob();
      const rightBlob = await (await fetch(rightImage)).blob();

      formDataLeft.append("file", leftBlob, "left_image.jpg");
      formDataRight.append("file", rightBlob, "right_image.jpg");

      // Make API calls concurrently.
      const [leftResponse, rightResponse] = await Promise.all([
        axios.post(`${API_URL}/api/image/upload`, formDataLeft, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }),
        axios.post(`${API_URL}/api/image/upload`, formDataRight, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }),
      ]);

      // Convert predictions to string and trim
      const leftPrediction = String(leftResponse.data.prediction).trim();
      const rightPrediction = String(rightResponse.data.prediction).trim();

      console.log("Left Prediction:", leftPrediction);
      console.log("Right Prediction:", rightPrediction);

      if (leftPrediction === "0") {
        toast.error("Left eye: Invalid image uploaded");
      } else {
        toast.success("Left eye: Valid image");
      }

      if (rightPrediction === "0") {
        toast.error("Right eye: Invalid image uploaded");
      } else {
        toast.success("Right eye: Valid image");
      }

      // If at least one image is valid, show the DetailModal; otherwise, navigate to analysis page.
      if (leftPrediction !== "0" || rightPrediction !== "0") {
        setShowDetailModal(true);
      } else {
        navigate("/analysis");
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Error uploading images. Check console for details.");
    }
  };

  return (
    <div className="bg-primary flex flex-col min-h-screen relative">
      <Header />

      {/* Drawer Toggle Button */}
      <button
        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
        className="fixed right-4 bottom-4 z-50 p-3 bg-white rounded-full shadow-lg"
      >
        {isDrawerOpen ? <IoMdClose size={28}/> : <MdTableRows size={28} />}
      </button>

      {isDrawerOpen && (
        <RecentReportsDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />
      )}

      <div className="flex flex-col items-center mt-20 pt-10 bg-primary text-secondary relative">
        <h1 className="text-center text-8xl font-bold mb-8 mx-auto text-secondary">
          <span className="gradient-text">Retina Analysis</span> 
        </h1>
        <p className="text-center text-3xl font-semibold mb-8 mx-auto mt-2 text-secondary">
          Kindly Upload Both Images
        </p>

        <div className="flex flex-row w-full mt-5 px-5 gap-5">
          <div className="w-1/2">
            <InstructionSlider />
          </div>
          <div className="w-1/2 flex flex-col items-center gap-4">
            <div className="flex flex-row items-start justify-center gap-8">
              <div className="flex flex-col items-center">
                <button
                  className="cursor-pointer bg-primary border-2 shadow-lg shadow-[#387AA4] border-[#387AA4] text-secondary py-4 px-10 rounded-full text-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#7162d7]/50 flex items-center gap-2"
                  onClick={() => openFilePicker("left")}
                >
                  Upload Left Image
                  <TfiUpload className="text-secondary m-1 pl-1 text-xl" />
                </button>
                <input
                  type="file"
                  ref={leftInputRef}
                  accept=".jpg,.png,.jpeg"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, "left")}
                />
                {leftImage && (
                  <div className="mt-2 text-center">
                    <img
                      src={leftImage}
                      alt="Left Preview"
                      className="max-w-xs border border-gray-300 my-5"
                    />
                    <p className="text-sm font-semibold mt-1">{truncateFileName(leftFileName)}</p>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center">
                <button
                  className="cursor-pointer bg-primary border-2 shadow-lg shadow-[#387AA4] border-[#387AA4] text-secondary py-4 px-10 rounded-full text-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#7162d7]/50 flex items-center gap-2"
                  onClick={() => openFilePicker("right")}
                >
                  Upload Right Image
                  <TfiUpload className="text-secondary m-1 pl-1 text-xl" />
                </button>
                <input
                  type="file"
                  ref={rightInputRef}
                  accept=".jpg,.png,.jpeg"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, "right")}
                />
                {rightImage && (
                  <div className="mt-2 text-center">
                    <img
                      src={rightImage}
                      alt="Right Preview"
                      className="max-w-xs border border-gray-300 my-5"
                    />
                    <p className="text-sm font-semibold mt-1">{truncateFileName(rightFileName)}</p>
                  </div>
                )}
              </div>
            </div>
            {leftImage && rightImage && (
              <button
                onClick={handleAnalyze}
                className="bg-secondary text-secondary py-3 px-8 rounded-full text-lg font-semibold hover:bg-gray-800 hover:cursor-pointer transition"
              >
                Analyze
              </button>
            )}
          </div>
        </div>

        {croppingImage && (
          <CropModal
            image={croppingImage}
            side={croppingSide}
            onCropSave={handleCropSave}
            onClose={handleClose}
          />
        )}
      </div>
      {showDetailModal && <DetailModal onClose={() => setShowDetailModal(false)} />}
    </div>
  );
};

export default Upload;
