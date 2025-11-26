const mongoose = require("mongoose");

const DSAProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      ref: "User",
      required: true,
    },
    topic: {
      type: String,
      required: true,
      enum: [
        "Arrays",
        "Strings",
        "Linked List",
        "Trees",
        "Graphs",
        "Dynamic Programming",
        "Greedy",
        "Recursion",
        "Stack / Queue",
      ],
    },
    difficulty: {
      type: String,
      required: true,
      enum: ["Easy", "Medium", "Hard"],
    },
    problemSlug: {
      type: String,
      required: true,
    },
    problemTitle: {
      type: String,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    pointsEarned: {
      type: Number,
      default: 0,
    },
    language: {
      type: String,
      enum: ["javascript", "python", "cpp", "java", "c"],
      default: "javascript",
    },
    solution: {
      type: String,
      default: "",
    },
    completedAt: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Compound index to prevent duplicate completions
DSAProgressSchema.index({ userId: 1, problemSlug: 1 }, { unique: true });

module.exports = mongoose.model("DSAProgress", DSAProgressSchema);
