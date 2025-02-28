// src/components/PatientModal.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import API_URL from "../../utils/config";
import ConfirmModal from "./ConfirmModal";
import { toast } from "react-toastify";

const PatientModal = ({ onClose, patientId }) => {
  const [age, setAge] = useState("");
  const [patientName, setPatientName] = useState("");
  const [gender, setGender] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = { age, patientName, gender };
    try {
      const response = await axios.put(`${API_URL}/api/patient/${patientId}`, formData, {
        withCredentials: true,
      });
      console.log("Updated patient:", response.data);
      toast.success("Patient updated successfully!");
      // Open the confirmation modal
      setShowConfirmModal(true);
    } catch (error) {
      console.error("Error updating patient:", error);
      toast.error("Failed to update patient");
    }
  };

  const handleConfirmClose = () => {
    setShowConfirmModal(false);
    onClose();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="bg-white p-10 rounded-lg shadow-lg w-full max-w-2xl"
        >
          <h2 className="text-2xl font-bold mb-6">New Patient Details</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Patient ID</label>
              <input
                type="text"
                value={patientId}
                disabled
                className="mt-1 w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="mt-1 w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Patient Name</label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="mt-1 w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="mt-1 w-full border rounded px-3 py-2"
                required
              >
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
              >
                Submit
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>

      {showConfirmModal && (
        <ConfirmModal onCancel={handleConfirmClose} patientId={patientId} />
      )}
    </>
  );
};

export default PatientModal;
