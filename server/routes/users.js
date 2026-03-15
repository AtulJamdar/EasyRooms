const express = require('express');
const { protect } = require('../middleware/auth');
const { getUserById } = require('../controllers/userController');

const router = express.Router();

// Get public profile info for a user by ID
router.get('/:id', protect, getUserById);

module.exports = router;
