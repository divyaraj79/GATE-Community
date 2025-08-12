const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Question = require('../models/Question');

// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/users/login');
    }
    next();
};

// Show registration form
router.get('/register', (req, res) => {
    if (req.session.user) {
        return res.redirect('/');
    }
    res.render('users/register', { user: null });
});

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, firstName, lastName, institution, expertise } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });
        
        if (existingUser) {
            return res.render('users/register', {
                error: 'Username or email already exists',
                user: null
            });
        }
        
        // Create new user
        const user = new User({
            username,
            email,
            password,
            firstName,
            lastName,
            institution: institution || '',
            expertise: expertise ? expertise.split(',').map(exp => exp.trim()) : []
        });
        
        await user.save();
        
        req.session.user = {
            _id: user._id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
        };
        
        res.redirect('/');
    } catch (error) {
        console.error('Error:', error);
        res.render('users/register', {
            error: 'Failed to create account',
            user: null
        });
    }
});

// Show login form
router.get('/login', (req, res) => {
    if (req.session.user) {
        return res.redirect('/');
    }
    res.render('users/login', { user: null });
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user by email
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.render('users/login', {
                error: 'Invalid email or password',
                user: null
            });
        }
        
        // Check password
        const isMatch = await user.comparePassword(password);
        
        if (!isMatch) {
            return res.render('users/login', {
                error: 'Invalid email or password',
                user: null
            });
        }
        
        // Set session
        req.session.user = {
            _id: user._id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
        };
        
        // Update last active
        user.lastActive = new Date();
        await user.save();
        
        res.redirect('/');
    } catch (error) {
        console.error('Error:', error);
        res.render('users/login', {
            error: 'Login failed',
            user: null
        });
    }
});

// Logout user
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Show user profile
router.get('/profile', requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id);
        const questions = await Question.find({ author: user._id })
            .populate('category')
            .sort({ createdAt: -1 });
            
        res.render('users/profile', {
            user: req.session.user,
            profile: user,
            questions
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).render('error', { error: 'Internal Server Error' });
    }
});

// Show edit profile form
router.get('/profile/edit', requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id);
        res.render('users/edit-profile', {
            user: req.session.user,
            profile: user
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).render('error', { error: 'Internal Server Error' });
    }
});

// Update profile
router.put('/profile', requireAuth, async (req, res) => {
    try {
        const { firstName, lastName, bio, institution, expertise } = req.body;
        
        const user = await User.findById(req.session.user._id);
        
        user.firstName = firstName;
        user.lastName = lastName;
        user.bio = bio || '';
        user.institution = institution || '';
        user.expertise = expertise ? expertise.split(',').map(exp => exp.trim()) : [];
        
        await user.save();
        
        // Update session
        req.session.user.firstName = firstName;
        req.session.user.lastName = lastName;
        
        res.json({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// Show user by username
router.get('/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        
        if (!user) {
            return res.status(404).render('error', { error: 'User not found' });
        }
        
        const questions = await Question.find({ 
            author: user._id, 
            isApproved: true 
        })
        .populate('category')
        .sort({ createdAt: -1 });
        
        res.render('users/public-profile', {
            user: req.session.user,
            profile: user,
            questions
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).render('error', { error: 'Internal Server Error' });
    }
});

// Change password
router.post('/change-password', requireAuth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        const user = await User.findById(req.session.user._id);
        
        // Verify current password
        const isMatch = await user.comparePassword(currentPassword);
        
        if (!isMatch) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }
        
        // Update password
        user.password = newPassword;
        await user.save();
        
        res.json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to change password' });
    }
});

module.exports = router;
