const express = require("express");
const router = express.Router();
const multer = require("multer");
const xlsx = require("xlsx");
const Lead = require("../models/Lead");

// Multer Setup for File Upload (Memory Storage)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// GET /api/leads - Fetch all leads
router.get("/", async (req, res) => {
    try {
        const { assignedTo } = req.query;
        let query = {};
        if (assignedTo) {
            query.assignedUser = assignedTo;
        }

        const leads = await Lead.find(query).sort({ createdAt: -1 });
        res.json(leads);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server Error" });
    }
});

// GET /api/leads/salespersons - Fetch all salespeople
router.get("/salespersons", async (req, res) => {
    try {
        // Assumes User model is imported
        const salespersons = await require("../models/User").find({ role: "salesperson" }).select("name _id");
        res.json(salespersons);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server Error" });
    }
});

// POST /api/leads/upload - Upload Excel
router.post("/upload", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: "No file uploaded" });
        }

        // Parse Excel using xlsx
        const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convert to JSON
        const rawData = xlsx.utils.sheet_to_json(sheet);

        if (rawData.length === 0) {
            return res.status(400).json({ msg: "Excel file is empty" });
        }

        const documentsToInsert = rawData.map((row) => {
            // Helper to lookup case-insensitive keys
            const getValue = (keys) => {
                for (let key of keys) {
                    if (row[key] !== undefined) return row[key];
                    const rowKey = Object.keys(row).find(
                        (k) => k.trim().toLowerCase() === key.toLowerCase()
                    );
                    if (rowKey) return row[rowKey];
                }
                return null;
            };

            // Mapping logic
            const customerName = getValue([
                "customer name",
                "customer",
                "name",
                "person_name",
                "person name",
            ]);
            const phoneNumber = getValue([
                "phn no",
                "phone number",
                "phone",
                "mobile",
            ]);
            const email = getValue(["email", "e-mail", "mail", "email address"]);

            // Map 'productEn' or similar to callDescription
            // Added 'productEnquiry' from debug log
            const callDescription = getValue(["productEnquiry", "producten", "product enquiry", "enquiry", "description"]);

            // Defaults with checks
            let status = getValue(["status", "state"]);
            if (
                !status ||
                !["assigned", "not assigned", "completed"].includes(status.toLowerCase())
            ) {
                if (!status) status = "not assigned";
            } else {
                status = status.toLowerCase();
            }

            // Added 'assignedUser' from debug log (camelCase match)
            const assignedUser = getValue(["assignedUser", "assigned user", "user", "agent", "assignedu"]) || null;
            const aiFeedback = getValue(["ai feedback", "feedback"]) || null;

            // Added 'sentimentLabel' from debug log
            let sentiment = getValue(["sentimentLabel", "sentiment", "sentimentl"]);

            // Handle special mapping for symbols like ✖ if necessary, or just lower case
            if (sentiment === "✖") {
                sentiment = "negative";
            } else if (sentiment === "✔") {
                sentiment = "positive";
            } else if (sentiment && ["positive", "negative"].includes(sentiment.toLowerCase())) {
                sentiment = sentiment.toLowerCase();
            } else {
                sentiment = null;
            }

            return {
                customerName,
                phoneNumber,
                email,
                status,
                assignedUser,
                aiFeedback,
                sentiment,
                callDescription, // Added this field
            };
        });

        await Lead.insertMany(documentsToInsert);

        res.json({
            msg: "File uploaded and parsed successfully",
            count: documentsToInsert.length,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server Error", error: err.message });
    }
});

// PUT /api/leads/assign - Assign leads to a user
router.put("/assign", async (req, res) => {
    const { leadIds, assignedTo } = req.body;

    if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
        return res.status(400).json({ msg: "No leads selected" });
    }

    try {
        const result = await Lead.updateMany(
            { _id: { $in: leadIds } },
            { $set: { assignedUser: assignedTo } } // using 'assignedUser' as per schema inferred from upload route
        );

        res.json({ msg: "Leads assigned successfully", modifiedCount: result.modifiedCount });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server Error" });
    }
});

module.exports = router;
