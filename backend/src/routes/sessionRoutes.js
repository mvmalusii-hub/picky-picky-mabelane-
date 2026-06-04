const express = require('express');
const { authenticate, requireRole } = require('../middleware/auth');
const { validateRequest, joinSessionValidation, gasCardValidation, disqualifyValidation } = require('../middleware/validation');
const {
  getUpcomingSessions,
  joinSession,
  getLiveKitToken,
  disqualify,
  pickWinner,
} = require('../controllers/sessionController');
const { submitGasCard } = require('../controllers/gasCardController');

const router = express.Router();

router.use(authenticate);

router.get('/upcoming', getUpcomingSessions);
router.post('/join', joinSessionValidation, validateRequest, joinSession);
router.get('/:sessionId/live-token', getLiveKitToken);
router.post('/:sessionId/gas-card', gasCardValidation, validateRequest, submitGasCard);
router.post('/:sessionId/disqualify', requireRole(['presenter', 'admin']), disqualifyValidation, validateRequest, disqualify);
router.post('/:sessionId/pick-winner', requireRole(['presenter', 'admin']), pickWinner);

module.exports = router;
