/**
 * Central error handling middleware.
 * Catches errors from anywhere in the app and sends a consistent JSON response.
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.stack || err.message || err);

  // Default status code and message
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let code = err.code || 'INTERNAL_ERROR';

  // Specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
    code = 'VALIDATION_ERROR';
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized';
    code = 'UNAUTHORIZED';
  } else if (err.code === '23505') { // PostgreSQL unique violation
    statusCode = 409;
    message = 'Duplicate entry';
    code = 'DUPLICATE_KEY';
  } else if (err.code === '23503') { // Foreign key violation
    statusCode = 400;
    message = 'Referenced resource does not exist';
    code = 'FOREIGN_KEY_VIOLATION';
  }

  // Don't leak internal error details in production
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'Something went wrong';
  }

  res.status(statusCode).json({
    error: message,
    code,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

module.exports = { errorHandler };
