const rooms = [];

const locations = [
"Kothrud",
"Shivaji Nagar",
"Wakad",
"Hinjewadi",
"Karve Nagar",
"Aundh",
"Pimple Saudagar",
"Baner",
"Warje",
"Deccan"
];

for (let i = 1; i <= 50; i++) {
  rooms.push({
    title: `Affordable Student Room ${i}`,
    rent: 3500 + (i * 100),
    location: locations[i % locations.length],
    numberOfRoommatesNeeded: (i % 3) + 1,
    description: "Room available for students near Fortune Cloud Technologies institute in Pune. Suitable for sharing.",
    isActive: true,
  });
}

module.exports = rooms;