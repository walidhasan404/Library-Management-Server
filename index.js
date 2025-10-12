require('dotenv').config();
const dbConnection = require('./src/config/db');
const app = require('./src/app');

const port = process.env.PORT || 5000;


const startServer = async () => {
  try {
    console.log('🚀 Starting Library Management API...');
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    
    // Connect to database first
    console.log('📦 Connecting to database...');
    await dbConnection.connect();
    
    // Start the server only after database connection is established
    const server = app.listen(port, () => {
      console.log('🎉 Server started successfully!');
      console.log(`📡 API running on: http://localhost:${port}`);
      console.log(`📊 Database: ${dbConnection.getConnectionStatus().host}`);
      console.log('📚 Library Management API is ready to serve requests!');
      console.log('🔗 Health check: http://localhost:' + port);
      console.log('🔗 API docs: http://localhost:' + port + '/api');
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${port} is already in use`);
        console.error('💡 Try using a different port or kill the process using this port');
      } else {
        console.error('❌ Server error:', error);
      }
      process.exit(1);
    });

    // Graceful shutdown handling
    const gracefulShutdown = async (signal) => {
      console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
      
      server.close(async () => {
        console.log('🔌 HTTP server closed');
        
        try {
          await dbConnection.disconnect();
          console.log('📦 Database connection closed');
          console.log('✅ Graceful shutdown completed');
          process.exit(0);
        } catch (error) {
          console.error('❌ Error during shutdown:', error);
          process.exit(1);
        }
      });
    };

    // Handle process termination signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    console.error('💡 Check your environment variables and database connection');
    process.exit(1);
  }
};

// ========================================
// START APPLICATION
// ========================================

// Only start if this file is run directly (not imported)
if (require.main === module) {
  startServer();
}

// Export for testing
module.exports = { app, startServer };