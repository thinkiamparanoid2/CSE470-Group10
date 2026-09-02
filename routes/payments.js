const express = require('express');
const router = express.Router();
const { isAuthenticated, hasRole } = require('../middleware/auth');
const paymentController = require('../controllers/paymentController');

// Member B: Vendor Payment Tracker
// Recording a disbursement is a financial/procurement action (same tier as vendor
// creation, PO approval, and contract upload) — not a field-operations task, so
// Site Engineer is intentionally excluded here even though they can view the ledger.
router.get('/', isAuthenticated, paymentController.listPayments);
router.get('/create', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), paymentController.showCreateForm);
router.post('/create', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), paymentController.createPayment);
router.get('/vendor/:id', isAuthenticated, paymentController.vendorStatement);

module.exports = router;
