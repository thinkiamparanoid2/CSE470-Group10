const express = require('express');
const router = express.Router();
const { isAuthenticated, hasRole } = require('../middleware/auth');
const wasteLogController = require('../controllers/wasteLogController');

// Member A: Material Waste Log
// Internal scrap/cost-variance data — hidden from Vendor in the navbar, so gate the route too.
router.get('/', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer'), wasteLogController.listWasteLogs);
router.post('/', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer'), wasteLogController.createWasteLog);

module.exports = router;
