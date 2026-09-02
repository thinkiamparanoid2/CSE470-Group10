const express = require('express');
const router = express.Router();
const { isAuthenticated, hasRole } = require('../middleware/auth');
const materialRequestController = require('../controllers/materialRequestController');

// Member D: Emergency Material Request
// Internal site requisition data — hidden from Vendor in the navbar, so gate the route too.
router.get('/', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer'), materialRequestController.listRequests);
router.post('/', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer'), materialRequestController.createRequest);
router.post('/:id/status', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), materialRequestController.updateStatus);

module.exports = router;
