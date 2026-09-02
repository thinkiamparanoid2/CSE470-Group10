const express = require('express');
const router = express.Router();
const { isAuthenticated, hasRole } = require('../middleware/auth');
const projectController = require('../controllers/projectController');

// Member C: Project Progress Dashboard (Gantt-lite)
// Internal execution-timeline view — hidden from Vendor in the navbar, so gate the route too.
router.get('/', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer'), projectController.progressDashboard);

module.exports = router;
