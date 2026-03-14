const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

/**
 * Create a signed JWT for a given user ID.
 */
const createToken = (userId) => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = '7d';

  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.sign({ userId }, secret, { expiresIn });
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user and return an auth token.
 */
const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    // Ensure email is not already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email is already in use' });
    }

    const user = await User.create({ name, email, password });

    const token = createToken(user._id);

    return res.status(201).json({
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and return JWT.
 */
const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = createToken(user._id);
    return res.json({ user, token });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
};
