const express = require('express');
const router = express.Router();
const courtroomController = require('../controllers/courtroomController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.use(protect);
router.use(restrictTo('civilian', 'lawyer'));

// READ
router.get('/:userId/contacts', courtroomController.getUserContacts);
router.get('/:userId/messages', courtroomController.getUserMessages);

// CREATE
router.post('/:userId/message', courtroomController.postUserMessage);
router.post('/:userId/room', courtroomController.postRoom);

// UPDATE
router.put('/:userId/messages/status', courtroomController.updateMessageReadStatus);
router.put('/:userId/messages/pin/:messageId', courtroomController.toggleMessagePin);
router.patch('/:userId/messages/:messageId', courtroomController.editMessage);
router.delete('/:userId/messages/:messageId', courtroomController.deleteMessage);

// AI & SUMMARY
router.post('/:userId/chat/summary', courtroomController.generateChatSummary);
router.get('/:userId/chat/summary', courtroomController.getChatSummary);
router.post('/:userId/chat/suggestions', courtroomController.getLegalSuggestions);

module.exports = router;
