const express = require('express');
const { body } = require('express-validator');
const { register, login, getProfile, updateProfile, sendPasswordResetToken, resetPassword } = require('../controllers/authController');

const router = express.Router();
const { protect } = require('../middleware/auth');

/**
 * @route POST /api/auth/register
 * @desc  Create a new user account
 */
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  register
);

/**
 * @route POST /api/auth/login
 * @desc  Authenticate and return a JWT
 */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  login
);

/**
 * Initiate password reset by generating a token (sent via email by the frontend)
 */
router.post(
  '/forgot-password',
  [body('email').isEmail().withMessage('Valid email is required')],
  sendPasswordResetToken
);

/**
 * Reset password using a one-time token
 */
router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('Token is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  resetPassword
);

/**
 * Get current user's profile
 */
router.get('/profile', protect, getProfile);

/**
 * Update current user's profile
 */
router.put(
  '/profile',
  protect,
  [
    body('name').optional().trim(),
    body('phone').optional().trim(),
    body('college').optional().trim(),
    body('course').optional().trim(),
    body('year').optional().trim(),
    body('gender')
      .optional()
      .isIn(['male', 'female', 'other'])
      .withMessage('Gender must be male, female, or other'),
    body('budget').optional().isFloat({ min: 0 }).withMessage('Budget must be a positive number'),
    body('whatsapp').optional().trim() // Removed trailing comma here
  ], // Added missing closing bracket for the array
  updateProfile // Added the controller function that handles the logic
); // Added missing closing parenthesis for router.put

module.exports = router;