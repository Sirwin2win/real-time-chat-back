const { Server } = require("socket.io");
const { pubClient, subClient } = require("../config/redis");

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: [process.env.FRONTEND_URL],
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join", (conversationId) => {
      socket.join(conversationId);
    });

    socket.on("chat message", async (msg, callback) => {
      try {
        const payload = JSON.stringify(msg);
        await pubClient.publish("chat", payload);
        callback && callback({ status: "ok" });
      } catch (err) {
        console.error("Publish failed:", err);
        callback && callback({ status: "error", error: err.message });
      }
    });

    socket.on("disconnect", () => console.log("User disconnected:", socket.id));
  });

  subClient.on("error", (err) => console.error("Redis Sub Error:", err));

  subClient.subscribe("chat", (message) => {
    try {
      const payload = JSON.parse(message);
      io.to(payload.conversationId).emit("chat message", payload);
    } catch (err) {
      console.error("Failed to parse Redis message:", err);
    }
  });
}

module.exports = initSocket;