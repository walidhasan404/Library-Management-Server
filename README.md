# Library Management API

A professional REST API for library management system built with Express.js and MongoDB using MVC architecture.

## 🏗️ Project Structure

```
library-management-server/
├── src/                        # Source code directory
│   ├── config/                 # Configuration files
│   │   ├── database.js         # Database connection
│   │   ├── cors.js             # CORS configuration
│   │   └── jwt.js              # JWT utilities
│   ├── controllers/            # Business logic controllers
│   │   ├── userController.js
│   │   ├── bookController.js
│   │   ├── borrowedBookController.js
│   │   └── addedBookController.js
│   ├── middlewares/            # Custom middlewares
│   │   ├── auth.js             # Authentication & authorization
│   │   ├── errorHandler.js     # Global error handling
│   │   └── asyncHandler.js     # Async error wrapper
│   ├── models/                 # Mongoose models
│   │   ├── User.js
│   │   ├── Book.js
│   │   ├── BorrowedBook.js
│   │   └── AddedBook.js
│   ├── routes/                 # API routes
│   │   ├── index.js            # Main router
│   │   ├── userRoutes.js
│   │   ├── bookRoutes.js
│   │   ├── borrowedBookRoutes.js
│   │   └── addedBookRoutes.js
│   └── utils/                  # Utility functions
│       ├── response.js         # Standard API responses
│       ├── validation.js       # Input validation
│       └── constants.js         # Application constants
├── index.js                    # Application entry point
├── package.json
└── README.md
```

## 🚀 Features

- **MVC Architecture**: Clean separation of concerns
- **Authentication**: JWT-based authentication
- **Authorization**: Role-based access control (Admin/User)
- **Database**: MongoDB with Mongoose ODM
- **Error Handling**: Centralized error handling
- **Validation**: Input validation with Mongoose schemas
- **API Documentation**: RESTful API endpoints

## 📋 API Endpoints

### Authentication

- `POST /api/users/auth/jwt` - Generate JWT token
- `POST /api/users` - Create new user

### Users (Admin only)

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `PATCH /api/users/:id/admin` - Make user admin
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/admin/:email` - Check admin status

### Books

- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get single book
- `GET /api/books/category/:category` - Get books by category
- `GET /api/books/search` - Search books
- `POST /api/books` - Create book (Admin)
- `PUT /api/books/:id` - Update book (Admin)
- `DELETE /api/books/:id` - Delete book (Admin)

### Borrowed Books

- `GET /api/borrowed` - Get user's borrowed books
- `POST /api/borrowed` - Borrow a book
- `PATCH /api/borrowed/:id/return` - Return a book
- `GET /api/borrowed/all` - Get all borrowed books (Admin)
- `PATCH /api/borrowed/:id` - Update status (Admin)
- `DELETE /api/borrowed/:id` - Delete record (Admin)

### Added Books

- `GET /api/added` - Get user's added books
- `POST /api/added` - Add book suggestion
- `GET /api/added/:id` - Get single added book
- `DELETE /api/added/:id` - Delete added book
- `GET /api/added/all` - Get all added books (Admin)
- `PATCH /api/added/:id/status` - Update status (Admin)

## 🔧 Installation

1. Install dependencies:

```bash
npm install
```

2. Create `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/libraryBooks
ACCESS_TOKEN_SECRET=your_jwt_secret
NODE_ENV=development
```

3. Start the server:

```bash
npm start
```

## 🛡️ Security Features

- JWT Authentication
- Role-based Authorization
- Input Validation
- CORS Configuration
- Error Handling
- Password Hashing (ready for implementation)

## 📊 Database Models

### User Model

- name, email, role, timestamps

### Book Model

- name, author_name, category, image, rating, description, isbn, publishedYear, available, timestamps

### BorrowedBook Model

- user, book, email, bookName, authorName, category, image, borrowDate, returnDate, status, fine, timestamps

### AddedBook Model

- user, email, name, author_name, category, image, rating, description, isbn, publishedYear, status, timestamps

## 🔄 Migration from Old Structure

The new structure replaces the monolithic `index.js` with:

- **Config**: Database, CORS, JWT configurations
- **Models**: Mongoose schemas with validation
- **Controllers**: Business logic separated by feature
- **Routes**: RESTful API endpoints
- **Middlewares**: Authentication, error handling, async wrapper

## 🚀 Deployment

The API is ready for deployment on platforms like:

- Vercel (current configuration)
- Heroku
- Railway
- DigitalOcean

## 📝 Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb+srv://...
ACCESS_TOKEN_SECRET=your_secret_key
NODE_ENV=production
```

## 🔍 Error Handling

All errors are handled centrally with:

- Consistent error format
- Proper HTTP status codes
- Detailed error messages
- Logging for debugging

## 📈 Performance

- Async/await pattern
- Database indexing
- Efficient queries
- Error boundaries
- Request validation
