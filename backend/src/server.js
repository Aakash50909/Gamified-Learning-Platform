// backend/src/server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  // We will add specific frontend URLs here in Phase 7
  origin: "*", 
  credentials: true
}));

// Health Check Route
app.get("/", (req, res) => res.send("API is running smoothly."));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});