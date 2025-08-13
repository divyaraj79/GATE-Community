const { body, param, query, validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Middleware to check validation results
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Validation failed',
            details: errors.array().map(err => ({
                field: err.path,
                message: err.msg,
                value: err.value
            }))
        });
    }
    next();
};

// Sanitize and validate user registration
const validateUserRegistration = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    
    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
    
    body('firstName')
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('First name must be between 1 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('First name can only contain letters and spaces'),
    
    body('lastName')
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Last name must be between 1 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Last name can only contain letters and spaces'),
    
    handleValidationErrors
];

// Sanitize and validate user login
const validateUserLogin = [
    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    
    handleValidationErrors
];

// Sanitize and validate question creation
const validateQuestionCreation = [
    body('title')
        .trim()
        .isLength({ min: 10, max: 200 })
        .withMessage('Title must be between 10 and 200 characters'),
    
    body('content')
        .trim()
        .isLength({ min: 20, max: 2000 })
        .withMessage('Content must be between 20 and 2000 characters'),
    
    body('difficulty')
        .isIn(['Easy', 'Medium', 'Hard'])
        .withMessage('Difficulty must be Easy, Medium, or Hard'),
    
    body('marks')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Marks must be between 1 and 100'),
    
    body('year')
        .optional()
        .isInt({ min: 1990, max: new Date().getFullYear() })
        .withMessage('Year must be between 1990 and current year'),
    
    body('tags')
        .optional()
        .isArray({ max: 10 })
        .withMessage('Maximum 10 tags allowed'),
    
    body('tags.*')
        .optional()
        .trim()
        .isLength({ min: 1, max: 20 })
        .withMessage('Each tag must be between 1 and 20 characters'),
    
    handleValidationErrors
];

// Sanitize and validate answer creation
const validateAnswerCreation = [
    body('content')
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage('Answer content must be between 10 and 2000 characters'),
    
    body('questionId')
        .notEmpty()
        .withMessage('Question ID is required')
        .custom(value => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error('Invalid question ID format');
            }
            return true;
        }),
    
    handleValidationErrors
];

// Validate MongoDB ObjectId parameters
const validateObjectId = [
    param('id')
        .custom(value => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error('Invalid ID format');
            }
            return true;
        }),
    
    handleValidationErrors
];

// Sanitize search queries
const validateSearchQuery = [
    query('q')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Search query must be between 1 and 100 characters'),
    
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    
    handleValidationErrors
];

// Sanitize and validate profile updates
const validateProfileUpdate = [
    body('firstName')
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('First name must be between 1 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('First name can only contain letters and spaces'),
    
    body('lastName')
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Last name must be between 1 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Last name can only contain letters and spaces'),
    
    body('email')
        .optional()
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    
    handleValidationErrors
];

// File upload validation
const validateFileUpload = (req, res, next) => {
    if (!req.file) {
        return next();
    }
    
    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (req.file.size > maxSize) {
        return res.status(400).json({
            error: 'File too large',
            message: 'File size must be less than 5MB'
        });
    }
    
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).json({
            error: 'Invalid file type',
            message: 'Only JPEG, PNG, GIF, and WebP images are allowed'
        });
    }
    
    next();
};

module.exports = {
    validateUserRegistration,
    validateUserLogin,
    validateQuestionCreation,
    validateAnswerCreation,
    validateObjectId,
    validateSearchQuery,
    validateProfileUpdate,
    validateFileUpload,
    handleValidationErrors
};


