// controllers/patientController.js
const Patient = require("../models/patient");
const Doctor = require("../models/doctor");

exports.createPatient = async (req, res) => {
  try {
    // The auth middleware should attach the authenticated doctor to req.doctor.
    const doctor = req.doctor;
    if (!doctor) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Create a new patient with minimal default values.
    // You can leave the fields empty or set default placeholders.
    const newPatient = new Patient({
      name: "", 
      age: 0,
      gender: "",
      city: "",
      contactNo: "",
      doctor: doctor._id,
      reports: []
    });
    
    await newPatient.save();
    
    // Optionally update the doctor document to include this patient.
    doctor.patients.push(newPatient._id);
    await doctor.save();

    // Return the generated patient ID.
    return res.status(201).json({ patientId: newPatient._id });
  } catch (error) {
    console.error("Error creating patient:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getPatientsByDoctor = async (req, res) => {
    try {
      const doctor = req.doctor;
      if (!doctor) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      // Fetch patients for this doctor; return _id and name.
      const patients = await Patient.find({ doctor: doctor._id }).select("_id name");
      return res.status(200).json({ patients });
    } catch (error) {
      console.error("Error fetching patients:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };




  exports.getPatientById = async (req, res) => {
    try {
      const { patientId } = req.params;
      if (!patientId) {
        return res.status(400).json({ message: "Missing patientId" });
      }
      const patient = await Patient.findById(patientId);
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }
      return res.status(200).json({ patient });
    } catch (error) {
      console.error("Error fetching patient:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };


  
exports.updatePatientById = async (req, res) => {
    try {
      const { patientId } = req.params;
      const { age, patientName, gender } = req.body;
  
      // Validate required fields
      if (!patientId || !age || !patientName || !gender) {
        return res.status(400).json({ message: "Missing required fields" });
      }
  
      // Update the patient: we update the 'name', 'age', and 'gender' fields.
      const updatedPatient = await Patient.findByIdAndUpdate(
        patientId,
        { name: patientName, age, gender },
        { new: true } // Return the updated document.
      );
  
      if (!updatedPatient) {
        return res.status(404).json({ message: "Patient not found" });
      }
  
      return res.status(200).json({ message: "Patient updated successfully", patient: updatedPatient });
    } catch (error) {
      console.error("Error updating patient:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };