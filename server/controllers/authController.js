const Doctor=require('../models/doctor');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
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


exports.getDoctor = async (req, res) => {
  try {
    const doctorId = req.doctor.id;

    const doctor = await Doctor.findById(doctorId).select('-password -resetPasswordOTP -resetPasswordExpires');
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json({ doctor });
  } catch (error) {
    console.error('Error fetching doctor details:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


exports.updateDoctor = async (req, res) => {
  try {
    const doctorId = req.doctor.id;
    const updates = req.body;

    const doctor = await Doctor.findByIdAndUpdate(doctorId, updates, { new: true }).select('-password -resetPasswordOTP -resetPasswordExpires');
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.status(200).json({ message: 'Doctor updated successfully', doctor });
  } catch (error) {
    console.error('Error updating doctor details:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



// Generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT, 10), 
  secure: process.env.EMAIL_PORT === "465", 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.APP_PASS || "", 
  },
  tls: {
    rejectUnauthorized: false, 
  },
});

// Request OTP for password reset
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const doctor = await Doctor.findOne({ email });

    if (!doctor) {
      return res.status(404).send({ message: "Doctor not found" });
    }

    const otp = generateOTP();
    doctor.resetPasswordOTP = otp;
    await doctor.save();

    // Create a stylish HTML email template
    const htmlContent = `
      <html>
      <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
          <!-- Header -->
          <tr>
            <td style="background: #030811; padding: 20px; text-align: center; color: #ffffff; font-size: 24px;">
              Nuvo Ai
            </td>
          </tr>
          <!-- Main Content -->
          <tr>
            <td style="padding: 20px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px; margin: auto; background: #ffffff; border: 1px solid #dddddd; border-radius: 8px; overflow: hidden;">
                <!-- Banner Image -->
                <tr>
                  <td style="text-align: center;">
                    <img src="https://res.cloudinary.com/dh0kdktqr/image/upload/v1742287641/email_x7yxk6.jpg" alt="Banner Image" style="width:100%; max-width:600px; display: block;">
                  </td>
                </tr>
                <!-- Email Body -->
                <tr>
                  <td style="padding: 20px; color: #333333;">
                    <h2 style="color: #030811;">Password Reset Request</h2>
                    <p>Hello,</p>
                    <p>Your OTP for password reset is: <strong style="color:#030811;">${otp}</strong></p>
                    <p>This OTP will expire in 10 minutes. Please use it to reset your password.</p>
                    <p>If you did not request a password reset, please ignore this email.</p>
                    <p>Best regards,<br>Your Team</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background: #f0f0f0; padding: 10px; text-align: center; font-size: 12px; color: #888888;">
              © 2025 Nuvo ai. All rights reserved.
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // Mail options with both plain text and HTML content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP for Resetting Password",
      text: `Hello,\n\nYour OTP for password reset is: ${otp}.\nIt will expire in 10 minutes.\n\nBest,\nYour Team`,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).send({ message: "OTP sent to email" });
  } catch (error) {
    console.error("Error requesting password reset:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};



// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const doctor = await Doctor.findOne({ email });

    if (!doctor) {
      return res.status(404).send({ message: "Doctor not found" });
    }
    console.log(doctor.resetPasswordExpires);
    if (
      doctor.resetPasswordOTP !== otp ||
      doctor.resetPasswordExpires < Date.now()
    ) {
      return res.status(400).send({ message: "Invalid or expired OTP" });
    }

    // Generate a temporary token for password reset
    const tempToken = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    res.status(200).send({ message: "OTP verified successfully", tempToken });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { tempToken, newPassword } = req.body;

    // Verify the temporary token
    const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
    const doctor = await Doctor.findById(decoded.id);

    if (!doctor) {
      return res.status(404).send({ message: "Doctor not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    doctor.password = hashedPassword;
    doctor.resetPasswordOTP = undefined;
    doctor.resetPasswordExpires = undefined;
    await doctor.save();

    res.status(200).send({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).send({ message: "Internal server error" });
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