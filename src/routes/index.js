const express = require('express');
const userRoutes = require('./userRoutes');
const bookRoutes = require('./bookRoutes');
const borrowedBookRoutes = require('./borrowedBookRoutes');
const addedBookRoutes = require('./addedBookRoutes');

const router = express.Router();

// API routes
router.use('/users', userRoutes);
router.use('/books', bookRoutes);
router.use('/borrowed', borrowedBookRoutes);
router.use('/added', addedBookRoutes);

module.exports = router;
