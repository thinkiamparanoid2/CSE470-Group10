const express = require('express');
const router = express.Router();
const { isAuthenticated, hasRole } = require('../middleware/auth');
const equipmentController = require('../controllers/equipmentController');

// Member D: Equipment Maintenance Scheduler
// Internal fleet data — hidden from Vendor in the navbar, so gate the route too.
router.get('/', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer'), equipmentController.listEquipment);
router.get('/create', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer'), equipmentController.showCreateForm);
router.post('/create', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer'), equipmentController.createEquipment);
router.get('/edit/:id', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), equipmentController.showEditForm);
router.post('/edit/:id', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), equipmentController.updateEquipment);
router.get('/schedule', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer'), equipmentController.showScheduleForm);
router.post('/schedule', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer'), equipmentController.scheduleMaintenance);
router.post('/maintenance/:id/status', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer'), equipmentController.updateMaintenanceStatus);

module.exports = router;
