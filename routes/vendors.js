const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { isAuthenticated, hasRole } = require('../middleware/auth');

// Member B: Feature 1 - Vendor Directory & Rating List
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const [vendors] = await db.query('SELECT * FROM vendors ORDER BY rating DESC');
        res.render('vendors/index', { vendors, title: 'Vendor Directory & Ratings | Member B' });
    } catch (err) {
        console.error(err);
        res.render('vendors/index', { vendors: [], title: 'Vendor Directory' });
    }
});

// Member B: Create Vendor (Form)
router.get('/create', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), (req, res) => {
    res.render('vendors/create', { title: 'Add New Vendor' });
});

// Member B: Create Vendor (Raw SQL)
router.post('/create', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), async (req, res) => {
    const { company_name, contact_person, email, phone, address, material_category, rating } = req.body;
    try {
        await db.query(
            'INSERT INTO vendors (company_name, contact_person, email, phone, address, material_category, rating) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [company_name, contact_person, email, phone, address, material_category, rating || 5.00]
        );
        res.redirect('/vendors');
    } catch (err) {
        console.error(err);
        res.render('vendors/create', { error: 'Failed to add vendor profile', title: 'Add New Vendor' });
    }
});

// Member B: Edit Vendor (Form)
router.get('/edit/:id', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), async (req, res) => {
    try {
        const [vendors] = await db.query('SELECT * FROM vendors WHERE id = ?', [req.params.id]);
        if (vendors.length === 0) return res.redirect('/vendors');
        res.render('vendors/edit', { vendor: vendors[0], title: 'Edit Vendor' });
    } catch (err) {
        console.error(err);
        res.redirect('/vendors');
    }
});

// Member B: Edit Vendor (Raw SQL)
router.post('/edit/:id', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), async (req, res) => {
    const { company_name, contact_person, email, phone, address, material_category, rating } = req.body;
    try {
        await db.query(
            'UPDATE vendors SET company_name = ?, contact_person = ?, email = ?, phone = ?, address = ?, material_category = ?, rating = ? WHERE id = ?',
            [company_name, contact_person, email, phone, address, material_category, rating || 5.00, req.params.id]
        );
        res.redirect('/vendors');
    } catch (err) {
        console.error(err);
        res.redirect('/vendors');
    }
});

// Member B: Delete Vendor
router.post('/delete/:id', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), async (req, res) => {
    try {
        await db.query('DELETE FROM vendors WHERE id = ?', [req.params.id]);
        res.redirect('/vendors');
    } catch (err) {
        console.error(err);
        res.redirect('/vendors');
    }
});

module.exports = router;
