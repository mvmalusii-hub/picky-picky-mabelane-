const express = require('express');
const { authenticate, requireRole } = require('../middleware/auth');
const { validateRequest, auditionValidation } = require('../middleware/validation');
const { submitAudition, getAllAuditions, updateAuditionStatus } = require('../controllers/auditionController');

const router = express.Router();

// Public – anyone can submit
router.post('/', auditionValidation, validateRequest, submitAudition);

// Admin only
router.get('/', authenticate, requireRole(['admin']), getAllAuditions);
router.put('/:id', authenticate, requireRole(['admin']), updateAuditionStatus);

module.exports = router;
