const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    options: [{
        text: {
            type: String,
            required: true
        },
        isCorrect: {
            type: Boolean,
            default: false
        }
    }],
    explanation: {
        type: String,
        required: true,
        trim: true
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium'
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    year: {
        type: Number,
        min: 1990,
        max: new Date().getFullYear()
    },
    marks: {
        type: Number,
        default: 1,
        min: 1,
        max: 10
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    views: {
        type: Number,
        default: 0
    },
    imageUrl: {
        type: String
    }
}, {
    timestamps: true
});

// Index for better search performance
questionSchema.index({ title: 'text', content: 'text', tags: 'text' });

// Virtual for like count
questionSchema.virtual('likeCount').get(function() {
    return this.likes.length;
});

// Method to check if user has liked
questionSchema.methods.hasUserLiked = function(userId) {
    return this.likes.includes(userId);
};

// Method to toggle like
questionSchema.methods.toggleLike = function(userId) {
    const hasLiked = this.hasUserLiked(userId);
    if (hasLiked) {
        this.likes = this.likes.filter(id => id.toString() !== userId.toString());
    } else {
        this.likes.push(userId);
    }
    return this.save();
};

module.exports = mongoose.model('Question', questionSchema);
