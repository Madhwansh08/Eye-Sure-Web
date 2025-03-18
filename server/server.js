const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan=require('morgan');
const helmet=require('helmet');
const limiter = require('express-rate-limit');
const compression=require('compression');


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
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());  

// Rate limiter
const limiterMiddleware = limiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 100 requests per windowMs
});

app.use(limiterMiddleware);
app.use(compression());

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

const contactRoutes = require('./routes/contactRoutes')
app.use('/api/contact', contactRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
