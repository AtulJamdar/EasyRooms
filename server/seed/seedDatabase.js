require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');
const RoomPost = require('../models/RoomPost');
const RoomRequirement = require('../models/RoomRequirement');

const seedUsers = require('./seedUsers');
const seedRooms = require('./seedRooms');

async function seed() {
  await connectDB();

  console.log('Clearing existing data...');
  await Promise.all([
    User.deleteMany(),
    RoomPost.deleteMany(),
    RoomRequirement.deleteMany(),
  ]);

  console.log('Seeding users...');
  const createdUsers = await User.create(seedUsers);

  // Ensure we have an admin user (first user in seedUsers)
  const adminUser = createdUsers.find((u) => u.role === 'admin');
  const regularUsers = createdUsers.filter((u) => u.role === 'user');

  console.log('Seeding rooms...');
  const roomsToCreate = seedRooms.slice(0, 15).map((room, idx) => ({
    ...room,
    postedBy: regularUsers[idx % regularUsers.length]._id,
  }));

  await RoomPost.create(roomsToCreate);

  console.log('Seeding room requirements...');
  const requirements = regularUsers.slice(0, 8).map((user, idx) => ({
    user: user._id,
    preferredArea: ['Kothrud', 'Wakad', 'Aundh', 'Baner'][idx % 4],
    maxRent: 4500 + idx * 250,
    genderPreference: idx % 2 === 0 ? 'any' : 'female',
    moveInDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  }));

  await RoomRequirement.create(requirements);

  console.log('✅ Seed complete!');
  console.log(`Admin login: ${adminUser.email} / Admin123!`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
