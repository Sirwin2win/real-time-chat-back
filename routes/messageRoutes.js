const express = require('express');
const { getChatHistory, sendMessage } = require('../controllers/messageController');
const router = express.Router();


// GET /api/messages/history/user123/user456
router.get('/chat/:userId/:otherId',getChatHistory);

// POST /api/messages (Optional, if you want to save via HTTP instead of Socket)
router.post('/chat', sendMessage);

module.exports = router;