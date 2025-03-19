const express = require('express');
const { getDashboardData, getDRDashboardData } = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/data', authMiddleware, getDashboardData);
router.get('/data/dr' , authMiddleware , getDRDashboardData)

module.exports = router;
