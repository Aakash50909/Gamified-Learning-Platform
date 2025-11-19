const mongoose = require("mongoose");

const ModuleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "easy" },
  xpReward: { type: Number, required: true },
  description: String,
  content: String, // Could be markdown or a URL to video
  questions: [
    {
      questionText: String,
      options: [String],
      correctAnswer: Number // Index of the correct option
    }
  ]
});

module.exports = mongoose.model("LearningModule", ModuleSchema);