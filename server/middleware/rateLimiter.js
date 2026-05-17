const rateLimit = require('express-rate-limit');

// Rate limiting for AI endpoints to prevent abuse and manage costs
exports.aiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 50, // Limit each IP to 50 AI requests per hour
    message: {
        status: 'error',
        message: 'You have exceeded the maximum number of AI requests allowed per hour. Please try again later.'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

exports.apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Limit each IP to 200 general API requests per window
    message: {
        status: 'error',
        message: 'Too many requests from this IP, please try again after 15 minutes'
    }
});
