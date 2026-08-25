const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const dashboardController = require('../controllers/dashboardController');

// Dashboard Overview
router.get('/', isAuthenticated, dashboardController.showDashboard);

module.exports = router;
