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

const updateRohit = async () => {
    await connectDB();
    try {
        const email = "rohit63@mail.com";
        const duration = "14s"; // Hardcoded duration

        const updatedLead = await Lead.findOneAndUpdate(
            { email: email },
            { $set: { callDuration: duration } },
            { new: true }
        );

        if (updatedLead) {
            console.log(`SUCCESS: Updated ${updatedLead.customerName} (${email}) with duration: ${updatedLead.callDuration}`);
        } else {
            console.log(`ERROR: Lead with email ${email} not found.`);
        }
    } catch (error) {
        console.error("Update Error:", error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

updateRohit();
