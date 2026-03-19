const { Router } = require("express");
const mongoose = require("mongoose");
const { z } = require("zod");
const { authMiddleware, requireRole } = require("../middleware/auth");
const { users, challenges, submissions } = require("../data/store");
const { levelFromXp, awardBadges } = require("../services/gamification");

const router = Router();

router.use(authMiddleware);
router.use(requireRole("admin", "superadmin"));

/* ── Stats Overview ── */
router.get("/stats", (_req, res) => {
  const studentUsers = users.filter((u) => u.role === "user");
  const totalXp = studentUsers.reduce((s, u) => s + u.xp, 0);
  const avgXp = studentUsers.length ? Math.round(totalXp / studentUsers.length) : 0;
  const activeStreaks = studentUsers.filter((u) => u.streak > 0).length;
  const totalSubmissions = submissions.length;
  const totalChallenges = challenges.length;
  const levels = { Beginner: 0, Intermediate: 0, Advanced: 0, Master: 0 };
  studentUsers.forEach((u) => {
    const lvl = levelFromXp(u.xp);
    if (levels[lvl] !== undefined) levels[lvl]++;
  });
  res.json({
    totalUsers: studentUsers.length,
    totalChallenges,
    totalSubmissions,
    avgXp,
    activeStreaks,
    levelDistribution: levels,
    topPerformers: [...studentUsers].sort((a, b) => b.xp - a.xp).slice(0, 5).map((u) => ({ name: u.name, xp: u.xp, level: levelFromXp(u.xp), streak: u.streak }))
  });
});

/* ── User Management ── */
router.get("/users", (req, res) => {
  const { search, role } = req.query;
  let list = users.map((u) => ({ id: u.id, name: u.name, email: u.email, role: u.role, xp: u.xp, streak: u.streak, level: levelFromXp(u.xp), badges: u.badges, joinedAt: u.joinedAt }));
  if (search) {
    const s = search.toLowerCase();
    list = list.filter((u) => u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s));
  }
  if (role) list = list.filter((u) => u.role === role);
  res.json({ items: list, total: list.length });
});

const patchUserSchema = z.object({
  role: z.enum(["user", "admin", "superadmin"]).optional(),
  xp: z.number().min(0).optional(),
  coins: z.number().min(0).optional(),
  streak: z.number().min(0).optional()
});

router.patch("/users/:id", (req, res) => {
  if (req.user.role !== "superadmin") return res.status(403).json({ message: "Super-admin only" });
  const parsed = patchUserSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid payload" });
  const user = users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  Object.assign(user, parsed.data);
  if (parsed.data.xp !== undefined) user.level = levelFromXp(user.xp);
  user.badges = awardBadges(user);
  res.json({ message: "Updated", user: { id: user.id, name: user.name, role: user.role, xp: user.xp, level: user.level } });
});

/* ── Challenge Management ── */
router.get("/challenges", (_req, res) => {
  res.json({ items: challenges, total: challenges.length });
});

const challengeSchema = z.object({
  type: z.enum(["daily", "weekly", "monthly"]),
  title: z.string().min(3),
  subject: z.string().min(2),
  description: z.string().optional().default(""),
  baseXp: z.number().min(1),
  difficulty: z.enum(["easy", "medium", "hard"]),
  timeLimitMin: z.number().min(1)
});

router.post("/challenges", (req, res) => {
  const parsed = challengeSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid payload", errors: parsed.error.issues });
  const id = `custom-${Date.now()}`;
  const challenge = { id, ...parsed.data, isActive: true, createdAt: new Date() };
  challenges.push(challenge);
  res.status(201).json({ message: "Created", challenge });
});

router.put("/challenges/:id", (req, res) => {
  const parsed = challengeSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid payload" });
  const idx = challenges.findIndex((c) => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: "Challenge not found" });
  Object.assign(challenges[idx], parsed.data);
  res.json({ message: "Updated", challenge: challenges[idx] });
});

router.delete("/challenges/:id", (req, res) => {
  const idx = challenges.findIndex((c) => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: "Challenge not found" });
  challenges.splice(idx, 1);
  res.json({ message: "Deleted" });
});

/* ── Submissions ── */
router.get("/submissions", (_req, res) => {
  const recent = submissions.slice(-50).reverse().map((s) => {
    const user = users.find((u) => u.id === s.userId);
    return { ...s, userName: user ? user.name : "Unknown" };
  });
  res.json({ items: recent, total: submissions.length });
});

/* ── System Health (Advanced) ── */
router.get("/system", (req, res) => {
  if (req.user.role !== "superadmin") return res.status(403).json({ message: "Super-admin only" });
  const mem = process.memoryUsage();
  res.json({
    uptime: process.uptime(),
    memory: { rss: mem.rss, heapUsed: mem.heapUsed, heapTotal: mem.heapTotal },
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    dbName: mongoose.connection.name || "N/A",
    nodeVersion: process.version,
    platform: process.platform,
    userCount: users.length,
    challengeCount: challenges.length,
    submissionCount: submissions.length,
    env: process.env.NODE_ENV || "development"
  });
});

/* ── Difficulty Tuning (Advanced) ── */
const tuningSchema = z.object({
  easyThreshold: z.number().min(0).max(100).optional(),
  hardThreshold: z.number().min(0).max(100).optional(),
  streakBonusMultiplier: z.number().min(1).max(5).optional()
});

let difficultyConfig = { easyThreshold: 65, hardThreshold: 85, streakBonusMultiplier: 1.5 };

router.get("/tuning", (req, res) => {
  if (req.user.role !== "superadmin") return res.status(403).json({ message: "Super-admin only" });
  res.json(difficultyConfig);
});

router.put("/tuning", (req, res) => {
  if (req.user.role !== "superadmin") return res.status(403).json({ message: "Super-admin only" });
  const parsed = tuningSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid payload" });
  Object.assign(difficultyConfig, parsed.data);
  res.json({ message: "Updated", config: difficultyConfig });
});

module.exports = router;
