// controllers/reportController.js

const Report = require('../models/report');
const Patient = require('../models/patient');
const { uploadFile } = require('../config/s3');
const axios = require('axios');
const FormData = require('form-data');

const uploadImageToS3 = async (patientId, side, file) => {
  const key = `reports/${patientId}/${side}-${Date.now()}.jpg`;
  const result = await uploadFile(
    process.env.S3_BUCKET_NAME,
    key,
    file.buffer,
    file.mimetype
  );
  return result.Location; // S3 URL
};


const uploadBase64ImageToS3 = async (patientId, side, base64Image) => {
  // Decode the base64 string into a Buffer
  const buffer = Buffer.from(base64Image, 'base64');

  // Optionally, detect file type if your model always returns PNG or JPEG
  // For simplicity, we'll assume PNG here. Adjust as needed.
  const mimeType = 'image/png';

  const key = `reports/${patientId}/${side}-gradcam-${Date.now()}.png`;

  // Reuse your existing uploadFile function
  const result = await uploadFile(
    process.env.S3_BUCKET_NAME,
    key,
    buffer,
    mimeType
  );
  return result.Location; // S3 URL
};


const uploadEyeImages = async (patientId, leftFile, rightFile) => {
  const leftURL = await uploadImageToS3(patientId, 'left', leftFile);
  const rightURL = await uploadImageToS3(patientId, 'right', rightFile);
  return { leftURL, rightURL };
};


const uploadToHeatMapModel = async (patientId, leftFile, rightFile) => {
  try {
    const formData = new FormData();
    // The key must be 'files' for both images, per your model requirement
    formData.append('files', leftFile.buffer, leftFile.originalname);
    formData.append('files', rightFile.buffer, rightFile.originalname);

    // POST to your heatmap model endpoint
    const response = await axios.post(
      `${process.env.AI_DR_EXPLAIN_URL}/predict/`,
      formData,
      { headers: formData.getHeaders() }
    );

    const heatmapData = response.data; 
    // e.g., { predicted_images: { left_eye: { gradcam_image: ... }, right_eye: { gradcam_image: ... } } }

    // Extract base64 strings
    const leftBase64 = heatmapData?.predicted_images?.left_eye?.gradcam_image || "";
    const rightBase64 = heatmapData?.predicted_images?.right_eye?.gradcam_image || "";

    // If base64 is empty or invalid, handle accordingly
    let leftGradcamURL = "";
    let rightGradcamURL = "";

    // Upload the base64 images to S3 if they exist
    if (leftBase64) {
      leftGradcamURL = await uploadBase64ImageToS3(patientId, 'left_gradcam', leftBase64);
    }
    if (rightBase64) {
      rightGradcamURL = await uploadBase64ImageToS3(patientId, 'right_gradcam', rightBase64);
    }

    // Return the S3 URLs
    return {
      leftGradcamURL,
      rightGradcamURL
    };
  } catch (error) {
    throw new Error('Error uploading to Heatmap model: ' + error.message);
  }
};


const uploadToContorModel = async (patientId, leftFile, rightFile) => {
  try {
    const formData = new FormData();
    // The keys must be 'lefteye' and 'righteye' per your Contor model requirement
    formData.append('lefteye', leftFile.buffer, leftFile.originalname);
    formData.append('righteye', rightFile.buffer, rightFile.originalname);

    // POST to your Contor model endpoint
    const response = await axios.post(
      `${process.env.AI_GLAUCOMA_URL}/predict`,
      formData,
      { headers: formData.getHeaders() }
    );

    const contorData = response.data;

    const leftContourBase64 = contorData?.left_eye?.contour_image || "";
    const rightContourBase64 = contorData?.right_eye?.contour_image || "";

    // Upload the base64 images to S3 if they exist
    let leftContourURL = "";
    let rightContourURL = "";
    if (leftContourBase64) {
      leftContourURL = await uploadBase64ImageToS3(patientId, 'left_contour', leftContourBase64);
    }
    if (rightContourBase64) {
      rightContourURL = await uploadBase64ImageToS3(patientId, 'right_contour', rightContourBase64);
    }

    // Return the S3 URLs plus any other data you might want
    return {
      leftContourURL,
      rightContourURL,
      leftVCDR: contorData?.left_eye?.VCDR,
      rightVCDR: contorData?.right_eye?.VCDR,
      leftGlaucomaStatus: contorData?.left_eye?.glaucoma_status,
      rightGlaucomaStatus: contorData?.right_eye?.glaucoma_status
    };
  } catch (error) {
    throw new Error('Error uploading to Contor model: ' + error.message);
  }
};


