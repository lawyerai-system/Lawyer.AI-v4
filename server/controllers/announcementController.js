const Announcement = require('../models/Announcement');

const announcementController = {
  // Admin: Create new announcement
  createAnnouncement: async (req, res) => {
    try {
      const { title, content, type, expiresAt } = req.body;
      const announcement = await Announcement.create({
        title,
        content,
        type,
        expiresAt: expiresAt || undefined,
        createdBy: req.user.id
      });

      res.status(201).json({
        success: true,
        data: announcement
      });

      // Emit real-time announcement if active
      if (announcement.isActive) {
        const io = req.app.get('io');
        if (io) {
          io.emit('NEW_ANNOUNCEMENT', announcement);
        }
      }
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Admin: Get all announcements (including inactive)
  getAllAnnouncements: async (req, res) => {
    try {
      const announcements = await Announcement.find()
        .populate('createdBy', 'name')
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        data: announcements
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Admin: Update announcement
  updateAnnouncement: async (req, res) => {
    try {
      const announcement = await Announcement.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!announcement) {
        return res.status(404).json({ success: false, message: 'Announcement not found' });
      }

      res.status(200).json({
        success: true,
        data: announcement
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Admin: Delete announcement
  deleteAnnouncement: async (req, res) => {
    try {
      const announcement = await Announcement.findByIdAndDelete(req.params.id);
      if (!announcement) {
        return res.status(404).json({ success: false, message: 'Announcement not found' });
      }

      res.status(200).json({
        success: true,
        message: 'Announcement deleted successfully'
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // User: Get active announcements
  getActiveAnnouncements: async (req, res) => {
    try {
      const announcements = await Announcement.find({ 
        isActive: true,
        $or: [
          { expiresAt: { $exists: false } },
          { expiresAt: null },
          { expiresAt: { $gt: new Date() } }
        ]
      }).sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        data: announcements
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = announcementController;
