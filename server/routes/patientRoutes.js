// routes/patientRoutes.js
const express = require("express");
const router = express.Router();
const { createPatient , updatePatientById , getPatientsByDoctor , getPatientById , getPatientHistory, deletePatientById} = require("../controllers/patientController");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * @swagger
 * /api/patient/create:
 *   post:
 *     summary: Create a new patient
 *     tags: [Patient]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: number
 *               gender:
 *                 type: string
 *               doctorId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Patient created successfully
 *       400:
 *         description: Bad request
 */
router.post("/create", authMiddleware, createPatient);


/**
 * @swagger
 * /api/patient/doctor:
 *   get:
 *     summary: Get patients by doctor
 *     tags: [Patient]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Patients retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/doctor', authMiddleware, getPatientsByDoctor);


/**
 * @swagger
 * /api/patient/{patientId}:
 *   get:
 *     summary: Get patient by ID
 *     tags: [Patient]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Patient retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/:patientId', authMiddleware, getPatientById);

/**
 * @swagger
 * /api/patient/{patientId}:
 *   put:
 *     summary: Update patient by ID
 *     tags: [Patient]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
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
 *               name:
 *                 type: string
 *               age:
 *                 type: number
 *               gender:
 *                 type: string
 *     responses:
 *       200:
 *         description: Patient updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.put('/:patientId', authMiddleware, updatePatientById);


/**
 * @swagger
 * /api/patient/{patientId}:
 *   delete:
 *     summary: Delete patient by ID
 *     tags: [Patient]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Patient deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.delete('/:patientId' , authMiddleware , deletePatientById)


/**
 * @swagger
 * /api/patient/{patientId}/history:
 *   get:
 *     summary: Get patient history by ID
 *     tags: [Patient]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Patient history retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/:patientId/history' ,authMiddleware, getPatientHistory)

module.exports = router;
