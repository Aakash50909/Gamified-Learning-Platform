const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // 1. DEBUG LOG: Print what we are trying to use
    console.log("-----------------------------------------");
    console.log("DEBUG: Connection Function Started");
    console.log("DEBUG: Env Var Type:", typeof process.env.MONGO_URL);
    console.log("DEBUG: Env Var Value:", process.env.MONGO_URL ? "EXISTS" : "MISSING");
    console.log("-----------------------------------------");

    // 2. FORCE CRASH if missing (Do not allow localhost fallback)
    if (!process.env.MONGO_URL) {
      throw new Error("FATAL: MONGO_URL is not defined in Environment Variables!");
    }

    const conn = await mongoose.connect(process.env.MONGO_URL);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;