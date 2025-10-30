const express = require('express');
const {
  getBorrowedBooks,
  getAllBorrowedBooks,
  borrowBook,
  returnBook,
  updateReturnDate,
  updateBorrowedBookStatus,
  deleteBorrowedBook,
  getPendingReturns
} = require('../controllers/borrowedBookController');
const { verifyToken, verifyAdmin } = require('../middlewares/auth');

const router = express.Router();

// Protected routes
router.get('/', verifyToken, getBorrowedBooks);
router.get('/pending', verifyToken, verifyAdmin, getPendingReturns);
router.post('/', verifyToken, borrowBook);
router.patch('/:id/return', verifyToken, returnBook);
router.patch('/:id/return-date', verifyToken, updateReturnDate);

// Private routes (authenticated users only)
router.get('/all', verifyToken, getAllBorrowedBooks);
router.patch('/:id', verifyToken, verifyAdmin, updateBorrowedBookStatus);
router.delete('/:id', verifyToken, deleteBorrowedBook);

module.exports = router;
