const User = require('../models/User');
const Blog = require('../models/Blog');
const Case = require('../models/Case');
const MootCourtSession = require('../models/MootCourtSession');
const Room = require('../models/Room');
const AILog = require('../models/AILog');

// @desc    Get system stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const lawyers = await User.countDocuments({ role: 'lawyer' });
        const civilians = await User.countDocuments({ role: 'civilian' });
        const lawStudents = await User.countDocuments({ role: 'law_student' });
        const adminUsers = await User.countDocuments({ role: 'admin' });
        const totalBlogs = await Blog.countDocuments();
        const totalCases = await Case.countDocuments();
        const totalMootSessions = await MootCourtSession.countDocuments();
        const totalRooms = await Room.countDocuments();

        res.json({
            status: 'success',
            data: {
                users: {
                    totalUsers,
                    lawyers,
                    civilians,
                    lawStudents,
                    adminUsers
                },
                content: {
                    totalBlogs,
                    totalCases
                },
                activity: {
                    totalMootSessions,
                    totalRooms
                }
            }
        });
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};

// @desc    Get all users with advanced filtering, search and pagination
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const { search, role, status, page = 1, limit = 10 } = req.query;
        const query = {};

        // Search by name or email
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        // Filter by role
        if (role && role !== 'all') {
            query.role = role;
        }

        // Filter by account status
        if (status && status !== 'all') {
            query.isActive = status === 'active';
        }

        // Pagination
        const skip = (page - 1) * limit;
        
        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(parseInt(skip))
            .limit(parseInt(limit));

        const total = await User.countDocuments(query);

        res.json({
            status: 'success',
            results: users.length,
            total,
            pages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            data: { users }
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        // Prevent deleting self or other admins
        if (user.role === 'admin') {
            return res.status(400).json({ status: 'error', message: 'Cannot delete admin users' });
        }

        await user.deleteOne();
        res.json({ status: 'success', message: 'User removed successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};

// @desc    Suspend or Reactivate user
// @route   PATCH /api/admin/users/:id/status
// @access  Private/Admin
const updateUserStatus = async (req, res) => {
    try {
        const { isActive } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        if (user.role === 'admin') {
            return res.status(400).json({ status: 'error', message: 'Cannot modify admin account status' });
        }

        user.isActive = isActive;
        await user.save({ validateBeforeSave: false });

        res.json({ 
            status: 'success', 
            message: `User account ${isActive ? 'reactivated' : 'suspended'} successfully`,
            data: { user }
        });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};

// @desc    Update user role
// @route   PATCH /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const validRoles = ['civilian', 'law_student', 'lawyer', 'admin'];

        if (!validRoles.includes(role)) {
            return res.status(400).json({ status: 'error', message: 'Invalid role provided' });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        // Prevent changing own role if last admin
        if (user._id.toString() === req.user.id && user.role === 'admin' && role !== 'admin') {
            const adminCount = await User.countDocuments({ role: 'admin' });
            if (adminCount <= 1) {
                return res.status(400).json({ status: 'error', message: 'Cannot demote the only administrator' });
            }
        }

        user.role = role;
        // If demoting from lawyer, maybe verify? Or keep verification status as is.
        await user.save({ validateBeforeSave: false });

        res.json({ 
            status: 'success', 
            message: `User role updated to ${role} successfully`,
            data: { user }
        });
    } catch (error) {
        console.error('Error updating role:', error);
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};

// @desc    Verify user (Lawyer approval)
// @route   PATCH /api/admin/users/:id/verify
// @access  Private/Admin
const verifyUser = async (req, res) => {
    try {
        const { status, reason } = req.body;

        if (!['APPROVED', 'REJECTED', 'NEEDS_INFO'].includes(status)) {
            return res.status(400).json({ status: 'error', message: 'Invalid status provided.' });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        user.verificationStatus = status;
        
        if (status === 'REJECTED' || status === 'NEEDS_INFO') {
            user.rejectionReason = reason || 'No reason specified';
            user.verified = false;
        }

        if (status === 'APPROVED') {
            user.verified = true;
            user.rejectionReason = undefined;
        }

        await user.save({ validateBeforeSave: false });

        res.json({ 
            status: 'success', 
            message: `Lawyer status updated to ${status}`,
            data: { user } 
        });
    } catch (error) {
        console.error('Error verifying user:', error);
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};

// @desc    Get pending lawyers
// @route   GET /api/admin/pending-lawyers
// @access  Private/Admin
const getPendingLawyers = async (req, res) => {
    try {
        const lawyers = await User.find({ role: 'lawyer', verificationStatus: 'PENDING' }).select('-password').sort({ createdAt: -1 });
        res.json({
            status: 'success',
            data: { lawyers }
        });
    } catch (error) {
        console.error('Error fetching pending lawyers:', error);
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};

// @desc    Get all cases for moderation
// @route   GET /api/admin/cases
// @access  Private/Admin
const getAllCases = async (req, res) => {
    try {
        const { search, status, page = 1, limit = 10 } = req.query;
        const query = {};

        if (search) {
            query.$text = { $search: search };
        }

        if (status && status !== 'all') {
            query.status = status;
        }

        const skip = (page - 1) * limit;

        const cases = await Case.find(query)
            .populate('uploader', 'name email role')
            .sort({ createdAt: -1 })
            .skip(parseInt(skip))
            .limit(parseInt(limit));

        const total = await Case.countDocuments(query);

        res.json({
            status: 'success',
            results: cases.length,
            total,
            pages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            data: { cases }
        });
    } catch (error) {
        console.error('Error fetching cases:', error);
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};

// @desc    Update case (Moderation: edit, status, highlight)
// @route   PATCH /api/admin/cases/:id
// @access  Private/Admin
const updateCase = async (req, res) => {
    try {
        const updates = req.body;
        const caseObj = await Case.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true
        }).populate('uploader', 'name email role');

        if (!caseObj) {
            return res.status(404).json({ status: 'error', message: 'Case not found' });
        }

        res.json({
            status: 'success',
            message: 'Case updated successfully',
            data: { case: caseObj }
        });
    } catch (error) {
        console.error('Error updating case:', error);
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};

// @desc    Delete a case
// @route   DELETE /api/admin/cases/:id
// @access  Private/Admin
const deleteCase = async (req, res) => {
    try {
        const caseObj = await Case.findById(req.params.id);
        if (!caseObj) {
            return res.status(404).json({ status: 'error', message: 'Case not found' });
        }
        await caseObj.deleteOne();
        res.json({ status: 'success', message: 'Case removed successfully' });
    } catch (error) {
        console.error('Error deleting case:', error);
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};

// @desc    Get all blogs for moderation
// @route   GET /api/admin/blogs
// @access  Private/Admin
const getAllBlogs = async (req, res) => {
    try {
        const { search, category, page = 1, limit = 10 } = req.query;
        const query = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ];
        }

        if (category && category !== 'all') {
            query.category = category;
        }

        const skip = (page - 1) * limit;

        const blogs = await Blog.find(query)
            .populate('author', 'name email')
            .sort({ createdAt: -1 })
            .skip(parseInt(skip))
            .limit(parseInt(limit));

        const total = await Blog.countDocuments(query);

        res.json({
            status: 'success',
            results: blogs.length,
            total,
            pages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            data: { blogs }
        });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};

// @desc    Update blog (Moderation: edit, highlight)
// @route   PATCH /api/admin/blogs/:id
// @access  Private/Admin
const updateBlog = async (req, res) => {
    try {
        const updates = req.body;
        const blog = await Blog.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true
        });

        if (!blog) {
            return res.status(404).json({ status: 'error', message: 'Blog not found' });
        }

        res.json({
            status: 'success',
            message: 'Blog updated successfully',
            data: { blog }
        });
    } catch (error) {
        console.error('Error updating blog:', error);
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};

// @desc    Delete a blog
// @route   DELETE /api/admin/blogs/:id
// @access  Private/Admin
const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ status: 'error', message: 'Blog not found' });
        }
        await blog.deleteOne();
        res.json({ status: 'success', message: 'Blog removed successfully' });
    } catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};

// @desc    Get all moot sessions
// @route   GET /api/admin/moot-sessions
// @access  Private/Admin
const getAllMootSessions = async (req, res) => {
    try {
        const sessions = await MootCourtSession.find().populate('userId', 'name email').sort({ createdAt: -1 });
        res.json({
            status: 'success',
            data: { sessions }
        });
    } catch (error) {
        console.error('Error fetching moot sessions:', error);
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};

// @desc    Get all active justice rooms
// @route   GET /api/admin/rooms
// @access  Private/Admin
const getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.find().populate('lawyerId', 'name email').populate('civilianId', 'name email').sort({ createdAt: -1 });
        res.json({
            status: 'success',
            data: { rooms }
        });
    } catch (error) {
        console.error('Error fetching rooms:', error);
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};

// @desc    Get platform analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getAnalytics = async (req, res) => {
    try {
        const last14Days = new Date();
        last14Days.setDate(last14Days.getDate() - 14);

        // 1. Daily Active Users Trends (Snapshot based on lastActive)
        const dauTrend = await User.aggregate([
            { $match: { lastActive: { $gte: last14Days } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%m-%d", date: "$lastActive" } },
                    activeUsers: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // 2. New Registrations Trends
        const regTrend = await User.aggregate([
            { $match: { createdAt: { $gte: last14Days } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%m-%d", date: "$createdAt" } },
                    newUsers: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // 3. Feature Usage Statistics
        const mootCourtCount = await MootCourtSession.countDocuments();
        const roomsCount = await Room.countDocuments();
        const blogCount = await Blog.countDocuments();
        const caseCount = await Case.countDocuments();

        const featureUsage = [
            { name: 'Moot Court', value: mootCourtCount },
            { name: 'Justice Rooms', value: roomsCount },
            { name: 'Insights Blog', value: blogCount },
            { name: 'Case Library', value: caseCount }
        ];

        // 4. Content Engagement
        const topBlogs = await Blog.find()
            .select('title views')
            .sort({ views: -1 })
            .limit(5);

        const topCases = await Case.aggregate([
            { $project: { title: 1, stars: { $size: { $ifNull: ["$stars", []] } } } },
            { $sort: { stars: -1 } },
            { $limit: 5 }
        ]);

        res.json({
            status: 'success',
            data: {
                trends: {
                    dau: dauTrend,
                    registrations: regTrend
                },
                featureUsage,
                engagement: {
                    topBlogs,
                    topCases
                }
            }
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};


// @desc    Get AI Usage Monitoring Data
// @route   GET /api/admin/ai-monitoring
// @access  Private/Admin
const getAIMonitoring = async (req, res) => {
    try {
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);

        // 1. Daily AI Requests (Last 7 Days)
        const dailyUsage = await AILog.aggregate([
            { $match: { timestamp: { $gte: last7Days } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                    requests: { $sum: 1 },
                    errors: { $sum: { $cond: [{ $eq: ["$status", "ERROR"] }, 1, 0] } }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // 2. Usage by Feature
        const featureDistribution = await AILog.aggregate([
            {
                $group: {
                    _id: "$feature",
                    count: { $sum: 1 },
                    avgResponseTime: { $avg: "$responseTime" }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // 3. Performance Stats
        const globalStats = await AILog.aggregate([
            {
                $group: {
                    _id: null,
                    avgLatency: { $avg: "$responseTime" },
                    totalRequests: { $sum: 1 },
                    errorRate: { $avg: { $cond: [{ $eq: ["$status", "ERROR"] }, 1, 0] } }
                }
            }
        ]);

        // 4. Recent Errors Logs
        const errorLogs = await AILog.find({ status: 'ERROR' })
            .select('feature errorMessage timestamp userId')
            .populate('userId', 'name email')
            .sort({ timestamp: -1 })
            .limit(20);

        res.json({
            status: 'success',
            data: {
                dailyUsage,
                featureDistribution,
                performance: globalStats[0] || { avgLatency: 0, totalRequests: 0, errorRate: 0 },
                errorLogs
            }
        });
    } catch (error) {
        console.error('Error fetching AI monitoring data:', error);
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};
module.exports = {
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
};
