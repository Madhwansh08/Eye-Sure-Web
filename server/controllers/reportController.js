// controllers/reportController.js

const Report = require('../models/report');
const Patient = require('../models/patient');
const { uploadFile } = require('../config/s3');
const axios = require('axios');
const FormData = require('form-data');

// Configure axios for better performance
const axiosInstance = axios.create({
  timeout: 30000, // 30 seconds timeout
  maxRedirects: 2,
  maxContentLength: 50 * 1024 * 1024 // 50MB
});

// Helper functions
const uploadImageToS3 = async (patientId, side, file) => {
  const folderName = side === 'left' ? 'left_eye' : 'right_eye';
  const key = `reports/${patientId}/${folderName}/${Date.now()}.jpg`;

  return uploadFile(
    process.env.S3_BUCKET_NAME,
    key,
    file.buffer,
    file.mimetype
  ).then(result => result.Location);
};

const uploadBase64ImageToS3 = async (patientId, side, base64Image) => {
  const buffer = Buffer.from(base64Image, 'base64');
  const folderName = side === 'left' ? 'left_eye' : 'right_eye';
  const key = `reports/${patientId}/${folderName}/${Date.now()}.png`;

  return uploadFile(
    process.env.S3_BUCKET_NAME,
    key,
    buffer,
    'image/png'
  ).then(result => result.Location);
};


const processDR = async (patientId, leftFile, rightFile) => {
  const formData = new FormData();
  formData.append('left_eye', leftFile.buffer, leftFile.originalname);
  formData.append('right_eye', rightFile.buffer, rightFile.originalname);

  // Call your AI endpoint
  const { data } = await axiosInstance.post(
    `${process.env.AI_DR_URL}/predict/`,
    formData,
    { headers: formData.getHeaders() }
  );

  let leftXAIURL = "";
  let rightXAIURL = "";

  // ---------- LEFT EYE ----------
  // Check if we have data.left_eye.xai_results.image
  if (data?.left_eye?.xai_results?.image) {
    // "image" is the base64 string
    const leftBuffer = Buffer.from(data.left_eye.xai_results.image, 'base64');
    const leftKey = `reports/${patientId}/left_gradcam-${Date.now()}.png`;

    const leftUpload = await uploadFile(
      process.env.S3_BUCKET_NAME,
      leftKey,
      leftBuffer,
      'image/png'
    );
    leftXAIURL = leftUpload.Location;
  }

  // ---------- RIGHT EYE ----------
  // Check if we have data.right_eye.xai_results.image
  if (data?.right_eye?.xai_results?.image) {
    const rightBuffer = Buffer.from(data.right_eye.xai_results.image, 'base64');
    const rightKey = `reports/${patientId}/right_gradcam-${Date.now()}.png`;

    const rightUpload = await uploadFile(
      process.env.S3_BUCKET_NAME,
      rightKey,
      rightBuffer,
      'image/png'
    );
    rightXAIURL = rightUpload.Location;
  }

  return {
    left: {
      primary_classification: data.left_eye.primary_classification,
      sub_classes: data.left_eye.sub_classes,
      xai_url: leftXAIURL
    },
    right: {
      primary_classification: data.right_eye.primary_classification,
      sub_classes: data.right_eye.sub_classes,
      xai_url: rightXAIURL
    }
  };
};


const processContorModel = async (patientId, leftFile, rightFile) => {
  const formData = new FormData();
  formData.append('left_eye', leftFile.buffer, leftFile.originalname);
  formData.append('right_eye', rightFile.buffer, rightFile.originalname);

  const { data } = await axiosInstance.post(
    `${process.env.AI_GLAUCOMA_URL}/glaucoma_predict`,
    formData,
    { headers: formData.getHeaders() }
  );

  const [leftContourURL, rightContourURL] = await Promise.all([
    data?.left_eye?.xai_results?.image 
      ? uploadBase64ImageToS3(patientId, 'left_contour', data.left_eye.xai_results.image)
      : Promise.resolve(''),
    data?.right_eye?.xai_results?.image 
      ? uploadBase64ImageToS3(patientId, 'right_contour', data.right_eye.xai_results.image)
      : Promise.resolve('')
  ]);

  return {
    leftContourURL,
    rightContourURL,
    leftGlaucomaStatus: data?.left_eye?.primary_classification?.class_name,
    rightGlaucomaStatus: data?.right_eye?.primary_classification?.class_name
  };
};

const processClaheModel = async (patientId, leftFile, rightFile) => {
  const formData = new FormData();
  formData.append('left_eye', leftFile.buffer, leftFile.originalname);
  formData.append('right_eye', rightFile.buffer, rightFile.originalname);

  const { data } = await axiosInstance.post(
    `${process.env.AI_CLAHE_URL}/clahe_process`,
    formData,
    { headers: formData.getHeaders() }
  );

  return {
    leftEyeClahe: data?.left_eye ? await uploadBase64ImageToS3(patientId, 'left', data.left_eye) : '',
    rightEyeClahe: data?.right_eye ? await uploadBase64ImageToS3(patientId, 'right', data.right_eye) : ''
  };
};

