const express = require('express');
const router = express.Router();
const { isAuthenticated, hasRole } = require('../middleware/auth');
const materialController = require('../controllers/materialController');

// Member A: Material Stock Tracking
// Internal inventory data — not part of the Vendor-facing feature set (see navbar),
// so the list view itself must also be gated, not just hidden from the menu.
router.get('/', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer'), materialController.listMaterials);
router.get('/create', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), materialController.showCreateForm);
router.post('/create', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), materialController.createMaterial);
router.get('/edit/:id', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), materialController.showEditForm);
router.post('/edit/:id', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), materialController.updateMaterial);
router.post('/delete/:id', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), materialController.deleteMaterial);

module.exports = router;
