const router = require("express").Router();
const Problem = require("../models/Problem");
const User = require("../models/User");

// 1. GET Topics (Grouped by Difficulty/Tag)
router.get("/topics", async (req, res) => {
  // Hardcoded topics for the demo (Fastest way)
  const topics = [
    {
      id: 1,
      name: "Arrays",
      description: "Basic array operations",
      icon: "📊",
      color: "from-blue-400 to-blue-600",
      points: 100,
    },
    {
      id: 2,
      name: "Linked Lists",
      description: "Node-based structures",
      icon: "🔗",
      color: "from-green-400 to-green-600",
      points: 200,
    },
    {
      id: 3,
      name: "Stacks & Queues",
      description: "LIFO and FIFO",
      icon: "📚",
      color: "from-purple-400 to-purple-600",
      points: 150,
    },
    {
      id: 4,
      name: "Trees",
      description: "Hierarchical data",
      icon: "🌳",
      color: "from-yellow-400 to-yellow-600",
      points: 300,
    },
  ];
  res.json(topics);
});

// GET /api/dsa/problems - Fetch problems from GFG API with fallback
router.get("/problems", async (req, res) => {
  try {
    const { topic, difficulty, page = 1 } = req.query;

    if (!topic || !difficulty) {
      return res
        .status(400)
        .json({ error: "Topic and difficulty are required" });
    }

    const topicConfig = DSA_TOPICS.find(
      (t) => t.name.toLowerCase() === topic.toLowerCase() || t.id === topic
    );

    if (!topicConfig) {
      return res.status(404).json({ error: "Topic not found" });
    }

    // Try GFG API first
    const gfgEndpoints = [
      `https://practiceapi.geeksforgeeks.org/api/vLatest/problems/`,
      `https://practiceapi.geeksforgeeks.org/api/v1/problems/`,
    ];

    let problems = [];
    let apiSuccess = false;

    for (const endpoint of gfgEndpoints) {
      try {
        console.log(`🔄 Trying GFG API: ${endpoint}`);

        const response = await axios.get(endpoint, {
          params: {
            category: topicConfig.gfgSlug,
            difficulty: difficulty.toLowerCase(),
            page: page,
          },
          timeout: 10000,
          headers: {
            "User-Agent": "Mozilla/5.0",
            Accept: "application/json",
          },
        });

        const data = response.data;
        problems = data.results || data.problems || [];

        if (problems && problems.length > 0) {
          apiSuccess = true;
          console.log(`✅ Found ${problems.length} problems from GFG`);
          break;
        }
      } catch (error) {
        console.log(`❌ GFG API failed: ${error.message}`);
        continue;
      }
    }

    // If GFG fails, use curated problems
    if (!apiSuccess || problems.length === 0) {
      console.log("⚠️ Using curated practice problems");
      const curatedProblems = getCuratedProblems(topicConfig.id, difficulty);

      if (curatedProblems.length > 0) {
        return res.json({
          problems: curatedProblems,
          total: curatedProblems.length,
          page: 1,
          topic: topicConfig.name,
          difficulty,
          source: "Curated Practice Problems",
        });
      }

      return res.status(404).json({
        error: "No problems available",
        message: `No problems available for ${topicConfig.name} - ${difficulty}`,
      });
    }

    // Transform GFG problems
    const transformedProblems = problems.slice(0, 10).map((problem, index) => ({
      id: problem.problem_name || problem.slug || `${topicConfig.id}-${index}`,
      slug:
        problem.problem_name || problem.slug || `${topicConfig.id}-${index}`,
      title:
        problem.problem_title ||
        problem.title ||
        `${topicConfig.name} Problem ${index + 1}`,
      difficulty: difficulty,
      topic: topicConfig.name,
      description:
        problem.problem_description ||
        problem.description ||
        "Solve this problem to earn points!",
      inputFormat:
        problem.input_format || problem.inputFormat || "Standard input format",
      outputFormat:
        problem.output_format ||
        problem.outputFormat ||
        "Standard output format",
      constraints: problem.constraints || "Standard constraints apply",
      sampleTestCases: parseSampleTestCases(problem),
      points:
        DIFFICULTY_LEVELS.find((d) => d.level === difficulty)?.points || 10,
    }));

    res.json({
      problems: transformedProblems,
      total: transformedProblems.length,
      page: parseInt(page),
      topic: topicConfig.name,
      difficulty,
      source: "GFG API",
    });
  } catch (err) {
    console.error("Problems API Error:", err.message);
    res.status(500).json({
      error: "Failed to fetch problems",
      message: err.message,
    });
  }
});

