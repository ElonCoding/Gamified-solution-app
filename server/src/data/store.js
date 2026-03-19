const { randomUUID } = require("crypto");

const now = Date.now();

const createUser = ({ name, email, password }) => ({
  id: randomUUID(),
  name,
  email: email.toLowerCase(),
  password,
  xp: 120,
  coins: 80,
  streak: 3,
  level: "Beginner",
  proficiency: {
    tech: 28,
    aptitude: 22,
    softSkills: 31
  },
  badges: ["Fast Learner"],
  completedChallenges: [],
  weeklyStats: {
    accuracy: 74,
    speed: 68,
    consistency: 77
  },
  createdAt: now
});

const users = [
  createUser({
    name: "Demo Student",
    email: "student@demo.com",
    password: "student123"
  })
];

const challenges = [
  { id: "d-1", type: "daily", title: "10-Minute DSA Sprint", subject: "Tech", baseXp: 40, difficulty: "easy", timeLimitMin: 10 },
  { id: "d-2", type: "daily", title: "Quant Reflex Drill", subject: "Aptitude", baseXp: 35, difficulty: "easy", timeLimitMin: 12 },
  { id: "w-1", type: "weekly", title: "Build a REST API", subject: "Tech", baseXp: 220, difficulty: "medium", timeLimitMin: 240 },
  { id: "w-2", type: "weekly", title: "Mock Group Discussion", subject: "Soft Skills", baseXp: 180, difficulty: "medium", timeLimitMin: 90 },
  { id: "m-1", type: "monthly", title: "Capstone Challenge", subject: "Tech", baseXp: 500, difficulty: "hard", timeLimitMin: 600 }
];

module.exports = { users, challenges, createUser };

