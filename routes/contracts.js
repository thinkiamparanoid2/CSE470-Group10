const express = require('express');
const router = express.Router();
const { isAuthenticated, hasRole } = require('../middleware/auth');
const contractController = require('../controllers/contractController');

// Member B: Contract Document Upload
router.get('/', isAuthenticated, contractController.listContracts);
router.post('/', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), contractController.upload.single('contract_file'), contractController.uploadContract);

module.exports = router;
