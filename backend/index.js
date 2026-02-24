const express = require("express");
const app = express();
const mongoose = require("mongoose");

const PORT = 3000;
const DB_URI = "mongodb://localhost:27017/EasyRoom";

app.get("/", (req, res) => {
    res.send("Hello, Node.js App!");
});



// Replace <dbname> with your database name
mongoose.connect(DB_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    })

.catch(err => {
    console.error("MongoDB connection error:", err)
    process.exit(1);
});