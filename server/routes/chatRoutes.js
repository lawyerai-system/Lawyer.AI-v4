const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { checkAIAccess } = require('../middleware/aiCheckMiddleware');
const { sendMessage, getSessions, getSession, deleteSession, createSession, getSectionDetails } = require('../controllers/chatController');

const router = express.Router();

router.post('/send', protect, checkAIAccess, sendMessage);
router.post('/session', protect, checkAIAccess, createSession);
router.get('/sessions', protect, getSessions);
router.get('/session/:sessionId', protect, getSession);
router.delete('/session/:sessionId', protect, deleteSession);
router.post('/session', protect, createSession);
router.get('/section', protect, getSectionDetails);

module.exports = router;
