const express = require('express');
const router = express.Router();
const Answer = require('../models/Answer');
const Question = require('../models/Question');
const User = require('../models/User');

// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    next();
};

// Create a new answer
router.post('/', requireAuth, async (req, res) => {
    try {
        const { content, questionId } = req.body;
        
        if (!content || !questionId) {
            return res.status(400).json({ error: 'Content and question ID are required' });
        }
        
        // Check if question exists
        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }
        
        // Check if user already answered this question
        const existingAnswer = await Answer.findOne({
            question: questionId,
            author: req.session.user._id
        });
        
        if (existingAnswer) {
            return res.status(400).json({ error: 'You have already answered this question' });
        }
        
        const answer = new Answer({
            content,
            question: questionId,
            author: req.session.user._id
        });
        
        await answer.save();
        
        // Populate author info for response
        await answer.populate('author', 'username firstName lastName');
        
        res.json({
            success: true,
            answer,
            message: 'Answer posted successfully'
        });
    } catch (error) {
        console.error('Error creating answer:', error);
        res.status(500).json({ error: 'Failed to create answer' });
    }
});

// Get answers for a question
router.get('/question/:questionId', async (req, res) => {
    try {
        const { questionId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        const answers = await Answer.find({ question: questionId })
            .populate('author', 'username firstName lastName reputation')
            .sort({ isAccepted: -1, likeCount: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit);
            
        const total = await Answer.countDocuments({ question: questionId });
        const totalPages = Math.ceil(total / limit);
        
        res.json({
            answers,
            currentPage: page,
            totalPages,
            total
        });
    } catch (error) {
        console.error('Error fetching answers:', error);
        res.status(500).json({ error: 'Failed to fetch answers' });
    }
});

// Like/unlike an answer
router.post('/:answerId/like', requireAuth, async (req, res) => {
    try {
        const answer = await Answer.findById(req.params.answerId);
        
        if (!answer) {
            return res.status(404).json({ error: 'Answer not found' });
        }
        
        await answer.toggleLike(req.session.user._id);
        
        res.json({
            success: true,
            likeCount: answer.likeCount,
            isLiked: answer.hasUserLiked(req.session.user._id)
        });
    } catch (error) {
        console.error('Error toggling like:', error);
        res.status(500).json({ error: 'Failed to toggle like' });
    }
});

// Accept an answer (only question author can do this)
router.post('/:answerId/accept', requireAuth, async (req, res) => {
    try {
        const answer = await Answer.findById(req.params.answerId);
        
        if (!answer) {
            return res.status(404).json({ error: 'Answer not found' });
        }
        
        // Check if user is the question author
        const question = await Question.findById(answer.question);
        if (question.author.toString() !== req.session.user._id) {
            return res.status(403).json({ error: 'Only question author can accept answers' });
        }
        
        // Unaccept all other answers for this question
        await Answer.updateMany(
            { question: answer.question },
            { isAccepted: false }
        );
        
        // Accept this answer
        answer.isAccepted = true;
        await answer.save();
        
        // Update user reputation
        const answerAuthor = await User.findById(answer.author);
        if (answerAuthor) {
            await answerAuthor.updateReputation(10); // Bonus for accepted answer
        }
        
        res.json({
            success: true,
            message: 'Answer accepted successfully'
        });
    } catch (error) {
        console.error('Error accepting answer:', error);
        res.status(500).json({ error: 'Failed to accept answer' });
    }
});

// Delete an answer (only answer author or admin can do this)
router.delete('/:answerId', requireAuth, async (req, res) => {
    try {
        const answer = await Answer.findById(req.params.answerId);
        
        if (!answer) {
            return res.status(404).json({ error: 'Answer not found' });
        }
        
        // Check if user is answer author or admin
        if (answer.author.toString() !== req.session.user._id && req.session.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        await Answer.findByIdAndDelete(req.params.answerId);
        
        res.json({
            success: true,
            message: 'Answer deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting answer:', error);
        res.status(500).json({ error: 'Failed to delete answer' });
    }
});

// Edit an answer (only answer author can do this)
router.put('/:answerId', requireAuth, async (req, res) => {
    try {
        const { content } = req.body;
        
        if (!content) {
            return res.status(400).json({ error: 'Content is required' });
        }
        
        const answer = await Answer.findById(req.params.answerId);
        
        if (!answer) {
            return res.status(404).json({ error: 'Answer not found' });
        }
        
        // Check if user is answer author
        if (answer.author.toString() !== req.session.user._id) {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        answer.content = content;
        await answer.save();
        
        res.json({
            success: true,
            answer,
            message: 'Answer updated successfully'
        });
    } catch (error) {
        console.error('Error updating answer:', error);
        res.status(500).json({ error: 'Failed to update answer' });
    }
});

module.exports = router;
