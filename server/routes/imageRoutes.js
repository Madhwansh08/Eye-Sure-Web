// routes/imageRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const { uploadImages } = require("../controllers/imageController");
const authMiddleware = require("../middleware/authMiddleware");

// Use authMiddleware if needed.
router.post("/upload", authMiddleware, upload.single("file"), uploadImages);

module.exports = router;