const processArmdModel = async (patientId, leftFile, rightFile) => {
  const formData = new FormData();
  formData.append('left_eye', leftFile.buffer, leftFile.originalname);
  formData.append('right_eye', rightFile.buffer, rightFile.originalname);

  const { data } = await axiosInstance.post(
    `${process.env.AI_ARMD_URL}/amd_predict/`,
    formData,
    { headers: formData.getHeaders() }
  );

  // Convert ARMD/Non-ARMD to "1" or "0"
  const mapClassification = (classification) =>
    classification === "ARMD" ? "1" : "0";

  return {
    left_eye: mapClassification(data.left_eye.primary_classification.class_name),
    right_eye: mapClassification(data.right_eye.primary_classification.class_name),
  };
};





exports.uploadDRReport = async (req, res) => {
  try {
    const { patientId, analysisType } = req.body;
    if (!patientId) {
      return res.status(400).json({ message: "Missing patientId" });
    }
    if (!analysisType || analysisType !== "DR") {
      return res.status(400).json({ message: "Invalid analysisType for DR report" });
    }
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

    // Verify patient existence.
    const patientExists = await Patient.exists({ _id: patientId });
    if (!patientExists) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const [originalUrls, claheUrls, drResults] = await Promise.all([
      Promise.all([
        uploadImageToS3(patientId, 'left', leftFile),
        uploadImageToS3(patientId, 'right', rightFile)
      ]),
      processClaheModel(patientId, leftFile, rightFile),
      processDR(patientId, leftFile, rightFile)
    ]);
    
    // Create a new report document
    const newReport = await Report.create({
      leftFundusImage: originalUrls[0],
      rightFundusImage: originalUrls[1],
      analysisType: "DR",
      explainableAiLeftFundusImage: drResults.left.xai_url,
      explainableAiRightFundusImage: drResults.right.xai_url,
    
      // Correctly storing CLAHE images
      leftEyeClahe: claheUrls.leftEyeClahe,
      rightEyeClahe: claheUrls.rightEyeClahe,
    
      leftFundusPrediction: {
        primary_classification: drResults.left.primary_classification,
        sub_classes: drResults.left.sub_classes
      },
      rightFundusPrediction: {
        primary_classification: drResults.right.primary_classification,
        sub_classes: drResults.right.sub_classes
      },
    
      patientId
    });
    

    // Update patient with the newly created report
    await Patient.findByIdAndUpdate(
      patientId,
      { $push: { reports: newReport._id } },
      { new: true }
    );

    return res.status(201).json({
      reportId: newReport._id,
      message: "DR Report uploaded successfully"
    });
  } catch (error) {
    console.error("DR Report upload error:", error);
    const statusCode = error.response?.status || 500;
    const message = error.message || "Internal server error";
    return res.status(statusCode).json({ message });
  }
};

exports.uploadGlaucomaReport = async (req, res) => {
  try {
    const { patientId, analysisType } = req.body;
    if (!patientId) return res.status(400).json({ message: "Missing patientId" });
    if (!analysisType || analysisType !== "Glaucoma") {
      return res.status(400).json({ message: "Invalid analysisType for Glaucoma report" });
    }
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

    // Verify patient existence.
    const patientExists = await Patient.exists({ _id: patientId });
    if (!patientExists) return res.status(404).json({ message: "Patient not found" });

    // Parallel processing for Glaucoma analysis.
    const [originalUrls, contorData, claheUrls] = await Promise.all([
      Promise.all([
        uploadImageToS3(patientId, 'left', leftFile),
        uploadImageToS3(patientId, 'right', rightFile)
      ]),
      processContorModel(patientId, leftFile, rightFile),
      processClaheModel(patientId, leftFile, rightFile)
    ]);

    const newReport = await Report.create({
      leftFundusImage: originalUrls[0],
      rightFundusImage: originalUrls[1],
      analysisType: "Glaucoma",
      contorLeftFundusImage: contorData.leftContourURL,
      contorRightFundusImage: contorData.rightContourURL,
      contorLeftGlaucomaStatus: contorData.leftGlaucomaStatus,
      contorRightGlaucomaStatus: contorData.rightGlaucomaStatus,
      leftEyeClahe: claheUrls.leftEyeClahe,
      rightEyeClahe: claheUrls.rightEyeClahe,
      patientId
    });

    await Patient.findByIdAndUpdate(
      patientId,
      { $push: { reports: newReport._id } },
      { new: true }
    );

    return res.status(201).json({
      reportId: newReport._id,
      message: "Glaucoma Report uploaded successfully"
    });
  } catch (error) {
    console.error("Glaucoma Report upload error:", error);
    const statusCode = error.response?.status || 500;
    const message = error.message || "Internal server error";
    return res.status(statusCode).json({ message });
  }
};




