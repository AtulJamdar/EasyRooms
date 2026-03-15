const express = require('express');
const { protect } = require('../middleware/auth');
const { getMatches, getMatchesAI } = require('../controllers/matchController');

const router = express.Router();

/**
 * Get roommate matches for a user.
 */
router.get('/:userId', protect, getMatches);

/**
 * Get AI-ranked roommate matches (optional, requires GROK_API_KEY).
 */
router.get('/:userId/ai', protect, getMatchesAI);

module.exports = router;
