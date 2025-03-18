// routes/patientRoutes.js
const express = require("express");
const router = express.Router();
const { createPatient , updatePatientById , getPatientsByDoctor , getPatientById , getPatientHistory} = require("../controllers/patientController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/create", authMiddleware, createPatient);

router.get('/doctor', authMiddleware, getPatientsByDoctor);

router.get('/:patientId', authMiddleware, getPatientById);

router.put('/:patientId', authMiddleware, updatePatientById);

router.get('/:patientId/history' ,authMiddleware, getPatientHistory)

module.exports = router;
