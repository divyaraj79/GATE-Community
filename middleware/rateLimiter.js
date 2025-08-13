const rateLimit = require('express-rate-limit');

// General rate limiter for all routes
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res) => {
        res.status(429).json({
            error: 'Too many requests from this IP, please try again later.',
            retryAfter: Math.ceil(15 * 60 / 60) // minutes
        });
    }
});

// Stricter rate limiter for authentication routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: {
        error: 'Too many authentication attempts, please try again later.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            error: 'Too many authentication attempts, please try again later.',
            retryAfter: Math.ceil(15 * 60 / 60)
        });
    }
});

// Rate limiter for answer submission
const answerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 answer submissions per hour
    message: {
        error: 'Too many answer submissions, please try again later.',
        retryAfter: '1 hour'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            error: 'Too many answer submissions, please try again later.',
            retryAfter: Math.ceil(60 / 60)
        });
    }
});

// Rate limiter for question creation
const questionLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 question creations per hour
    message: {
        error: 'Too many question creations, please try again later.',
        retryAfter: '1 hour'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            error: 'Too many question creations, please try again later.',
            retryAfter: Math.ceil(60 / 60)
        });
    }
});

module.exports = {
    generalLimiter,
    authLimiter,
    answerLimiter,
    questionLimiter
};


