const express = require("express");
const app = express();
const connectDB = require("./config/db.js"); // Import the function

const PORT = 3000;

// Connect to Database
connectDB();

app.get("/", (req, res) => {
    res.send("Hello, Node.js App!");
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});