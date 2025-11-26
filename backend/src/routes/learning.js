const router = require("express").Router();
const User = require("../models/User"); // Import the Real DB Model

// GET: Fetch Modules (Keep this simple for now)
router.get("/modules", (req, res) => {
  res.json([
    { id: "mod_1", title: "Intro to Variables", xpReward: 50 },
    { id: "mod_2", title: "Loops & Logic", xpReward: 100 },
  ]);
});

// POST: Complete a Module & Earn XP (THE REAL LOGIC)
router.post("/complete", async (req, res) => {
  const { userId, xpAmount } = req.body;

  try {
    // 1. Find the user in the Real Cloud Database
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // 2. Update their XP
    user.xp += xpAmount;

    // 3. Save to MongoDB Atlas
    await user.save();

    res.json({ message: "XP Updated", newXP: user.xp });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
const User = require("../models/User"); // Make sure User model is imported

// GET /api/auth/profile/:id
// This lets the frontend fetch real stats
router.get("/profile/:id", async (req, res) => {
  try {
    // 1. Look up user by ID in MongoDB
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ error: "User not found" });

    // 2. Send back the REAL data
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
