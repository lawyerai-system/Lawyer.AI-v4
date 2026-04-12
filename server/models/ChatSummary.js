const mongoose = require('mongoose');

const chatSummarySchema = new mongoose.Schema({
    chatId: {
        type: String, // Can be room ID or a combined ID of two users (e.g., sorted user IDs)
        required: true,
        unique: true
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    legalIssue: String,
    keyArguments: [String],
    ipcSections: [String],
    summary: String,
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ChatSummary', chatSummarySchema);
