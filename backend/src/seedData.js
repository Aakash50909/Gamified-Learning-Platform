const mongoose = require("mongoose");
const LearningModule = require("./models/LearningModule");
require("dotenv").config();

const seedModules = [
  {
    title: "Intro to Variables",
    name: "Coding",
    difficulty: "easy",
    xpReward: 50,
    description: "Learn the basics of variables",
    category: "coding",
    icon: "Code",
    color: "from-blue-500 to-cyan-500",
    xp: 0,
    maxXp: 1000,
    level: 1,
    streak: 0,
  },
  {
    title: "Control Flow",
    difficulty: "easy",
    xpReward: 75,
    description: "Master if statements and loops",
  },
  {
    title: "Functions",
    difficulty: "medium",
    xpReward: 100,
    description: "Understand functions and scope",
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");

    await LearningModule.deleteMany({});
    console.log("Cleared existing modules");

    await LearningModule.insertMany(seedModules);
    console.log("✅ Seed data added!");

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

seed();
