const express = require('express');
const { authenticate } = require('../middleware/auth');
const { validateRequest, purchaseValidation } = require('../middleware/validation');
const { getShopItems, buyItem, useItem } = require('../controllers/shopController');

const router = express.Router();

router.use(authenticate);

router.get('/items', getShopItems);
router.post('/buy', purchaseValidation, validateRequest, buyItem);
router.post('/use/:purchaseId', useItem);

module.exports = router;
