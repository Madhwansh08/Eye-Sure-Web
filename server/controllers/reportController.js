// controllers/reportController.js
const Report=require('../models/report') // Ensure you have a Report model compiled from reportSchema
const Patient = require("../models/patient");
const { uploadFile } = require("../config/s3");

exports.uploadReport = async (req, res) => {
    try {
      // Get patientId from the request body.
      const { patientId } = req.body;
      if (!patientId) {
        return res.status(400).json({ message: "Missing patientId" });
      }
      // Validate that both files are uploaded.
      if (
        !req.files ||
        !req.files.leftImage ||
        req.files.leftImage.length === 0 ||
        !req.files.rightImage ||
        req.files.rightImage.length === 0
      ) {
        return res.status(400).json({ message: "Please upload both left and right images" });
      }
  
      const leftFile = req.files.leftImage[0];
      const rightFile = req.files.rightImage[0];
  
      // Upload left image to S3.
      const leftResult = await uploadFile(
        process.env.S3_BUCKET_NAME,
        `reports/${patientId}/left-${Date.now()}.jpg`,
        leftFile.buffer,
        leftFile.mimetype
      );
  
      // Upload right image to S3.
      const rightResult = await uploadFile(
        process.env.S3_BUCKET_NAME,
        `reports/${patientId}/right-${Date.now()}.jpg`,
        rightFile.buffer,
        rightFile.mimetype
      );
  
      // Create a new Report document (including the required patientId).
      const newReport = new Report({
        leftFundusImage: leftResult.Location,
        rightFundusImage: rightResult.Location,
        reannotationLabel: req.body.reannotationLabel || "",
        reannotationCoordinates: req.body.reannotationCoordinates || [],
        explainableAiLeftFundusImage: req.body.explainableAiLeftFundusImage || "",
        explainableAiRightFundusImage: req.body.explainableAiRightFundusImage || "",
        patientId: patientId // Added to meet validation requirements.
      });
      await newReport.save();
  
      // Update the patient document by adding this report.
      const patient = await Patient.findById(patientId);
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }
      patient.reports.push(newReport);
      await patient.save();
  
      return res.status(201).json({ reportId: newReport._id, message: "Report uploaded successfully" });
    } catch (error) {
      console.error("Error uploading report:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };

exports.getReportById = async (req, res) => {
    try {
      const { reportId } = req.params;
      if (!reportId) {
        return res.status(400).json({ message: "Missing reportId" });
      }
      const report = await Report.findById(reportId);
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }
      return res.status(200).json({ report });
    } catch (error) {
      console.error("Error fetching report:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };