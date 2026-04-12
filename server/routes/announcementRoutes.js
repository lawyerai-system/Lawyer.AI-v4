const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Public/User route: Get active announcements
router.get('/active', protect, announcementController.getActiveAnnouncements);

// Admin routes: Manage announcements
router.use(protect);
router.use(restrictTo('admin'));

router.get('/', announcementController.getAllAnnouncements);
router.post('/', announcementController.createAnnouncement);
router.patch('/:id', announcementController.updateAnnouncement);
router.delete('/:id', announcementController.deleteAnnouncement);

module.exports = router;
