// src/components/ExistingPatientModal.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import API_URL from "../../utils/config";
import { toast } from "react-toastify";
import ConfirmModal from "./ConfirmModal";

const ExistingPatientModal = ({ onClose }) => {
  const [patientList, setPatientList] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [age, setAge] = useState("");
  const [patientName, setPatientName] = useState("");
  const [gender, setGender] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Fetch the list of patients for the current doctor.
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/patient/doctor`, { withCredentials: true });
        setPatientList(response.data.patients);
      } catch (error) {
        console.error("Error fetching patients:", error);
        toast.error("Failed to fetch patients");
      }
    };
    fetchPatients();
  }, []);

  // When a patient is selected, fetch its details.
  useEffect(() => {
    if (!selectedPatientId) return;
    const fetchPatientDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/patient/${selectedPatientId}`, { withCredentials: true });
        const patient = response.data.patient;
        setAge(patient.age);
        setPatientName(patient.name);
        setGender(patient.gender);
      } catch (error) {
        console.error("Error fetching patient details:", error);
        toast.error("Failed to fetch patient details");
      }
    };
    fetchPatientDetails();
  }, [selectedPatientId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = { age, patientName, gender };
      const response = await axios.put(`${API_URL}/api/patient/${selectedPatientId}`, formData, { withCredentials: true });
      console.log("Updated patient:", response.data);
      toast.success("Patient updated successfully!");
      // Open ConfirmModal without immediately closing this modal.
      setShowConfirmModal(true);
      // Optionally, if you want to close this modal, you can call onClose() after a short delay.
      // setTimeout(() => onClose(), 500);
    } catch (error) {
      console.error("Error updating patient:", error);
      toast.error("Failed to update patient");
    }
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
          className="bg-primary p-10 rounded-lg shadow-lg w-full border-2 border-[#5c60c6] max-w-2xl"
        >
          <h2 className="text-2xl font-bold mb-6 text-secondary">Existing Patient Details</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary">Select Patient</label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="mt-1 w-full border rounded px-3 text-secondary py-2"
                required
              >
                <option value="">Select a patient</option>
                {patientList.map((patient) => (
                  <option key={patient._id} value={patient._id}>
                    {patient.name} ({patient._id})
                  </option>
                ))}
              </select>
            </div>
            {selectedPatientId && (
              <>
                <div>
                  <label className="block text-sm text-secondary font-medium">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="mt-1 text-secondary w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-secondary font-medium">Patient Name</label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="mt-1 w-full border rounded text-secondary px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-secondary font-medium">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="mt-1 w-full border text-secondary rounded px-3 py-2"
                    required
                  >
                    <option value="">Select...</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </>
            )}
            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded bg-[#fdfdfd] text-gray-800 hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedPatientId}
                className="px-4 py-2 rounded bg-secondary text-white hover:bg-blue-600 transition"
              >
                Save
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>

      {showConfirmModal && (
        <ConfirmModal
          onCancel={() => setShowConfirmModal(false)}
          patientId={selectedPatientId}
        />
      )}
    </>
  );
};

export default ExistingPatientModal;
