const express = require("express");
const router = express.Router();
const AnalyticsDetails = require("../models/AnalyticsDetails");

// GET analytics data
router.get("/", async (req, res) => {
  try {
    const { period } = req.query;

    if (!period) {
      return res.status(400).json({ message: "Period is required" });
    }

    const analytics = await AnalyticsDetails.findOne({ period });

    if (!analytics) {
      return res.status(404).json({ message: "Analytics data not found" });
    }

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
