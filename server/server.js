// ===========================
// File: server.js
// ===========================
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');

// Load environment variables
dotenv.config();

// MongoDB connection
const connectDB = require('./config/db');
connectDB();

// Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/v1/auth', require('./routes/userRoutes'));
app.use('/api/v1/auth', require('./routes/formRoutes'));
app.use('/api/v1/auth', require('./routes/responseRoutes'));
app.use("/api/v1/auth", require("./routes/surveyorRoutes"));
//app.use('/api/v1/auth', require("./routes/analysis"));

// Start server
const PORT = process.env.PORT || 8082;
app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`.bgGreen.white);
     console.log("✅ MongoDB connected");   
});
