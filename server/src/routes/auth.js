const { Router } = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { z } = require("zod");
const { users, createUser } = require("../data/store");

const router = Router();
const SECRET = () => process.env.JWT_SECRET || "dev-secret";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

router.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid payload" });
  const payload = parsed.data;
  const existing = users.find((u) => u.email === payload.email.toLowerCase());
  if (existing) return res.status(409).json({ message: "Email already exists" });
  const hashed = await bcrypt.hash(payload.password, 10);
  const user = createUser({ name: payload.name, email: payload.email, password: hashed });
  users.push(user);
  const token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, SECRET(), { expiresIn: "7d" });
  return res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, level: user.level, xp: user.xp } });
});

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid payload" });
  const payload = parsed.data;
  const user = users.find((u) => u.email === payload.email.toLowerCase());
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  const match = await bcrypt.compare(payload.password, user.password);
  if (!match) return res.status(401).json({ message: "Invalid credentials" });
  const token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, SECRET(), { expiresIn: "7d" });
  return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, level: user.level, xp: user.xp } });
});

module.exports = router;
