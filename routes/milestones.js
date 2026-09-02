const express = require('express');
const router = express.Router();
const { isAuthenticated, hasRole } = require('../middleware/auth');
const milestoneController = require('../controllers/milestoneController');

// Member C: Milestone Tracker
// Internal schedule data — hidden from Vendor in the navbar, so gate the route too.
router.get('/', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer'), milestoneController.listMilestones);
router.post('/create', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer'), milestoneController.createMilestone);
router.get('/edit/:id', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer'), milestoneController.showEditForm);
router.post('/edit/:id', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer'), milestoneController.updateMilestone);
router.post('/delete/:id', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), milestoneController.deleteMilestone);

module.exports = router;
