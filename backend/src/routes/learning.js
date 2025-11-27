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

    const user = await User.findById(userId).select(
      "username avatar dsaPoints dsaRank dsaStats"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const completedProblems = await DSAProgress.countDocuments({
      userId,
      completed: true,
    });

    // Calculate streak based on consecutive days
    const recentActivity = await DSAProgress.find({
      userId,
      completed: true,
    })
      .sort({ completedAt: -1 })
      .select("completedAt");

    const streak = calculateStreak(recentActivity);

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
      streak: streak,
    });
  } catch (err) {
    console.error("Learning Progress API Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Helper function to calculate consecutive day streak
function calculateStreak(activities) {
  if (!activities || activities.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get unique dates
  const uniqueDates = [
    ...new Set(
      activities.map((activity) => {
        const date = new Date(activity.completedAt);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
      })
    ),
  ].sort((a, b) => b - a);

  if (uniqueDates.length === 0) return 0;

  const mostRecentActivity = new Date(uniqueDates[0]);
  const daysSinceLastActivity = Math.floor(
    (today - mostRecentActivity) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceLastActivity > 1) return 0;

  let streak = 0;
  let currentDate = today.getTime();

  for (const dateTimestamp of uniqueDates) {
    const dayDiff = Math.floor(
      (currentDate - dateTimestamp) / (1000 * 60 * 60 * 24)
    );

    if (dayDiff === 0 || dayDiff === 1) {
      streak++;
      currentDate = dateTimestamp;
    } else {
      break;
    }
  }

  return streak;
}

module.exports = router;
