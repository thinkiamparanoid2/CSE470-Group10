const express = require('express');
const router = express.Router();
const { isAuthenticated, hasRole } = require('../middleware/auth');
const siteReportController = require('../controllers/siteReportController');

// Member C: Daily Site Report
router.get('/', isAuthenticated, siteReportController.listReports);
router.get('/generate', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer'), siteReportController.showGenerateForm);
router.post('/create', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer'), siteReportController.createReport);
router.get('/:id', isAuthenticated, siteReportController.viewReport);

module.exports = router;
