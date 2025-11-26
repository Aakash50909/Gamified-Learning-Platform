// Run this once: node seedUser.js

const mongoose = require("mongoose");
const User = require("./src/models/User"); // seedUser.js is in backend/, models are in src/models/
require("dotenv").config();

const createTestUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/coding-platform"
    );
    console.log("✅ Connected to MongoDB");

    // Check if user already exists
    const existingUser = await User.findById("user-1763817386544");

    if (existingUser) {
      console.log("⚠️  User already exists:", existingUser);
      process.exit(0);
    }

    // Create test user with string ID
    const testUser = new User({
      _id: "user-1763817386544", // Your current userId from frontend
      name: "Test User",
      email: "test@example.com",
      username: "TestUser",
      password: "test123", // You can hash this if needed
      avatar: "ninja",
      role: "player",
      xp: 0,
      level: 1,
      dsaPoints: 0,
      dsaRank: 0,
      dsaStats: {
        easyCompleted: 0,
        mediumCompleted: 0,
        hardCompleted: 0,
        totalCompleted: 0,
      },
      achievements: [],
      completedModules: [],
    });

    await testUser.save();
    console.log("✅ Test user created successfully!");
    console.log("User ID:", testUser._id);
    console.log("Username:", testUser.username);

    // Verify
    const verifyUser = await User.findById("user-1763817386544");
    console.log("\n✅ Verified user in database:", verifyUser);

    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
};

createTestUser();
