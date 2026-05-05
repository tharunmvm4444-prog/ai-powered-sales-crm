const express = require("express");
const router = express.Router();
const AllowedSalesperson = require("../models/AllowedSalesperson");
const User = require("../models/User");

/* REGISTER */
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // 1. Check if user exists
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User exists" });

    // 2. If Salesperson, check allow list
    if (role === 'salesperson') {
      const isAllowed = await AllowedSalesperson.findOne({ name });
      if (!isAllowed) {
        return res.status(403).json({ message: "Salesperson name not authorized by Admin." });
      }
    }

    const user = await User.create({ name, email, password, role });

    res.status(201).json({
      id: user._id,
      name: user.name,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    console.log("LOGIN ROLE:", user.role); // <-- ADD THIS

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

module.exports = router;
