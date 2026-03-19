const { Router } = require("express");
const mongoose = require("mongoose");
const { z } = require("zod");
const { authMiddleware } = require("../middleware/auth");
const { users, challenges } = require("../data/store");
const { levelFromXp, nextLevel, adaptiveDifficulty, awardBadges } = require("../services/gamification");

const router = Router();

const getUser = (id) => users.find((u) => u.id === id);

router.get("/health", (_req, res) => {
  const mem = process.memoryUsage();
  res.json({
    status: "ok",
    timestamp: Date.now(),
    uptime: process.uptime(),
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    memory: { rss: mem.rss, heapUsed: mem.heapUsed }
  });
});

router.get("/dashboard", authMiddleware, (req, res) => {
  const user = getUser(req.user.sub);
  if (!user) return res.status(404).json({ message: "User not found" });
  user.level = levelFromXp(user.xp);
  user.badges = awardBadges(user);
  const target = nextLevel(user.xp);
  return res.json({
    user: {
      id: user.id,
      name: user.name,
      level: user.level,
      xp: user.xp,
      coins: user.coins,
      streak: user.streak,
      badges: user.badges
    },
    progress: {
      nextLevel: target.name,
      remainingXp: Math.max(target.minXp - user.xp, 0),
      proficiency: user.proficiency
    },
    activeChallenges: challenges.filter((c) => !user.completedChallenges.includes(c.id)).slice(0, 6)
  });
});

router.get("/challenges", authMiddleware, (req, res) => {
  const user = getUser(req.user.sub);
  if (!user) return res.status(404).json({ message: "User not found" });
  const recommendedDifficulty = adaptiveDifficulty(user.weeklyStats.accuracy);
  const recommended = challenges.map((challenge) => ({
    ...challenge,
    adaptiveDifficulty: recommendedDifficulty
  }));
  res.json({ items: recommended });
});

const submitSchema = z.object({
  challengeId: z.string(),
  accuracy: z.number().min(0).max(100),
  timeSpentMin: z.number().positive()
});

router.post("/challenges/submit", authMiddleware, (req, res) => {
  const parsed = submitSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid payload" });
  const user = getUser(req.user.sub);
  if (!user) return res.status(404).json({ message: "User not found" });
  const challenge = challenges.find((c) => c.id === parsed.data.challengeId);
  if (!challenge) return res.status(404).json({ message: "Challenge not found" });

  const speedScore = Math.max(40, Math.round((challenge.timeLimitMin / parsed.data.timeSpentMin) * 100));
  const earnedXp = Math.max(20, Math.round(challenge.baseXp * (parsed.data.accuracy / 100)));
  const earnedCoins = Math.max(10, Math.round(earnedXp / 4));

  user.xp += earnedXp;
  user.coins += earnedCoins;
  user.streak += 1;
  user.level = levelFromXp(user.xp);
  if (!user.completedChallenges.includes(challenge.id)) {
    user.completedChallenges.push(challenge.id);
  }
  user.weeklyStats = {
    accuracy: Math.round((user.weeklyStats.accuracy + parsed.data.accuracy) / 2),
    speed: Math.round((user.weeklyStats.speed + speedScore) / 2),
    consistency: Math.min(100, user.weeklyStats.consistency + 2)
  };
  user.badges = awardBadges(user);
  return res.json({
    earnedXp,
    earnedCoins,
    level: user.level,
    streak: user.streak,
    badges: user.badges
  });
});

router.get("/leaderboard", authMiddleware, (_req, res) => {
  const ranks = [...users]
    .map((user) => ({ id: user.id, name: user.name, xp: user.xp, streak: user.streak, level: levelFromXp(user.xp) }))
    .sort((a, b) => b.xp - a.xp)
    .map((user, index) => ({ rank: index + 1, ...user }));
  res.json({ items: ranks });
});

router.get("/analytics", authMiddleware, (req, res) => {
  const user = getUser(req.user.sub);
  if (!user) return res.status(404).json({ message: "User not found" });
  const report = {
    weeklyGrowth: [
      { week: "W1", xp: Math.max(50, user.xp - 240) },
      { week: "W2", xp: Math.max(80, user.xp - 180) },
      { week: "W3", xp: Math.max(120, user.xp - 100) },
      { week: "W4", xp: user.xp }
    ],
    metrics: user.weeklyStats,
    proficiency: user.proficiency,
    feedback: user.weeklyStats.accuracy > 80
      ? "Great momentum. Push into advanced challenges to maximize growth."
      : "Focus on consistency drills and review weak concepts using guided missions."
  };
  res.json(report);
});

const chatSchema = z.object({
  message: z.string().min(2)
});

router.post("/assistant", authMiddleware, (req, res) => {
  const parsed = chatSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid payload" });
  const user = getUser(req.user.sub);
  if (!user) return res.status(404).json({ message: "User not found" });
  const diff = adaptiveDifficulty(user.weeklyStats.accuracy);
  const reply = `Coach mode: Your current level is ${levelFromXp(user.xp)}. Recommended difficulty: ${diff}. Next action: complete one ${diff} Tech challenge and one Soft Skills mission today.`;
  return res.json({ reply });
});

module.exports = router;

