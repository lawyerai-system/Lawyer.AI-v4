const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  issueType: {
    type: String,
    enum: ['General Contact', 'Technical Issue', 'Report User', 'Feature Request', 'Feedback'],
    default: 'General Contact'
  },
  status: {
    type: String,
    enum: ['Pending', 'In Review', 'Resolved'],
    default: 'Pending'
  },
  adminResponse: {
    text: String,
    respondedAt: Date,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Contact', contactSchema);
