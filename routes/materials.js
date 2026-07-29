const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { isAuthenticated, hasRole } = require('../middleware/auth');

// Member A: Feature 1 - Material Stock Tracking List
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const [materials] = await db.query('SELECT * FROM materials ORDER BY name ASC');
        res.render('materials/index', { materials, title: 'Material Stock Tracking | Member A' });
    } catch (err) {
        console.error(err);
        res.render('materials/index', { materials: [], title: 'Material Stock Tracking' });
    }
});

// Member A: Create Material (Form)
router.get('/create', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), (req, res) => {
    res.render('materials/create', { title: 'Add New Material' });
});

// Member A: Create Material (Raw SQL)
router.post('/create', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), async (req, res) => {
    const { name, category, unit, current_stock, reorder_level, unit_price_est } = req.body;
    try {
        await db.query(
            'INSERT INTO materials (name, category, unit, current_stock, reorder_level, unit_price_est) VALUES (?, ?, ?, ?, ?, ?)',
            [name, category, unit, current_stock, reorder_level, unit_price_est]
        );
        res.redirect('/materials');
    } catch (err) {
        console.error(err);
        res.render('materials/create', { error: 'Failed to add material', title: 'Add New Material' });
    }
});

// Member A: Edit Material (Form)
router.get('/edit/:id', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), async (req, res) => {
    try {
        const [materials] = await db.query('SELECT * FROM materials WHERE id = ?', [req.params.id]);
        if (materials.length === 0) return res.redirect('/materials');
        res.render('materials/edit', { material: materials[0], title: 'Edit Material' });
    } catch (err) {
        console.error(err);
        res.redirect('/materials');
    }
});

// Member A: Edit Material (Raw SQL)
router.post('/edit/:id', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), async (req, res) => {
    const { name, category, unit, current_stock, reorder_level, unit_price_est } = req.body;
    try {
        await db.query(
            'UPDATE materials SET name = ?, category = ?, unit = ?, current_stock = ?, reorder_level = ?, unit_price_est = ? WHERE id = ?',
            [name, category, unit, current_stock, reorder_level, unit_price_est, req.params.id]
        );
        res.redirect('/materials');
    } catch (err) {
        console.error(err);
        res.redirect('/materials');
    }
});

// Member A: Delete Material
router.post('/delete/:id', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), async (req, res) => {
    try {
        await db.query('DELETE FROM materials WHERE id = ?', [req.params.id]);
        res.redirect('/materials');
    } catch (err) {
        console.error(err);
        res.redirect('/materials');
    }
});

module.exports = router;
