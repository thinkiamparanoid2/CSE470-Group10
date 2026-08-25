const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Public CMS Landing Page (Member D)
router.get('/', dashboardController.showHomePage);

module.exports = router;
