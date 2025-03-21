// routes/reportRoutes.js
const express = require("express");
const router = express.Router();
const { uploadReport, getReportById , getRecentReports, uploadDRReport, uploadGlaucomaReport, uploadArmdReport, updateReportById, updateReportNote, updateReportFeedback } = require("../controllers/reportController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../config/multer");


/**
 * @swagger
 * /api/report/dr/upload:
 *   post:
 *     summary: Upload a diabetic retinopathy report
 *     tags: [Report]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               leftImage:
 *                 type: string
 *                 format: binary
 *               rightImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: DR report uploaded successfully
 *       400:
 *         description: Bad request
 */
router.post(
  "/dr/upload",
  authMiddleware,
  upload.fields([
    { name: "leftImage", maxCount: 1 },
    { name: "rightImage", maxCount: 1 }
  ]),
  uploadDRReport
);

/**
 * @swagger
 * /api/report/glaucoma/upload:
 *   post:
 *     summary: Upload a glaucoma report
 *     tags: [Report]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               leftImage:
 *                 type: string
 *                 format: binary
 *               rightImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Glaucoma report uploaded successfully
 *       400:
 *         description: Bad request
 */
router.post(
  "/glaucoma/upload",
  authMiddleware,
  upload.fields([
    { name: "leftImage", maxCount: 1 },
    { name: "rightImage", maxCount: 1 }
  ]),
  uploadGlaucomaReport
);

/**
 * @swagger
 * /api/report/armd/upload:
 *   post:
 *     summary: Upload an ARMD report
 *     tags: [Report]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               leftImage:
 *                 type: string
 *                 format: binary
 *               rightImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: ARMD report uploaded successfully
 *       400:
 *         description: Bad request
 */
router.post(
  "/armd/upload",
  authMiddleware,
  upload.fields([
    { name: "leftImage", maxCount: 1 },
    { name: "rightImage", maxCount: 1 }
  ]),
  uploadArmdReport
);

/**
 * @swagger
 * /api/report/{reportId}/annotations:
 *   patch:
 *     summary: Update report annotations by ID
 *     tags: [Report]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               annotations:
 *                 type: string
 *     responses:
 *       200:
 *         description: Report annotations updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.patch(
  '/:reportId/annotations',
  authMiddleware,
  updateReportById
)

/**
 * @swagger
 * /api/report/{reportId}/note:
 *   patch:
 *     summary: Update report note by ID
 *     tags: [Report]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         description: Report note updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.patch(
  '/:reportId/note'
  ,
  authMiddleware,
  updateReportNote
)
/**
 * @swagger
 * /api/report/{reportId}/feedback:
 *   patch:
 *     summary: Update report feedback by ID
 *     tags: [Report]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               feedback:
 *                 type: string
 *     responses:
 *       200:
 *         description: Report feedback updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.patch(
  '/:reportId/feedback',
  authMiddleware,
  updateReportFeedback
)


/**
 * @swagger
 * /api/report/{reportId}:
 *   get:
 *     summary: Get report by ID
 *     tags: [Report]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Report retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/:reportId', authMiddleware , getReportById);

/**
 * @swagger
 * /api/report/recent/reports:
 *   get:
 *     summary: Get recent reports
 *     tags: [Report]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recent reports retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/recent/reports', authMiddleware, getRecentReports);


module.exports = router;
