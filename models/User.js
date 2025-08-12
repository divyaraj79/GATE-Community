const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    avatar: {
        type: String,
        default: '/images/default-avatar.png'
    },
    bio: {
        type: String,
        maxlength: 500,
        default: ''
    },
    expertise: [{
        type: String,
        trim: true
    }],
    institution: {
        type: String,
        trim: true,
        maxlength: 100
    },
    role: {
        type: String,
        enum: ['student', 'teacher', 'expert', 'admin'],
        default: 'student'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    reputation: {
        type: Number,
        default: 0
    },
    questionsSubmitted: {
        type: Number,
        default: 0
    },
    questionsApproved: {
        type: Number,
        default: 0
    },
    lastActive: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Method to get full name
userSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

// Method to update reputation
userSchema.methods.updateReputation = function(points) {
    this.reputation += points;
    return this.save();
};

// Method to increment questions count
userSchema.methods.incrementQuestions = function() {
    this.questionsSubmitted += 1;
    return this.save();
};

// Method to increment approved questions count
userSchema.methods.incrementApprovedQuestions = function() {
    this.questionsApproved += 1;
    return this.save();
};

module.exports = mongoose.model('User', userSchema);
