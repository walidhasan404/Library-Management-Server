const Book = require('../models/Book');
const asyncHandler = require('../middlewares/asyncHandler');
const { sendSuccess, sendError } = require('../utils/response');

// @desc    Get all books
// @route   GET /api/books
// @access  Public
const getAllBooks = asyncHandler(async (req, res) => {
  const books = await Book.find().select('-__v');
  sendSuccess(res, 'Books retrieved successfully', books);
});

// @desc    Get books by category
// @route   GET /api/books/category/:category
// @access  Public
const getBooksByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  const books = await Book.find({ category }).select('-__v');
  
  sendSuccess(res, 'Books retrieved successfully', books);
});

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public
const getBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id).select('-__v');
  
  if (!book) {
    return sendError(res, 'Book not found', 404);
  }

  sendSuccess(res, 'Book retrieved successfully', book);
});

// @desc    Create new book
// @route   POST /api/books
// @access  Private
const createBook = asyncHandler(async (req, res) => {
  const book = await Book.create(req.body);
  
  sendSuccess(res, 'Book created successfully', book, 201);
});

// @desc    Update book
// @route   PUT /api/books/:id
// @access  Private
const updateBook = asyncHandler(async (req, res) => {
  const book = await Book.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!book) {
    return sendError(res, 'Book not found', 404);
  }

  sendSuccess(res, 'Book updated successfully', book);
});

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Private
const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findByIdAndDelete(req.params.id);

  if (!book) {
    return sendError(res, 'Book not found', 404);
  }

  sendSuccess(res, 'Book deleted successfully');
});

// @desc    Search books
// @route   GET /api/books/search
// @access  Public
const searchBooks = asyncHandler(async (req, res) => {
  const { q, category, author } = req.query;
  let query = {};

  if (q) {
    query.$or = [
      { name: { $regex: q, $options: 'i' } },
      { author_name: { $regex: q, $options: 'i' } }
    ];
  }

  if (category) {
    query.category = category;
  }

  if (author) {
    query.author_name = { $regex: author, $options: 'i' };
  }

  const books = await Book.find(query).select('-__v');

  sendSuccess(res, 'Search completed', books);
});

module.exports = {
  getAllBooks,
  getBooksByCategory,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  searchBooks
};
