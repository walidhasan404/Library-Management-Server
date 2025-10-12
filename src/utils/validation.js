const { sendValidationError } = require('./response');

// Email validation
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
const isValidPassword = (password) => {
  // At least 6 characters
  return password && password.length >= 6;
};

// Validate required fields
const validateRequiredFields = (fields, data) => {
  const errors = [];
  
  fields.forEach(field => {
    if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
      errors.push(`${field} is required`);
    }
  });
  
  return errors;
};

// Validate email format
const validateEmail = (email) => {
  if (!email) return 'Email is required';
  if (!isValidEmail(email)) return 'Invalid email format';
  return null;
};

// Validate password strength
const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (!isValidPassword(password)) return 'Password must be at least 6 characters';
  return null;
};

// Generic validation middleware
const validateRequest = (validationRules) => {
  return (req, res, next) => {
    const errors = [];
    
    Object.keys(validationRules).forEach(field => {
      const rules = validationRules[field];
      const value = req.body[field];
      
      if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
        errors.push(`${field} is required`);
      }
      
      if (value && rules.email && !isValidEmail(value)) {
        errors.push(`${field} must be a valid email`);
      }
      
      if (value && rules.minLength && value.length < rules.minLength) {
        errors.push(`${field} must be at least ${rules.minLength} characters`);
      }
      
      if (value && rules.maxLength && value.length > rules.maxLength) {
        errors.push(`${field} must be no more than ${rules.maxLength} characters`);
      }
    });
    
    if (errors.length > 0) {
      return sendValidationError(res, errors);
    }
    
    next();
  };
};

module.exports = {
  isValidEmail,
  isValidPassword,
  validateRequiredFields,
  validateEmail,
  validatePassword,
  validateRequest
};
