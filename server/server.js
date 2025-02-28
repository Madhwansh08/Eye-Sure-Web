const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config(); // Load environment variables

// Connect to MongoDB
const connectDB = require('./config/db');
connectDB();

const app = express();
const port = process.env.PORT || 9000;



// Middleware
app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true
    }
));
app.use(express.json());
app.use(cookieParser());

// Simple home route
app.get('/', (req, res) => {
  res.send('Hello Eye Sure!');
});

// Authentication routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);


const imageRoutes= require('./routes/imageRoutes');
app.use('/api/image', imageRoutes);


const patientRoutes= require('./routes/patientRoutes');
app.use('/api/patient', patientRoutes);


const reportRoutes=require('./routes/reportRoutes')
app.use('/api/report', reportRoutes); 

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
