const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
{
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  ],

  isGroup: {
    type: Boolean,
    default: false
  },

  groupName: {
    type: String
  },

  groupAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message"
  },

  lastMessageText: {
    type: String
  },

  lastMessageSender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  lastMessageAt: {
    type: Date
  },

  unreadCount: {
    type: Map,
    of: Number,
    default: {}
  }

},
{ timestamps: true }
);

conversationSchema.index({ participants: 1 });
conversationSchema.index({ lastMessageAt: -1 });

module.exports = mongoose.model("Conversation", conversationSchema);