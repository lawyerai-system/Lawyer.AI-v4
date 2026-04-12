const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    reporter: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Report must have a reporter']
    },
    reportType: {
        type: String,
        required: [true, 'Report must have a type'],
        enum: ['User', 'Blog', 'Legal Information', 'Case Library', 'Other']
    },
    targetId: {
        type: mongoose.Schema.ObjectId,
        required: [true, 'Report must have a target (e.g., user ID or blog ID)']
    },
    targetName: {
        type: String, // Cached name for quick display (e.g. Blog Title or Username)
        required: true
    },
    reason: {
        type: String,
        required: [true, 'Please provide a reason for the report'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Reviewed', 'Resolved', 'Dismissed'],
        default: 'Pending'
    },
    adminAction: {
        type: String,
        enum: ['None', 'Warned User', 'Removed Content', 'Suspended User', 'Banned'],
        default: 'None'
    },
    resolvedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    resolvedAt: Date
}, { timestamps: true });

// Index for status and type for admin filtering
reportSchema.index({ status: 1, reportType: 1 });

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
