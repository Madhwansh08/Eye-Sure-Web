// routes/imageRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const { uploadImages } = require("../controllers/imageController");
const authMiddleware = require("../middleware/authMiddleware");

// Use authMiddleware if needed.
router.post("/upload", authMiddleware, upload.array("file", 2), uploadImages);

module.exports = router;
