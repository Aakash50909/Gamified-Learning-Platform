const router = require("express").Router();
const Problem = require("../models/Problem");
const User = require("../models/User");

// 1. GET all problems
router.get("/problems", async (req, res) => {
  try {
    const problems = await Problem.find();
    res.json(problems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. POST: Mark problem as solved & Award Points
router.post("/solve", async (req, res) => {
  const { userId, problemId } = req.body;

  try {
    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ error: "Problem not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Prevent double points (Optional logic)
    // if (user.solvedProblems.includes(problemId)) ...

    // Update Stats
    user.dsaPoints = (user.dsaPoints || 0) + problem.points;
    user.dsaStats = user.dsaStats || { easy: 0, medium: 0, hard: 0 };

    // Increment difficulty counter
    const diff = problem.difficulty.toLowerCase();
    if (user.dsaStats[diff] !== undefined) user.dsaStats[diff]++;

    await user.save();

    res.json({
      success: true,
      message: `Solved! Earned ${problem.points} points.`,
      newPoints: user.dsaPoints
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;