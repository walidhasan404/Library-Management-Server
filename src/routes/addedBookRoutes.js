const express = require('express');
const {
  getAddedBooks,
  getAllAddedBooks,
  addBook,
  updateAddedBookStatus,
  deleteAddedBook,
  getAddedBook
} = require('../controllers/addedBookController');
const { verifyToken, verifyAdmin } = require('../middlewares/auth');

const router = express.Router();

// Protected routes
router.get('/', verifyToken, getAddedBooks);
router.post('/', verifyToken, addBook);
router.get('/:id', verifyToken, getAddedBook);
router.delete('/:id', verifyToken, deleteAddedBook);

// Admin only routes
router.get('/all', verifyToken, verifyAdmin, getAllAddedBooks);
router.patch('/:id/status', verifyToken, verifyAdmin, updateAddedBookStatus);

module.exports = router;
