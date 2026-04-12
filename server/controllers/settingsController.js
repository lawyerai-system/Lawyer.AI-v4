const Settings = require('../models/Settings');

const settingsController = {
  // Get platform settings
  getSettings: async (req, res) => {
    try {
      let settings = await Settings.findOne();
      
      // If no settings exist, create default ones
      if (!settings) {
        settings = await Settings.create({
          categories: {
            blog: ['News', 'Case Study', 'Legal Update', 'Advice'],
            caseLibrary: ['Criminal', 'Civil', 'Family', 'Constitution', 'Corporate']
          }
        });
      }

      res.status(200).json({
        success: true,
        data: settings
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Update platform settings
  updateSettings: async (req, res) => {
    try {
      let settings = await Settings.findOne();
      
      if (!settings) {
        settings = new Settings(req.body);
      } else {
        // Simple merge/update
        Object.keys(req.body).forEach(key => {
          if (typeof req.body[key] === 'object' && !Array.isArray(req.body[key])) {
            settings[key] = { ...settings[key].toObject(), ...req.body[key] };
          } else {
            settings[key] = req.body[key];
          }
        });
      }

      settings.updatedBy = req.user.id;
      await settings.save();

      res.status(200).json({
        success: true,
        data: settings
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = settingsController;