const uploadToClaheModel = async (patientId, file) => {
  try {
    const formData = new FormData();
    // The key must be 'file' (singular)
    formData.append('file', file.buffer, file.originalname);

    const response = await axios.post(
      `${process.env.AI_CLAHE_URL}/process/`,
      formData,
      { headers: formData.getHeaders() }
    );
    // Example response: { Clahe_Image: "iVBORw0KGgoAAAANSUhEUgAAA..." }
    const claheData = response.data;
    const base64 = claheData?.clahe_image || "";

    // Upload the base64 string to S3 if it exists
    let claheURL = "";
    if (base64) {
      // 'clahe_left' or 'clahe_right' just to differentiate the file name
      claheURL = await uploadBase64ImageToS3(patientId, 'clahe', base64);
    }
    return claheURL;
  } catch (error) {
    throw new Error('Error uploading to CLAHE model: ' + error.message);
  }
};


const uploadToPredictionModel=async(patientId , file)=>{
  try {
    const formData=new FormData();
    formData.append('file',file.buffer,file.originalname);
    const response=await axios.post(
      `${process.env.AI_DR_URL}/predict/`,
      formData,
      {headers:formData.getHeaders()}
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading to Prediction model:", error);
    return res.status(500).json({ message: "Server error" });
  }
}



exports.uploadReport = async (req, res) => {
  try {
  
    const { patientId } = req.body;
    if (!patientId) {
      return res.status(400).json({ message: "Missing patientId" });
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


    const { leftURL, rightURL } = await uploadEyeImages(patientId, leftFile, rightFile);

    
    const { leftGradcamURL, rightGradcamURL } = await uploadToHeatMapModel(patientId, leftFile, rightFile);

    const {
      leftContourURL,
      rightContourURL,
      leftVCDR,
      rightVCDR,
      leftGlaucomaStatus,
      rightGlaucomaStatus
    } = await uploadToContorModel(patientId, leftFile, rightFile);

    const leftClaheURL = await uploadToClaheModel(patientId, leftFile);
    const rightClaheURL = await uploadToClaheModel(patientId, rightFile);


    const leftPrediction=await uploadToPredictionModel(patientId,leftFile);
    const rightPrediction=await uploadToPredictionModel(patientId,rightFile);


    const newReport = new Report({
      leftFundusImage: leftURL,    // original fundus image in S3
      rightFundusImage: rightURL,  // original fundus image in S3
      reannotationLabel: req.body.reannotationLabel || "",
      reannotationCoordinates: req.body.reannotationCoordinates || [],

      explainableAiLeftFundusImage: leftGradcamURL,
      explainableAiRightFundusImage: rightGradcamURL,
      contorLeftFundusImage: leftContourURL,
      contorRightFundusImage: rightContourURL,
   
      contorLeftVCDR: leftVCDR,
      contorRightVCDR: rightVCDR,
      contorLeftGlaucomaStatus: leftGlaucomaStatus,
      contorRightGlaucomaStatus: rightGlaucomaStatus,

      leftEyeClahe: leftClaheURL,
      rightEyeClahe: rightClaheURL,

      leftFundusPrediction: leftPrediction,
      rightFundusPrediction: rightPrediction,

      patientId: patientId
    });

    await newReport.save();


    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    patient.reports.push(newReport);
    await patient.save();

    return res.status(201).json({
      reportId: newReport._id,
      message: "Report uploaded successfully"
    });

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