const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Question = require('../models/Question');

// Get all categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true })
            .populate('subcategories')
            .sort({ order: 1, name: 1 });
            
        res.render('categories/index', {
            categories,
            user: req.session.user
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).render('error', { error: 'Internal Server Error' });
    }
});

// Get category by slug with questions
router.get('/:slug', async (req, res) => {
    try {
        const category = await Category.findOne({ 
            slug: req.params.slug, 
            isActive: true 
        });
        
        if (!category) {
            return res.status(404).render('error', { error: 'Category not found' });
        }
        
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        const questions = await Question.find({ 
            category: category._id, 
            isApproved: true 
        })
        .populate('author', 'username firstName lastName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
        
        const total = await Question.countDocuments({ 
            category: category._id, 
            isApproved: true 
        });
        const totalPages = Math.ceil(total / limit);
        
        // Get subcategories if any
        const subcategories = await Category.find({ 
            parentCategory: category._id, 
            isActive: true 
        });
        
        res.render('categories/show', {
            category,
            questions,
            subcategories,
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

module.exports = router;
