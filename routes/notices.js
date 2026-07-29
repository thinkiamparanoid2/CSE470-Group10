const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { isAuthenticated, hasRole } = require('../middleware/auth');

// Member D: Notice Board CMS List (Admin View)
router.get('/', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), async (req, res) => {
    try {
        const [notices] = await db.query(`
            SELECT notices.*, users.name as author 
            FROM notices 
            LEFT JOIN users ON notices.created_by = users.id 
            ORDER BY created_at DESC
        `);
        res.render('notices/index', { notices, title: 'Notice Board CMS | Member D' });
    } catch (err) {
        console.error(err);
        res.render('notices/index', { notices: [], title: 'Notice Board CMS' });
    }
});

// Member D: Create Notice (Form)
router.get('/create', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), (req, res) => {
    res.render('notices/create', { title: 'Create New Notice' });
});

// Member D: Create Notice (Raw SQL)
router.post('/create', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), async (req, res) => {
    const { title, content, priority } = req.body;
    const created_by = req.session.user.id;
    try {
        await db.query(
            'INSERT INTO notices (title, content, priority, created_by) VALUES (?, ?, ?, ?)',
            [title, content, priority || 'Normal', created_by]
        );
        res.redirect('/notices');
    } catch (err) {
        console.error(err);
        res.render('notices/create', { error: 'Failed to create notice', title: 'Create New Notice' });
    }
});

// Member D: Delete Notice (Raw SQL)
router.post('/delete/:id', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), async (req, res) => {
    try {
        await db.query('DELETE FROM notices WHERE id = ?', [req.params.id]);
        res.redirect('/notices');
    } catch (err) {
        console.error(err);
        res.redirect('/notices');
    }
});

// Member D: Edit Notice (Form)
router.get('/edit/:id', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), async (req, res) => {
    try {
        const [notices] = await db.query('SELECT * FROM notices WHERE id = ?', [req.params.id]);
        if (notices.length === 0) return res.redirect('/notices');
        res.render('notices/edit', { notice: notices[0], title: 'Edit Notice' });
    } catch (err) {
        console.error(err);
        res.redirect('/notices');
    }
});

// Member D: Edit Notice (Raw SQL)
router.post('/edit/:id', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), async (req, res) => {
    const { title, content, priority } = req.body;
    try {
        await db.query(
            'UPDATE notices SET title = ?, content = ?, priority = ? WHERE id = ?',
            [title, content, priority || 'Normal', req.params.id]
        );
        res.redirect('/notices');
    } catch (err) {
        console.error(err);
        res.redirect('/notices');
    }
});

module.exports = router;
