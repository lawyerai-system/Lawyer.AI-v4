const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/authMiddleware');
const {
    getStats,
    getAllUsers,
    deleteUser,
    updateUserStatus,
    updateUserRole,
    verifyUser,
    getPendingLawyers,
    getAllCases,
    updateCase,
    deleteCase,
    getAllBlogs,
    updateBlog,
    deleteBlog,
    getAllMootSessions,
    getAllRooms,
    getAnalytics,
    getAIMonitoring
} = require('../controllers/adminController');

// All routes are protected and require 'admin' role
router.use(protect);
router.use(restrictTo('admin'));

router.get('/stats', getStats);
router.get('/analytics', getAnalytics);
router.get('/ai-monitoring', getAIMonitoring);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/status', updateUserStatus);
router.patch('/users/:id/role', updateUserRole);
router.patch('/users/:id/verify', verifyUser);
router.get('/pending-lawyers', getPendingLawyers);

// Case library moderation
router.get('/cases', getAllCases);
router.patch('/cases/:id', updateCase);
router.delete('/cases/:id', deleteCase);

// Blog moderation
router.get('/blogs', getAllBlogs);
router.patch('/blogs/:id', updateBlog);
router.delete('/blogs/:id', deleteBlog);

router.get('/moot-sessions', getAllMootSessions);
router.get('/rooms', getAllRooms);

module.exports = router;
