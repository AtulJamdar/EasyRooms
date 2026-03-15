const users = [];

// Admin user (for dashboard access)
users.push({
  name: 'Admin User',
  email: 'admin@easyroom.test',
  password: 'Admin123!',
  role: 'admin',
  college: 'EasyRoom HQ',
  course: 'Administration',
  year: 'NA',
  phone: '0000000000',
  budget: 0,
});

// 20 ROOM OWNERS
for (let i = 1; i <= 20; i++) {
  users.push({
    name: `RoomOwner${i}`,
    email: `owner${i}@gmail.com`,
    password: "123456",
    role: "user",
    college: "Fortune Cloud Technologies",
    course: ["Full Stack", "Data Science", "AI", "Cloud"][i % 4],
    year: 1 + (i % 3),
    phone: `98765432${i}`,
    budget: 5000 + (i * 200),
    lookingForRoom: false
  });
}

// 20 ROOM SEEKERS
for (let i = 1; i <= 20; i++) {
  users.push({
    name: `RoomSeeker${i}`,
    email: `seeker${i}@gmail.com`,
    password: "123456",
    role: "user",
    college: "Fortune Cloud Technologies",
    course: ["Full Stack", "Data Science", "AI", "Cloud"][i % 4],
    year: 1 + (i % 3),
    phone: `87654321${i}`,
    budget: 4000 + (i * 150),
    lookingForRoom: true
  });
}

module.exports = users;