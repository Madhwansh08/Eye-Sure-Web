// routes/patientRoutes.js
const express = require("express");
const router = express.Router();
const { createPatient , updatePatientById , getPatientsByDoctor , getPatientById} = require("../controllers/patientController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/create", authMiddleware, createPatient);

router.get('/doctor', authMiddleware, getPatientsByDoctor);

router.get('/:patientId', authMiddleware, getPatientById);

router.put('/:patientId', authMiddleware, updatePatientById);

module.exports = router;
