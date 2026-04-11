const PlatformSettings = require('../models/PlatformSettings');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to check if the platform is in maintenance mode.
 * Blocks non-admin users from accessing protected routes when maintenance is active.
 */
const checkMaintenanceMode = async (req, res, next) => {
    try {
        const settings = await PlatformSettings.findOne();
        const isMaintenance = settings ? settings.isMaintenanceMode : false;

        if (!isMaintenance) {
            return next();
        }

        // 1. Silent token check to allow admins
        let isAdmin = false;
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            try {
                const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
                const user = await User.findById(decoded.id);
                if (user && user.role === 'admin') {
                    isAdmin = true;
                }
            } catch (err) {
                // Ignore decoding errors
            }
        }

        if (isAdmin) return next();

        // 2. Define Public Routes (Allowed during maintenance)
        const publicPaths = [
            '/api/blogs',
            '/api/news',
            '/api/stats',
            '/api/contact',
            '/api/home',
            '/api/dashboard/stats',
            '/api/auth/login',         // Essential for Admins to identify themselves
            '/api/auth/register',
            '/api/admin/settings'
        ];

        // Check path and method
        const isPublicPath = publicPaths.some(path => req.path.startsWith(path));
        const isGET = req.method === 'GET';

        // Allow Public GETs and specifically login/register POSTs (handled inside controllers)
        const isAuthPost = (req.path === '/api/auth/login' || req.path === '/api/auth/register') && req.method === 'POST';

        if ((isPublicPath && isGET) || req.path === '/api/auth/me' || isAuthPost) {
            return next();
        }

        // 3. Block everything else
        return res.status(503).json({
            success: false,
            message: "Platform is under maintenance. Some features are temporarily unavailable.",
            maintenance: true
        });

    } catch (error) {
        console.error('Maintenance Middleware Error:', error);
        next();
    }
};

module.exports = checkMaintenanceMode;
