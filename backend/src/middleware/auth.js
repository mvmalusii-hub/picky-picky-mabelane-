const jwt = require('jsonwebtoken');
const db = require('../config/database');

/**
 * Middleware: Authenticates JWT token from Authorization header.
 * Sets req.user with user object from database.
 */
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db('users').where({ id: decoded.id }).first();

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Check if user is banned (ban_expires in the future)
    if (user.ban_expires && new Date(user.ban_expires) > new Date()) {
      return res.status(403).json({ error: 'Account is temporarily banned' });
    }

    // Remove password hash before attaching to request
    delete user.password_hash;
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    next(err);
  }
};

/**
 * Middleware factory: Restricts access to specific roles.
 * @param {string[]} allowedRoles - Array of role strings (e.g., ['admin', 'presenter'])
 */
const requireRole = (allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }
  next();
};

module.exports = { authenticate, requireRole };
