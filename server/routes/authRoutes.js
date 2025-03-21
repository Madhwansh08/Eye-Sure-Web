const express = require('express');
const router = express.Router();
const { registerDoctor, loginDoctor, logoutDoctor , requestPasswordReset, verifyOTP, resetPassword, getProfile, getDoctor, updateDoctor} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/auth/register - Register a new doctor
router.post('/register', registerDoctor);

// POST /api/auth/login - Login an existing doctor
router.post('/login', loginDoctor);

// GET /api/auth/logout - Logout the doctor (clear the cookie)
router.get('/logout', logoutDoctor);

router.get('/profile', authMiddleware , getProfile);

router.post('/send-otp', requestPasswordReset );

router.post('/verify-otp', verifyOTP);

router.post('/reset-password', resetPassword)

router.get('/data' , authMiddleware , getDoctor)

router.patch('/update' , authMiddleware , updateDoctor)


module.exports = router;
