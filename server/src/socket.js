const { Server } = require("socket.io");

const setupSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] }
  });

  io.on("connection", (socket) => {
    socket.on("join", (room) => {
      socket.join(room);
    });

    socket.on("health_check", (ack) => {
      if (typeof ack === "function") ack({ status: "ok", t: Date.now() });
    });

    socket.on("peer_message", (payload) => {
      io.to(payload.room).emit("peer_message", {
        ...payload,
        createdAt: Date.now()
      });
    });
  });
};

module.exports = { setupSocket };

