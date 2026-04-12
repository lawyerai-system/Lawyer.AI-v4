const mongoose = require('mongoose');

const MootCourtSessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    role: {
        type: String,
        enum: ['Defense Lawyer', 'Prosecutor'],
        required: true
    },
    difficulty: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        required: true
    },
    caseDetails: {
        title: String,
        background: String,
        relevantSections: [String],
        evidence: [String],
        witnesses: [String]
    },
    messages: [{
        sender: {
            type: String,
            enum: ['AI Judge', 'AI Opposing Lawyer', 'User']
        },
        content: String,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    status: {
        type: String,
        enum: ['active', 'completed'],
        default: 'active'
    },
    evaluation: {
        score: Number,
        ipcUse: String,
        clarity: String,
        suggestions: String
    }
}, { timestamps: true });

module.exports = mongoose.model('MootCourtSession', MootCourtSessionSchema);
