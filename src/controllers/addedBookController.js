const AddedBook = require('../models/AddedBook');
const Book = require('../models/Book');
const asyncHandler = require('../middlewares/asyncHandler');
const { sendSuccess, sendError } = require('../utils/response');

// @desc    Get added books for a user
// @route   GET /api/added
// @access  Private
const getAddedBooks = asyncHandler(async (req, res) => {
  const { email } = req.query;
  
  if (email !== req.user.email) {
    return sendError(res, 'Forbidden access', 403);
  }

  const addedBooks = await AddedBook.find({ email })
    .populate('user', 'name email')
    .select('-__v');

  sendSuccess(res, 'Added books retrieved successfully', addedBooks);
});

// @desc    Get all added books (Admin only)
// @route   GET /api/added/all
// @access  Private/Admin
const getAllAddedBooks = asyncHandler(async (req, res) => {
  const addedBooks = await AddedBook.find()
    .populate('user', 'name email')
    .select('-__v');

  sendSuccess(res, 'All added books retrieved successfully', addedBooks);
});

// @desc    Add a new book suggestion
// @route   POST /api/added
// @access  Private
const addBook = asyncHandler(async (req, res) => {
  const bookData = {
    ...req.body,
    user: req.user._id,
    email: req.user.email
  };

  const addedBook = await AddedBook.create(bookData);

  sendSuccess(res, 'Book suggestion added successfully', addedBook, 201);
});

// @desc    Update added book status (Admin only)
// @route   PATCH /api/added/:id/status
// @access  Private/Admin
const updateAddedBookStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  
  const addedBook = await AddedBook.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!addedBook) {
    return sendError(res, 'Added book record not found', 404);
  }

  // If approved, add to main books collection
  if (status === 'approved') {
    const bookData = {
      name: addedBook.name,
      author_name: addedBook.author_name,
      category: addedBook.category,
      image: addedBook.image,
      rating: addedBook.rating,
      description: addedBook.description,
      isbn: addedBook.isbn,
      publishedYear: addedBook.publishedYear
    };

    await Book.create(bookData);
  }

  sendSuccess(res, 'Added book status updated successfully', addedBook);
});

// @desc    Delete added book
// @route   DELETE /api/added/:id
// @access  Private
const deleteAddedBook = asyncHandler(async (req, res) => {
  const addedBook = await AddedBook.findById(req.params.id);

  if (!addedBook) {
    return sendError(res, 'Added book record not found', 404);
  }

  // Check if user owns this added book or is admin
  if (addedBook.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return sendError(res, 'Forbidden access', 403);
  }

  await AddedBook.findByIdAndDelete(req.params.id);

  sendSuccess(res, 'Added book record deleted successfully');
});

// @desc    Get added book by ID
// @route   GET /api/added/:id
// @access  Private
const getAddedBook = asyncHandler(async (req, res) => {
  const addedBook = await AddedBook.findById(req.params.id)
    .populate('user', 'name email')
    .select('-__v');

  if (!addedBook) {
    return sendError(res, 'Added book record not found', 404);
  }

  sendSuccess(res, 'Added book retrieved successfully', addedBook);
});

module.exports = {
  getAddedBooks,
  getAllAddedBooks,
  addBook,
  updateAddedBookStatus,
  deleteAddedBook,
  getAddedBook
};
