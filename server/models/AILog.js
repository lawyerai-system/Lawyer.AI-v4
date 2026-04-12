const mongoose = require('mongoose');

const aiLogSchema = new mongoose.Schema({
    feature: {
        type: String,
        required: true,
        enum: [
            'Legal AI', 
            'Document Analyzer', 
            'Strategy Generator', 
            'Moot Court Simulator', 
            'Case Outcome Predictor', 
            'AI Court Simulation',
            'Case Builder',
            'IPC Search'
        ]
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    responseTime: {
        type: Number, // in milliseconds
        required: true
    },
    status: {
        type: String,
        enum: ['SUCCESS', 'ERROR'],
        required: true
    },
    errorMessage: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    }
}, { timestamps: true });

// Index for aggregation performance
aiLogSchema.index({ feature: 1, timestamp: -1 });

const AILog = mongoose.model('AILog', aiLogSchema);

module.exports = AILog;
