const { validationResult } = require('express-validator');
const RoomRequirement = require('../models/RoomRequirement');

/**
 * @route   POST /api/requirements
 * @desc    Save room requirements for the current user
 * @access  Private
 */
const createRequirement = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { preferredArea, maxRent, genderPreference, moveInDate } = req.body;

    const requirement = await RoomRequirement.create({
      user: req.user._id,
      preferredArea,
      maxRent,
      genderPreference,
      moveInDate,
    });

    return res.status(201).json(requirement);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/requirements
 * @desc    Get requirements saved by the current user
 * @access  Private
 */
const getRequirementsForUser = async (req, res, next) => {
  try {
    const requirements = await RoomRequirement.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(requirements);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRequirement,
  getRequirementsForUser,
};
