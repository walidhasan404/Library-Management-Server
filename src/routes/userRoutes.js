const express = require('express');
const {
  getAllUsers,
  getUser,
  createUser,
  makeAdmin,
  removeAdmin,
  deleteUser,
  checkAdminStatus,
  generateJWT
} = require('../controllers/userController');
const { verifyToken, verifyAdmin } = require('../middlewares/auth');

const router = express.Router();

// Public routes
router.post('/auth/jwt', generateJWT);
router.post('/', createUser);

// Protected routes
router.get('/admin/:email', verifyToken, checkAdminStatus);

// Admin only routes
router.get('/', verifyToken, verifyAdmin, getAllUsers);
router.get('/:id', verifyToken, verifyAdmin, getUser);
router.patch('/:id/admin', verifyToken, verifyAdmin, makeAdmin);
router.patch('/:id/remove-admin', verifyToken, verifyAdmin, removeAdmin);
router.delete('/:id', verifyToken, verifyAdmin, deleteUser);

module.exports = router;
