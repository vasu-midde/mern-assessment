// In your authRoutes.js or wherever the user routes are defined

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); // Assuming you have this middleware to protect routes
const User = require('../models/userModel'); // Assuming you have a User model

// Route to get the profile of the logged-in user
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('name email'); // Only return name and email
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user); // Send user data to the client
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
