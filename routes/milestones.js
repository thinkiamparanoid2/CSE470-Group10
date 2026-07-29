const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { isAuthenticated } = require('../middleware/auth');

// Member C: Feature 1 - Milestone Tracker List
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const [projects] = await db.query('SELECT * FROM projects');
        const [milestones] = await db.query(`
            SELECT m.*, p.name AS project_name 
            FROM milestones m 
            JOIN projects p ON m.project_id = p.id 
            ORDER BY m.due_date ASC
        `);
        res.render('milestones/index', { projects, milestones, title: 'Milestone Tracker | Member C' });
    } catch (err) {
        console.error(err);
        res.render('milestones/index', { projects: [], milestones: [], title: 'Milestone Tracker' });
    }
});

// Member C: Create Milestone (Raw SQL)
router.post('/create', isAuthenticated, async (req, res) => {
    const { project_id, title, description, due_date } = req.body;
    try {
        await db.query(
            'INSERT INTO milestones (project_id, title, description, due_date) VALUES (?, ?, ?, ?)',
            [project_id, title, description, due_date]
        );
        res.redirect('/milestones');
    } catch (err) {
        console.error(err);
        res.redirect('/milestones');
    }
});

// Member C: Edit Milestone (Form)
router.get('/edit/:id', isAuthenticated, async (req, res) => {
    try {
        const [milestones] = await db.query('SELECT * FROM milestones WHERE id = ?', [req.params.id]);
        if (milestones.length === 0) return res.redirect('/milestones');
        res.render('milestones/edit', { milestone: milestones[0], title: 'Edit Milestone' });
    } catch (err) {
        console.error(err);
        res.redirect('/milestones');
    }
});

// Member C: Edit Milestone (Raw SQL)
router.post('/edit/:id', isAuthenticated, async (req, res) => {
    const { title, description, due_date, status } = req.body;
    try {
        await db.query(
            'UPDATE milestones SET title = ?, description = ?, due_date = ?, status = ? WHERE id = ?',
            [title, description, due_date, status, req.params.id]
        );
        res.redirect('/milestones');
    } catch (err) {
        console.error(err);
        res.redirect('/milestones');
    }
});

// Member C: Delete Milestone
router.post('/delete/:id', isAuthenticated, async (req, res) => {
    try {
        await db.query('DELETE FROM milestones WHERE id = ?', [req.params.id]);
        res.redirect('/milestones');
    } catch (err) {
        console.error(err);
        res.redirect('/milestones');
    }
});

module.exports = router;
