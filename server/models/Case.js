const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Case title is required'],
        trim: true
    },
    year: {
        type: Number,
        required: [true, 'Year is required']
    },
    court: {
        type: String,
        required: [true, 'Court name is required'],
        trim: true
    },
    legalTopic: {
        type: String,
        required: [true, 'Legal topic is required'],
        trim: true
    },
    ipcSections: [{
        type: String,
        trim: true
    }],
    summary: {
        type: String,
        required: [true, 'Case summary is required']
    },
    judgementOutcome: {
        type: String,
        required: [true, 'Judgement outcome is required']
    },
    keyArguments: [{
        type: String,
        trim: true
    }],
    importantPrinciples: [{
        type: String,
        trim: true
    }],
    tags: [{
        type: String,
        lowercase: true,
        trim: true
    }],
    uploader: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Case must have an uploader']
    },
    stars: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    comments: [{
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true
        },
        content: {
            type: String,
            required: true,
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    aiSummary: String,
    suggestedReferences: [{
        type: String,
        trim: true
    }],
    impact: {
        type: String,
        trim: true
    },
    source: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED'],
        default: 'PENDING'
    },
    isImportant: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Indexing for search
caseSchema.index({ title: 'text', summary: 'text', legalTopic: 'text', court: 'text' });

const Case = mongoose.model('Case', caseSchema);

module.exports = Case;
