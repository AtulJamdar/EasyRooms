const mongoose = require('mongoose');

/**
 * Report model - used to track suspicious or inappropriate listings.
 *
 * Admins can review reports and take action such as removing listings or banning users.
 */
const reportSchema = new mongoose.Schema(
  {
    reportedPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RoomPost',
      required: true,
    },
    reason: {
      type: String,
      required: [true, 'Reason for report is required'],
      trim: true,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isResolved: {
      type: Boolean,
      default: false,
      description: 'Whether an admin has resolved the report',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Report', reportSchema);
