const express = require('express');
const router = express.Router();
const { isAuthenticated, hasRole } = require('../middleware/auth');
const boqController = require('../controllers/boqController');

// Member A: Bill of Quantities (BOQ) Generator
router.get('/', isAuthenticated, boqController.listBoqs);
router.get('/create', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer'), boqController.showCreateForm);
router.post('/create', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer'), boqController.createBoq);
router.get('/:id/export-csv', isAuthenticated, boqController.exportCsv);
router.get('/:id', isAuthenticated, boqController.viewBoq);
router.post('/:id/add-item', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer'), boqController.addItem);
router.post('/delete-item/:itemId', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer'), boqController.deleteItem);

module.exports = router;
