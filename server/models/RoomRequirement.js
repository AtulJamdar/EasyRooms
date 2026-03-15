const mongoose = require('mongoose');

/**
 * RoomRequirement model - allows a user to save their preferred room criteria.
 *
 * This is used to trigger notifications when matching room listings are created.
 */
const roomRequirementSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    preferredArea: {
      type: String,
      trim: true,
    },
    maxRent: {
      type: Number,
      min: [0, 'Max rent must be a number'],
    },
    genderPreference: {
      type: String,
      enum: ['male', 'female', 'any'],
      default: 'any',
    },
    moveInDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('RoomRequirement', roomRequirementSchema);
