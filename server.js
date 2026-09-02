const express = require('express');
const session = require('express-session');
const path = require('path');
const { toDateInputValue } = require('./middleware/validate');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session Middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'smartconstruction_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));

// Set View Engine (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Global locals for templates
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.toDateInputValue = toDateInputValue;
    next();
});

// Import Routes
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const materialsRoutes = require('./routes/materials');
const vendorsRoutes = require('./routes/vendors');
const projectsRoutes = require('./routes/projects');
const milestonesRoutes = require('./routes/milestones');
const noticesRoutes = require('./routes/notices');
const purchaseOrdersRoutes = require('./routes/purchase_orders');
const deliveriesRoutes = require('./routes/deliveries');
const laborRoutes = require('./routes/labor');
const inventoryTransfersRoutes = require('./routes/inventory_transfers');
const dashboardProjectsRoutes = require('./routes/dashboard_projects');
const priceComparisonRoutes = require('./routes/price_comparison');
const materialRequestsRoutes = require('./routes/material_requests');
const wasteLogsRoutes = require('./routes/waste_logs');
const contractsRoutes = require('./routes/contracts');
const boqRoutes = require('./routes/boq');
const paymentsRoutes = require('./routes/payments');
const expensesRoutes = require('./routes/expenses');
const siteReportsRoutes = require('./routes/site_reports');
const equipmentRoutes = require('./routes/equipment');
app.use('/', indexRoutes);
app.use('/', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/materials', materialsRoutes);
app.use('/vendors', vendorsRoutes);
app.use('/projects', projectsRoutes);
app.use('/milestones', milestonesRoutes);
app.use('/notices', noticesRoutes);
app.use('/purchase_orders', purchaseOrdersRoutes);
app.use('/deliveries', deliveriesRoutes);
app.use('/labor', laborRoutes);
app.use('/inventory-transfers', inventoryTransfersRoutes);
app.use('/dashboard_projects', dashboardProjectsRoutes);
app.use('/price-comparison', priceComparisonRoutes);
app.use('/material-requests', materialRequestsRoutes);
app.use('/waste-logs', wasteLogsRoutes);
app.use('/contracts', contractsRoutes);
app.use('/boq', boqRoutes);
app.use('/payments', paymentsRoutes);
app.use('/expenses', expensesRoutes);
app.use('/site-reports', siteReportsRoutes);
app.use('/equipment', equipmentRoutes);
// Error 404 handler
app.use((req, res) => {
    res.status(404).render('error', { message: '404: Page Not Found' });
});

// Global 500 Error Handler Middleware
app.use((err, req, res, next) => {
    console.error('Unhandled Application Error:', err);
    res.status(err.status || 500).render('error', { 
        message: err.message || '500: An unexpected internal server error occurred.' 
    });
});

app.listen(PORT, () => {
    console.log(`🚀 SmartConstruction Server running on http://localhost:${PORT}`);
});
