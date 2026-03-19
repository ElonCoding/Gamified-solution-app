const { randomUUID } = require("crypto");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const now = Date.now();

const useDb = () => mongoose.connection.readyState === 1;

const createUser = ({ name, email, password, role }) => ({
  id: randomUUID(),
  name,
  email: email.toLowerCase(),
  password,
  role: role || "user",
  xp: 120,
  coins: 80,
  streak: 3,
  level: "Beginner",
  proficiency: { tech: 28, aptitude: 22, softSkills: 31 },
  badges: ["Fast Learner"],
  completedChallenges: [],
  weeklyStats: { accuracy: 74, speed: 68, consistency: 77 },
  streakLastDate: new Date(now - 86400000),
  totalChallengesCompleted: 5,
  joinedAt: new Date(now)
});

const hashSync = (plain) => bcrypt.hashSync(plain, 10);

const users = [
  createUser({ name: "Demo Student", email: "student@demo.com", password: hashSync("student123") }),
  { ...createUser({ name: "Alice Chen", email: "alice@demo.com", password: hashSync("student123") }), xp: 890, coins: 320, streak: 12, level: "Intermediate", proficiency: { tech: 62, aptitude: 55, softSkills: 48 }, badges: ["Fast Learner", "Consistency King"], weeklyStats: { accuracy: 82, speed: 75, consistency: 88 }, totalChallengesCompleted: 18 },
  { ...createUser({ name: "Bob Kumar", email: "bob@demo.com", password: hashSync("student123") }), xp: 1450, coins: 580, streak: 21, level: "Advanced", proficiency: { tech: 78, aptitude: 70, softSkills: 65 }, badges: ["Fast Learner", "Top Performer", "Consistency King"], weeklyStats: { accuracy: 91, speed: 83, consistency: 95 }, totalChallengesCompleted: 32 },
  { ...createUser({ name: "Carol Martinez", email: "carol@demo.com", password: hashSync("student123") }), xp: 2400, coins: 920, streak: 45, level: "Master", proficiency: { tech: 92, aptitude: 88, softSkills: 85 }, badges: ["Fast Learner", "Top Performer", "Consistency King", "Streak Master", "Challenge Crusher", "Mission Machine"], weeklyStats: { accuracy: 96, speed: 90, consistency: 98 }, totalChallengesCompleted: 55 },
  { ...createUser({ name: "Dave O'Brien", email: "dave@demo.com", password: hashSync("student123") }), xp: 340, coins: 150, streak: 0, badges: [], weeklyStats: { accuracy: 60, speed: 55, consistency: 45 }, totalChallengesCompleted: 8 },
  createUser({ name: "Platform Admin", email: "admin@gamifyu.com", password: hashSync("admin123"), role: "admin" }),
  createUser({ name: "Super Admin", email: "superadmin@gamifyu.com", password: hashSync("admin123"), role: "superadmin" })
];

const challenges = [
  { id: "d-1", type: "daily", title: "10-Minute DSA Sprint", subject: "Tech", description: "Solve 3 array problems under time pressure", baseXp: 40, difficulty: "easy", timeLimitMin: 10 },
  { id: "d-2", type: "daily", title: "Quant Reflex Drill", subject: "Aptitude", description: "Quick-fire quantitative aptitude questions", baseXp: 35, difficulty: "easy", timeLimitMin: 12 },
  { id: "d-3", type: "daily", title: "Vocabulary Power-Up", subject: "Soft Skills", description: "Learn 10 new professional vocabulary words", baseXp: 25, difficulty: "easy", timeLimitMin: 8 },
  { id: "d-4", type: "daily", title: "Debug Detective", subject: "Tech", description: "Find and fix bugs in 5 code snippets", baseXp: 45, difficulty: "medium", timeLimitMin: 15 },
  { id: "w-1", type: "weekly", title: "Build a REST API", subject: "Tech", description: "Design and implement a complete CRUD REST API", baseXp: 220, difficulty: "medium", timeLimitMin: 240 },
  { id: "w-2", type: "weekly", title: "Mock Group Discussion", subject: "Soft Skills", description: "Participate in a structured GD on current affairs", baseXp: 180, difficulty: "medium", timeLimitMin: 90 },
  { id: "w-3", type: "weekly", title: "Data Structures Deep Dive", subject: "Tech", description: "Implement a balanced BST and hash map from scratch", baseXp: 250, difficulty: "hard", timeLimitMin: 300 },
  { id: "w-4", type: "weekly", title: "Case Study Analysis", subject: "Aptitude", description: "Analyze a real business case and present findings", baseXp: 190, difficulty: "medium", timeLimitMin: 120 },
  { id: "m-1", type: "monthly", title: "Capstone Project", subject: "Tech", description: "Build a full-stack application addressing a real-world problem", baseXp: 500, difficulty: "hard", timeLimitMin: 600 },
  { id: "m-2", type: "monthly", title: "Leadership Simulation", subject: "Soft Skills", description: "Lead a virtual team through a multi-day project scenario", baseXp: 400, difficulty: "hard", timeLimitMin: 480 }
];

const submissions = [];

module.exports = { users, challenges, submissions, createUser, useDb };
