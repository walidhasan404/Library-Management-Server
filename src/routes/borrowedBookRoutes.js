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

// Admin only routes
router.get('/all', verifyToken, verifyAdmin, getAllBorrowedBooks);
router.patch('/:id', verifyToken, verifyAdmin, updateBorrowedBookStatus);
router.delete('/:id', verifyToken, verifyAdmin, deleteBorrowedBook);

module.exports = router;
