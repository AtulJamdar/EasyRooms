const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const {
  createRequirement,
  getRequirementsForUser,
} = require('../controllers/requirementController');

const router = express.Router();

/**
 * Create a saved room requirement (for notifications)
 */
router.post(
  '/',
  protect,
  [
    body('preferredArea').optional().trim(),
    body('maxRent')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Max rent must be a positive number'),
    body('genderPreference')
      .optional()
      .isIn(['male', 'female', 'any'])
      .withMessage('Gender preference must be male, female or any'),
    body('moveInDate').optional().isISO8601().toDate().withMessage('Move in date must be a valid date'),
  ],
  createRequirement
);

/**
 * Get requirements saved by the current user
 */
router.get('/', protect, getRequirementsForUser);

module.exports = router;
