const express = require('express');
const router = express.Router();
const { isAuthenticated, hasRole } = require('../middleware/auth');
const materialController = require('../controllers/materialController');

// Member A: Material Stock Tracking
router.get('/', isAuthenticated, materialController.listMaterials);
router.get('/create', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), materialController.showCreateForm);
router.post('/create', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), materialController.createMaterial);
router.get('/edit/:id', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), materialController.showEditForm);
router.post('/edit/:id', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), materialController.updateMaterial);
router.post('/delete/:id', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), materialController.deleteMaterial);

module.exports = router;
