const express = require('express');
const router = express.Router();
const { registerDoctor, loginDoctor, logoutDoctor , getProfile} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/auth/register - Register a new doctor
router.post('/register', registerDoctor);

// POST /api/auth/login - Login an existing doctor
router.post('/login', loginDoctor);

// GET /api/auth/logout - Logout the doctor (clear the cookie)
router.get('/logout', logoutDoctor);

router.get('/profile', authMiddleware , getProfile);


module.exports = router;
