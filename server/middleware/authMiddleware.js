const jwt = require("jsonwebtoken");
const Doctor = require("../models/doctor");

const authMiddleware = async (req, res, next) => {
  // First, try to get token from the Authorization header
  let token = req.header("Authorization") ? req.header("Authorization").replace("Bearer ", "") : null;
  
  // If not found, try to get it from the cookies
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const doctor = await Doctor.findById(decoded.id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    req.doctor = doctor;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
