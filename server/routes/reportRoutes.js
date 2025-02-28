// routes/reportRoutes.js
const express = require("express");
const router = express.Router();
const { uploadReport, getReportById } = require("../controllers/reportController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../config/multer");

// Use multer.fields to accept two files (one for left and one for right)
router.post(
  "/upload",
  authMiddleware,
  upload.fields([
    { name: "leftImage", maxCount: 1 },
    { name: "rightImage", maxCount: 1 }
  ]),
  uploadReport
);

router.get('/:reportId', authMiddleware , getReportById);


module.exports = router;
