const jwt = require("jsonwebtoken");

const SECRET = () => process.env.JWT_SECRET || "dev-secret";

const authMiddleware = (req, res, next) => {
  const auth = req.headers.authorization || "";
  if (!auth.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = auth.replace("Bearer ", "");
  try {
    const payload = jwt.verify(token, SECRET());
    req.user = payload;
    return next();
  } catch (_error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: insufficient permissions" });
    }
    return next();
  };
};

module.exports = { authMiddleware, requireRole };
