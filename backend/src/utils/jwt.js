const jwt = require('jsonwebtoken');

/**
 * Generate a JWT token for a user.
 * @param {object} payload - Contains user id and role
 * @returns {string} JWT token
 */
function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY || '7d',
  });
}

/**
 * Verify a JWT token.
 * @param {string} token
 * @returns {object} Decoded payload
 */
function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { generateToken, verifyToken };
