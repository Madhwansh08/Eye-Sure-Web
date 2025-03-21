// routes/imageRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const { uploadImages } = require("../controllers/imageController");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * @swagger
 * /api/image/upload:
 *   post:
 *     summary: Upload an image
 *     tags: [Image]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       400:
 *         description: Bad request
 */
router.post("/upload", authMiddleware, upload.single("file"), uploadImages);

module.exports = router;
