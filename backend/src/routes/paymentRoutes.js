const express = require('express');
const { authenticate } = require('../middleware/auth');
const { createCheckoutSession } = require('../controllers/paymentController');

const router = express.Router();

router.post('/create-checkout-session', authenticate, createCheckoutSession);

module.exports = router;
