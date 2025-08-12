const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/question-bank'
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hours
}));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/question-bank', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Import models
const Question = require('./models/Question');
const User = require('./models/User');
const Category = require('./models/Category');

// Import routes
const questionRoutes = require('./routes/questions');
const userRoutes = require('./routes/users');
const categoryRoutes = require('./routes/categories');
const answerRoutes = require('./routes/answers');

// Routes
app.use('/questions', questionRoutes);
app.use('/users', userRoutes);
app.use('/categories', categoryRoutes);
app.use('/answers', answerRoutes);

// Home route
app.get('/', async (req, res) => {
    try {
        const questions = await Question.find().populate('category').populate('author', 'username').limit(6);
        const categories = await Category.find();
        const totalQuestions = await Question.countDocuments();
        const totalUsers = await User.countDocuments();
        
        res.render('index', {
            questions,
            categories,
            totalQuestions,
            totalUsers,
            user: req.session.user
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).render('error', { error: 'Internal Server Error' });
    }
});

// Search route
app.get('/search', async (req, res) => {
    try {
        const query = req.query.q;
        const category = req.query.category;
        const difficulty = req.query.difficulty;
        
        let searchQuery = {};
        
        if (query) {
            searchQuery.$or = [
                { title: { $regex: query, $options: 'i' } },
                { content: { $regex: query, $options: 'i' } },
                { tags: { $in: [new RegExp(query, 'i')] } }
            ];
        }
        
        if (category) {
            searchQuery.category = category;
        }
        
        if (difficulty) {
            searchQuery.difficulty = difficulty;
        }
        
        const questions = await Question.find(searchQuery)
            .populate('category')
            .populate('author', 'username')
            .sort({ createdAt: -1 });
            
        res.render('search', {
            questions,
            query,
            category,
            difficulty,
            user: req.session.user
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).render('error', { error: 'Internal Server Error' });
    }
});

// About route
app.get('/about', (req, res) => {
    res.render('about', { user: req.session.user });
});

// Contact route
app.get('/contact', (req, res) => {
    res.render('contact', { user: req.session.user });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('error', { error: 'Page not found' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to view the application`);
});
