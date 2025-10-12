# 📁 Professional MVC Structure - Library Management API

## 🏗️ New Directory Structure

```
library-management-server/
├── 📁 src/                        # Source code directory
│   ├── 📁 config/                 # Configuration files
│   │   ├── 📄 database.js         # MongoDB connection with Mongoose
│   │   ├── 📄 cors.js             # CORS configuration
│   │   └── 📄 jwt.js              # JWT utilities (generate/verify)
│   │
│   ├── 📁 controllers/            # Business Logic Layer
│   │   ├── 📄 userController.js   # User management logic
│   │   ├── 📄 bookController.js   # Book management logic
│   │   ├── 📄 borrowedBookController.js  # Borrowing logic
│   │   └── 📄 addedBookController.js     # Book suggestion logic
│   │
│   ├── 📁 middlewares/            # Custom Middlewares
│   │   ├── 📄 auth.js             # Authentication & authorization
│   │   ├── 📄 errorHandler.js     # Global error handling
│   │   └── 📄 asyncHandler.js     # Async error wrapper
│   │
│   ├── 📁 models/                 # Data Layer (Mongoose Schemas)
│   │   ├── 📄 User.js             # User schema with validation
│   │   ├── 📄 Book.js             # Book schema with validation
│   │   ├── 📄 BorrowedBook.js     # Borrowing record schema
│   │   └── 📄 AddedBook.js        # Book suggestion schema
│   │
│   ├── 📁 routes/                 # API Routes Layer
│   │   ├── 📄 index.js            # Main router configuration
│   │   ├── 📄 userRoutes.js       # User-related endpoints
│   │   ├── 📄 bookRoutes.js       # Book-related endpoints
│   │   ├── 📄 borrowedBookRoutes.js # Borrowing endpoints
│   │   └── 📄 addedBookRoutes.js  # Book suggestion endpoints
│   │
│   └── 📁 utils/                  # Utility Functions
│       ├── 📄 response.js         # Standard API response utilities
│       ├── 📄 validation.js        # Input validation utilities
│       └── 📄 constants.js         # Application constants
│
├── 📄 index.js                    # Application entry point
├── 📄 package.json                # Dependencies & scripts
├── 📄 vercel.json                 # Deployment configuration
└── 📄 README.md                   # API documentation
```

## 🎯 Key Improvements

### **1. Professional Organization**

- **src/ folder**: All source code organized in one place
- **Clear separation**: Each component has its dedicated folder
- **Scalable structure**: Easy to add new features and modules

### **2. Enhanced Utilities**

- **response.js**: Standardized API responses
- **validation.js**: Input validation utilities
- **constants.js**: Application-wide constants

### **3. Updated Import Paths**

- All imports now use relative paths from src/
- Clean and maintainable code structure
- Easy to refactor and move components

## 🚀 API Endpoints

### **Authentication & Users**

```
POST   /api/users/auth/jwt         # Generate JWT token
POST   /api/users                  # Create new user
GET    /api/users/admin/:email     # Check admin status
GET    /api/users                  # Get all users (Admin)
GET    /api/users/:id              # Get single user (Admin)
PATCH  /api/users/:id/admin        # Make user admin (Admin)
DELETE /api/users/:id               # Delete user (Admin)
```

### **Books Management**

```
GET    /api/books                  # Get all books
GET    /api/books/search           # Search books
GET    /api/books/category/:cat    # Get books by category
GET    /api/books/:id              # Get single book
POST   /api/books                  # Create book (Admin)
PUT    /api/books/:id              # Update book (Admin)
DELETE /api/books/:id               # Delete book (Admin)
```

### **Borrowing System**

```
GET    /api/borrowed               # Get user's borrowed books
POST   /api/borrowed               # Borrow a book
PATCH  /api/borrowed/:id/return   # Return a book
GET    /api/borrowed/all           # Get all borrowed books (Admin)
PATCH  /api/borrowed/:id           # Update status (Admin)
DELETE /api/borrowed/:id            # Delete record (Admin)
```

### **Book Suggestions**

```
GET    /api/added                  # Get user's added books
POST   /api/added                  # Add book suggestion
GET    /api/added/:id              # Get single added book
DELETE /api/added/:id              # Delete added book
GET    /api/added/all              # Get all added books (Admin)
PATCH  /api/added/:id/status      # Update status (Admin)
```

## 🛠️ New Features

### **Standardized Responses**

```javascript
// Before
res.json({ success: true, data: books });

// After
sendSuccess(res, "Books retrieved successfully", books);
```

### **Enhanced Validation**

```javascript
// Input validation with custom rules
const validateRequest = (validationRules) => {
  return (req, res, next) => {
    // Validation logic
  };
};
```

### **Application Constants**

```javascript
const {
  HTTP_STATUS,
  USER_ROLES,
  BOOK_CATEGORIES,
} = require("./utils/constants");
```

## 🔧 Configuration

### **Environment Variables**

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/libraryBooks
ACCESS_TOKEN_SECRET=your_jwt_secret
NODE_ENV=development
```

### **Database Connection**

```javascript
// src/config/database.js
const connectDB = async () => {
  // MongoDB connection with Mongoose
};
```

### **CORS Configuration**

```javascript
// src/config/cors.js
const corsOptions = {
  origin: ["http://localhost:5173", "https://your-domain.com"],
  credentials: true,
};
```

## 📊 Benefits of New Structure

### **1. Professional Standards**

- Industry best practices
- Clean code principles
- Maintainable architecture

### **2. Developer Experience**

- Easy to navigate
- Clear file organization
- Consistent patterns

### **3. Scalability**

- Easy to add new features
- Modular development
- Team collaboration friendly

### **4. Performance**

- Optimized imports
- Efficient routing
- Better error handling

## 🚀 Getting Started

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Environment Setup**:

   ```bash
   cp .env.example .env
   # Update .env with your configuration
   ```

3. **Start Development**:

   ```bash
   npm start
   ```

4. **Test API**:

   ```bash
   # Health check
   GET http://localhost:5000/

   # Get all books
   GET http://localhost:5000/api/books
   ```

## 🔄 Migration Complete

✅ **All files moved to src/ folder**  
✅ **Import paths updated**  
✅ **Old files cleaned up**  
✅ **Enhanced utilities added**  
✅ **Professional structure implemented**

The API is now organized in a professional MVC structure with improved maintainability, scalability, and developer experience!

