const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const milestoneController = require('../controllers/milestoneController');

// Member C: Milestone Tracker
router.get('/', isAuthenticated, milestoneController.listMilestones);
router.post('/create', isAuthenticated, milestoneController.createMilestone);
router.get('/edit/:id', isAuthenticated, milestoneController.showEditForm);
router.post('/edit/:id', isAuthenticated, milestoneController.updateMilestone);
router.post('/delete/:id', isAuthenticated, milestoneController.deleteMilestone);

module.exports = router;
