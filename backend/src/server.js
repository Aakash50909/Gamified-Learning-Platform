const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors({
  origin: "*", // Allow Vercel to access this
  credentials: true
}));
app.use(express.json());

// ---------------------------------------------------------
// ⚡ NUCLEAR DATABASE CONNECTION (Hardcoded for stability)
// ---------------------------------------------------------
// Replace <password> with your REAL password
const DB_CONNECTION_STRING = "mongodb+srv://aakashchandra505:password1234@sharedcluster.vq1dvx4.mongodb.net/gamified-platform?retryWrites=true&w=majority";

console.log("⏳ Attempting to connect to MongoDB Atlas...");

mongoose
  .connect(DB_CONNECTION_STRING)
  .then(() => console.log("✅ MongoDB Connected to CLOUD"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    // Keep server running so we can see logs
  });
// ---------------------------------------------------------

// Import Routes
const authRoutes = require("./routes/auth");
const dsaRoutes = require("./routes/dsa");
const learningRoutes = require("./routes/learning");
const leaderboardRoutes = require("./routes/leaderboard");
const userRoutes = require("./routes/user");

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/dsa", dsaRoutes);
app.use("/api/learning", learningRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/user", userRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "API is running..." });
});

// 404 handler
app.use((req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ error: "Route not found" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
});

// Handle unhandled rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
});