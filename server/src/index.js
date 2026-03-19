require("dotenv").config();
const http = require("http");
const { app } = require("./app");
const { connectDb } = require("./config/db");
const { setupSocket } = require("./socket");

const PORT = Number(process.env.PORT || 8080);

const start = async () => {
  const db = await connectDb();
  if (!db.connected) {
    console.warn(`DB disconnected: ${db.reason}`);
  }
  const server = http.createServer(app);
  setupSocket(server);
  server.listen(PORT, () => {
    console.log(`API running at http://localhost:${PORT}`);
  });
};

start();

