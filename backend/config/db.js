const mongoose = require("mongoose");

const DB_URI = "mongodb://localhost:27017/EasyRoom";

const connectDB = async() => {
    try {
        await mongoose.connect(DB_URI);
        console.log("MongoDB connected successfully");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1); // Stop the app if DB fails
    }
};

module.exports = connectDB;