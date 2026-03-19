const { Router } = require("express");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const { users, createUser } = require("../data/store");

const router = Router();

const authSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email(),
  password: z.string().min(6)
});

router.post("/register", (req, res) => {
  const parsed = authSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid payload" });
  const payload = parsed.data;
  const existing = users.find((u) => u.email === payload.email.toLowerCase());
  if (existing) return res.status(409).json({ message: "Email already exists" });
  const user = createUser({
    name: payload.name || "Student",
    email: payload.email,
    password: payload.password
  });
  users.push(user);
  const token = jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET || "dev-secret", { expiresIn: "7d" });
  return res.status(201).json({ token, user: { ...user, password: undefined } });
});

router.post("/login", (req, res) => {
  const parsed = authSchema.omit({ name: true }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid payload" });
  const payload = parsed.data;
  const user = users.find((u) => u.email === payload.email.toLowerCase() && u.password === payload.password);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  const token = jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET || "dev-secret", { expiresIn: "7d" });
  return res.json({ token, user: { ...user, password: undefined } });
});

module.exports = router;

