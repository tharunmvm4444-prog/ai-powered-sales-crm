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

const updateAll = async () => {
    await connectDB();
    try {
        const email = "rohit63@mail.com";
        const result = await Lead.updateMany(
            { email: email },
            { $set: { callDuration: "14s" } }
        );

        console.log(`Updated ${result.modifiedCount} (matched: ${result.matchedCount}) records for ${email} to duration '14s'.`);

    } catch (error) {
        console.error("Update Error:", error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

updateAll();
