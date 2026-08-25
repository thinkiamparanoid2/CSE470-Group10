const express = require('express');
const router = express.Router();
const { isAuthenticated, hasRole } = require('../middleware/auth');
const paymentController = require('../controllers/paymentController');

// Member B: Vendor Payment Tracker
router.get('/', isAuthenticated, paymentController.listPayments);
router.get('/create', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer'), paymentController.showCreateForm);
router.post('/create', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer'), paymentController.createPayment);
router.get('/vendor/:id', isAuthenticated, paymentController.vendorStatement);

module.exports = router;
