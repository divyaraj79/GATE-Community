const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const User = require('../models/User');
const Category = require('../models/Category');

// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/users/login');
    }
    next();
};

// Get all questions with pagination
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        const questions = await Question.find({ isApproved: true })
            .populate('category')
            .populate('author', 'username firstName lastName')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
            
        const total = await Question.countDocuments({ isApproved: true });
        const totalPages = Math.ceil(total / limit);
        
        res.render('questions/index', {
            questions,
            currentPage: page,
            totalPages,
            limit,
            user: req.session.user
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).render('error', { error: 'Internal Server Error' });
    }
});

// Show create question form (place BEFORE :id route to avoid being captured by it)
router.get('/create', requireAuth, async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true });
        res.render('questions/create', {
            categories,
            user: req.session.user
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).render('error', { error: 'Internal Server Error' });
    }
});

// Get questions by category (place BEFORE :id route to avoid being captured by it)
router.get('/category/:slug', async (req, res) => {
    try {
        const category = await Category.findOne({ slug: req.params.slug });
        
        if (!category) {
            return res.status(404).render('error', { error: 'Category not found' });
        }
        
        const questions = await Question.find({ 
            category: category._id, 
            isApproved: true 
        })
        .populate('author', 'username firstName lastName')
        .sort({ createdAt: -1 });
        
        res.render('questions/category', {
            category,
            questions,
            user: req.session.user
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).render('error', { error: 'Internal Server Error' });
    }
});

// Get question by ID
router.get('/:id', async (req, res) => {
    try {
        const question = await Question.findById(req.params.id)
            .populate('category')
            .populate('author', 'username firstName lastName reputation')
            .populate('upvotes', 'username')
            .populate('downvotes', 'username');
            
        if (!question) {
            return res.status(404).render('error', { error: 'Question not found' });
        }
        
        // Increment view count
        question.views += 1;
        await question.save();
        
        res.render('questions/show', {
            question,
            user: req.session.user
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).render('error', { error: 'Internal Server Error' });
    }
});

// Create new question
router.post('/', requireAuth, async (req, res) => {
    try {
        const { title, content, options, explanation, difficulty, category, tags, year, marks } = req.body;
        
        // Validate options
        const questionOptions = options.map((option, index) => ({
            text: option,
            isCorrect: req.body.correctOption === index.toString()
        }));
        
        const question = new Question({
            title,
            content,
            options: questionOptions,
            explanation,
            difficulty,
            category,
            tags: tags.split(',').map(tag => tag.trim()),
            year: year || null,
            marks: marks || 1,
            author: req.session.user._id
        });
        
        await question.save();
        
        // Update user's question count
        await User.findByIdAndUpdate(req.session.user._id, {
            $inc: { questionsSubmitted: 1 }
        });
        
        res.redirect(`/questions/${question._id}`);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).render('error', { error: 'Failed to create question' });
    }
});

// Show edit question form
router.get('/:id/edit', requireAuth, async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        const categories = await Category.find({ isActive: true });
        
        if (!question) {
            return res.status(404).render('error', { error: 'Question not found' });
        }
        
        // Check if user is author or admin
        if (question.author.toString() !== req.session.user._id && req.session.user.role !== 'admin') {
            return res.status(403).render('error', { error: 'Access denied' });
        }
        
        res.render('questions/edit', {
            question,
            categories,
            user: req.session.user
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).render('error', { error: 'Internal Server Error' });
    }
});

// Update question
router.put('/:id', requireAuth, async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }
        
        // Check if user is author or admin
        if (question.author.toString() !== req.session.user._id && req.session.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        const { title, content, options, explanation, difficulty, category, tags, year, marks } = req.body;
        
        // Validate options
        const questionOptions = options.map((option, index) => ({
            text: option,
            isCorrect: req.body.correctOption === index.toString()
        }));
        
        question.title = title;
        question.content = content;
        question.options = questionOptions;
        question.explanation = explanation;
        question.difficulty = difficulty;
        question.category = category;
        question.tags = tags.split(',').map(tag => tag.trim());
        question.year = year || null;
        question.marks = marks || 1;
        
        await question.save();
        
        res.json({ success: true, message: 'Question updated successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to update question' });
    }
});

// Delete question
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }
        
        // Check if user is author or admin
        if (question.author.toString() !== req.session.user._id && req.session.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        await Question.findByIdAndDelete(req.params.id);
        
        res.json({ success: true, message: 'Question deleted successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to delete question' });
    }
});

// Vote on question
router.post('/:id/vote', requireAuth, async (req, res) => {
    try {
        const { voteType } = req.body;
        const question = await Question.findById(req.params.id);
        
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }
        
        const userId = req.session.user._id;
        const currentVote = question.hasUserVoted(userId);
        
        // Remove existing vote
        if (currentVote === 'upvote') {
            question.upvotes = question.upvotes.filter(id => id.toString() !== userId.toString());
        } else if (currentVote === 'downvote') {
            question.downvotes = question.downvotes.filter(id => id.toString() !== userId.toString());
        }
        
        // Add new vote
        if (voteType === 'upvote' && currentVote !== 'upvote') {
            question.upvotes.push(userId);
        } else if (voteType === 'downvote' && currentVote !== 'downvote') {
            question.downvotes.push(userId);
        }
        
        await question.save();
        
        res.json({
            success: true,
            upvotes: question.upvotes.length,
            downvotes: question.downvotes.length,
            voteCount: question.voteCount
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to vote' });
    }
});

module.exports = router;
