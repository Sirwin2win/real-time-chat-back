require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { createClient } = require('redis');
const { createAdapter } = require('@socket.io/redis-adapter');

const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const socketHandler = require('./sockets/socketHandler');

// ---------- Connect Database ----------
connectDB();

// ---------- Create Express App ----------
const app = express();
app.use(express.json());

// ---------- API Routes ----------
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

// ---------- Create HTTP Server ----------
const server = http.createServer(app);

// ---------- Create Socket.IO Server ----------
const io = new Server(server, {
  cors: { origin: "*" }, // Update with your frontend URL in production
});

// ---------- Setup Redis Adapter for Socket.IO ----------
const setupRedisAdapter = async () => {
  try {
    const pubClient = createClient({ url: process.env.REDIS_URL });
    const subClient = pubClient.duplicate();

    await pubClient.connect();
    await subClient.connect();

    io.adapter(createAdapter(pubClient, subClient));
    console.log('✅ Socket.IO Redis adapter connected');
  } catch (err) {
    console.error('❌ Redis Adapter Error:', err);
  }
};

// Initialize Redis Adapter if REDIS_URL exists
if (process.env.REDIS_URL) {
  setupRedisAdapter();
}

// ---------- Initialize Socket.IO Logic ----------
socketHandler(io);

// ---------- Start Server ----------
const PORT = process.env.PORT || 7000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});