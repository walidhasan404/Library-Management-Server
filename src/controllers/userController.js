const User = require('../models/User');
const asyncHandler = require('../middlewares/asyncHandler');
const { generateToken } = require('../config/jwt');
const { sendSuccess, sendError } = require('../utils/response');

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-__v');
  
  sendSuccess(res, 'Users retrieved successfully', users);
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-__v');
  
  if (!user) {
    return sendError(res, 'User not found', 404);
  }

  sendSuccess(res, 'User retrieved successfully', user);
});

// @desc    Create new user
// @route   POST /api/users
// @access  Public
const createUser = asyncHandler(async (req, res) => {
  const { name, email, role } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return sendError(res, 'User already exists', 400);
  }

  const user = await User.create({
    name,
    email,
    role: role || 'user'
  });

  sendSuccess(res, 'User created successfully', user, 201);
});

// @desc    Update user role to admin
// @route   PATCH /api/users/:id/admin
// @access  Private/Admin
const makeAdmin = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role: 'admin' },
    { new: true, runValidators: true }
  );

  if (!user) {
    return sendError(res, 'User not found', 404);
  }

  sendSuccess(res, 'User role updated to admin', user);
});

// @desc    Remove admin privileges from user
// @route   PATCH /api/users/:id/remove-admin
// @access  Private/Admin
const removeAdmin = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role: 'user' },
    { new: true, runValidators: true }
  );

  if (!user) {
    return sendError(res, 'User not found', 404);
  }

  sendSuccess(res, 'Admin privileges removed', user);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return sendError(res, 'User not found', 404);
  }

  sendSuccess(res, 'User deleted successfully');
});

// @desc    Check if user is admin
// @route   GET /api/users/admin/:email
// @access  Private
const checkAdminStatus = asyncHandler(async (req, res) => {
  const { email } = req.params;
  
  if (email !== req.user.email) {
    return sendError(res, 'Forbidden access', 403);
  }

  const user = await User.findOne({ email });
  const isAdmin = user?.role === 'admin';

  sendSuccess(res, 'Admin status checked', { admin: isAdmin });
});

// @desc    Generate JWT token
// @route   POST /api/auth/jwt
// @access  Public
const generateJWT = asyncHandler(async (req, res) => {
  const { email, name } = req.body;
  
  // Check if user exists, if not create one
  let user = await User.findOne({ email });
  
  if (!user) {
    // Create new user with default role
    user = await User.create({
      email,
      name: name || email.split('@')[0],
      role: 'user'
    });
  }
  
  const token = generateToken({ 
    _id: user._id,
    email: user.email 
  });
  
  sendSuccess(res, 'Token generated successfully', { token });
});

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  makeAdmin,
  removeAdmin,
  deleteUser,
  checkAdminStatus,
  generateJWT
};
