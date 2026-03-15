const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const { sendEmail } = require('../services/emailService');

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

const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
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

    const user = await User.create({ name, email, password, role: 'user' });

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
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : email;
    const user = await User.findOne({ email: normalizedEmail });

    const isMatch = user ? await user.matchPassword(password) : false;
    console.log(`[auth] login attempt email=${normalizedEmail} found=${!!user} passwordMatch=${isMatch}`);

    if (!user || !isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = createToken(user._id);
    return res.json({ user, token });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ user });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/auth/profile
 * @desc    Update current user profile
 * @access  Private
 */
const sendPasswordResetToken = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // For security, don't reveal that the email does not exist
      return res.json({ message: 'If that email exists, a reset token has been sent' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = hashToken(token);
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    const frontEndUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetUrl = `${frontEndUrl}/reset-password?token=${token}`;

    // Try sending a reset email via EmailJS (server-side). This is optional and should
    // not block the response if EmailJS isn't configured or fails.
    let emailSent = false;
    let emailError = null;

    try {
      await sendEmail({
        to_name: user.name || 'Student',
        to_email: user.email,
        subject: 'Reset your EasyRoom password',
        message: `Click the link to reset your password: ${resetUrl}`,
      });
      emailSent = true;
    } catch (err) {
      emailError = err?.message || String(err);
      console.warn('Password reset email send failed:', emailError);
    }

    // Return token + reset link for dev & fallback (front-end can send / display it if needed)
    return res.json({
      message: 'Password reset token generated',
      token,
      email: user.email,
      resetUrl,
      emailSent,
      emailError,
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    const hashedToken = hashToken(token);

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.json({ message: 'Password reset successful' });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updates = {
      name: req.body.name,
      phone: req.body.phone,
      whatsapp: req.body.whatsapp,
      college: req.body.college,
      course: req.body.course,
      year: req.body.year,
      gender: req.body.gender,
      budget: req.body.budget,
      lifestyleHabits: req.body.lifestyleHabits,
    };

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  sendPasswordResetToken,
  resetPassword,
};
