const Contact = require('../models/Contact');
const jwt = require('jsonwebtoken');

const contactController = {
  submitContact: async (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        role,
        message,
        issueType
      } = req.body;

      // Validate required fields
      if (!name || !email || !phone || !role || !message) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      // Extract user ID from token if available
      let userId = null;
      // ... (existing logic for userId)
      const authHeader = req.headers.authorization;
      if (authHeader) {
        const token = authHeader.split(' ')[1];
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          userId = decoded.id;
        } catch (tokenError) {
          console.warn('Invalid token provided');
        }
      }

      // Create contact submission
      const newContact = new Contact({
        user: userId,
        name,
        email,
        phone,
        role,
        message,
        issueType: issueType || 'General Contact'
      });

      // Save contact submission
      await newContact.save();

      res.status(201).json({
        success: true,
        message: 'Support request submitted successfully',
        data: {
          id: newContact._id,
          name: newContact.name,
          email: newContact.email,
          status: newContact.status,
          issueType: newContact.issueType
        }
      });
    } catch (error) {
      console.error('Error in support submission:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  // Retrieve submissions for admin
  getContactSubmissions: async (req, res) => {
    try {
      const { issueType } = req.query;
      let query = {};
      if (issueType && issueType !== 'All') {
        query.issueType = issueType;
      }

      const contacts = await Contact.find(query)
        .sort({ createdAt: -1 })
        .populate('user', 'name email role');

      res.status(200).json({
        success: true,
        data: contacts
      });
    } catch (error) {
      console.error('Error retrieving support submissions:', error);
      res.status(500).json({
        success: false,
        message: 'Unable to retrieve submissions'
      });
    }
  },

  updateStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ['Pending', 'In Review', 'Resolved'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status' });
      }

      const contact = await Contact.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });

      res.status(200).json({ success: true, data: contact });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  updateIssueType: async (req, res) => {
    try {
      const { id } = req.params;
      const { issueType } = req.body;

      const contact = await Contact.findByIdAndUpdate(
        id,
        { issueType },
        { new: true }
      );

      if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });

      res.status(200).json({ success: true, data: contact });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  deleteContact: async (req, res) => {
    try {
      const { id } = req.params;
      await Contact.findByIdAndDelete(id);
      res.status(200).json({ success: true, message: 'Contact deleted' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = contactController;
