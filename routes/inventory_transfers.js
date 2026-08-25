const express = require('express');
const router = express.Router();
const { isAuthenticated, hasRole } = require('../middleware/auth');
const inventoryTransferController = require('../controllers/inventoryTransferController');

// Member A: Site-wise Inventory Transfer
router.get('/', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer'), inventoryTransferController.listTransfers);
router.get('/create', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer'), inventoryTransferController.showCreateForm);
router.post('/create', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer'), inventoryTransferController.createTransfer);
router.post('/status/:id', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), inventoryTransferController.updateStatus);

module.exports = router;
