const router = require("express").Router();
const Problem = require("../models/Problem");
const User = require("../models/User");

// 1. GET Topics (Grouped by Difficulty/Tag)
router.get("/topics", async (req, res) => {
  // Hardcoded topics for the demo (Fastest way)
  const topics = [
    { id: 1, name: "Arrays", description: "Basic array operations", icon: "📊", color: "from-blue-400 to-blue-600", points: 100 },
    { id: 2, name: "Linked Lists", description: "Node-based structures", icon: "🔗", color: "from-green-400 to-green-600", points: 200 },
    { id: 3, name: "Stacks & Queues", description: "LIFO and FIFO", icon: "📚", color: "from-purple-400 to-purple-600", points: 150 },
    { id: 4, name: "Trees", description: "Hierarchical data", icon: "🌳", color: "from-yellow-400 to-yellow-600", points: 300 }
  ];
  res.json(topics);
});

// 2. GET Problems (Filtered by Topic if needed)
router.get("/problems", async (req, res) => {
  try {
    const problems = await Problem.find();
    res.json(problems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. POST Solve (Update Points)
router.post("/solve", async (req, res) => {
  const { userId, problemId } = req.body;
  try {
    const user = await User.findById(userId);
    const problem = await Problem.findById(problemId);

    if (!user || !problem) return res.status(404).json({ error: "Not found" });

    // Update Stats
    user.dsaPoints = (user.dsaPoints || 0) + problem.points;
    user.dsaStats = user.dsaStats || { totalCompleted: 0 };
    user.dsaStats.totalCompleted += 1;

    await user.save();

    res.json({ success: true, newPoints: user.dsaPoints, newStats: user.dsaStats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;