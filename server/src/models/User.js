const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin", "superadmin"], default: "user" },
  xp: { type: Number, default: 0 },
  coins: { type: Number, default: 50 },
  streak: { type: Number, default: 0 },
  level: { type: String, default: "Beginner" },
  proficiency: {
    tech: { type: Number, default: 10 },
    aptitude: { type: Number, default: 10 },
    softSkills: { type: Number, default: 10 }
  },
  badges: { type: [String], default: [] },
  completedChallenges: { type: [String], default: [] },
  weeklyStats: {
    accuracy: { type: Number, default: 50 },
    speed: { type: Number, default: 50 },
    consistency: { type: Number, default: 50 }
  },
  streakLastDate: { type: Date, default: null },
  totalChallengesCompleted: { type: Number, default: 0 },
  joinedAt: { type: Date, default: Date.now }
});

userSchema.index({ xp: -1 });
userSchema.index({ email: 1 });

module.exports = mongoose.model("User", userSchema);
