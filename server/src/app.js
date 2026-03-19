const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const authRoutes = require("./routes/auth");
const platformRoutes = require("./routes/platform");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.json({ name: "Gamified Learning API", status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api", platformRoutes);

module.exports = { app };

