const express = require("express");
const router = express.Router();
const DashboardDetails = require("../models/DashboardDetails");

// GET dashboard details
router.get("/", async (req, res) => {
  try {
    const { period } = req.query;

    if (!period) {
      return res.status(400).json({ message: "Period is required" });
    }

    const dashboard = await DashboardDetails.findOne({ period });

    if (!dashboard) {
      return res.status(404).json({ message: "Dashboard data not found" });
    }

    res.json(dashboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