exports.uploadArmdReport = async (req, res) => {
  try {
    const { patientId, analysisType } = req.body;
    if (!patientId) return res.status(400).json({ message: "Missing patientId" });
    if (!analysisType || analysisType !== "Armd") {
      return res.status(400).json({ message: "Invalid analysisType for Armd report" });
    }
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

    // Verify patient existence.
    const patientExists = await Patient.exists({ _id: patientId });
    if (!patientExists) return res.status(404).json({ message: "Patient not found" });

    // Parallel processing for Armd analysis.
    const [originalUrls, claheUrls, armdData] = await Promise.all([
      Promise.all([
        uploadImageToS3(patientId, 'left', leftFile),
        uploadImageToS3(patientId, 'right', rightFile)
      ]),
      processClaheModel(patientId, leftFile, rightFile),
      processArmdModel(patientId, leftFile, rightFile)
    ]);

    // Create a new report document
    const newReport = await Report.create({
      leftFundusImage: originalUrls[0],
      rightFundusImage: originalUrls[1],
      analysisType: "Armd",
      leftEyeClahe: claheUrls.leftEyeClahe,
      rightEyeClahe: claheUrls.rightEyeClahe,
      leftFundusArmdPrediction: armdData.left_eye,
      rightFundusArmdPrediction: armdData.right_eye,
      patientId
    });

    // Update patient with the newly created report
    await Patient.findByIdAndUpdate(
      patientId,
      { $push: { reports: newReport._id } },
      { new: true }
    );

    return res.status(201).json({
      reportId: newReport._id,
      message: "Armd Report uploaded successfully"
    });
  } catch (error) {
    console.error("Armd Report upload error:", error);
    const statusCode = error.response?.status || 500;
    const message = error.message || "Internal server error";
    return res.status(statusCode).json({ message });
  }
};



exports.updateReportById = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { leftFundusAnnotationCoordinates, rightFundusAnnotationCoordinates } = req.body;

    if (!reportId) {
      return res.status(400).json({ message: "Report ID is required." });
    }

    // Update the report with the new annotation objects.
    const updatedReport = await Report.findByIdAndUpdate(
      reportId,
      {
        leftFundusAnnotationCoordinates: leftFundusAnnotationCoordinates || [],
        rightFundusAnnotationCoordinates: rightFundusAnnotationCoordinates || []
      },
      { new: true }
    );

    if (!updatedReport) {
      return res.status(404).json({ message: "Report not found." });
    }

    return res.status(200).json({
      report: updatedReport,
      message: "Annotations updated successfully."
    });
  } catch (error) {
    console.error("Error updating report annotations:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// In your controller file (e.g., reportController.js)
exports.updateReportNote = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { note } = req.body;

    if (!reportId) {
      return res.status(400).json({ message: "Report ID is required." });
    }

    // Update only the note field
    const updatedReport = await Report.findByIdAndUpdate(
      reportId,
      { note: note || "" },
      { new: true }
    );

    if (!updatedReport) {
      return res.status(404).json({ message: "Report not found." });
    }

    return res.status(200).json({
      report: updatedReport,
      message: "Note updated successfully."
    });
  } catch (error) {
    console.error("Error updating report note:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

exports.updateReportFeedback = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { analysisType, feedback } = req.body; // analysisType e.g., "DR", "Glaucoma", "Armd"

    if (!reportId) {
      return res.status(400).json({ message: "Report ID is required." });
    }
    if (!analysisType) {
      return res.status(400).json({ message: "Analysis type is required." });
    }
    if (!feedback) {
      return res.status(400).json({ message: "Feedback data is required." });
    }

    // Fetch the current report document to check the analysis type.
    const reportDoc = await Report.findById(reportId);
    if (!reportDoc) {
      return res.status(404).json({ message: "Report not found." });
    }
    if (reportDoc.analysisType !== analysisType) {
      return res.status(400).json({ message: "Analysis type mismatch." });
    }

    // Build the update object. We assume that the feedback is a nested object.
    const update = {
      leftFundusFeedback: feedback.leftFundusFeedback,
      rightFundusFeedback: feedback.rightFundusFeedback
    };

    const updatedReport = await Report.findByIdAndUpdate(reportId, update, { new: true });
    return res.status(200).json({
      report: updatedReport,
      message: "Feedback updated successfully."
    });
  } catch (error) {
    console.error("Error updating report feedback:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};



exports.getReportById = async (req, res) => {
  try {
    const { reportId } = req.params;

    if (!reportId) {
      return res.status(400).json({ message: "Missing reportId" });
    }

    // Fetch the report and populate the patient reference
    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Find the patient linked to this report
    const patient = await Patient.findOne({ reports: reportId }).select("name age gender city contactNo location");

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    return res.status(200).json({ report, patient });

  } catch (error) {
    console.error("Error fetching report and patient details:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


exports.getRecentReports = async (req, res) => {
  try {
      // Get the logged-in doctor's ID from the request
      const doctorId = req.doctor.id;

      // Find patients assigned to this doctor
      const patientIds = await Patient.find({ doctor: doctorId }).distinct('_id');

      // Fetch the top 5 recent reports for those patients
      const reports = await Report.find({ patientId: { $in: patientIds } })
          .sort({ createdAt: -1 })
          .limit(5);

      return res.status(200).json({ reports });
  } catch (error) {
      console.error("Error fetching recent reports:", error);
      return res.status(500).json({ message: "Server error" });
  }
};
