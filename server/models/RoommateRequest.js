const mongoose = require('mongoose');

/**
 * RoommateRequest model - tracks roommate requests sent between users.
 *
 * Status flow:
 * - pending: initial request
 * - accepted: receiver agreed
 * - rejected: receiver declined
 */
const roommateRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
    message: {
      type: String,
      trim: true,
      description: 'Optional message included with the roommate request',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('RoommateRequest', roommateRequestSchema);
