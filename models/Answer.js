const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isAccepted: {
        type: Boolean,
        default: false
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    isCorrect: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for better performance
answerSchema.index({ question: 1, createdAt: -1 });
answerSchema.index({ author: 1 });

// Virtual for like count
answerSchema.virtual('likeCount').get(function() {
    return this.likes.length;
});

// Method to check if user has liked
answerSchema.methods.hasUserLiked = function(userId) {
    return this.likes.includes(userId);
};

// Method to toggle like
answerSchema.methods.toggleLike = function(userId) {
    const hasLiked = this.hasUserLiked(userId);
    if (hasLiked) {
        this.likes = this.likes.filter(id => id.toString() !== userId.toString());
    } else {
        this.likes.push(userId);
    }
    return this.save();
};

module.exports = mongoose.model('Answer', answerSchema);
