const express = require('express');
const router = express.Router();
const { isAuthenticated, hasRole } = require('../middleware/auth');
const laborController = require('../controllers/laborController');

// Member C: Labor Attendance & Cost Log
router.get('/', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer'), laborController.listLaborLogs);
router.get('/create', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer'), laborController.showCreateForm);
router.post('/create', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer'), laborController.createLaborLog);

module.exports = router;
