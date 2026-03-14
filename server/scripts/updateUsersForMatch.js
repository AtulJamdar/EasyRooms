const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const users = await User.find().limit(2);
  console.log('Found users:', users.map((u) => ({ id: u._id.toString(), email: u.email })));

  if (users.length === 0) {
    console.log('No users found. Please register at least two users first.');
    process.exit(0);
  }

  const u1 = users[0];
  u1.college = 'Test College';
  u1.course = 'Computer Science';
  u1.year = '2';
  u1.budget = 250;
  u1.lifestyleHabits = ['quiet', 'clean'];
  await u1.save();

  if (users[1]) {
    const u2 = users[1];
    u2.college = 'Test College';
    u2.course = 'Computer Science';
    u2.year = '2';
    u2.budget = 270;
    u2.lifestyleHabits = ['quiet', 'early-riser'];
    await u2.save();
  }

  console.log('Updated user profiles for matching');
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
