const express = require('express');
const router = express.Router();
const chatbotService = require('../services/chatbot');

// POST /api/chat - Send message and get response
router.post('/', async (req, res) => {
  try {
    const { message, file, language } = req.body;
    
    if (!message || message.trim() === '') {
      return res.status(400).json({
        error: 'Message is required'
      });
    }
    
    // Use session ID to maintain conversation context
    const sessionId = req.sessionID;
    
    // Generate response (with file and language if provided)
    const result = await chatbotService.generateResponse(message, sessionId, file, language);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'An error occurred while processing your message'
    });
  }
});

// DELETE /api/chat/history - Clear conversation history
router.delete('/history', (req, res) => {
  try {
    const sessionId = req.sessionID;
    chatbotService.clearHistory(sessionId);
    
    res.json({
      success: true,
      message: 'Conversation history cleared'
    });
  } catch (error) {
    console.error('Error clearing history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear conversation history'
    });
  }
});

module.exports = router;
