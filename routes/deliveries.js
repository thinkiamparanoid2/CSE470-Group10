const express = require('express');
const router = express.Router();
const { isAuthenticated, hasRole } = require('../middleware/auth');
const deliveryController = require('../controllers/deliveryController');

// Member B: Delivery Scheduling
router.get('/', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer', 'Vendor'), deliveryController.listDeliveries);
router.post('/status/:id', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer', 'Vendor'), deliveryController.updateStatus);

module.exports = router;
