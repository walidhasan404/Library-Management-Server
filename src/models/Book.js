const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Book name is required'],
    trim: true
  },
  author_name: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Book image is required']
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  description: {
    type: String,
    trim: true
  },
  isbn: {
    type: String,
    unique: true,
    sparse: true
  },
  publishedYear: {
    type: Number
  },
  available: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
bookSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Book', bookSchema);
