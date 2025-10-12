const express = require('express');
const {
  getAllBooks,
  getBooksByCategory,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  searchBooks
} = require('../controllers/bookController');
const { verifyToken, verifyAdmin } = require('../middlewares/auth');

const router = express.Router();

// Public routes
router.get('/', getAllBooks);
router.get('/search', searchBooks);
router.get('/category/:category', getBooksByCategory);
router.get('/:id', getBook);

// Private routes (authenticated users only)
router.post('/', verifyToken, createBook);
router.put('/:id', verifyToken, updateBook);
router.delete('/:id', verifyToken, deleteBook);

module.exports = router;
