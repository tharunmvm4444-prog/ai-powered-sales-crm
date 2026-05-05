const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// GET /api/notifications - Get all notifications (newest first)
router.get('/', async (req, res) => {
    try {
        const notifications = await Notification.find().sort({ createdAt: -1 });
        // Map to match the frontend expected format if needed, or just return as is
        // The frontend expects: { id, message, timestamp, status }
        // We will return the raw objects and map them on frontend or here.
        // Let's return raw and handle mapping on frontend or return mapped here.
        // Frontend in the plan said "Use the styles from merge/notify path" which expected:
        // id, message, timestamp (string), status.

        const formatted = notifications.map(n => ({
            id: n._id,
            message: n.message,
            status: n.status,
            timestamp: new Date(n.createdAt).toLocaleString()
        }));

        res.json(formatted);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/notifications - Create a notification
router.post('/', async (req, res) => {
    try {
        console.log("POST /api/notifications received:", req.body);
        const { message, type, status } = req.body;
        const newNotification = new Notification({
            message,
            type,
            status: status || 'Email Sent'
        });
        const saved = await newNotification.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
