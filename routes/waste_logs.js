const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const wasteLogController = require('../controllers/wasteLogController');

// Member A: Material Waste Log
router.get('/', isAuthenticated, wasteLogController.listWasteLogs);
router.post('/', isAuthenticated, wasteLogController.createWasteLog);

module.exports = router;
