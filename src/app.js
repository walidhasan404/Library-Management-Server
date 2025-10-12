const express = require('express');
const cookieParser = require('cookie-parser');
const dbConnection = require('./config/db');
const corsOptions = require('./config/cors');
const errorHandler = require('./middlewares/errorHandler');
const routes = require('./routes');

// Create Express application
const app = express();

// Initialize database connection for Vercel
let dbInitialized = false;
const initializeDB = async () => {
  if (!dbInitialized) {
    try {
      // Set a timeout for database initialization
      const initPromise = dbConnection.connect();
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Database init timeout')), 5000);
      });

      const connection = await Promise.race([initPromise, timeoutPromise]);
      if (connection) {
        dbInitialized = true;
        console.log('✅ Database initialized successfully');
      } else {
        console.warn('⚠️ Database connection not available');
      }
    } catch (error) {
      console.error('❌ Database initialization failed:', error.message);
      // Don't throw error in serverless environment - allow app to continue
      dbInitialized = false;
    }
  }
};

// ========================================
// MIDDLEWARE SETUP
// ========================================

// CORS middleware
app.use(corsOptions);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parsing middleware
app.use(cookieParser());

// Database initialization middleware
app.use(async (req, res, next) => {
  await initializeDB();
  next();
});

// Request logging middleware (development only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// ========================================
// ROUTES SETUP
// ========================================

// API routes
app.use('/api', routes);

// Health check route
app.get('/', async (req, res) => {
  try {
    let dbHealth = { status: 'unknown', message: 'Database check not available' };
    let connectionStatus = { isConnected: false, host: 'Not connected', name: 'Not connected' };
    
    try {
      dbHealth = await dbConnection.healthCheck();
      connectionStatus = dbConnection.getConnectionStatus();
    } catch (dbError) {
      console.warn('Database health check failed:', dbError.message);
    }
    
    res.json({
      success: true,
      message: 'Library Management API is running',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: dbHealth.status,
        message: dbHealth.message,
        connected: connectionStatus.isConnected,
        host: connectionStatus.host,
        database: connectionStatus.name
      }
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Service temporarily unavailable',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// API health check route
app.get('/api/health', async (req, res) => {
  try {
    let dbHealth = { status: 'unknown' };
    let connectionStatus = { isConnected: false, host: 'Not connected' };
    
    try {
      dbHealth = await dbConnection.healthCheck();
      connectionStatus = dbConnection.getConnectionStatus();
    } catch (dbError) {
      console.warn('Database health check failed:', dbError.message);
    }
    
    res.json({
      success: true,
      status: dbHealth.status === 'healthy' ? 'healthy' : 'degraded',
      database: {
        status: dbHealth.status,
        connected: connectionStatus.isConnected,
        host: connectionStatus.host
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// ========================================
// ERROR HANDLING
// ========================================

// 404 handler - must be after all routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Global error handling middleware - must be last
app.use(errorHandler);

// ========================================
// EXPORT APP
// ========================================

module.exports = app;
