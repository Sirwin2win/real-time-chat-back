const express = require("express");
const conversationRoutes = require("./routes/conversationRoutes");
const messageRoutes = require("./routes/messageRoutes");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./middlewares/errorHandler");


const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");

const { corsOptions } = require("./config/cors");

const app = express();

app.set("trust proxy", 1);

/* ---------------- SECURITY ---------------- */

app.use(helmet());

/* ---------------- CORS ---------------- */

app.use(cors(corsOptions));

/* ---------------- MIDDLEWARE ---------------- */

app.use(express.json());
app.use(cookieParser());

/* ---------------- ROUTES ---------------- */

app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

/* ---------------- 404 HANDLER ---------------- */
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});
/* ---------------- ERROR HANDLER---------------- */
app.use(errorHandler);
/* ---------------- HEALTH CHECK ---------------- */

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

module.exports = app;