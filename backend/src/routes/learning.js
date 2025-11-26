const router = require("express").Router();
const User = require("../models/User");
const DSAProgress = require("../models/DSAProgress");

// GET /api/learning/progress - Get user learning progress
router.get("/progress", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    // Use findById with string ID (no ObjectId conversion needed)
    const user = await User.findById(userId).select(
      "username avatar dsaPoints dsaRank dsaStats"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get completed problems count
    const completedProblems = await DSAProgress.countDocuments({
      userId,
      completed: true,
    });

    // Calculate streak (simplified - you can enhance this)
    const recentActivity = await DSAProgress.find({
      userId,
      completed: true,
    })
      .sort({ completedAt: -1 })
      .limit(7)
      .select("completedAt");

    res.json({
      username: user.username,
      avatar: user.avatar || "ninja",
      points: user.dsaPoints || 0,
      rank: user.dsaRank || 0,
      stats: user.dsaStats || {
        easyCompleted: 0,
        mediumCompleted: 0,
        hardCompleted: 0,
        totalCompleted: 0,
      },
      completedProblems: completedProblems,
      streak: recentActivity.length,
    });
  } catch (err) {
    console.error("Learning Progress API Error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
