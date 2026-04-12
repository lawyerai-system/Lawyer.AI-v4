const AILog = require('../models/AILog');

/**
 * Logs an AI feature request to the database
 * @param {string} feature - The name of the AI feature
 * @param {string} userId - The ID of the user who made the request
 * @param {number} startTime - Performance.now() or new Date().getTime() at start
 * @param {boolean} success - Whether the request was successful
 * @param {string} [error] - Error message if applicable
 */
const logAIUsage = async (feature, userId, startTime, success, error = null) => {
    try {
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        await AILog.create({
            feature,
            userId,
            responseTime,
            status: success ? 'SUCCESS' : 'ERROR',
            errorMessage: error,
            timestamp: new Date()
        });
    } catch (err) {
        // We don't want to crash the main app if logging fails, but we should know
        console.error('CRITICAL: AI Logging Failed:', err.message);
    }
};

module.exports = logAIUsage;
