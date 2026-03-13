const express = require("express");
const conversationRoutes = require("./routes/conversationRoutes");
const messageRoutes = require("./routes/messageRoutes");
const userRoutes = require("./routes/userRoutes");
const cookieParser = require("cookie-parser");


const app = express();
app.use(express.json());
app.use(cookieParser());


app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

module.exports = app;