// src/components/ConfirmModal.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import API_URL from "../../utils/config";
import { BarLoader } from "./BarLoader";

const ConfirmModal = ({ onCancel, patientId }) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("DR Analysis"); // default selection
  const navigate = useNavigate();
  const { leftImage, rightImage } = useSelector((state) => state.images);

  // Map active tab to analysis type
  const getAnalysisType = () => {
    switch (activeTab) {
      case "Glaucoma Analysis":
        return "Glaucoma";
      case "Armd Analysis":
        return "Armd";
      case "DR Analysis":
      default:
        return "DR";
    }
  };

  // Determine endpoint based on active analysis type
  const getEndpoint = () => {
    switch (activeTab) {
      case "Glaucoma Analysis":
        return `${API_URL}/api/report/glaucoma/upload`;
      case "Armd Analysis":
        return `${API_URL}/api/report/armd/upload`;
      case "DR Analysis":
      default:
        return `${API_URL}/api/report/dr/upload`;
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Create a FormData instance.
      const formData = new FormData();

      // Convert Base64 images to Blob objects.
      const leftBlob = await (await fetch(leftImage)).blob();
      const rightBlob = await (await fetch(rightImage)).blob();

      // Append patientId, images, and analysisType.
      formData.append("patientId", patientId);
      formData.append("leftImage", leftBlob, "left_image.jpg");
      formData.append("rightImage", rightBlob, "right_image.jpg");
      formData.append("analysisType", getAnalysisType());

      // Get the correct endpoint based on the active tab.
      const endpoint = getEndpoint();

      // Call the report upload API.
      const response = await axios.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      const { reportId } = response.data;
      toast.success("Report uploaded successfully!");
      navigate(`/analysis/${reportId}`);
    } catch (error) {
      console.error("Error uploading report:", error);
      toast.error("Failed to upload report");
      setLoading(false);
    }
  };

  return (
    <>
      {/* Confirm Modal */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="bg-primary p-8 rounded-lg shadow-lg border border-[#5c60c6]"
        >
          <h1 className="text-xl font-bold mb-6 text-center text-secondary">
            Please select the analysis type
          </h1>
          {/* Analysis type toggle */}
          <div className="flex items-center justify-center w-full mb-6">
            <div className="relative flex items-center bg-white border border-[#5c60c6] rounded-full overflow-hidden max-w-xl w-full shadow-sm">
              <div
                className={`absolute top-0 left-0 h-full w-1/3 bg-[#5c60c6] rounded-full transition-transform duration-500 ease-in-out ${
                  activeTab === "Glaucoma Analysis"
                    ? "translate-x-full"
                    : activeTab === "Armd Analysis"
                    ? "translate-x-[200%]"
                    : "translate-x-0"
                }`}
              ></div>
              <button
                className={`relative z-10 flex-1 px-4 py-2 text-sm font-semibold transition-colors duration-300 ${
                  activeTab === "DR Analysis"
                    ? "text-white"
                    : "text-gray-800 hover:text-[#5c60c6]"
                }`}
                onClick={() => setActiveTab("DR Analysis")}
                aria-label="DR Analysis"
              >
                DR Analysis
              </button>
              <button
                className={`relative z-10 flex-1 px-4 py-2 text-sm font-semibold transition-colors duration-300 ${
                  activeTab === "Glaucoma Analysis"
                    ? "text-white"
                    : "text-gray-800 hover:text-[#5c60c6]"
                }`}
                onClick={() => setActiveTab("Glaucoma Analysis")}
                aria-label="Glaucoma Analysis"
              >
                Glaucoma Analysis
              </button>
              <button
                className={`relative z-10 flex-1 px-4 py-2 text-sm font-semibold transition-colors duration-300 ${
                  activeTab === "Armd Analysis"
                    ? "text-white"
                    : "text-gray-800 hover:text-[#5c60c6]"
                }`}
                onClick={() => setActiveTab("Armd Analysis")}
                aria-label="Armd Analysis"
              >
                Armd Analysis
              </button>
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-full bg-gray-300 text-gray-800 hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-full bg-secondary text-white hover:bg-blue-600 transition"
            >
              Save
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* Loader Overlay */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
          <BarLoader />
        </div>
      )}
    </>
  );
};

export default ConfirmModal;
