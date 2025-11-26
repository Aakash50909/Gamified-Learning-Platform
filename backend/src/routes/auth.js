const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userId = `user-${Date.now()}`;

    const newUser = new User({
      _id: userId,
      name: username,
      username: username,
      email: email.toLowerCase(),
      password: hashedPassword,
      avatar: "ninja",
      dsaPoints: 0,
      dsaStats: {
        easyCompleted: 0,
        mediumCompleted: 0,
        hardCompleted: 0,
        totalCompleted: 0,
      },
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
      expiresIn: "30d",
    });

    res.json({
      success: true,
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        avatar: newUser.avatar,
        dsaPoints: newUser.dsaPoints,
        dsaStats: newUser.dsaStats,
      },
    });

    console.log(`✅ User registered: ${username}`);
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "30d",
    });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        dsaPoints: user.dsaPoints,
        dsaStats: user.dsaStats,
      },
    });

    console.log(`✅ User logged in: ${user.username}`);
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