// POST /api/dsa/execute - Execute code using Piston API
router.post("/execute", async (req, res) => {
  try {
    const { code, language, input } = req.body;

    if (!code || !language) {
      return res.status(400).json({ error: "Code and language are required" });
    }

    const langConfig = LANGUAGE_CONFIG[language];
    if (!langConfig) {
      return res.status(400).json({ error: "Unsupported language" });
    }

    const response = await axios.post(`${PISTON_API}/execute`, {
      language: langConfig.language,
      version: langConfig.version,
      files: [
        {
          name: `main.${getFileExtension(language)}`,
          content: code,
        },
      ],
      stdin: input || "",
      args: [],
      compile_timeout: 10000,
      run_timeout: 3000,
    });

    const result = response.data;

    if (result.run) {
      const output = result.run.stdout || "";
      const error = result.run.stderr || "";

      if (error) {
        return res.json({
          success: false,
          error: "Runtime Error",
          message: error,
          output: output,
        });
      }

      res.json({
        success: true,
        output: output.trim(),
      });
    } else if (result.compile && result.compile.code !== 0) {
      res.json({
        success: false,
        error: "Compilation Error",
        message: result.compile.stderr || result.compile.output,
      });
    } else {
      res.json({
        success: false,
        error: "Execution Failed",
        message: "Unknown error occurred",
      });
    }
  } catch (err) {
    console.error("Piston API Error:", err.message);
    res.status(500).json({
      success: false,
      error: "Server Error",
      message: err.message,
    });
  }
});

