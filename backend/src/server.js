const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); // <--- Add this
require("dotenv").config();

// Connect to Database
connectDB(); // <--- Add this

const app = express();
// ... rest of your code remains the same

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