const User = require('../models/User');

/**
 * @route   GET /api/users/:id
 * @desc    Get public profile information for a user (used by other users to view profiles)
 * @access  Private
 */
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password -__v');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserById,
};
