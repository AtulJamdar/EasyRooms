const RoomRequirement = require('../models/RoomRequirement');
const User = require('../models/User');

/**
 * Find requirements that match a newly created room.
 *
 * Matching rules (simple MVP):
 * - preferredArea (if set) must match the room location (case-insensitive substring)
 * - maxRent (if set) must be >= room rent
 * - genderPreference (if set and not "any") must match the room poster's gender
 *
 * Returns an array of requirements that match.
 */
const findMatchingRequirements = async (room) => {
  const poster = await User.findById(room.postedBy);

  // Build query using requirements that match the room's details.
  // We support partial requirements: if a student left a field empty, it should not block matching.
  const andConditions = [];

  // Match preferred area to room location (simple substring match).
  if (room.location) {
    andConditions.push({
      preferredArea: { $regex: room.location, $options: 'i' },
    });
  }

  // Max rent: either the student didn't set it, or it must be >= room rent.
  andConditions.push({
    $or: [{ maxRent: { $exists: false } }, { maxRent: { $gte: room.rent } }],
  });

  // Gender preference: match "any" or match the poster's gender (if known).
  if (poster && poster.gender) {
    andConditions.push({
      $or: [
        { genderPreference: 'any' },
        { genderPreference: poster.gender },
      ],
    });
  }

  const query = andConditions.length ? { $and: andConditions } : {};

  const matches = await RoomRequirement.find(query).populate('user', 'name email college');

  return matches;
};

module.exports = {
  findMatchingRequirements,
};
