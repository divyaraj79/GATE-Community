const helmet = require('helmet');

// Security middleware configuration
const securityMiddleware = [
    // Basic security headers
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://fonts.googleapis.com"],
                scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
                fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
                imgSrc: ["'self'", "data:", "https:"],
                connectSrc: ["'self'"],
                frameSrc: ["'none'"],
                objectSrc: ["'none'"]
            }
        },
        hsts: process.env.NODE_ENV === 'production' ? {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true
        } : false,
        noSniff: true,
        referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
    }),
    
    // Prevent clickjacking
    (req, res, next) => {
        res.setHeader('X-Frame-Options', 'DENY');
        next();
    },
    
    // Prevent MIME type sniffing
    (req, res, next) => {
        res.setHeader('X-Content-Type-Options', 'nosniff');
        next();
    },
    
    // Prevent XSS attacks
    (req, res, next) => {
        res.setHeader('X-XSS-Protection', '1; mode=block');
        next();
    },
    
    // Remove server information
    (req, res, next) => {
        res.removeHeader('X-Powered-By');
        next();
    },
    
    // Upgrade insecure requests (only in production)
    (req, res, next) => {
        if (process.env.NODE_ENV === 'production') {
            res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
        }
        next();
    }
];

// Simple token-based CSRF protection
const generateCSRFToken = (req, res, next) => {
    if (!req.session.csrfToken) {
        req.session.csrfToken = require('crypto').randomBytes(32).toString('hex');
    }
    res.locals.csrfToken = req.session.csrfToken;
    next();
};

const validateCSRFToken = (req, res, next) => {
    const token = req.body._csrf || req.headers['x-csrf-token'];
    
    if (!token || token !== req.session.csrfToken) {
        return res.status(403).json({
            error: 'CSRF token validation failed',
            message: 'Invalid or missing CSRF token'
        });
    }
    
    next();
};

// Sanitize user input to prevent XSS
const sanitizeInput = (req, res, next) => {
    // Recursively sanitize request body
    const sanitize = (obj) => {
        if (typeof obj === 'string') {
            return obj
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#x27;')
                .replace(/\//g, '&#x2F;');
        }
        
        if (Array.isArray(obj)) {
            return obj.map(sanitize);
        }
        
        if (obj && typeof obj === 'object') {
            const sanitized = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    sanitized[key] = sanitize(obj[key]);
                }
            }
            return sanitized;
        }
        
        return obj;
    };
    
    if (req.body) {
        req.body = sanitize(req.body);
    }
    
    if (req.query) {
        req.query = sanitize(req.query);
    }
    
    next();
};

module.exports = {
    securityMiddleware,
    generateCSRFToken,
    validateCSRFToken,
    sanitizeInput
};
