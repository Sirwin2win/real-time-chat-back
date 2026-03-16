const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, sender, text, messageType, attachments } = req.body;

    if (!conversationId || !sender || !text) {
      return res.status(400).json({ message: "conversationId, sender and text are required" });
    }

    const message = new Message({ conversationId, sender, text, messageType, attachments });
    const saved = await message.save();

    // Update lastMessage in conversation
await Conversation.findByIdAndUpdate(conversationId, {
  lastMessage: saved._id,
  updatedAt: new Date(),
});

    res.status(201).json(saved);
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