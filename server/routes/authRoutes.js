const express = require('express');
const router = express.Router();
const { registerDoctor, loginDoctor, logoutDoctor , requestPasswordReset, verifyOTP, resetPassword, getProfile, getDoctor, updateDoctor} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new doctor
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Doctor registered successfully
 *       400:
 *         description: Bad request
 */
router.post('/register', registerDoctor);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a doctor
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Doctor logged in successfully
 *       400:
 *         description: Bad request
 */
router.post('/login', loginDoctor);

/**
 * @swagger
 * /api/auth/logout:
 *   get:
 *     summary: Logout the doctor
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Doctor logged out successfully
 *       400:
 *         description: Bad request
 */
router.get('/logout', logoutDoctor);


/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get the profile of the logged-in doctor
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Doctor profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', authMiddleware , getProfile);

/**
 * @swagger
 * /api/auth/send-otp:
 *   post:
 *     summary: Request a password reset OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: Bad request
 */
router.post('/send-otp', requestPasswordReset );

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Verify the OTP for password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Bad request
 */
router.post('/verify-otp', verifyOTP);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset the password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Bad request
 */
router.post('/reset-password', resetPassword)

/**
 * @swagger
 * /api/auth/data:
 *   get:
 *     summary: Get the data of the logged-in doctor
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Doctor data retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/data' , authMiddleware , getDoctor)

/**
 * @swagger
 * /api/auth/update:
 *   patch:
 *     summary: Update the doctor's profile
 *     tags: [Auth]
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
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Doctor profile updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.patch('/update' , authMiddleware , updateDoctor)


module.exports = router;
