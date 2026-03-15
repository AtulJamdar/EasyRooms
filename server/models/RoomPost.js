const mongoose = require('mongoose');

/**
 * RoomPost model - represents a room listing posted by a user.
 *
 * This model allows students to share details about available rooms and
 * provides the core data for search and matching.
 */
const roomPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    rent: {
      type: Number,
      required: [true, 'Rent is required'],
      min: [0, 'Rent must be a positive number'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    numberOfRoommatesNeeded: {
      type: Number,
      required: [true, 'Number of roommates needed is required'],
      min: [0, 'Must be 0 or more'],
    },
    images: {
      type: [String],
      default: [],
      description: 'Array of image URLs for the room listing',
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      description: 'Whether the listing is currently active/visible to users',
    },
  },
  {
    timestamps: true,
  }
);

// Automatically delete room posts after 30 days
roomPostSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });

module.exports = mongoose.model('RoomPost', roomPostSchema);
