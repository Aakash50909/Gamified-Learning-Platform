const router = require("express").Router();
const User = require("../models/User");

// GET /api/leaderboard - Get global leaderboard
router.get("/", async (req, res) => {
  try {
    const { type = "global", limit = 100, userId } = req.query;

    const leaderboard = await User.find({ dsaPoints: { $gt: 0 } })
      .sort({ dsaPoints: -1, "dsaStats.totalCompleted": -1 })
      .limit(parseInt(limit))
      .select("username avatar dsaPoints dsaRank dsaStats");

    const formattedLeaderboard = leaderboard.map((user, index) => ({
      rank: index + 1,
      userId: user._id,
      username: user.username,
      avatar: user.avatar || "ninja",
      points: user.dsaPoints || 0,
      problemsSolved: user.dsaStats?.totalCompleted || 0,
      stats: user.dsaStats || {
        easyCompleted: 0,
        mediumCompleted: 0,
        hardCompleted: 0,
        totalCompleted: 0,
      },
      isCurrentUser: userId && user._id.toString() === userId.toString(),
    }));

    res.json(formattedLeaderboard);
  } catch (err) {
    console.error("Leaderboard API Error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
