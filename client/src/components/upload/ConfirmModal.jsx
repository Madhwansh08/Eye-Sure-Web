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
  const navigate = useNavigate();
  const { leftImage, rightImage } = useSelector((state) => state.images);

  const handleSave = async () => {
    setLoading(true); // show loader
    try {
      // Create a FormData instance.
      const formData = new FormData();
      
      // Convert stored Base64 images to Blob objects.
      const leftBlob = await (await fetch(leftImage)).blob();
      const rightBlob = await (await fetch(rightImage)).blob();

      // Append patientId and images to the FormData.
      formData.append("patientId", patientId);
      formData.append("leftImage", leftBlob, "left_image.jpg");
      formData.append("rightImage", rightBlob, "right_image.jpg");

      // Call the report upload API.
      const response = await axios.post(`${API_URL}/api/report/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      // Retrieve the reportId from the response.
      const { reportId } = response.data;
      toast.success("Report uploaded successfully!");
      navigate(`/analysis/${reportId}`);
    } catch (error) {
      console.error("Error uploading report:", error);
      toast.error("Failed to upload report");
      setLoading(false); // hide loader on error
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
          className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">Start Analysis?</h2>
          <p className="mb-6 text-center">
            Would you like to start the analysis of the images?
          </p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
            >
              Save
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* Loader Overlay */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-60 bg-black bg-opacity-50 backdrop-blur-sm">
          <BarLoader />
        </div>
      )}
    </>
  );
};

export default ConfirmModal;
