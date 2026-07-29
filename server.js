const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session Middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'smarstruction_secret',
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

app.use('/', indexRoutes);
app.use('/', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/materials', materialsRoutes);
app.use('/vendors', vendorsRoutes);
app.use('/projects', projectsRoutes);
app.use('/milestones', milestonesRoutes);
app.use('/notices', noticesRoutes);

// Error 404 handler
app.use((req, res) => {
    res.status(404).render('error', { message: '404: Page Not Found' });
});

app.listen(PORT, () => {
    console.log(`🚀 Smarstruction Server running on http://localhost:${PORT}`);
});
