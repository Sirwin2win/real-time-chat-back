const dotenv = require("dotenv").config();
const http = require("http");
const cors = require('cors');
const connectDB = require("./config/db");
const { connectRedis } = require("./config/redis");
const app = require("./app");
const initSocket = require("./socket/socket");

const server = http.createServer(app);

async function startServer() {
  try {
    await connectDB();
    await connectRedis();
    initSocket(server);

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Server startup error:", err);
    process.exit(1);
  }
}

startServer();