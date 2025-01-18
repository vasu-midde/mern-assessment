const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;  // Include role in request body if necessary

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, role: role || 'user' });  // Default role to 'user' if not provided

    // Include name and role in token
    const token = jwt.sign(
      { id: user._id, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ user, token });
  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
};

const authUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Include name and role in token
    const token = jwt.sign(
      { id: user._id, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({ user, token });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error logging in user', error: error.message });
  }
};

module.exports = { registerUser, authUser };
