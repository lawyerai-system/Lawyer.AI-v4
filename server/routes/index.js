const express = require('express');
const router = express.Router();

// Import all route modules
const authRoutes = require('./authRoutes');
const blogRoutes = require('./blogRoutes');
const messageRoutes = require('./messageRoutes');
const userRoutes = require('./userRoutes');
const userProfileRoutes = require('./userProfile');
const contactRoutes = require('./contactRoutes');
const ipcRoutes = require('./ipcRoutes');
const reportRoutes = require('./reportRoutes');

// High-level API routes
router.use('/auth', authRoutes);
router.use('/blogs', blogRoutes);
router.use('/messages', messageRoutes);
router.use('/users', userRoutes);
router.use('/admin', require('./adminRoutes'));
router.use('/profile', userProfileRoutes);
router.use('/contact', contactRoutes);
router.use('/ipc', ipcRoutes);
router.use('/chat', require('./chatRoutes'));
router.use('/courtroom', require('./courtroomRoutes'));
router.use('/upload', require('./uploadRoutes'));
router.use('/document', require('./documentRoutes'));
router.use('/strategy', require('./strategyRoutes'));
router.use('/moot-court', require('./mootCourtRoutes'));
router.use('/cases', require('./caseRoutes'));
router.use('/predict', require('./predictorRoutes'));
router.use('/simulation', require('./simulationRoutes'));
router.use('/announcements', require('./announcementRoutes'));
router.use('/admin/settings', require('./settingsRoutes'));
router.use('/builder', require('./builderRoutes'));
router.use('/dashboard', require('./dashboardRoutes'));
router.use('/reports', reportRoutes);

module.exports = router;
