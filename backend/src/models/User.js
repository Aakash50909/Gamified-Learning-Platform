const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    _id: {
      type: String, // ✅ Changed to String to accept "user-1763817386544" format
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false, // Optional if using OAuth
    },
    username: {
      type: String,
      default: function () {
        return this.name || "User";
      },
    },
    bio: {
      type: String,
      default: "",
      maxlength: 500,
    },
    role: {
      type: String,
      enum: ["player", "organizer", "admin"],
      default: "player",
    },
    avatar: {
      type: String,
      default: "ninja",
    },
    xp: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
    },
    completedModules: [
      { type: mongoose.Schema.Types.ObjectId, ref: "LearningModule" },
    ],
    achievements: [String],
    dsaPoints: {
      type: Number,
      default: 0,
    },
    dsaRank: {
      type: Number,
      default: 0,
    },
    dsaStats: {
      easyCompleted: { type: Number, default: 0 },
      mediumCompleted: { type: Number, default: 0 },
      hardCompleted: { type: Number, default: 0 },
      totalCompleted: { type: Number, default: 0 },
    },
  },
  {
    _id: false, // ✅ Disable automatic ObjectId generation
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Indexes for better query performance
UserSchema.index({ dsaPoints: -1 });

module.exports = mongoose.model("User", UserSchema);
