const express = require("express");
const conversationRoutes = require("./routes/conversationRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();
app.use(express.json());

app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);

module.exports = app;