const Conversation = require("../models/Conversation");

exports.createConversation = async (req, res) => {
  try {
    const { participants, isGroup, groupName, groupAdmin } = req.body;

    if (!participants || participants.length < 1)
      return res.status(400).json({ message: "Participants are required" });

    if (isGroup && !groupName)
      return res.status(400).json({ message: "Group name is required" });

    if (isGroup && !groupAdmin)
      return res.status(400).json({ message: "Group admin is required" });

    const conversation = new Conversation({ participants, isGroup, groupName, groupAdmin });
    const saved = await conversation.save();

    res.status(201).json(saved);
  } catch (error) {
    console.error("Create Conversation Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getUserConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ participants: { $in: [req.params.userId] } })
      .populate("participants", "username avatar _id")
      .populate("groupAdmin", "username avatar _id")
      .populate("lastMessage", "text sender createdAt")
      .sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (error) {
    console.error("Get User Conversations Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};