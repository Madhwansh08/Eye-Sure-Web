// src/components/DetailModal.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiPlus, FiUser } from "react-icons/fi";
import PatientModal from "./PatientModal";
import ExistingPatientModal from "./ExistingPatientModal";
import axios from "axios";
import API_URL from "../../utils/config";
import { toast } from "react-toastify";

const DetailModal = ({ onClose }) => {
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showExistingPatientModal, setShowExistingPatientModal] = useState(false);
  const [generatedPatientId, setGeneratedPatientId] = useState("");

  const handleNewPatient = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/patient/create`, {}, { withCredentials: true });
      const newPatientId = response.data.patientId;
      console.log("New patient ID:", newPatientId);
      setGeneratedPatientId(newPatientId);
      setShowPatientModal(true);
    } catch (error) {
      console.error("Error creating new patient:", error);
      toast.error("Failed to create new patient");
    }
  };

  const handleExistingPatient = () => {
    setShowExistingPatientModal(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm bg-opacity-70"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="bg-primary p-10 rounded-lg shadow-lg w-full max-w-2xl"
        >
          <div className="flex flex-row space-x-8">
            <div className="flex-1 flex flex-col items-center justify-center border-r border-gray-300 pr-8">
              <button onClick={handleNewPatient}>
                <FiPlus size={80} className="text-secondary hover:text-[#5c60c6]" />
              </button>
              <h3 className="mt-6 text-3xl font-bold text-secondary">New Patient</h3>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center pl-8">
              <button onClick={handleExistingPatient}>
                <FiUser size={80} className="text-secondary hover:text-[#5c60c6]" />
              </button>
              <h3 className="mt-6 text-3xl font-bold text-secondary">Existing Patient</h3>
            </div>
          </div>
          <div className="flex justify-end mt-8">
            <button
              onClick={onClose}
              className="px-4 py-3 rounded-full bg-secondary text-secondary transition"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
      {showPatientModal && (
        <PatientModal
          patientId={generatedPatientId}
          onClose={() => setShowPatientModal(false)}
        />
      )}
      {showExistingPatientModal && (
        <ExistingPatientModal
          onClose={() => setShowExistingPatientModal(false)}
        />
      )}
    </>
  );
};

export default DetailModal;
