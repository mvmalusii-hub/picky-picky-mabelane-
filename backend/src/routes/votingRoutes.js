const express = require('express');
const { authenticate } = require('../middleware/auth');
const { validateRequest, voteValidation } = require('../middleware/validation');
const {
  submitVote,
  getVoteTallies,
  predictWinner,
  resolveVoting,
} = require('../controllers/votingController');

const router = express.Router();

router.use(authenticate);

router.post('/vote', voteValidation, validateRequest, submitVote);
router.get('/tallies/:sessionId', getVoteTallies);
router.post('/predict', predictWinner);
router.post('/resolve/:sessionId', resolveVoting); // presenter/admin only – role check inside controller

module.exports = router;
