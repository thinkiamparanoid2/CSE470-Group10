const express = require('express');
const router = express.Router();
const { isAuthenticated, hasRole } = require('../middleware/auth');
const vendorController = require('../controllers/vendorController');

// Member B: Vendor Directory & Rating
router.get('/', isAuthenticated, vendorController.listVendors);
router.get('/create', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), vendorController.showCreateForm);
router.post('/create', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), vendorController.createVendor);
router.get('/edit/:id', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), vendorController.showEditForm);
router.post('/edit/:id', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), vendorController.updateVendor);
router.post('/delete/:id', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), vendorController.deleteVendor);

module.exports = router;
