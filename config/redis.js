const { createClient } = require("redis");

const pubClient = createClient({ url: process.env.REDIS_URL });
const subClient = pubClient.duplicate();

pubClient.on("error", (err) => console.error("Redis Pub Client Error:", err));
subClient.on("error", (err) => console.error("Redis Sub Client Error:", err));

async function connectRedis() {
  if (!pubClient.isOpen) await pubClient.connect();
  if (!subClient.isOpen) await subClient.connect();
  console.log("Redis connected");
}

module.exports = { pubClient, subClient, connectRedis };