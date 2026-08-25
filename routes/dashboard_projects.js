const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const projectController = require('../controllers/projectController');

// Member C: Project Progress Dashboard (Gantt-lite)
router.get('/', isAuthenticated, projectController.progressDashboard);

module.exports = router;
