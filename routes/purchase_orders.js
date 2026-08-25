const express = require('express');
const router = express.Router();
const { isAuthenticated, hasRole } = require('../middleware/auth');
const purchaseOrderController = require('../controllers/purchaseOrderController');

// Member A: Purchase Order System
router.get('/', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer'), purchaseOrderController.listPurchaseOrders);
router.get('/create', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), purchaseOrderController.showCreateForm);
router.post('/create', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), purchaseOrderController.createPurchaseOrder);
router.post('/status/:id', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), purchaseOrderController.updateStatus);

module.exports = router;
