const Conversation = require("../models/Conversation");
const io = require("../socket/socket"); // your socket.io instance (with Redis adapter)

// Create a conversation and emit real-time updates
exports.createConversation = async (req, res) => {
  try {
    let { participants, isGroup, groupName, groupAdmin } = req.body;

    if (!participants || participants.length < 1) {
      return res.status(400).json({ message: "Participants are required" });
    }

    // Remove duplicates
    participants = [...new Set(participants)];

    // Sort for 1-to-1 conversations
    if (!isGroup && participants.length === 2) participants.sort();

    if (isGroup && !groupName)
      return res.status(400).json({ message: "Group name is required" });
    if (isGroup && !groupAdmin)
      return res.status(400).json({ message: "Group admin is required" });

    // Check if private conversation exists
    if (!isGroup && participants.length === 2) {
      const existing = await Conversation.findOne({
        isGroup: false,
        participants: { $all: participants, $size: 2 }
      })
        .populate("participants", "username avatar _id")
        .populate("lastMessage");

      if (existing) {
        return res.status(200).json(existing);
      }
    }

    // Create new conversation
    const conversation = new Conversation({
      participants,
      isGroup,
      groupName,
      groupAdmin
    });

    const saved = await conversation.save();

    // Populate for emitting
    const populated = await saved
      .populate("participants", "username avatar _id")
      .populate("groupAdmin", "username avatar")
      .execPopulate();

    // Emit real-time event to all participants using Socket.IO + Redis
    participants.forEach(userId => {
      // `io.to(userId)` works if each user joins a room with their own userId
      io.to(userId.toString()).emit("newConversation", populated);
    });

    res.status(201).json(populated);

  } catch (error) {
    console.error("Create Conversation Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};



exports.getUserConversations = async (req, res) => {
  try {
    const userId = req.params.userId;

    const conversations = await Conversation.find({
      participants: userId
    })
      .populate("participants", "username avatar")
      .populate("groupAdmin", "username avatar")
      .populate("lastMessage", "text sender createdAt")
      .sort({ updatedAt: -1 })
      .limit(50)
      .lean();

    const formatted = conversations.map(conv => {
      if (!conv.isGroup) {
        const otherUser = conv.participants.find(
          p => p._id.toString() !== userId
        );

        return {
          ...conv,
          otherUser
        };
      }

      return conv;
    });

    res.json(formatted);

  } catch (error) {
    console.error("Get User Conversations Error:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};