const User = require('../models/User');
const AILog = require('../models/AILog');
const MootCourtSession = require('../models/MootCourtSession');
const Blog = require('../models/Blog');
const Case = require('../models/Case');

exports.getDashboardStats = async (req, res) => {
    try {
        const userId = req.user._id;
        const role = req.user.role;

        // 1. User Info & Last Login
        const user = await User.findById(userId).select('name role lastLogin lastActive');

        // 2. Recent Activity (Last 5 actions from AILog)
        const recentLogs = await AILog.find({ userId })
            .sort({ timestamp: -1 })
            .limit(5);

        // 3. Platform Insights
        const totalCases = await Case.countDocuments();
        const latestBlog = await Blog.findOne({ status: 'published' }).sort({ createdAt: -1 }).select('title subtitle createdAt');
        const activeMootTrials = await MootCourtSession.countDocuments({ status: 'active' });

        // 4. Role-Based Widgets
        let roleStats = {};
        if (role === 'lawyer') {
            const blogCount = await Blog.countDocuments({ author: userId });
            const totalBlogViews = await Blog.aggregate([
                { $match: { author: userId } },
                { $group: { _id: null, total: { $sum: "$views" } } }
            ]);
            const strategyUsage = await AILog.countDocuments({ userId, feature: 'Strategy Generator' });
            roleStats = {
                blogCount,
                blogViews: totalBlogViews[0]?.total || 0,
                strategyUsage
            };
        } else if (role === 'law_student') {
            const mootSessions = await MootCourtSession.find({ userId, status: 'completed' });
            const avgScore = mootSessions.length > 0 
                ? (mootSessions.reduce((acc, curr) => acc + (curr.evaluation?.score || 0), 0) / mootSessions.length).toFixed(1)
                : 0;
            const strategyUsage = await AILog.countDocuments({ userId, feature: 'Strategy Generator' });
            roleStats = {
                completedMoots: mootSessions.length,
                averageMootScore: avgScore,
                strategyUsage
            };
        } else if (role === 'civilian') {
            const aiHelpUsage = await AILog.countDocuments({ userId, feature: 'Legal AI' });
            roleStats = {
                aiHelpUsage
            };
        }

        // 5. Continue Where You Left Off
        const lastActiveSession = await MootCourtSession.findOne({ userId, status: 'active' })
            .sort({ updatedAt: -1 })
            .select('caseDetails.title updatedAt');

        res.status(200).json({
            status: 'success',
            data: {
                user,
                recentActivity: recentLogs,
                platformInsights: {
                    totalCases,
                    latestBlog,
                    activeMootTrials
                },
                roleStats,
                resumeActivity: lastActiveSession
            }
        });
    } catch (err) {
        console.error('Dashboard Stats Error:', err);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch dashboard statistics'
        });
    }
};
