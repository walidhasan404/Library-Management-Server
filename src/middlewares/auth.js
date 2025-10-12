const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token.' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired.' 
      });
    }
    return res.status(500).json({ 
      success: false, 
      message: 'Token verification failed.' 
    });
  }
};

// Verify admin role
const verifyAdmin = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found.' 
      });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin privileges required.' 
      });
    }

    req.userData = user;
    next();
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Error verifying admin privileges.' 
    });
  }
};

// Check if user is admin (for specific routes)
const checkAdmin = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found.' 
      });
    }

    req.isAdmin = user.role === 'admin';
    req.userData = user;
    next();
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Error checking user role.' 
    });
  }
};

module.exports = {
  verifyToken,
  verifyAdmin,
  checkAdmin
};
