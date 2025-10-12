// Application constants
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};

const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin'
};

const BOOK_STATUS = {
  AVAILABLE: 'available',
  BORROWED: 'borrowed',
  UNAVAILABLE: 'unavailable'
};

const BORROW_STATUS = {
  BORROWED: 'borrowed',
  RETURNED: 'returned',
  OVERDUE: 'overdue'
};

const ADDED_BOOK_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

const BOOK_CATEGORIES = [
  'Fiction',
  'Non-Fiction',
  'Science',
  'Technology',
  'History',
  'Biography',
  'Self-Help',
  'Romance',
  'Mystery',
  'Thriller',
  'Fantasy',
  'Science Fiction',
  'Poetry',
  'Drama',
  'Comedy',
  'Education',
  'Reference',
  'Children',
  'Young Adult',
  'Other'
];

const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
};

const JWT_CONFIG = {
  EXPIRES_IN: '1h',
  REFRESH_EXPIRES_IN: '7d'
};

module.exports = {
  HTTP_STATUS,
  USER_ROLES,
  BOOK_STATUS,
  BORROW_STATUS,
  ADDED_BOOK_STATUS,
  BOOK_CATEGORIES,
  PAGINATION,
  JWT_CONFIG
};
