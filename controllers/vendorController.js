const db = require('../config/db');

// Member B: Feature 1 - Vendor Directory & Rating List
async function listVendors(req, res) {
    try {
        const [vendors] = await db.query('SELECT * FROM vendors ORDER BY rating DESC');
        res.render('vendors/index', { vendors, title: 'Vendor Directory & Ratings | Member B' });
    } catch (err) {
        console.error(err);
        res.render('vendors/index', { vendors: [], title: 'Vendor Directory' });
    }
}

// Show Create Vendor Form
function showCreateForm(req, res) {
    res.render('vendors/create', { title: 'Add New Vendor' });
}

// Create Vendor (Raw SQL)
async function createVendor(req, res) {
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
}

// Show Edit Vendor Form
async function showEditForm(req, res) {
    try {
        const [vendors] = await db.query('SELECT * FROM vendors WHERE id = ?', [req.params.id]);
        if (vendors.length === 0) return res.redirect('/vendors');
        res.render('vendors/edit', { vendor: vendors[0], title: 'Edit Vendor' });
    } catch (err) {
        console.error(err);
        res.redirect('/vendors');
    }
}

// Update Vendor (Raw SQL)
async function updateVendor(req, res) {
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
}

// Delete Vendor (Raw SQL)
async function deleteVendor(req, res) {
    try {
        await db.query('DELETE FROM vendors WHERE id = ?', [req.params.id]);
        res.redirect('/vendors');
    } catch (err) {
        console.error(err);
        res.redirect('/vendors');
    }
}

module.exports = {
    listVendors,
    showCreateForm,
    createVendor,
    showEditForm,
    updateVendor,
    deleteVendor
};
