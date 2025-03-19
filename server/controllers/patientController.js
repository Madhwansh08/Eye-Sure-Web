// controllers/patientController.js
const Patient = require("../models/patient");
const Doctor = require("../models/doctor");
const Report=require('../models/report')

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
      location: "",
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

// Updated API endpoint in your controller (e.g., patientController.js)
exports.getPatientsByDoctor = async (req, res) => {
  try {
    const doctor = req.doctor;
    if (!doctor) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Build the query object. If a search term is provided, filter by name.
    const search = req.query.search;
    const query = { doctor: doctor._id };
    if (search) {
      query.name = { $regex: search, $options: "i" }; // Case-insensitive matching
    }
    
    // Fetch patients for this doctor; return _id and name.
    const patients = await Patient.find(query).select("_id name");
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



// controllers/reportController.js
exports.getPatientHistory = async (req, res) => {
  try {
    const { patientId } = req.params;
    if (!patientId) {
      return res.status(400).json({ message: "Patient ID is required." });
    }
    
    const reports = await Report.find({ patientId }).sort({ createdAt: -1 });
    const history = reports.map((report) => {
      let leftResult = "N/A";
      let rightResult = "N/A";
      const analysisType = report.analysisType;

      if (analysisType === "DR") {
        leftResult = report.leftFundusPrediction?.primary_classification?.class_name || "N/A";
        rightResult = report.rightFundusPrediction?.primary_classification?.class_name || "N/A";
      } else if (analysisType === "Glaucoma") {
        leftResult = report.contorLeftGlaucomaStatus || "N/A";
        rightResult = report.contorRightGlaucomaStatus || "N/A";
      } else if (analysisType === "Armd") {
        leftResult = report.leftFundusArmdPrediction === "1" ? "ARMD Detected" : "No ARMD";
        rightResult = report.rightFundusArmdPrediction === "1" ? "ARMD Detected" : "No ARMD";
      }

      return {
        date: report.createdAt,
        analysisType,
        leftResult,
        rightResult,
      };
    });

    return res.status(200).json({ history });
  } catch (error) {
    console.error("Error in patient history", error);
    return res.status(500).json({ message: "Server error" });
  }
};



  
exports.updatePatientById = async (req, res) => {
    try {
      const { patientId } = req.params;
      const { age, patientName, gender , location } = req.body;
  
      // Validate required fields
      if (!patientId || !age || !patientName || !gender || !location) {
        return res.status(400).json({ message: "Missing required fields" });
      }
  
      // Update the patient: we update the 'name', 'age', and 'gender' fields.
      const updatedPatient = await Patient.findByIdAndUpdate(
        patientId,
        { name: patientName, age, gender  , location},
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




  exports.deletePatientById = async (req, res) => {
    try {
      // Ensure the doctor is authenticated
      const doctor = req.doctor;
      if (!doctor) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      const { patientId } = req.params;
      const patient = await Patient.findById(patientId);
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }
  
      // Verify the patient belongs to the authenticated doctor
      if (patient.doctor.toString() !== doctor._id.toString()) {
        return res
          .status(403)
          .json({ message: "You are not authorized to delete this patient" });
      }
  
      // OPTIONAL: Check if the patient record is "empty"
      // Here we assume an "empty" record has an empty name, gender, location,
      // age equal to 0, and no contact number.
      const isEmpty =
        patient.name === "" &&
        patient.age === 0 &&
        patient.gender === "" &&
        patient.location === "" &&
        (!patient.contactNo || patient.contactNo === "");
  
      if (!isEmpty) {
        return res.status(400).json({
          message: "Patient record contains data and cannot be deleted",
        });
      }
  
      // Delete the patient record
      await Patient.findByIdAndDelete(patientId);
  
      // Optionally update the doctor's record to remove the patient ID.
      await Doctor.findByIdAndUpdate(doctor._id, { $pull: { patients: patientId } });
  
      return res.status(200).json({ message: "Patient deleted successfully" });
    } catch (error) {
      console.error("Error deleting patient:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };