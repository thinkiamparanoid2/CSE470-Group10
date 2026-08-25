const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const priceComparisonController = require('../controllers/priceComparisonController');

// Member B: Price Comparison Engine
router.get('/', isAuthenticated, priceComparisonController.comparePrices);

module.exports = router;
