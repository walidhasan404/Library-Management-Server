const mongoose = require('mongoose');

const borrowedBookSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true
  },
  bookName: {
    type: String,
    required: [true, 'Book name is required']
  },
  authorName: {
    type: String,
    required: [true, 'Author name is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required']
  },
  image: {
    type: String,
    required: [true, 'Book image is required']
  },
  borrowDate: {
    type: Date,
    default: Date.now
  },
  returnDate: {
    type: Date,
    required: [true, 'Return date is required']
  },
  status: {
    type: String,
    enum: ['borrowed', 'returned', 'overdue'],
    default: 'borrowed'
  },
  fine: {
    type: Number,
    default: 0
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
borrowedBookSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('BorrowedBook', borrowedBookSchema);
