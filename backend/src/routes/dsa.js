const router = require("express").Router();
const axios = require("axios");
const User = require("../models/User");
const mongoose = require("mongoose");
const DSAProgress = require("../models/DSAProgress");
const { DSA_TOPICS, DIFFICULTY_LEVELS } = require("../config/dsaTopics");

// Piston API Configuration
const PISTON_API = "https://emkc.org/api/v2/piston";

// Language mappings for Piston
const LANGUAGE_CONFIG = {
  javascript: { language: "javascript", version: "18.15.0" },
  python: { language: "python", version: "3.10.0" },
  java: { language: "java", version: "15.0.2" },
  cpp: { language: "cpp", version: "10.2.0" },
  c: { language: "c", version: "10.2.0" },
};

// Helper function to get file extension
function getFileExtension(language) {
  const extensions = {
    javascript: "js",
    python: "py",
    java: "java",
    cpp: "cpp",
    c: "c",
  };
  return extensions[language] || "txt";
}

// Helper function to parse sample test cases from GFG format
function parseSampleTestCases(problem) {
  try {
    if (problem.sampleTestCases && Array.isArray(problem.sampleTestCases)) {
      return problem.sampleTestCases.map((tc) => ({
        input: tc.input || tc.sampleInput || "",
        output: tc.output || tc.sampleOutput || "",
        explanation: tc.explanation || "",
      }));
    }

    if (problem.examples && Array.isArray(problem.examples)) {
      return problem.examples.map((ex) => ({
        input: ex.input || "",
        output: ex.output || "",
        explanation: ex.explanation || "",
      }));
    }

    return [
      {
        input: "5\n1 2 3 4 5",
        output: "15",
        explanation: "Sample test case",
      },
    ];
  } catch (error) {
    console.error("Error parsing test cases:", error);
    return [
      {
        input: "Sample input",
        output: "Sample output",
        explanation: "Test case",
      },
    ];
  }
}

// GET /api/dsa/topics - Get all DSA topics
router.get("/topics", async (req, res) => {
  try {
    const { userId } = req.query;

    let topicsWithProgress = DSA_TOPICS.map((topic) => ({ ...topic }));

    if (userId) {
      const progress = await DSAProgress.aggregate([
        {
          $match: {
            userId: userId,
            completed: true,
          },
        },
        {
          $group: {
            _id: "$topic",
            count: { $sum: 1 },
            points: { $sum: "$pointsEarned" },
          },
        },
      ]);

      topicsWithProgress = DSA_TOPICS.map((topic) => {
        const topicProgress = progress.find((p) => p._id === topic.name);
        return {
          ...topic,
          completed: topicProgress?.count || 0,
          points: topicProgress?.points || 0,
        };
      });
    }

    res.json(topicsWithProgress);
  } catch (err) {
    console.error("Topics API Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dsa/problems - Fetch problems from GFG API
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

    const gfgEndpoints = [
      `https://practiceapi.geeksforgeeks.org/api/vLatest/problems/`,
      `https://practiceapi.geeksforgeeks.org/api/v1/problems/`,
      `https://practiceapi.geeksforgeeks.org/api/latest/problems/`,
    ];

    let problems = [];
    let apiSuccess = false;

    for (const endpoint of gfgEndpoints) {
      try {
        console.log(`\n🔄 Trying GFG API: ${endpoint}`);
        console.log(
          `📋 Params: category=${
            topicConfig.gfgSlug
          }, difficulty=${difficulty.toLowerCase()}`
        );

        const response = await axios.get(endpoint, {
          params: {
            category: topicConfig.gfgSlug,
            difficulty: difficulty.toLowerCase(),
            page: page,
          },
          timeout: 15000,
          headers: {
            "User-Agent": "Mozilla/5.0",
            Accept: "application/json",
          },
        });

        console.log(`✅ GFG API Response Status: ${response.status}`);
        console.log(`📊 Response structure:`, Object.keys(response.data));

        const data = response.data;
        problems = data.results || data.problems || data.data || [];

        console.log(`📝 Problems found: ${problems.length}`);

        if (problems && problems.length > 0) {
          apiSuccess = true;
          console.log(
            `✅ Successfully fetched ${problems.length} problems from GFG`
          );
          break;
        } else {
          console.log(`⚠️ API returned empty results, trying next endpoint...`);
        }
      } catch (error) {
        console.log(`❌ Failed with ${endpoint}`);
        console.log(`   Error: ${error.message}`);
        if (error.response) {
          console.log(`   Status: ${error.response.status}`);
          console.log(`   Data:`, error.response.data);
        }
        continue;
      }
    }

    if (!apiSuccess || problems.length === 0) {
      return res.status(404).json({
        error: "No problems found from GFG API",
        message: `Could not fetch problems for topic: ${topicConfig.name}, difficulty: ${difficulty}. Please try another topic or difficulty.`,
        topic: topicConfig.name,
        difficulty,
        suggestion: "Try selecting a different topic or difficulty level",
      });
    }

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
      error: "Failed to fetch problems from GFG API",
      message: err.message,
      suggestion: "Please check your internet connection or try again later",
    });
  }
});

// GET /api/dsa/problem/:slug - Get detailed problem from GFG
router.get("/problem/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    console.log("Fetching problem details for:", slug);

    const gfgUrl = `https://practiceapi.geeksforgeeks.org/api/vLatest/problems/${slug}/`;

    try {
      const response = await axios.get(gfgUrl, {
        timeout: 15000,
      });

      const problem = response.data;

      res.json({
        id: problem.problem_name || slug,
        slug: slug,
        title: problem.problem_title || problem.title,
        difficulty: problem.difficulty,
        description: problem.problem_description || problem.description,
        inputFormat: problem.input_format || problem.inputFormat,
        outputFormat: problem.output_format || problem.outputFormat,
        constraints: problem.constraints,
        sampleTestCases: parseSampleTestCases(problem),
        source: "GFG API",
      });
    } catch (apiError) {
      console.error("Failed to fetch from GFG:", apiError.message);
      res.status(404).json({ error: "Problem not found" });
    }
  } catch (err) {
    console.error("Problem Detail API Error:", err.message);
    res.status(500).json({ error: err.message });
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

    console.log(`Executing ${language} code...`);

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
      compile_memory_limit: -1,
      run_memory_limit: -1,
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
        executionTime: result.run.code === 0 ? "Success" : "Failed",
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

    console.log(`Running ${testCases.length} test cases...`);

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

          if (!passed) {
            allPassed = false;
          }
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
        console.error(`Test case ${i + 1} error:`, error.message);
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
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.dsaPoints = (user.dsaPoints || 0) + pointsToAdd;

    if (!user.dsaStats) {
      user.dsaStats = {
        easyCompleted: 0,
        mediumCompleted: 0,
        hardCompleted: 0,
        totalCompleted: 0,
      };
    }

    if (difficulty === "Easy") user.dsaStats.easyCompleted += 1;
    else if (difficulty === "Medium") user.dsaStats.mediumCompleted += 1;
    else if (difficulty === "Hard") user.dsaStats.hardCompleted += 1;

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
      "problemSlug problemTitle topic difficulty pointsEarned completedAt"
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

// GET /api/dsa/languages - Get supported languages
router.get("/languages", (req, res) => {
  res.json({
    languages: Object.keys(LANGUAGE_CONFIG).map((key) => ({
      id: key,
      name: key.charAt(0).toUpperCase() + key.slice(1),
      version: LANGUAGE_CONFIG[key].version,
    })),
  });
});

// Helper function to update all user rankings
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
