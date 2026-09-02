const express = require('express');
const router = express.Router();
const { isAuthenticated, hasRole } = require('../middleware/auth');
const boqController = require('../controllers/boqController');

// Member A: Bill of Quantities (BOQ) Generator
// Internal costing data — hidden from Vendor in the navbar, so gate every route here too.
router.get('/', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer'), boqController.listBoqs);
router.get('/create', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer'), boqController.showCreateForm);
router.post('/create', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer'), boqController.createBoq);
router.get('/:id/export-csv', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer'), boqController.exportCsv);
router.get('/:id', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer'), boqController.viewBoq);
router.post('/:id/add-item', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer'), boqController.addItem);
router.post('/delete-item/:itemId', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer'), boqController.deleteItem);

module.exports = router;
