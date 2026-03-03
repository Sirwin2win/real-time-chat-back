const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    // Generate Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, userId: user._id, username: user.username });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// New: Get all users (to find people to chat with)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Don't send passwords!
    res.json(users);
  } catch (err) {
    res.status(500).json(err);
  }
};