const PlatformSettings = require('../models/PlatformSettings');

/**
 * Middleware to check if AI features are globally enabled.
 * If disabled, prevents access to AI routes and returns a descriptive error.
 */
const checkAIAccess = async (req, res, next) => {
    try {
        // Find the settings document or use default if none exists
        let settings = await PlatformSettings.findOne();

        // If no settings document exists, AI is enabled by default
        if (!settings) {
            return next();
        }

        if (!settings.aiFeaturesEnabled) {
            return res.status(403).json({
                success: false,
                message: "AI features are temporarily disabled by the administrator. Please try again later.",
                code: "AI_DISABLED"
            });
        }

        next();
    } catch (error) {
        console.error("AI Access Check Error:", error);
        // On error, we fail safe and allow the request to proceed (or change to fail closed if preferred)
        next();
    }
};

module.exports = { checkAIAccess };
