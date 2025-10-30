const BorrowedBook = require('../models/BorrowedBook');
const Book = require('../models/Book');
const asyncHandler = require('../middlewares/asyncHandler');
const { sendSuccess, sendError } = require('../utils/response');
const mongoose = require('mongoose');

// @desc    Get borrowed books for a user (only borrowed and pending, not returned)
// @route   GET /api/borrowed
// @access  Private
const getBorrowedBooks = asyncHandler(async (req, res) => {
  const { email } = req.query;
  
  if (email !== req.user.email) {
    return sendError(res, 'Forbidden access', 403);
  }

  // Check for status filter in query params
  const { status } = req.query;
  
  let statusFilter = { $in: ['borrowed', 'return_pending'] };
  if (status) {
    statusFilter = status; // Allow filtering by status
  }

  const borrowedBooks = await BorrowedBook.find({ 
    email,
    ...(status ? { status } : { status: { $in: ['borrowed', 'return_pending'] } })
  })
    .populate('book', 'name author_name category image')
    .populate('user', 'name email')
    .select('-__v')
    .sort({ createdAt: -1 });

  sendSuccess(res, 'Borrowed books retrieved successfully', borrowedBooks);
});

// @desc    Get all pending return requests (Admin only)
// @route   GET /api/borrowed/pending
// @access  Private (Admin only)
const getPendingReturns = asyncHandler(async (req, res) => {
  const pendingReturns = await BorrowedBook.find({ status: 'return_pending' })
    .populate('book', 'name author_name category image quantity')
    .populate('user', 'name email')
    .select('-__v')
    .sort({ returnRequestDate: -1 });

  sendSuccess(res, 'Pending returns retrieved successfully', pendingReturns);
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
  const { bookId, email, returnDate, bookName, authorName, category, image, userName } = req.body;

  // Check if book exists
  const book = await Book.findById(bookId);
  if (!book) {
    return sendError(res, 'Book not found', 404);
  }

  // Check if book is available by stock (quantity)
  if (typeof book.quantity !== 'number' || book.quantity <= 0) {
    return sendError(res, 'Book is not available for borrowing', 400);
  }
  // Auto-heal legacy flag if quantity > 0 but available is false
  if (book.available === false && book.quantity > 0) {
    await Book.findByIdAndUpdate(bookId, { available: true });
  }

  // Check if user has already borrowed this book (including pending returns)
  const existingBorrow = await BorrowedBook.findOne({ 
    user: new mongoose.Types.ObjectId(req.user._id), 
    book: bookId,
    status: { $in: ['borrowed', 'return_pending'] }
  });

  if (existingBorrow) {
    return sendError(res, 'You have already borrowed this book or it is pending return', 400);
  }

  // Create borrowed book record using data from request body (sent by frontend)
  const borrowedBook = await BorrowedBook.create({
    user: new mongoose.Types.ObjectId(req.user._id),
    book: bookId,
    email,
    userName: userName || req.user.name || email,
    bookName: bookName || book.name,
    authorName: authorName || book.author_name,
    category: category || book.category,
    image: image || book.image,
    returnDate: new Date(returnDate)
  });

  // Decrease book quantity by 1
  await Book.findByIdAndUpdate(bookId, { $inc: { quantity: -1 } });
  
  // Update availability if quantity reaches 0
  const updatedBook = await Book.findById(bookId);
  if (updatedBook.quantity === 0) {
    await Book.findByIdAndUpdate(bookId, { available: false });
  }

  sendSuccess(res, 'Book borrowed successfully', borrowedBook, 201);
});

// @desc    Request to return a book (user action)
// @route   PATCH /api/borrowed/:id/return
// @access  Private
const returnBook = asyncHandler(async (req, res) => {
  const borrowedBook = await BorrowedBook.findById(req.params.id);

  if (!borrowedBook) {
    return sendError(res, 'Borrowed book record not found', 404);
  }

  // Check if user owns this borrowed book
  if (borrowedBook.user.toString() !== req.user._id.toString()) {
    return sendError(res, 'Forbidden access', 403);
  }

  // Check if already pending return
  if (borrowedBook.status === 'return_pending') {
    return sendError(res, 'Return request already pending', 400);
  }

  // Update borrowed book status to pending
  borrowedBook.status = 'return_pending';
  borrowedBook.returnRequestDate = new Date();
  await borrowedBook.save();

  sendSuccess(res, 'Return request submitted. Waiting for admin confirmation.', borrowedBook);
});

// @desc    Update return date
// @route   PATCH /api/borrowed/:id/return-date
// @access  Private
const updateReturnDate = asyncHandler(async (req, res) => {
  const { returnDate } = req.body;
  
  const borrowedBook = await BorrowedBook.findById(req.params.id);

  if (!borrowedBook) {
    return sendError(res, 'Borrowed book record not found', 404);
  }

  // Check if user owns this borrowed book
  if (borrowedBook.user.toString() !== req.user._id.toString()) {
    return sendError(res, 'Forbidden access', 403);
  }

  // Check if edit limit reached
  if (borrowedBook.returnDateEditCount >= 2) {
    return sendError(res, 'Return date can only be edited 2 times', 400);
  }

  // Validate return date (max 1 month from now)
  const newReturnDate = new Date(returnDate);
  const maxReturnDate = new Date();
  maxReturnDate.setMonth(maxReturnDate.getMonth() + 1);

  if (newReturnDate > maxReturnDate) {
    return sendError(res, 'Return date cannot be more than 1 month from today', 400);
  }

  if (newReturnDate < new Date()) {
    return sendError(res, 'Return date cannot be in the past', 400);
  }

  // Update return date and increment edit count
  borrowedBook.returnDate = newReturnDate;
  borrowedBook.returnDateEditCount += 1;
  await borrowedBook.save();

  sendSuccess(res, 'Return date updated successfully', borrowedBook);
});

// @desc    Update borrowed book status (admin only for confirming returns)
// @route   PATCH /api/borrowed/:id
// @access  Private (Admin only)
const updateBorrowedBookStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const borrowedBook = await BorrowedBook.findById(req.params.id);
  
  if (!borrowedBook) {
    return sendError(res, 'Borrowed book record not found', 404);
  }

  // If admin confirms a return
  if (status === 'returned' && borrowedBook.status === 'return_pending') {
    // Increase book quantity by 1
    await Book.findByIdAndUpdate(borrowedBook.book, { $inc: { quantity: 1 } });
    
    // Update availability if quantity becomes greater than 0
    const updatedBook = await Book.findById(borrowedBook.book);
    if (updatedBook.quantity > 0) {
      await Book.findByIdAndUpdate(borrowedBook.book, { available: true });
    }
  }

  // Update the status
  borrowedBook.status = status;
  if (status === 'returned') {
    borrowedBook.returnRequestDate = undefined;
  }
  await borrowedBook.save();

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
  updateReturnDate,
  updateBorrowedBookStatus,
  deleteBorrowedBook,
  getPendingReturns
};
