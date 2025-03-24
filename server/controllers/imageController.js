// controllers/imageController.js
const axios = require("axios");
const FormData = require("form-data");

exports.uploadImages = async (req, res) => {
  try {
    // Check if file is present.
    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image." });
    }

    const file = req.file;

    // Create FormData and append the file using key "file"
    const formData = new FormData();
    formData.append("file", file.buffer, file.originalname);

    // Post to the external prediction API.
    const response = await axios.post(`${process.env.AI_PREDICT_URL}/verification`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    // Convert the prediction to a string, then trim.
    const prediction = String(response.data.prediction).trim();
    console.log("Prediction Result:", prediction);

    return res.status(200).json({ prediction });
  } catch (error) {
    console.error("Error in uploadImages:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
