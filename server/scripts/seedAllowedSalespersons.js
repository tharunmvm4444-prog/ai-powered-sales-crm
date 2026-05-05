const mongoose = require("mongoose");
const dotenv = require("dotenv");
const AllowedSalesperson = require("../models/AllowedSalesperson");
const path = require("path");

// Load env vars
dotenv.config({ path: path.join(__dirname, "../.env") });

const salespersons = [
    "Rahul",
    "Sneha",
    "Vikram",
    "Kavya",
    "Ivan",
    "Grace",
    "Eve",
    "Heidi",
    "Frank",
    "Tharun"
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");

        // Clear existing to avoid duplicates if re-run
        await AllowedSalesperson.deleteMany({});
        console.log("Cleared existing allowed salespersons");

        const docs = salespersons.map((name) => ({ name }));
        await AllowedSalesperson.insertMany(docs);
        console.log(`Seeded ${docs.length} allowed salespersons.`);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
