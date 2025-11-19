const mongoose = require("mongoose");

const CompetitionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["leaderboard", "knockout", "1v1"], required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  status: { type: String, enum: ["upcoming", "active", "finished"], default: "upcoming" },
  startDate: Date,
  endDate: Date,
  leaderboard: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      score: Number
    }
  ]
});

module.exports = mongoose.model("Competition", CompetitionSchema);