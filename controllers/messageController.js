const mongoose = require("mongoose");
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, sender, text } = req.body;

    if (!conversationId || !sender || !text) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Convert to ObjectId
    const conversationObjId = mongoose.Types.ObjectId(conversationId);
    const senderObjId = mongoose.Types.ObjectId(sender);

    // Check conversation exists
    const conversation = await Conversation.findById(conversationObjId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Create message
    const message = await Message.create({
      conversationId: conversationObjId,
      sender: senderObjId,
      text
    });

    // Update conversation
    conversation.lastMessage = message._id;
    conversation.lastMessageText = text;
    conversation.lastMessageSender = senderObjId;
    conversation.lastMessageAt = new Date();

    await conversation.save();

    res.status(201).json(message);

  } catch (error) {
    console.error("Send Message Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    if (!conversationId) {
      return res.status(400).json({ message: "conversationId is required" });
    }
    const messages = await Message.find({ conversationId })
      .populate("sender", "username avatar _id")
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json(messages);
  } catch (error) {
    console.error("Get Messages Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};