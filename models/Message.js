const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: String,
  messageType: { type: String, enum: ["text", "image", "video", "file"], default: "text" },
  attachments: [String],
  status: { type: String, enum: ["sent", "delivered", "read"], default: "sent" },
  seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  edited: { type: Boolean, default: false }
}, { timestamps: true });

MessageSchema.index({ conversationId: 1, createdAt: -1 });

module.exports = mongoose.model("Message", MessageSchema);