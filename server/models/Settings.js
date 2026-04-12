const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  features: {
    legalAI: { type: Boolean, default: true },
    docAnalyzer: { type: Boolean, default: true },
    strategyGenerator: { type: Boolean, default: true },
    mootCourt: { type: Boolean, default: true },
    outcomePredictor: { type: Boolean, default: true },
    judicialSimulation: { type: Boolean, default: true }
  },
  categories: {
    blog: [{ type: String }],
    caseLibrary: [{ type: String }]
  },
  systemDefaults: {
    maxUploadSize: { type: Number, default: 5 }, // in MB
    itemsPerPage: { type: Number, default: 10 }
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
