const winston = require('winston');
const morgan = require('morgan');
const path = require('path');

// Configure Winston logger for Render deployment
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    defaultMeta: { service: 'question-bank-api' },
    transports: [
        // Console transport for Render logs
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});

// Create a stream object for Morgan
const stream = {
    write: (message) => {
        logger.info(message.trim());
    }
};

// Custom Morgan format for better logging
const morganFormat = process.env.NODE_ENV === 'production' 
    ? 'combined' 
    : ':method :url :status :response-time ms';

// Morgan middleware for HTTP request logging
const morganMiddleware = morgan(morganFormat, { 
    stream,
    skip: (req, res) => {
        // Skip logging for static files
        return req.url.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/);
    }
});

// Custom logging middleware for application events
const logRequest = (req, res, next) => {
    // Skip logging for static files completely
    if (req.url.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
        return next();
    }
    
    // Skip logging for common static paths
    if (req.url.startsWith('/css/') || req.url.startsWith('/js/') || req.url.startsWith('/images/')) {
        return next();
    }
    
    const start = Date.now();
    
    // Log request
    logger.info('Incoming request', {
        method: req.method,
        url: req.url,
        ip: req.ip || req.connection.remoteAddress,
        userId: req.session?.user?._id || 'anonymous'
    });
    
    // Log response
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info('Request completed', {
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            userId: req.session?.user?._id || 'anonymous'
        });
    });
    
    next();
};

// Error logging middleware
const logError = (err, req, res, next) => {
    logger.error('Application error', {
        error: err.message,
        stack: err.stack,
        method: req.method,
        url: req.url,
        ip: req.ip || req.connection.remoteAddress,
        userId: req.session?.user?._id || 'anonymous',
        userAgent: req.get('User-Agent')
    });
    
    next(err);
};

// Performance monitoring middleware
const performanceMonitor = (req, res, next) => {
    // Skip monitoring for static files
    if (req.url.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
        return next();
    }
    
    const start = process.hrtime();
    
    res.on('finish', () => {
        const [seconds, nanoseconds] = process.hrtime(start);
        const duration = seconds * 1000 + nanoseconds / 1000000; // Convert to milliseconds
        
        // Log slow requests (over 1 second)
        if (duration > 1000) {
            logger.warn('Slow request detected', {
                method: req.method,
                url: req.url,
                duration: `${duration.toFixed(2)}ms`,
                userId: req.session?.user?._id || 'anonymous'
            });
        }
        
        // Log performance metrics
        logger.info('Request performance', {
            method: req.method,
            url: req.url,
            duration: `${duration.toFixed(2)}ms`,
            statusCode: res.statusCode
        });
    });
    
    next();
};

// Security event logging
const logSecurityEvent = (event, details) => {
    logger.warn('Security event detected', {
        event,
        details,
        timestamp: new Date().toISOString()
    });
};

// Database operation logging
const logDatabaseOperation = (operation, collection, duration, success) => {
    logger.info('Database operation', {
        operation,
        collection,
        duration: `${duration}ms`,
        success,
        timestamp: new Date().toISOString()
    });
};

// User activity logging
const logUserActivity = (userId, action, details) => {
    logger.info('User activity', {
        userId,
        action,
        details,
        timestamp: new Date().toISOString()
    });
};

module.exports = {
    logger,
    morganMiddleware,
    logRequest,
    logError,
    performanceMonitor,
    logSecurityEvent,
    logDatabaseOperation,
    logUserActivity
};
