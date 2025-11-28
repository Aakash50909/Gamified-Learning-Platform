const mongoose = require("mongoose");
const Problem = require("./src/models/Problem");
require("dotenv").config();

// Your Mongo Connection String
const DB = process.env.MONGO_URL || "YOUR_HARDCODED_CONNECTION_STRING";

const sampleProblems = [
    {
        title: "Missing Number in Array",
        difficulty: "Easy",
        link: "https://practice.geeksforgeeks.org/problems/missing-number-in-array1416/1",
        points: 10,
        tags: ["Arrays", "Math"]
    },
    {
        title: "Kadane's Algorithm",
        difficulty: "Medium",
        link: "https://practice.geeksforgeeks.org/problems/kadanes-algorithm-1587115620/1",
        points: 30,
        tags: ["Arrays", "DP"]
    },
    {
        title: "Detect Loop in Linked List",
        difficulty: "Medium",
        link: "https://practice.geeksforgeeks.org/problems/detect-loop-in-linked-list/1",
        points: 30,
        tags: ["LinkedList", "Pointers"]
    },
    {
        title: "Trapping Rain Water",
        difficulty: "Hard",
        link: "https://practice.geeksforgeeks.org/problems/trapping-rain-water-1587115621/1",
        points: 50,
        tags: ["Arrays", "Stack"]
    }
];

mongoose.connect(DB).then(async () => {
    console.log("Connected to DB...");
    await Problem.deleteMany({}); // Clear old problems
    await Problem.insertMany(sampleProblems);
    console.log("DSA Problems Added!");
    process.exit();
});