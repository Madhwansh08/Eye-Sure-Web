const express = require('express');
const { getDashboardData, getDRDashboardData, getGlaucomaDashboardData, getArmdDashboardData } = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * /api/dashboard/data:
 *   get:
 *     summary: Get general dashboard data
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/data', authMiddleware, getDashboardData);

/**
 * @swagger
 * /api/dashboard/data/dr:
 *   get:
 *     summary: Get diabetic retinopathy dashboard data
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Diabetic retinopathy dashboard data retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/data/dr' , authMiddleware , getDRDashboardData)

/**
 * @swagger
 * /api/dashboard/data/glaucoma:
 *   get:
 *     summary: Get glaucoma dashboard data
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Glaucoma dashboard data retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/data/glaucoma' , authMiddleware , getGlaucomaDashboardData)

/**
 * @swagger
 * /api/dashboard/data/armd:
 *   get:
 *     summary: Get age-related macular degeneration (ARMD) dashboard data
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ARMD dashboard data retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/data/armd' , authMiddleware , getArmdDashboardData)

module.exports = router;
