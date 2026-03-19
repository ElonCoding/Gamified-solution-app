const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema({
  type: { type: String, enum: ["daily", "weekly", "monthly"], required: true },
  title: { type: String, required: true, trim: true },
  subject: { type: String, required: true },
  description: { type: String, default: "" },
  baseXp: { type: Number, required: true },
  difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "easy" },
  timeLimitMin: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Challenge", challengeSchema);
