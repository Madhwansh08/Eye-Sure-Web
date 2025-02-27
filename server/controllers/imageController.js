// controllers/imageController.js
const axios = require("axios");
const FormData = require("form-data");

exports.uploadImages = async (req, res) => {
  try {
    // Check if files are present and there are at least 2 files.
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({ message: "Please upload both images." });
    }

    const leftFile = req.files[0];
    const rightFile = req.files[1];

    // Create FormData and append both files using the same field name "file"
    const formData = new FormData();
    formData.append("file", leftFile.buffer, leftFile.originalname);
    formData.append("file", rightFile.buffer, rightFile.originalname);

    // Post to the external prediction API.
    const response = await axios.post(`${process.env.AI_PREDICT_URL}/predict/`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    // Convert the prediction to a string, then trim.
    const prediction = String(response.data.prediction).trim();
    console.log("Prediction Result:", prediction);

    if (prediction === "0") {
      return res.status(200).json({ prediction: "0" });
    } else {
      return res.status(200).json({ prediction });
    }
  } catch (error) {
    console.error("Error in uploadImages:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
