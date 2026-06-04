const express = require('express');
const { authenticate, requireRole } = require('../middleware/auth');
const { getStats, createSession, getAllSessions, cancelSession } = require('../controllers/adminController');

const router = express.Router();

router.use(authenticate, requireRole(['admin']));

router.get('/stats', getStats);
router.post('/sessions', createSession);
router.get('/sessions', getAllSessions);
router.delete('/sessions/:id', cancelSession);

module.exports = router;
