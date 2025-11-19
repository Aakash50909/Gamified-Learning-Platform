const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ["player", "organizer", "admin"], 
    default: "player" 
  },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  completedModules: [{ type: mongoose.Schema.Types.ObjectId, ref: "LearningModule" }],
  achievements: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);