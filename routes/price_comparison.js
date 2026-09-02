const express = require('express');
const router = express.Router();
const { isAuthenticated, hasRole } = require('../middleware/auth');
const priceComparisonController = require('../controllers/priceComparisonController');

// Member B: Price Comparison Engine
// Shows multi-vendor bid pricing side by side — a vendor must never see competing
// vendors' prices, so this is hidden from Vendor in the navbar AND gated here.
router.get('/', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer'), priceComparisonController.comparePrices);

module.exports = router;
