const { sendEmail } = require('./emailService');

/**
 * Notify a user via email about a new matching room.
 */
async function notifyMatch(user, room) {
  if (!user?.email) return;

  const frontEndUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const roomUrl = `${frontEndUrl}/search-rooms`; // could link to room detail when implemented

  const message = `Hi ${user.name || 'there'},\n\nA new room listing was posted that matches your saved requirements:\n
Title: ${room.title}\nLocation: ${room.location}\nRent: ₹${room.rent}\n\nView the listing: ${roomUrl}\n\nIf you'd like to adjust your preferences, visit your profile or saved requirements in the app.`;

  try {
    await sendEmail({
      to_name: user.name || 'Student',
      to_email: user.email,
      subject: 'New room match on EasyRoom',
      message,
    });
  } catch (err) {
    console.error('Failed to send match notification email:', err.message || err);
  }
}

module.exports = {
  notifyMatch,
};
