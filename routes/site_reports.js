const express = require('express');
const router = express.Router();
const { isAuthenticated, hasRole } = require('../middleware/auth');
const siteReportController = require('../controllers/siteReportController');

// Member C: Daily Site Report
// Internal engineer/weather logs — hidden from Vendor in the navbar, so gate every route here too.
router.get('/', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer'), siteReportController.listReports);
router.get('/generate', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer'), siteReportController.showGenerateForm);
router.post('/create', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer'), siteReportController.createReport);
router.get('/:id', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer'), siteReportController.viewReport);

module.exports = router;
