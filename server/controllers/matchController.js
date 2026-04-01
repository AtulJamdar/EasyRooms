const User = require('../models/User');

/**
 * Compatibility scoring for roommate matching.
 * Points are awarded based on shared College, Course, Year, Budget, and Habits.
 */
const calculateCompatibilityScore = (baseUser, candidate) => {
    let score = 0;

    // 1) College match (+30)
    if (baseUser.college && candidate.college && baseUser.college === candidate.college) {
        score += 30;
    }

    // 2) Course match (+25)
    if (baseUser.course && candidate.course && baseUser.course === candidate.course) {
        score += 25;
    }

    // 3) Year match (+15)
    if (baseUser.year && candidate.year && baseUser.year === candidate.year) {
        score += 15;
    }

    // 4) Budget closeness (Up to +20)
    if (typeof baseUser.budget === 'number' && typeof candidate.budget === 'number') {
        const diff = Math.abs(baseUser.budget - candidate.budget);
        if (diff <= 500) score += 20;
        else if (diff <= 1000) score += 10;
        else if (diff <= 2000) score += 5;
    }

    // 5) Lifestyle habits overlap (Up to +30)
    if (Array.isArray(baseUser.lifestyleHabits) && Array.isArray(candidate.lifestyleHabits)) {
        const baseSet = new Set(baseUser.lifestyleHabits.map((h) => h.toLowerCase()));
        const overlap = candidate.lifestyleHabits.filter((h) => baseSet.has(h.toLowerCase()));
        score += Math.min(overlap.length, 3) * 10;
    }

    return score;
};

/**
 * Helper to determine the opposite intent for matching
 */
const getTargetIntent = (intent) => {
    if (intent === "room") return "owner"; // Seekers want Owners
    if (intent === "owner") return "room"; // Owners want Seekers
    return "roommate"; // Roommates want Roommates
};

/**
 * @route   GET /api/matches/:userId
 * @desc    Get top roommate matches for a user (Rule-based)
 */
const getMatches = async(req, res, next) => {
    try {
        const { userId } = req.params;

        // Authorization: Only user or admin can view
        if (req.user._id.toString() !== userId && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized to view matches' });
        }

        const baseUser = await User.findById(userId);
        if (!baseUser) return res.status(404).json({ message: 'User not found' });

        // Determine who we should be looking for based on intent
        const targetIntent = getTargetIntent(baseUser.intent);

        // Filtered Query: Match by intent, exclude admins, exclude blocked, and require college
        const candidates = await User.find({
            _id: { $ne: baseUser._id },
            intent: targetIntent,
            role: "user",
            isBlocked: false,
            college: { $ne: null }
        }).select('-password -__v');

        const ranked = candidates
            .filter(c => c.budget && c.college) // Extra safety check for valid profiles
            .map((candidate) => ({
                user: candidate,
                score: calculateCompatibilityScore(baseUser, candidate),
            }))
            .filter((item) => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 20);

        res.json({ matches: ranked });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/matches/:userId/ai
 * @desc    Get top matches and apply AI fine-tuning via Groq
 */
const getMatchesAI = async(req, res, next) => {
    try {
        const { userId } = req.params;

        if (req.user._id.toString() !== userId && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Determine target matching intent
        const targetIntent = getTargetIntent(user.intent);

        // Filtered Query
        const candidates = await User.find({
            _id: { $ne: user._id },
            intent: targetIntent,
            role: "user",
            isBlocked: false,
            college: { $ne: null }
        }).select('-password -__v');

        const ranked = candidates
            .filter(c => c.budget && c.college)
            .map((candidate) => ({
                user: candidate,
                score: calculateCompatibilityScore(user, candidate),
            }))
            .filter((item) => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 20);

        console.log(`📊 CLEAN MATCHES FOUND FOR AI (${targetIntent}):`, ranked.length);

        // AI Re-ranking Block
        if (process.env.GROK_API_KEY && ranked.length > 0) {
            console.log("🔥 AI MATCHING STARTED");
            const top5ForAI = ranked.slice(0, 5);

            try {
                // Ensure grokService is correctly configured for api.groq.com
                const grokService = require('../services/grokService');
                const aiRanked = await grokService.rankMatchesWithAI(user, top5ForAI);

                if (aiRanked && aiRanked.length > 0) {
                    console.log("✅ AI RESPONSE RECEIVED SUCCESSFULLY");
                    return res.json({ matches: aiRanked });
                }
            } catch (err) {
                console.error("❌ AI MATCHING FAILED:", err.message);
                console.log("⚠️ FALLBACK TO RULE-BASED MATCHES");
            }
        } else if (!process.env.GROK_API_KEY) {
            console.log("🚫 AI BYPASSED - Check GROK_API_KEY in .env");
        }

        res.json({ matches: ranked });
    } catch (error) {
        console.error("💀 CRITICAL ROUTE ERROR:", error);
        next(error);
    }
};

module.exports = {
    getMatches,
    getMatchesAI,
};