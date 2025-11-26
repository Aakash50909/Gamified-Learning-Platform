const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/coding-platform"
  )
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Import Routes
const authRoutes = require("./routes/auth");
const dsaRoutes = require("./routes/dsa");
const learningRoutes = require("./routes/learning");
const leaderboardRoutes = require("./routes/leaderboard");
const userRoutes = require("./routes/user");

// Use Routes - Register them BEFORE 404 handler
app.use("/api/auth", authRoutes);
app.use("/api/dsa", dsaRoutes);
app.use("/api/learning", learningRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/user", userRoutes);

console.log("✅ Routes registered:");
console.log("   - /api/auth (login, signup)");
console.log("   - /api/dsa (topics, problems, execute)");
console.log("   - /api/learning (progress)");
console.log("   - /api/leaderboard");
console.log("   - /api/user (profile)");

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// 404 handler - MUST be after all routes
app.use((req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📍 API available at http://localhost:${PORT}/api\n`);
});

// Handle unhandled rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
});
