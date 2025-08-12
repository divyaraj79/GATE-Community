const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxlength: 100
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },
    icon: {
        type: String,
        default: 'fas fa-book'
    },
    color: {
        type: String,
        default: '#007bff'
    },
    parentCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    },
    questionCount: {
        type: Number,
        default: 0
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for better performance
categorySchema.index({ slug: 1 });
categorySchema.index({ parentCategory: 1 });

// Virtual for subcategories
categorySchema.virtual('subcategories', {
    ref: 'Category',
    localField: '_id',
    foreignField: 'parentCategory'
});

// Method to update question count
categorySchema.methods.updateQuestionCount = function() {
    return this.model('Question').countDocuments({ category: this._id })
        .then(count => {
            this.questionCount = count;
            return this.save();
        });
};

module.exports = mongoose.model('Category', categorySchema);
