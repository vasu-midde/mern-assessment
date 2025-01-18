const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');  // Import the userRoutes
const reviewRoutes = require('./routes/reviewRoutes');  // Import the reviewRoutes
const profileRoutes = require('./routes/profileRoutes');  // Import the profileRoutes

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());  // For parsing application/json

// Routes
app.use('/api/auth', authRoutes);  // User routes (signup, login)
app.use('/api/reviews', reviewRoutes);  // Reviews route
app.use('/api/profile', profileRoutes);  // Profile route

// MongoDB connection
mongoose.connect(process.env.MONGO_URI,)
    .then((conn) => {
      console.log(`Connected to MongoDB: ${conn.connection.host}`);
      console.log(`Connected to Database: ${conn.connection.name}`);
      console.log(`Using Connection String: ${process.env.MONGO_URI}`);
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
    });
  

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
