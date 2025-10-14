const BorrowedBook = require('../models/BorrowedBook');
const Book = require('../models/Book');
const asyncHandler = require('../middlewares/asyncHandler');
const { sendSuccess, sendError } = require('../utils/response');

// @desc    Get borrowed books for a user
// @route   GET /api/borrowed
// @access  Private
const getBorrowedBooks = asyncHandler(async (req, res) => {
  const { email } = req.query;
  
  if (email !== req.user.email) {
    return sendError(res, 'Forbidden access', 403);
  }

  const borrowedBooks = await BorrowedBook.find({ email })
    .populate('book', 'name author_name category image')
    .populate('user', 'name email')
    .select('-__v');

  sendSuccess(res, 'Borrowed books retrieved successfully', borrowedBooks);
});

// @desc    Get all borrowed books
// @route   GET /api/borrowed/all
// @access  Private
const getAllBorrowedBooks = asyncHandler(async (req, res) => {
  const borrowedBooks = await BorrowedBook.find()
    .populate('book', 'name author_name category image')
    .populate('user', 'name email')
    .select('-__v');

  sendSuccess(res, 'All borrowed books retrieved successfully', borrowedBooks);
});

// @desc    Borrow a book
// @route   POST /api/borrowed
// @access  Private
const borrowBook = asyncHandler(async (req, res) => {
  const { bookId, email, returnDate, bookName, authorName, category, image } = req.body;

  // Check if book exists
  const book = await Book.findById(bookId);
  if (!book) {
    return sendError(res, 'Book not found', 404);
  }

  // Check if book is available
  if (!book.available) {
    return sendError(res, 'Book is not available for borrowing', 400);
  }

  const mongoose = require('mongoose');
  
  // Check if user has already borrowed this book
  const existingBorrow = await BorrowedBook.findOne({ 
    user: new mongoose.Types.ObjectId(req.user._id), 
    book: bookId,
    status: 'borrowed'
  });

  if (existingBorrow) {
    return sendError(res, 'You have already borrowed this book', 400);
  }

  // Create borrowed book record using data from request body (sent by frontend)
  const borrowedBook = await BorrowedBook.create({
    user: new mongoose.Types.ObjectId(req.user._id),
    book: bookId,
    email,
    bookName: bookName || book.name,
    authorName: authorName || book.author_name,
    category: category || book.category,
    image: image || book.image,
    returnDate: new Date(returnDate)
  });

  // Update book availability
  await Book.findByIdAndUpdate(bookId, { available: false });

  sendSuccess(res, 'Book borrowed successfully', borrowedBook, 201);
});

// @desc    Return a book
// @route   PATCH /api/borrowed/:id/return
// @access  Private
const returnBook = asyncHandler(async (req, res) => {
  const borrowedBook = await BorrowedBook.findById(req.params.id);

  if (!borrowedBook) {
    return sendError(res, 'Borrowed book record not found', 404);
  }

  // Check if user owns this borrowed book
  if (borrowedBook.user.toString() !== new mongoose.Types.ObjectId(req.user._id).toString()) {
    return sendError(res, 'Forbidden access', 403);
  }

  // Update borrowed book status
  borrowedBook.status = 'returned';
  await borrowedBook.save();

  // Update book availability
  await Book.findByIdAndUpdate(borrowedBook.book, { available: true });

  sendSuccess(res, 'Book returned successfully', borrowedBook);
});

// @desc    Update borrowed book status
// @route   PATCH /api/borrowed/:id
// @access  Private
const updateBorrowedBookStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  
  const borrowedBook = await BorrowedBook.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!borrowedBook) {
    return sendError(res, 'Borrowed book record not found', 404);
  }

  sendSuccess(res, 'Borrowed book status updated successfully', borrowedBook);
});

// @desc    Delete borrowed book record
// @route   DELETE /api/borrowed/:id
// @access  Private
const deleteBorrowedBook = asyncHandler(async (req, res) => {
  const borrowedBook = await BorrowedBook.findByIdAndDelete(req.params.id);

  if (!borrowedBook) {
    return sendError(res, 'Borrowed book record not found', 404);
  }

  sendSuccess(res, 'Borrowed book record deleted successfully');
});

module.exports = {
  getBorrowedBooks,
  getAllBorrowedBooks,
  borrowBook,
  returnBook,
  updateBorrowedBookStatus,
  deleteBorrowedBook
};
