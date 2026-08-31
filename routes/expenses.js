const express = require('express');
const router = express.Router();
const { isAuthenticated, hasRole } = require('../middleware/auth');
const expenseController = require('../controllers/expenseController');

// Member C: Project Expense Report Export
// Internal financials (budgets, expenditure, waste cost) — not for Vendor accounts.
router.get('/', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer'), expenseController.listExpenses);
router.get('/report', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer'), expenseController.generateReport);
router.get('/export-csv', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer'), expenseController.exportCsv);

module.exports = router;
