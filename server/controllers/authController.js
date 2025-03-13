const Doctor=require('../models/doctor');
const jwt = require('jsonwebtoken');
const { hashPassword, comparePassword } = require('../helpers/authHelper');

// Register API
exports.registerDoctor = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Check if a doctor with the provided email already exists
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(409).json({ message: 'Doctor with this email already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await hashPassword(password);




    const newDoctor = new Doctor({ name, email, password: hashedPassword });
    await newDoctor.save();

    res.status(201).json({ message: 'Doctor registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login API
exports.loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // First, find the doctor including the password for comparison
    const doctorWithPassword = await Doctor.findOne({ email });
    if (!doctorWithPassword) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await comparePassword(password, doctorWithPassword.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create a JWT token valid for 7 days
    const token = jwt.sign({ id: doctorWithPassword._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Store the token in an HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production', // enable in production with HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    // Remove sensitive information before sending back the doctor data
    const { password: pwd, ...doctorData } = doctorWithPassword.toObject();

    res.status(200).json({ message: 'Login successful', user: doctorData });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Logout API
exports.logoutDoctor = async (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie('token', {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production'
    });
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error during logout' });
  }
};


//Hydrating the user
exports.getProfile = async (req, res) => {
    try {
      // authMiddleware should attach the authenticated doctor to req.doctor
      if (!req.doctor) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const { password, ...doctorData } = req.doctor.toObject();
      res.status(200).json({ user: doctorData });
    } catch (error) {
      console.error('Profile error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };