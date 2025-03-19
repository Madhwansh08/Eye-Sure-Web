const express = require('express');
const { getDashboardData, getDRDashboardData, getGlaucomaDashboardData, getArmdDashboardData } = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/data', authMiddleware, getDashboardData);
router.get('/data/dr' , authMiddleware , getDRDashboardData)
router.get('/data/glaucoma' , authMiddleware , getGlaucomaDashboardData)
router.get('/data/armd' , authMiddleware , getArmdDashboardData)

module.exports = router;
