const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Lead = require('../models/Lead');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const updateDurations = async () => {
    try {
        await connectDB();

        // Find all assigned leads
        // Assuming 'assigned' status or assignedUser exists
        const leads = await Lead.find({
            $or: [
                { status: 'assigned' },
                { assignedUser: { $ne: null } }
            ]
        });

        console.log(`Found ${leads.length} assigned leads to update.`);

        for (const lead of leads) {
            // Random duration between 5 and 12 inclusive
            const seconds = Math.floor(Math.random() * (12 - 5 + 1)) + 5;
            const durationStr = `${seconds}s`; // e.g., "7s"

            lead.callDuration = durationStr;
            await lead.save();
            console.log(`Updated ${lead.customerName}: ${durationStr}`);
        }

        console.log('All assigned leads updated successfully!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

updateDurations();
