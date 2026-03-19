const { Router } = require("express");
const mongoose = require("mongoose");
const { z } = require("zod");
const { authMiddleware } = require("../middleware/auth");
const { users, challenges, submissions } = require("../data/store");
const { levelFromXp, nextLevel, getLevelInfo, adaptiveDifficulty, awardBadges, streakMultiplier, checkStreak, getSkillTree, ALL_BADGES } = require("../services/gamification");

const router = Router();

const getUser = (id) => users.find((u) => u.id === id);

/* ── Health ── */
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

/* ── Dashboard ── */
router.get("/dashboard", authMiddleware, (req, res) => {
  const user = getUser(req.user.sub);
  if (!user) return res.status(404).json({ message: "User not found" });
  user.level = levelFromXp(user.xp);
  user.badges = awardBadges(user);
  const levelInfo = getLevelInfo(user.xp);
  const streakInfo = checkStreak(user.streakLastDate);
  const mult = streakMultiplier(user.streak);
  return res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      level: user.level,
      xp: user.xp,
      coins: user.coins,
      streak: user.streak,
      badges: user.badges,
      joinedAt: user.joinedAt
    },
    progress: {
      nextLevel: levelInfo.next.name,
      remainingXp: Math.max(levelInfo.next.minXp - user.xp, 0),
      levelProgress: levelInfo.progress,
      proficiency: user.proficiency,
      streakMultiplier: mult,
      streakActive: streakInfo.active || user.streak > 0
    },
    activeChallenges: challenges.filter((c) => !user.completedChallenges.includes(c.id)).slice(0, 6).map((c) => ({
      ...c,
      adaptiveDifficulty: adaptiveDifficulty(user.weeklyStats.accuracy)
    }))
  });
});

/* ── Profile ── */
router.get("/profile", authMiddleware, (req, res) => {
  const user = getUser(req.user.sub);
  if (!user) return res.status(404).json({ message: "User not found" });
  user.level = levelFromXp(user.xp);
  user.badges = awardBadges(user);
  const levelInfo = getLevelInfo(user.xp);
  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      level: user.level,
      xp: user.xp,
      coins: user.coins,
      streak: user.streak,
      badges: user.badges,
      totalChallengesCompleted: user.totalChallengesCompleted || user.completedChallenges.length,
      joinedAt: user.joinedAt
    },
    allBadges: ALL_BADGES,
    levelInfo,
    proficiency: user.proficiency,
    weeklyStats: user.weeklyStats
  });
});

/* ── Skill Tree ── */
router.get("/skill-tree", authMiddleware, (req, res) => {
  const user = getUser(req.user.sub);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ skillTree: getSkillTree(user.xp) });
});

/* ── Streak Info ── */
router.get("/streak-info", authMiddleware, (req, res) => {
  const user = getUser(req.user.sub);
  if (!user) return res.status(404).json({ message: "User not found" });
  const info = checkStreak(user.streakLastDate);
  res.json({
    streak: user.streak,
    active: info.active || user.streak > 0,
    multiplier: streakMultiplier(user.streak),
    nextMilestone: user.streak < 3 ? 3 : user.streak < 7 ? 7 : user.streak < 14 ? 14 : user.streak < 30 ? 30 : null,
    nextMultiplier: user.streak < 3 ? 1.25 : user.streak < 7 ? 1.5 : user.streak < 14 ? 1.75 : user.streak < 30 ? 2.0 : null
  });
});

/* ── Challenges ── */
router.get("/challenges", authMiddleware, (req, res) => {
  const user = getUser(req.user.sub);
  if (!user) return res.status(404).json({ message: "User not found" });
  const recommendedDifficulty = adaptiveDifficulty(user.weeklyStats.accuracy);
  const items = challenges.map((challenge) => ({
    ...challenge,
    adaptiveDifficulty: recommendedDifficulty,
    completed: user.completedChallenges.includes(challenge.id)
  }));
  res.json({ items });
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

  const mult = streakMultiplier(user.streak);
  const speedScore = Math.max(40, Math.round((challenge.timeLimitMin / parsed.data.timeSpentMin) * 100));
  const rawXp = Math.max(20, Math.round(challenge.baseXp * (parsed.data.accuracy / 100)));
  const earnedXp = Math.round(rawXp * mult);
  const earnedCoins = Math.max(10, Math.round(earnedXp / 4));

  user.xp += earnedXp;
  user.coins += earnedCoins;
  user.streak += 1;
  user.streakLastDate = new Date();
  user.level = levelFromXp(user.xp);
  user.totalChallengesCompleted = (user.totalChallengesCompleted || 0) + 1;

  if (!user.completedChallenges.includes(challenge.id)) {
    user.completedChallenges.push(challenge.id);
  }

  // Update proficiency based on subject
  const subjectKey = challenge.subject === "Tech" ? "tech" : challenge.subject === "Aptitude" ? "aptitude" : "softSkills";
  user.proficiency[subjectKey] = Math.min(100, user.proficiency[subjectKey] + Math.round(parsed.data.accuracy / 20));

  user.weeklyStats = {
    accuracy: Math.round((user.weeklyStats.accuracy + parsed.data.accuracy) / 2),
    speed: Math.round((user.weeklyStats.speed + speedScore) / 2),
    consistency: Math.min(100, user.weeklyStats.consistency + 2)
  };
  user.badges = awardBadges(user);

  // Track submission
  const submission = {
    id: `sub-${Date.now()}`,
    userId: user.id,
    challengeId: challenge.id,
    challengeTitle: challenge.title,
    accuracy: parsed.data.accuracy,
    timeSpentMin: parsed.data.timeSpentMin,
    earnedXp,
    earnedCoins,
    submittedAt: new Date()
  };
  submissions.push(submission);

  const isLevelUp = user.level !== levelFromXp(user.xp - earnedXp);

  return res.json({
    earnedXp,
    earnedCoins,
    streakMultiplier: mult,
    level: user.level,
    isLevelUp,
    streak: user.streak,
    badges: user.badges,
    newBadges: user.badges.filter((b) => !(awardBadges({ ...user, xp: user.xp - earnedXp, streak: user.streak - 1, totalChallengesCompleted: (user.totalChallengesCompleted || 1) - 1 }).includes(b)))
  });
});

