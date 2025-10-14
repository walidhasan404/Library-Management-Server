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

// User management routes (authenticated users can manage)
router.patch('/:id/admin', verifyToken, makeAdmin);
router.patch('/:id/remove-admin', verifyToken, removeAdmin);
router.delete('/:id', verifyToken, deleteUser);

module.exports = router;
