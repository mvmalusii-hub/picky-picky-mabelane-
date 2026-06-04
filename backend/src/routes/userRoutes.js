const express = require('express');
const { authenticate } = require('../middleware/auth');
const { getProfile, updateProfile, getWallet } = require('../controllers/userController');

const router = express.Router();

router.use(authenticate); // all routes require authentication

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/wallet', getWallet);

module.exports = router;
