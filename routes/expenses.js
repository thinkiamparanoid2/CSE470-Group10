const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const expenseController = require('../controllers/expenseController');

// Member C: Project Expense Report Export
router.get('/', isAuthenticated, expenseController.listExpenses);
router.get('/report', isAuthenticated, expenseController.generateReport);
router.get('/export-csv', isAuthenticated, expenseController.exportCsv);

module.exports = router;
