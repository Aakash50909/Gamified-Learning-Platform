const router = require("express").Router();
const User = require("../models/User");
const DSAProgress = require("../models/DSAProgress");

// GET /api/user/profile/:userId - Get user profile
router.get("/profile/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select(
      "username email avatar dsaPoints dsaRank dsaStats createdAt"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get completed problems
    const completedProblems = await DSAProgress.find({
      userId,
      completed: true,
    })
      .sort({ completedAt: -1 })
      .limit(10)
      .select(
        "problemSlug problemTitle topic difficulty pointsEarned completedAt"
      );

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar || "ninja",
        points: user.dsaPoints || 0,
        rank: user.dsaRank || 0,
        stats: user.dsaStats || {
          easyCompleted: 0,
          mediumCompleted: 0,
          hardCompleted: 0,
          totalCompleted: 0,
        },
        joinedAt: user.createdAt,
      },
      recentProblems: completedProblems,
    });
  } catch (err) {
    console.error("User Profile API Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/user/profile/:userId - Update user profile
router.put("/profile/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, avatar, bio } = req.body;

    const updates = {};
    if (username) updates.username = username;
    if (avatar) updates.avatar = avatar;
    if (bio !== undefined) updates.bio = bio; // Allow empty string

    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    }).select("username email avatar bio dsaPoints dsaRank dsaStats");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        points: user.dsaPoints || 0,
        rank: user.dsaRank || 0,
        stats: user.dsaStats || {},
      },
    });
  } catch (err) {
    console.error("Update Profile API Error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
