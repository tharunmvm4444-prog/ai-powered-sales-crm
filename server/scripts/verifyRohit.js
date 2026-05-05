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

const verifyRohit = async () => {
    await connectDB();
    try {
        const email = "rohit63@mail.com";
        const leads = await Lead.find({ email: email });

        console.log(`Found ${leads.length} record(s) for ${email}:`);
        leads.forEach((lead, index) => {
            console.log(`[${index + 1}] ID: ${lead._id}, Name: ${lead.customerName}, Assigned: ${lead.assignedUser}, Duration: "${lead.callDuration}"`);
        });

    } catch (error) {
        console.error("Verification Error:", error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

verifyRohit();
