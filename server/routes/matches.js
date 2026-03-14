const express = require('express');
const { protect } = require('../middleware/auth');
const { getMatches } = require('../controllers/matchController');

const router = express.Router();

/**
 * Get roommate matches for a user.
 */
router.get('/:userId', protect, getMatches);

module.exports = router;
