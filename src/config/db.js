const mongoose = require('mongoose');

// Global connection cache for Vercel serverless
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

class DatabaseConnection {
  constructor() {
    this.isConnected = false;
    this.connection = null;
  }

  async connect() {
    try {
      // Check if already connected
      if (this.isConnected && mongoose.connection.readyState === 1) {
        console.log('📦 Database already connected');
        return this.connection;
      }

      // Validate MongoDB URI
      if (!process.env.MONGODB_URI) {
        console.warn('⚠️ MONGODB_URI environment variable is not set');
        return null;
      }

      // Use cached connection if available
      if (cached.conn) {
        this.connection = cached.conn;
        this.isConnected = true;
        console.log('📦 Using cached database connection');
        return this.connection;
      }

      console.log('🔄 Connecting to MongoDB...');

      // Optimized connection options for Vercel serverless + MongoDB Atlas
     

      // Create connection promise if not exists
      if (!cached.promise) {
        cached.promise = mongoose.connect(process.env.MONGODB_URI);
      }

      // Wait for connection with very short timeout for serverless
      const connectionPromise = cached.promise;
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Database connection timeout')), 2000);
      });

      try {
        this.connection = await Promise.race([connectionPromise, timeoutPromise]);
      } catch (error) {
        // If connection fails, return null instead of throwing
        console.warn('Database connection failed, using fallback data');
        return null;
      }
      cached.conn = this.connection;

      // Set connection status
      this.isConnected = true;

      // Log successful connection
      console.log(`✅ MongoDB Connected Successfully!`);
      console.log(`   Host: ${this.connection.connection.host}`);
      console.log(`   Database: ${this.connection.connection.name}`);

      // Handle connection events
      this.setupEventHandlers();

      return this.connection;
    } catch (error) {
      console.error('❌ Database connection failed:');
      console.error(`   Error: ${error.message}`);
      
      // Reset cached connection on error
      cached.conn = null;
      cached.promise = null;
      
      // In serverless, don't throw error - just return null
      console.warn('⚠️ Continuing without database connection');
      return null;
    }
  }

  setupEventHandlers() {
    const db = mongoose.connection;

    // Connection events
    db.on('connected', () => {
      console.log('📡 Mongoose connected to MongoDB');
    });

    db.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err);
      this.isConnected = false;
      // Reset cache on error
      cached.conn = null;
      cached.promise = null;
    });

    db.on('disconnected', () => {
      console.log('🔌 Mongoose disconnected from MongoDB');
      this.isConnected = false;
      // Reset cache on disconnect
      cached.conn = null;
      cached.promise = null;
    });
  }

  async disconnect() {
    try {
      if (this.isConnected && this.connection) {
        await mongoose.disconnect();
        this.isConnected = false;
        // Clear cache
        cached.conn = null;
        cached.promise = null;
        console.log('🔌 MongoDB connection closed');
      }
    } catch (error) {
      console.error('❌ Error closing database connection:', error);
    }
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      readyState: mongoose.connection.readyState,
      host: this.connection?.connection?.host || 'Not connected',
      name: this.connection?.connection?.name || 'Not connected'
    };
  }

  // Health check method
  async healthCheck() {
    try {
      if (!this.isConnected || mongoose.connection.readyState !== 1) {
        return { status: 'disconnected', message: 'Database not connected' };
      }

      // Ping the database
      await mongoose.connection.db.admin().ping();
      return { status: 'healthy', message: 'Database connection is healthy' };
    } catch (error) {
      return { status: 'unhealthy', message: error.message };
    }
  }
}

// Create singleton instance
const dbConnection = new DatabaseConnection();

// Export the connection instance
module.exports = dbConnection;