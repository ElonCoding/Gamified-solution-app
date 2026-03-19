const mongoose = require("mongoose");

const connectDb = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return { connected: false, reason: "MONGODB_URI not set" };
  }
  try {
    await mongoose.connect(uri, { dbName: process.env.MONGODB_DB || "gamified_learning" });
    return { connected: true };
  } catch (error) {
    return { connected: false, reason: error.message };
  }
};

module.exports = { connectDb };

