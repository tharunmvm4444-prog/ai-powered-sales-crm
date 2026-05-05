const mongoose = require("mongoose");
const Lead = require("../models/Lead");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");
    } catch (err) {
        console.error("DB Connection Error:", err.message);
        process.exit(1);
    }
};

const run = async () => {
    await connectDB();
    try {
        // Find FIRST
        const rohit = await Lead.findOne({ email: "rohit63@mail.com" });
        if (!rohit) {
            console.log("Rohit not found!");
            return;
        }
        console.log("BEFORE:", rohit.callDuration);

        // Update
        rohit.callDuration = "14s";
        await rohit.save();

        console.log("AFTER:", rohit.callDuration);
        console.log("Update Saved!");

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected");
        process.exit(0);
    }
};

run();
