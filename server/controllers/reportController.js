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
  const key = `reports/${patientId}/${side}-${Date.now()}.jpg`;
  return uploadFile(
    process.env.S3_BUCKET_NAME,
    key,
    file.buffer,
    file.mimetype
  ).then(result => result.Location);
};

const uploadBase64ImageToS3 = async (patientId, side, base64Image) => {
  const buffer = Buffer.from(base64Image, 'base64');
  const key = `reports/${patientId}/${side}-${Date.now()}.png`;
  return uploadFile(
    process.env.S3_BUCKET_NAME,
    key,
    buffer,
    'image/png'
  ).then(result => result.Location);
};

// Parallel processing functions
const processHeatMapModel = async (patientId, leftFile, rightFile) => {
  const formData = new FormData();
  formData.append('files', leftFile.buffer, leftFile.originalname);
  formData.append('files', rightFile.buffer, rightFile.originalname);

  const { data } = await axiosInstance.post(
    `${process.env.AI_DR_EXPLAIN_URL}/predict/`,
    formData,
    { headers: formData.getHeaders() }
  );

  const [leftGradcamURL, rightGradcamURL] = await Promise.all([
    data?.predicted_images?.left_eye?.gradcam_image 
      ? uploadBase64ImageToS3(patientId, 'left_gradcam', data.predicted_images.left_eye.gradcam_image)
      : Promise.resolve(''),
    data?.predicted_images?.right_eye?.gradcam_image 
      ? uploadBase64ImageToS3(patientId, 'right_gradcam', data.predicted_images.right_eye.gradcam_image)
      : Promise.resolve('')
  ]);

  return { leftGradcamURL, rightGradcamURL };
};

const processContorModel = async (patientId, leftFile, rightFile) => {
  const formData = new FormData();
  formData.append('lefteye', leftFile.buffer, leftFile.originalname);
  formData.append('righteye', rightFile.buffer, rightFile.originalname);

  const { data } = await axiosInstance.post(
    `${process.env.AI_GLAUCOMA_URL}/predict`,
    formData,
    { headers: formData.getHeaders() }
  );

  const [leftContourURL, rightContourURL] = await Promise.all([
    data?.left_eye?.contour_image 
      ? uploadBase64ImageToS3(patientId, 'left_contour', data.left_eye.contour_image)
      : Promise.resolve(''),
    data?.right_eye?.contour_image 
      ? uploadBase64ImageToS3(patientId, 'right_contour', data.right_eye.contour_image)
      : Promise.resolve('')
  ]);

  return {
    leftContourURL,
    rightContourURL,
    leftVCDR: data?.left_eye?.VCDR,
    rightVCDR: data?.right_eye?.VCDR,
    leftGlaucomaStatus: data?.left_eye?.glaucoma_status,
    rightGlaucomaStatus: data?.right_eye?.glaucoma_status
  };
};

const processClaheModel = async (patientId, file) => {
  const formData = new FormData();
  formData.append('file', file.buffer, file.originalname);

  const { data } = await axiosInstance.post(
    `${process.env.AI_CLAHE_URL}/process/`,
    formData,
    { headers: formData.getHeaders() }
  );

  return data?.clahe_image 
    ? uploadBase64ImageToS3(patientId, 'clahe', data.clahe_image)
    : '';
};


const processArmdModel = async (patientId, leftFile, rightFile) => {
  const formData = new FormData();
  formData.append('left_eye', leftFile.buffer, leftFile.originalname);
  formData.append('right_eye', rightFile.buffer, rightFile.originalname);

  const { data } = await axiosInstance.post(
    'http://10.10.110.24:8319/amd_predict/',
    formData,
    { headers: formData.getHeaders() }
  );

  // Map the response to the expected structure
  return {
    left_eye: data.left_eye_prediction,
    right_eye: data.right_eye_prediction
  };
};

const processPredictionModel = async (file) => {
  const formData = new FormData();
  formData.append('file', file.buffer, file.originalname);
  
  const { data } = await axiosInstance.post(
    `${process.env.AI_DR_URL}/predict/`,
    formData,
    { headers: formData.getHeaders() }
  );
  
  return data;
};


exports.uploadDRReport = async (req, res) => {
  try {
    const { patientId, analysisType } = req.body;
    if (!patientId) return res.status(400).json({ message: "Missing patientId" });
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
    if (!patientExists) return res.status(404).json({ message: "Patient not found" });

    // Parallel processing for DR analysis.
    const [originalUrls, heatMapData, claheUrls, predictions] = await Promise.all([
      Promise.all([
        uploadImageToS3(patientId, 'left', leftFile),
        uploadImageToS3(patientId, 'right', rightFile)
      ]),
      processHeatMapModel(patientId, leftFile, rightFile),
      Promise.all([
        processClaheModel(patientId, leftFile),
        processClaheModel(patientId, rightFile)
      ]),
      Promise.all([
        processPredictionModel(leftFile),
        processPredictionModel(rightFile)
      ])
    ]);

    const newReport = await Report.create({
      leftFundusImage: originalUrls[0],
      rightFundusImage: originalUrls[1],
      analysisType: "DR",
      explainableAiLeftFundusImage: heatMapData.leftGradcamURL,
      explainableAiRightFundusImage: heatMapData.rightGradcamURL,
      leftEyeClahe: claheUrls[0],
      rightEyeClahe: claheUrls[1],
      leftFundusPrediction: predictions[0],
      rightFundusPrediction: predictions[1],
      patientId
    });

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
      Promise.all([
        processClaheModel(patientId, leftFile),
        processClaheModel(patientId, rightFile)
      ])
    ]);

    const newReport = await Report.create({
      leftFundusImage: originalUrls[0],
      rightFundusImage: originalUrls[1],
      analysisType: "Glaucoma",
      contorLeftFundusImage: contorData.leftContourURL,
      contorRightFundusImage: contorData.rightContourURL,
      contorLeftVCDR: contorData.leftVCDR,
      contorRightVCDR: contorData.rightVCDR,
      contorLeftGlaucomaStatus: contorData.leftGlaucomaStatus,
      contorRightGlaucomaStatus: contorData.rightGlaucomaStatus,
      leftEyeClahe: claheUrls[0],
      rightEyeClahe: claheUrls[1],
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
      Promise.all([
        processClaheModel(patientId, leftFile),
        processClaheModel(patientId, rightFile)
      ]),
      processArmdModel(patientId, leftFile, rightFile)
    ]);

    const newReport = await Report.create({
      leftFundusImage: originalUrls[0],
      rightFundusImage: originalUrls[1],
      analysisType: "Armd",
      leftEyeClahe: claheUrls[0],
      rightEyeClahe: claheUrls[1],
      leftFundusArmdPrediction: armdData.left_eye,
      rightFundusArmdPrediction: armdData.right_eye,
      patientId
    });

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
    const patient = await Patient.findOne({ reports: reportId }).select("name age gender city contactNo");

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
      // Fetch the top 5 reports, sorted by creation date descending.
      const reports = await Report.find({})
        .sort({ createdAt: -1 })
        .limit(5);
      return res.status(200).json({ reports });
    } catch (error) {
      console.error("Error fetching recent reports:", error);
      return res.status(500).json({ message: "Server error" });
    }
};