// POST /api/dsa/run-tests - Run all test cases
router.post("/run-tests", async (req, res) => {
  try {
    const { code, language, testCases } = req.body;

    if (!code || !language || !testCases) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const results = [];
    let allPassed = true;

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];

      try {
        const langConfig = LANGUAGE_CONFIG[language];

        const response = await axios.post(`${PISTON_API}/execute`, {
          language: langConfig.language,
          version: langConfig.version,
          files: [
            {
              name: `main.${getFileExtension(language)}`,
              content: code,
            },
          ],
          stdin: testCase.input || "",
          args: [],
          compile_timeout: 10000,
          run_timeout: 3000,
        });

        const result = response.data;

        if (result.run) {
          const userOutput = (result.run.stdout || "").trim();
          const expectedOutput = (testCase.output || "").trim();
          const passed = userOutput === expectedOutput;

          results.push({
            testNumber: i + 1,
            input: testCase.input,
            expectedOutput: expectedOutput,
            userOutput: userOutput,
            passed: passed,
            error: result.run.stderr || null,
          });

          if (!passed) allPassed = false;
        } else {
          results.push({
            testNumber: i + 1,
            input: testCase.input,
            expectedOutput: testCase.output,
            userOutput: `Error: ${
              result.compile?.stderr || "Execution failed"
            }`,
            passed: false,
            error: result.compile?.stderr || "Unknown error",
          });
          allPassed = false;
        }
      } catch (error) {
        results.push({
          testNumber: i + 1,
          input: testCase.input,
          expectedOutput: testCase.output,
          userOutput: `Error: ${error.message}`,
          passed: false,
          error: error.message,
        });
        allPassed = false;
      }
    }

    res.json({
      success: true,
      allPassed,
      results,
      totalTests: testCases.length,
      passedTests: results.filter((r) => r.passed).length,
    });
  } catch (err) {
    console.error("Test Execution Error:", err.message);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// POST /api/dsa/complete - Mark problem as completed
router.post("/complete", async (req, res) => {
  try {
    const {
      userId,
      problemSlug,
      problemTitle,
      topic,
      difficulty,
      language,
      code,
    } = req.body;

    if (!userId || !problemSlug || !topic || !difficulty) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const pointsConfig = DIFFICULTY_LEVELS.find((d) => d.level === difficulty);
    const pointsToAdd = pointsConfig?.points || 10;

    let progress = await DSAProgress.findOne({ userId, problemSlug });

    if (progress && progress.completed) {
      return res.status(400).json({
        error: "Problem already completed",
        alreadyCompleted: true,
      });
    }

    if (!progress) {
      progress = new DSAProgress({
        userId,
        problemSlug,
        problemTitle,
        topic,
        difficulty,
        completed: true,
        pointsEarned: pointsToAdd,
        completedAt: new Date(),
        language: language || "javascript",
        solution: code || "",
      });
    } else {
      progress.completed = true;
      progress.pointsEarned = pointsToAdd;
      progress.completedAt = new Date();
      progress.language = language || "javascript";
      progress.solution = code || "";
    }

    await progress.save();

    const user = await User.findById(userId);
    const problem = await Problem.findById(problemId);

    if (!user || !problem) return res.status(404).json({ error: "Not found" });

    // Update Stats
    user.dsaPoints = (user.dsaPoints || 0) + problem.points;
    user.dsaStats = user.dsaStats || { totalCompleted: 0 };
    user.dsaStats.totalCompleted += 1;

    await user.save();

    await updateRankings();

    const updatedUser = await User.findById(userId).select(
      "dsaPoints dsaRank dsaStats"
    );

    console.log(
      `✅ ${
        user.name || user.username
      } completed ${problemTitle} in ${language} (+${pointsToAdd} points)`
    );

    res.json({
      success: true,
      pointsEarned: pointsToAdd,
      totalPoints: updatedUser.dsaPoints,
      rank: updatedUser.dsaRank,
      stats: updatedUser.dsaStats,
      message: `Congratulations! You earned ${pointsToAdd} points!`,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        error: "Problem already completed",
        alreadyCompleted: true,
      });
    }
    console.error("Complete Problem Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dsa/leaderboard - Get DSA leaderboard
router.get("/leaderboard", async (req, res) => {
  try {
    const { limit = 100, userId } = req.query;

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
      stats: user.dsaStats || {},
      isCurrentUser: userId && user._id.toString() === userId.toString(),
    }));

    res.json(formattedLeaderboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dsa/user-progress/:userId - Get user's progress
router.get("/user-progress/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select(
      "username dsaPoints dsaRank dsaStats"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const completedProblems = await DSAProgress.find({
      userId,
      completed: true,
    }).select(
      "problemSlug problemTitle topic difficulty pointsEarned completedAt language"
    );

    res.json({
      user: {
        username: user.username,
        points: user.dsaPoints || 0,
        rank: user.dsaRank || 0,
        stats: user.dsaStats || {},
      },
      completedProblems,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Helper: Get curated practice problems
function getCuratedProblems(topicId, difficulty) {
  const points =
    DIFFICULTY_LEVELS.find((d) => d.level === difficulty)?.points || 10;

  const problemsDB = {
    arrays: {
      Easy: [
        {
          id: "two-sum",
          slug: "two-sum",
          title: "Two Sum",
          difficulty: "Easy",
          topic: "Arrays",
          description:
            "Given an array of integers nums and an integer target, return indices of the two numbers that add up to target.",
          inputFormat:
            "First line: n and target\nSecond line: n space-separated integers",
          outputFormat: "Two space-separated indices",
          constraints: "2 ≤ n ≤ 10^4",
          sampleTestCases: [
            {
              input: "4 9\n2 7 11 15",
              output: "0 1",
              explanation: "nums[0] + nums[1] = 9",
            },
          ],
          points,
        },
      ],
      Medium: [
        {
          id: "max-subarray",
          slug: "max-subarray",
          title: "Maximum Subarray Sum",
          difficulty: "Medium",
          topic: "Arrays",
          description:
            "Find the contiguous subarray with the largest sum (Kadane's Algorithm).",
          inputFormat: "First line: n\nSecond line: n space-separated integers",
          outputFormat: "Single integer (maximum sum)",
          constraints: "1 ≤ n ≤ 10^5",
          sampleTestCases: [
            {
              input: "9\n-2 1 -3 4 -1 2 1 -5 4",
              output: "6",
              explanation: "Subarray [4,-1,2,1] = 6",
            },
          ],
          points,
        },
      ],
    },
    strings: {
      Easy: [
        {
          id: "reverse-string",
          slug: "reverse-string",
          title: "Reverse String",
          difficulty: "Easy",
          topic: "Strings",
          description: "Reverse a given string.",
          inputFormat: "Single line containing a string",
          outputFormat: "Reversed string",
          constraints: "1 ≤ length ≤ 10^5",
          sampleTestCases: [
            {
              input: "hello",
              output: "olleh",
              explanation: "String reversed",
            },
          ],
          points,
        },
      ],
    },
    "linked-list": {
      Easy: [
        {
          id: "reverse-list",
          slug: "reverse-list",
          title: "Reverse Linked List",
          difficulty: "Easy",
          topic: "Linked List",
          description: "Reverse a singly linked list (simulated with array).",
          inputFormat: "First line: n\nSecond line: n space-separated integers",
          outputFormat: "Reversed list as space-separated integers",
          constraints: "0 ≤ n ≤ 5000",
          sampleTestCases: [
            {
              input: "5\n1 2 3 4 5",
              output: "5 4 3 2 1",
              explanation: "List reversed",
            },
          ],
          points,
        },
      ],
      Medium: [
        {
          id: "middle-node",
          slug: "middle-node",
          title: "Middle of Linked List",
          difficulty: "Medium",
          topic: "Linked List",
          description: "Find the middle node of a linked list.",
          inputFormat: "First line: n\nSecond line: n space-separated integers",
          outputFormat: "Value of middle node",
          constraints: "1 ≤ n ≤ 100",
          sampleTestCases: [
            {
              input: "5\n1 2 3 4 5",
              output: "3",
              explanation: "Middle element",
            },
          ],
          points,
        },
      ],
    },
  };

  return problemsDB[topicId]?.[difficulty] || [];
}

// Helper: Update rankings
async function updateRankings() {
  try {
    const users = await User.find({ dsaPoints: { $gt: 0 } })
      .sort({ dsaPoints: -1, "dsaStats.totalCompleted": -1 })
      .select("_id");

    const bulkOps = users.map((user, index) => ({
      updateOne: {
        filter: { _id: user._id },
        update: { $set: { dsaRank: index + 1 } },
      },
    }));

    if (bulkOps.length > 0) {
      await User.bulkWrite(bulkOps);
    }
  } catch (err) {
    console.error("Error updating rankings:", err);
  }
}

module.exports = router;
