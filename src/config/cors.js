const cors = require('cors');

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://library-management-86cd6.web.app',
    'https://library-management-86cd6.firebaseapp.com',
    'https://library-management-86cd6-e1cb9.web.app',
    'https://library-management-86cd6-e1cb9.firebaseapp.com'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

module.exports = cors(corsOptions);
