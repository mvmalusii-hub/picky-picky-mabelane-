const { body, param, query, validationResult } = require('express-validator');

/**
 * Middleware: Checks for validation errors from express-validator.
 * If errors exist, returns 400 with details.
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map(e => ({ field: e.param, message: e.msg })),
    });
  }
  next();
};

// ---------- Reusable validation rules ----------

// User registration validation
const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('full_name').trim().notEmpty().withMessage('Full name required'),
  body('role').optional().isIn(['picker', 'picked', 'hybrid', 'viewer']).withMessage('Invalid role'),
];

// Login validation
const loginValidation = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
];

// Session join validation
const joinSessionValidation = [
  body('sessionId').isUUID().withMessage('Invalid session ID'),
  body('role').isIn(['picker', 'picked']).withMessage('Role must be picker or picked'),
];

// Gas card validation
const gasCardValidation = [
  param('sessionId').isUUID(),
  body('target_id').isUUID().withMessage('Target must be a valid user ID'),
  body('percentage').isInt({ min: 1, max: 100 }).withMessage('Percentage must be between 1 and 100'),
];

// Disqualify validation
const disqualifyValidation = [
  param('sessionId').isUUID(),
  body('contestant_id').isUUID(),
  body('reason').optional().isString().trim(),
];

// Vote submission validation
const voteValidation = [
  body('sessionId').isUUID(),
  body('targetId').isUUID(),
  body('category').isIn(['best_gas', 'fan_favorite', 'next_picker']),
  body('weight').optional().isInt({ min: 1, max: 100 }),
];

// Shop purchase validation
const purchaseValidation = [
  body('itemType').isIn(['plea_boost', 'gas_shield', 'side_eye', 'clap_back', 'mystery_gas', 'rose_rain', 'insider_tip', 'super_vote']),
  body('sessionId').isUUID(),
  body('targetContestantId').optional().isUUID(),
];

// Audition submission validation
const auditionValidation = [
  body('full_name').trim().notEmpty(),
  body('email').isEmail(),
  body('phone').optional().isMobilePhone(),
  body('video1_url').isURL(),
  body('video2_url').isURL(),
];

module.exports = {
  validateRequest,
  registerValidation,
  loginValidation,
  joinSessionValidation,
  gasCardValidation,
  disqualifyValidation,
  voteValidation,
  purchaseValidation,
  auditionValidation,
};
