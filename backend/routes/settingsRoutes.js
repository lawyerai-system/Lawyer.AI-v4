const express = require('express');
const router = express.Router();
const PlatformSettings = require('../models/PlatformSettings');
const Settings = require('../models/Settings');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Public GET route for platform settings (Maintenance check, categories)
router.get('/', async (req, res) => {
    try {
        let aiSettings = await PlatformSettings.findOne();
        if (!aiSettings) {
            aiSettings = await PlatformSettings.create({ aiFeaturesEnabled: true, isMaintenanceMode: false });
        }

        let generalSettings = await Settings.findOne();
        if (!generalSettings) {
            generalSettings = await Settings.create({
                categories: {
                    blog: ['News', 'Case Study', 'Legal Update', 'Advice'],
                    caseLibrary: ['Criminal', 'Civil', 'Family', 'Constitution', 'Corporate']
                }
            });
        }

        res.status(200).json({
            success: true,
            data: {
                aiFeaturesEnabled: aiSettings.aiFeaturesEnabled,
                isMaintenanceMode: aiSettings.isMaintenanceMode || false,
                general: generalSettings
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Protect all other routes - Admin only
router.use(protect);
router.use(restrictTo('admin'));

/**
 * @route   PUT /api/admin/settings/maintenance-toggle
 * @desc    Toggle Maintenance Mode globally
 */
router.put('/maintenance-toggle', async (req, res) => {
    try {
        const { enabled } = req.body;

        if (typeof enabled !== 'boolean') {
            return res.status(400).json({ success: false, message: "Enabled flag must be a boolean" });
        }

        let settings = await PlatformSettings.findOne();
        if (!settings) {
            settings = new PlatformSettings();
        }

        settings.isMaintenanceMode = enabled;
        await settings.save();

        res.status(200).json({
            success: true,
            message: `Maintenance Mode ${enabled ? 'enabled' : 'disabled'} successfully`,
            isMaintenanceMode: settings.isMaintenanceMode
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

/**
 * @route   PUT /api/admin/settings/ai-toggle
 * @desc    Toggle AI features globally
 */
router.put('/ai-toggle', async (req, res) => {
    try {
        const { enabled } = req.body;

        if (typeof enabled !== 'boolean') {
            return res.status(400).json({ success: false, message: "Enabled flag must be a boolean" });
        }

        let settings = await PlatformSettings.findOne();
        if (!settings) {
            settings = new PlatformSettings();
        }

        settings.aiFeaturesEnabled = enabled;
        await settings.save();

        res.status(200).json({
            success: true,
            message: `AI features ${enabled ? 'enabled' : 'disabled'} successfully`,
            aiFeaturesEnabled: settings.aiFeaturesEnabled
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

/**
 * @route   PATCH /api/admin/settings
 * @desc    Update general platform settings (compatibility with old frontend)
 */
router.patch('/', async (req, res) => {
    try {
        let settings = await Settings.findOne();

        if (!settings) {
            settings = new Settings(req.body);
        } else {
            // Merge logic from settingsController
            Object.keys(req.body).forEach(key => {
                if (req.body[key] && typeof req.body[key] === 'object' && !Array.isArray(req.body[key])) {
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
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
