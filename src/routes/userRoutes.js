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

// Protected routes (all authenticated users)
router.get('/admin/:email', verifyToken, checkAdminStatus);
router.get('/', verifyToken, getAllUsers);
router.get('/:id', verifyToken, getUser);

// Admin only routes
router.patch('/:id/admin', verifyToken, verifyAdmin, makeAdmin);
router.patch('/:id/remove-admin', verifyToken, verifyAdmin, removeAdmin);
router.delete('/:id', verifyToken, verifyAdmin, deleteUser);

module.exports = router;
