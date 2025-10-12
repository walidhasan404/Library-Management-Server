# 🔧 Configuration Files

## 📁 Database Configuration (`db.js`)

### **Features**
- **Singleton Pattern**: Single database connection instance
- **Async/Await**: Proper asynchronous connection handling
- **Error Handling**: Comprehensive error management
- **Connection Monitoring**: Real-time connection status
- **Health Checks**: Database health monitoring
- **Graceful Shutdown**: Proper connection cleanup

### **Connection Options**
```javascript
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,                    // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000,    // Keep trying for 5 seconds
  socketTimeoutMS: 45000,            // Close sockets after 45 seconds
  bufferCommands: false,              // Disable mongoose buffering
  bufferMaxEntries: 0,               // Disable mongoose buffering
};
```

### **Usage**
```javascript
const dbConnection = require('./src/config/db');

// Connect to database
await dbConnection.connect();

// Check connection status
const status = dbConnection.getConnectionStatus();

// Health check
const health = await dbConnection.healthCheck();

// Disconnect
await dbConnection.disconnect();
```

### **Connection Events**
- **Connected**: Database connection established
- **Error**: Connection error occurred
- **Disconnected**: Database connection lost
- **SIGINT/SIGTERM**: Graceful shutdown handling

### **Health Check Response**
```javascript
{
  status: 'healthy' | 'unhealthy' | 'disconnected',
  message: 'Database connection is healthy'
}
```

## 📁 CORS Configuration (`cors.js`)

### **Features**
- **Multiple Origins**: Support for development and production domains
- **Credentials**: Cookie and authentication support
- **Security**: Proper CORS policy implementation

### **Configured Origins**
- `http://localhost:5173` (Development)
- `https://library-management-86cd6.web.app` (Production)
- `https://library-management-86cd6.firebaseapp.com` (Production)
- `https://library-management-86cd6-e1cb9.web.app` (Production)
- `https://library-management-86cd6-e1cb9.firebaseapp.com` (Production)

## 📁 JWT Configuration (`jwt.js`)

### **Features**
- **Token Generation**: Create JWT tokens with expiration
- **Token Verification**: Validate JWT tokens
- **Security**: Secure token handling

### **Usage**
```javascript
const { generateToken, verifyToken } = require('./src/config/jwt');

// Generate token
const token = generateToken(user);

// Verify token
const decoded = verifyToken(token);
```

## 🚀 Server Startup Process

### **1. Environment Validation**
- Check for required environment variables
- Validate MongoDB URI format
- Verify JWT secret configuration

### **2. Database Connection**
- Connect to MongoDB with retry logic
- Handle connection errors gracefully
- Set up connection event handlers

### **3. Server Initialization**
- Start Express server only after database connection
- Set up middleware stack
- Configure routes and error handling

### **4. Health Monitoring**
- Real-time connection status
- Database health checks
- Graceful shutdown handling

## 🔧 Environment Variables

### **Required Variables**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
ACCESS_TOKEN_SECRET=your_jwt_secret_key
```

### **Optional Variables**
```env
PORT=5000
NODE_ENV=development
```

## 📊 Connection Status

### **Connection States**
- **0**: Disconnected
- **1**: Connected
- **2**: Connecting
- **3**: Disconnecting

### **Health Check Endpoints**
- `GET /` - Full API health check with database status
- `GET /api/health` - Database-specific health check

## 🛡️ Error Handling

### **Connection Errors**
- Invalid MongoDB URI
- Network connectivity issues
- Authentication failures
- Database server unavailable

### **Error Responses**
- **503**: Service temporarily unavailable
- **500**: Internal server error
- **400**: Bad request (invalid configuration)

## 🔄 Graceful Shutdown

### **Process Signals**
- **SIGINT**: Interrupt signal (Ctrl+C)
- **SIGTERM**: Termination signal

### **Shutdown Process**
1. Stop accepting new connections
2. Close database connection
3. Clean up resources
4. Exit process gracefully

## 📈 Performance Optimizations

### **Connection Pooling**
- Maximum 10 concurrent connections
- Automatic connection management
- Efficient resource utilization

### **Timeout Configuration**
- Server selection timeout: 5 seconds
- Socket timeout: 45 seconds
- Connection retry logic

### **Buffering**
- Disabled mongoose buffering
- Immediate error reporting
- Better error handling

This configuration provides a robust, scalable, and maintainable database connection system for your Library Management API.
