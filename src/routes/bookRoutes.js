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

// Admin only routes
router.post('/', verifyToken, verifyAdmin, createBook);
router.put('/:id', verifyToken, verifyAdmin, updateBook);
router.delete('/:id', verifyToken, verifyAdmin, deleteBook);

module.exports = router;
