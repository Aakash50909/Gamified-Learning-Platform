const mongoose = require("mongoose");

const ProblemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Easy" },
    link: { type: String, required: true }, // Link to actual GFG problem
    points: { type: Number, required: true },
    tags: [String]
});

module.exports = mongoose.model("Problem", ProblemSchema);