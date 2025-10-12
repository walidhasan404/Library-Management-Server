const express = require('express');
const {
  getBorrowedBooks,
  getAllBorrowedBooks,
  borrowBook,
  returnBook,
  updateBorrowedBookStatus,
  deleteBorrowedBook
} = require('../controllers/borrowedBookController');
const { verifyToken, verifyAdmin } = require('../middlewares/auth');

const router = express.Router();

// Protected routes
router.get('/', verifyToken, getBorrowedBooks);
router.post('/', verifyToken, borrowBook);
router.patch('/:id/return', verifyToken, returnBook);

// Private routes (authenticated users only)
router.get('/all', verifyToken, getAllBorrowedBooks);
router.patch('/:id', verifyToken, updateBorrowedBookStatus);
router.delete('/:id', verifyToken, deleteBorrowedBook);

module.exports = router;
