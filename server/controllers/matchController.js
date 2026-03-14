const User = require('../models/User');

/**
 * Compatibility scoring for roommate matching.
 *
 * Each factor contributes to an overall score.
 */
const calculateCompatibilityScore = (baseUser, candidate) => {
  let score = 0;

  // 1) College match
  if (baseUser.college && candidate.college && baseUser.college === candidate.college) {
    score += 30;
  }

  // 2) Course match
  if (baseUser.course && candidate.course && baseUser.course === candidate.course) {
    score += 25;
  }

  // 3) Year match
  if (baseUser.year && candidate.year && baseUser.year === candidate.year) {
    score += 15;
  }

  // 4) Budget closeness
  if (typeof baseUser.budget === 'number' && typeof candidate.budget === 'number') {
    const diff = Math.abs(baseUser.budget - candidate.budget);
    if (diff <= 500) score += 20;
    else if (diff <= 1000) score += 10;
    else if (diff <= 2000) score += 5;
  }

  // 5) Lifestyle habits overlap
  if (Array.isArray(baseUser.lifestyleHabits) && Array.isArray(candidate.lifestyleHabits)) {
    const baseSet = new Set(baseUser.lifestyleHabits.map((h) => h.toLowerCase()));
    const overlap = candidate.lifestyleHabits.filter((h) => baseSet.has(h.toLowerCase()));
    score += Math.min(overlap.length, 3) * 10; // cap to 30 points
  }

  return score;
};

/**
 * @route   GET /api/matches/:userId
 * @desc    Get top roommate matches for a user
 * @access  Private (owner or admin)
 */
const getMatches = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Ensure user can only request their own matches (unless admin)
    if (req.user._id.toString() !== userId && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view matches for this user' });
    }

    const baseUser = await User.findById(userId);
    if (!baseUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch potential roommates (exclude self)
    const candidates = await User.find({ _id: { $ne: baseUser._id } }).select(
      '-password -__v'
    );

    // Compute compatibility score for each candidate
    const ranked = candidates
      .map((candidate) => {
        const score = calculateCompatibilityScore(baseUser, candidate);
        return {
          user: candidate,
          score,
        };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20); // return top 20 matches

    res.json({ matches: ranked });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMatches,
};
