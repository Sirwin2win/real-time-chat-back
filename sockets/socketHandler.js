const Message = require('../models/Message');

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("✅ New client connected:", socket.id);

    // ---------------- Join a Chat Room ----------------
    socket.on("join_chat", ({ senderId, receiverId }) => {
      if (!senderId || !receiverId) {
        return socket.emit("error_message", "Invalid room data");
      }

      const roomID = [senderId, receiverId].sort().join("_");
      socket.join(roomID);

      console.log(`User ${socket.id} joined room: ${roomID}`);
      socket.emit("joined_room", roomID); // Confirm join to the client
    });

    // ---------------- Send Message ----------------
    socket.on("send_message", async (data) => {
      const { senderId, receiverId, text } = data;

      if (!senderId || !receiverId || !text?.trim()) {
        return socket.emit("error_message", "Invalid message data");
      }

      const roomID = [senderId, receiverId].sort().join("_");

      try {
        // Save message to database
        const newMessage = new Message({
          sender: senderId,
          receiver: receiverId,
          text: text
        });
        const savedMessage = await newMessage.save();

        // Broadcast message to all clients in the room, including cross-server via Redis
        socket.to(roomID).emit("receive_message", savedMessage); // other clients
        socket.emit("receive_message", savedMessage); // sender receives confirmation

      } catch (err) {
        console.error("❌ Socket Message Error:", err);
        socket.emit("error_message", "Failed to send message");
      }
    });

    // ---------------- Disconnect ----------------
    socket.on("disconnect", (reason) => {
      console.log(`⚡ Client disconnected: ${socket.id}, reason: ${reason}`);
    });

    // ---------------- Optional: Heartbeat / Ping ----------------
    socket.on("ping_server", () => {
      socket.emit("pong_server");
    });
  });

  // ---------------- Optional: Global Error Handling ----------------
  io.on("error", (err) => {
    console.error("Socket.IO server error:", err);
  });
};

module.exports = socketHandler;