const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  challengeId: { type: String, required: true },
  challengeTitle: { type: String, default: "" },
  accuracy: { type: Number, required: true },
  timeSpentMin: { type: Number, required: true },
  earnedXp: { type: Number, default: 0 },
  earnedCoins: { type: Number, default: 0 },
  submittedAt: { type: Date, default: Date.now }
});

submissionSchema.index({ submittedAt: -1 });

module.exports = mongoose.model("Submission", submissionSchema);