/* ── Leaderboard ── */
router.get("/leaderboard", authMiddleware, (req, res) => {
  const ranks = users
    .filter((u) => u.role === "user")
    .map((user) => ({ id: user.id, name: user.name, xp: user.xp, streak: user.streak, level: levelFromXp(user.xp), badges: user.badges }))
    .sort((a, b) => b.xp - a.xp)
    .map((user, index) => ({ rank: index + 1, ...user }));
  res.json({ items: ranks });
});

/* ── Analytics ── */
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
    improvementRate: Math.min(100, Math.round(((user.weeklyStats.accuracy + user.weeklyStats.speed + user.weeklyStats.consistency) / 3))),
    feedback: user.weeklyStats.accuracy > 80
      ? "Great momentum! Push into advanced challenges to maximize growth. Your consistency is paying off — consider tackling a monthly capstone."
      : user.weeklyStats.accuracy > 60
        ? "Solid progress. Focus on accuracy drills and review weak concept areas. Try the daily challenges to build momentum."
        : "Focus on consistency drills and review weak concepts using guided missions. Start with easy daily challenges to build confidence."
  };
  res.json(report);
});

/* ── AI Assistant ── */
const chatSchema = z.object({
  message: z.string().min(2)
});

router.post("/assistant", authMiddleware, (req, res) => {
  const parsed = chatSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid payload" });
  const user = getUser(req.user.sub);
  if (!user) return res.status(404).json({ message: "User not found" });

  const diff = adaptiveDifficulty(user.weeklyStats.accuracy);
  const level = levelFromXp(user.xp);
  const mult = streakMultiplier(user.streak);
  const msg = parsed.data.message.toLowerCase();

  let reply;
  if (msg.includes("streak") || msg.includes("consistency")) {
    reply = `🔥 Your current streak is ${user.streak} days (${mult}x XP multiplier). ${user.streak >= 7 ? "Amazing consistency! Keep it going for even bigger rewards." : "Try to complete at least one challenge daily to build your streak. At 7 days you'll unlock the 1.5x XP multiplier!"}`;
  } else if (msg.includes("improve") || msg.includes("better") || msg.includes("growth")) {
    const weakest = Object.entries(user.proficiency).sort(([,a], [,b]) => a - b)[0];
    reply = `📊 Your weakest area is ${weakest[0]} at ${weakest[1]}%. I recommend focusing on ${weakest[0]} challenges this week. Try the ${diff} difficulty ones first — your adaptive difficulty suggests that's your sweet spot.`;
  } else if (msg.includes("badge") || msg.includes("achievement")) {
    reply = `🏆 You currently have ${user.badges.length} badges: ${user.badges.join(", ") || "None yet!"}. Next badges to unlock: ${user.streak < 7 ? "Consistency King (7-day streak)" : user.totalChallengesCompleted < 20 ? "Mission Machine (20 challenges)" : "Keep pushing for rare badges!"}`;
  } else if (msg.includes("challenge") || msg.includes("recommend") || msg.includes("what should")) {
    reply = `🎯 Based on your ${user.weeklyStats.accuracy}% accuracy, I recommend ${diff} challenges. Your level is ${level}. Next action: complete one ${diff} Tech challenge and one Soft Skills mission today to boost both proficiency areas.`;
  } else {
    reply = `🧠 Coach mode active! Your current level is ${level} with ${user.xp} XP. Recommended difficulty: ${diff}. Streak multiplier: ${mult}x. You've completed ${user.totalChallengesCompleted || 0} total challenges. Ask me about streaks, improvements, badges, or challenge recommendations!`;
  }

  return res.json({ reply });
});

module.exports = router;
