const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Global Middleware
app.use(cors());
app.use(express.json());

// Main Semantic Endpoint Routers
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/properties', require('./routes/propertyRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server executing safely on port ${PORT}`));