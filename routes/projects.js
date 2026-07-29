const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { isAuthenticated, hasRole } = require('../middleware/auth');

// Create Project (Form)
router.get('/create', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), (req, res) => {
    res.render('projects/create', { title: 'Create New Project' });
});

// Create Project (Raw SQL)
router.post('/create', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), async (req, res) => {
    const { name, location, budget, start_date, target_completion_date } = req.body;
    try {
        await db.query(
            'INSERT INTO projects (name, location, budget, start_date, target_completion_date) VALUES (?, ?, ?, ?, ?)',
            [name, location, budget || 0.00, start_date, target_completion_date]
        );
        res.redirect('/milestones');
    } catch (err) {
        console.error(err);
        res.render('projects/create', { error: 'Failed to create project', title: 'Create New Project' });
    }
});

module.exports = router;
