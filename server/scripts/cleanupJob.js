const Message = require('../models/Message');
const ChatSession = require('../models/ChatSession');
const MootCourtSession = require('../models/MootCourtSession');

const runCleanup = async () => {
    try {
        const threshold = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000); // 15 days

        // ONLY Clean Virtual Courtroom messages (Temporary & Encrypted)
        const msgResult = await Message.deleteMany({ createdAt: { $lt: threshold } });

        if (msgResult.deletedCount > 0) {
            console.log(`[Cleanup] Maintenance completed. Deleted: ${msgResult.deletedCount} Virtual Courtroom messages.`);
        }
    } catch (err) {
        console.error('[Cleanup] Error during maintenance:', err);
    }
};

const startCleanupJob = () => {
    console.log('[Cleanup] Scheduled job initialized: Deleting data older than 15 days.');

    // Run once on startup after a small delay to ensure DB connection
    setTimeout(runCleanup, 5000);

    // Run every 24 hours
    setInterval(runCleanup, 24 * 60 * 60 * 1000);
};

module.exports = startCleanupJob;
