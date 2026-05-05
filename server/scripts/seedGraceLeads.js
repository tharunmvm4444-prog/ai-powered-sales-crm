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

const seedData = [
    {
        customerName: "Arun Kumar",
        phoneNumber: "9876543210",
        email: "sriharisrini.30@gmail.com",
        callDescription: "CRM Software - Interested in demo, follow up next week",
        callDuration: "5m 32s",
        assignedUser: "Grace",
        status: "assigned",
        aiFeedback: "Customer showed strong interest. Tone was enthusiastic. Key concern was pricing.",
        sentiment: "positive"
    },
    {
        customerName: "Priya Sharma",
        phoneNumber: "9123456780",
        email: "gnanasankari.b2025@vitstudent.ac.in",
        callDescription: "Sales Dashboard - Asked for pricing details",
        callDuration: "3m 10s",
        assignedUser: "Grace",
        status: "assigned",
        aiFeedback: "Customer seemed hesitant about the learning curve. Neutral tone throughout.",
        sentiment: "negative"
    },
    {
        customerName: "Rohit Singh",
        phoneNumber: "9988776655",
        email: "pradeep123kaiscf@gmail.com",
        callDescription: "Lead Management - Very interested, sent brochure",
        callDuration: "6m 45s",
        assignedUser: "Grace",
        status: "assigned",
        aiFeedback: "Highly positive interaction. Ready to move forward pending brochure review.",
        sentiment: "positive"
    }
];

const importData = async () => {
    try {
        await connectDB();

        for (const lead of seedData) {
            // Upsert: Update if exists, Insert if not
            await Lead.findOneAndUpdate(
                { email: lead.email, assignedUser: "Grace" },
                lead,
                { upsert: true, new: true }
            );
            console.log(`Upserted lead: ${lead.customerName}`);
        }

        console.log('Data Imported/Updated Successfully!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

importData();
