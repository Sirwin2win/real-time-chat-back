const Message = require('../models/Message');

exports.getChatHistory = async (req, res) => {
  const { userId, otherId } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: otherId },
        { sender: otherId, receiver: userId }
      ]
    }).sort({ createdAt: 1 });
    
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const newMessage = new Message(req.body);
    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
};