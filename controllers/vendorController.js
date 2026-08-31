const db = require('../config/db');
const { isRequired, isValidEmail, isPositiveNumber, sanitize } = require('../middleware/validate');

// Member B: Feature 1 - Vendor Directory & Rating List
async function listVendors(req, res) {
    try {
        const [vendors] = await db.query('SELECT * FROM vendors ORDER BY rating DESC');
        res.render('vendors/index', { vendors, title: 'Vendor Directory & Ratings | Member B' });
    } catch (err) {
        console.error('List Vendors Error:', err);
        res.render('vendors/index', { vendors: [], title: 'Vendor Directory', error: 'Failed to load vendors.' });
    }
}

// Show Create Vendor Form
function showCreateForm(req, res) {
    res.render('vendors/create', { title: 'Add New Vendor' });
}

// Create Vendor (Raw SQL with Validation)
async function createVendor(req, res) {
    const company_name = sanitize(req.body.company_name);
    const contact_person = sanitize(req.body.contact_person);
    const email = sanitize(req.body.email);
    const phone = sanitize(req.body.phone);
    const address = sanitize(req.body.address);
    const material_category = sanitize(req.body.material_category) || 'General Supplies';
    const rating = req.body.rating;

    // Validation
    if (!isRequired(company_name) || company_name.length < 2) {
        return res.render('error', { message: 'Validation Error: Vendor company name is required and must be at least 2 characters.' });
    }
    if (!isRequired(phone)) {
        return res.render('error', { message: 'Validation Error: Vendor contact phone number is required.' });
    }
    if (email && !isValidEmail(email)) {
        return res.render('error', { message: 'Validation Error: Invalid vendor email address format.' });
    }
    if (rating && (!isPositiveNumber(rating) || parseFloat(rating) < 0 || parseFloat(rating) > 9.99)) {
        return res.render('error', { message: 'Validation Error: Vendor rating must be a number between 0.0 and 9.99.' });
    }

    try {
        await db.query(
            'INSERT INTO vendors (company_name, contact_person, email, phone, address, material_category, rating) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [company_name, contact_person || null, email || null, phone, address || null, material_category, parseFloat(rating || 5.00)]
        );
        res.redirect('/vendors');
    } catch (err) {
        console.error('Create Vendor Error:', err);
        res.render('error', { message: 'Database Error: Failed to save vendor record.' });
    }
}

// Show Edit Vendor Form
async function showEditForm(req, res) {
    const vendorId = parseInt(req.params.id, 10);
    if (isNaN(vendorId)) {
        return res.render('error', { message: 'Invalid vendor ID provided.' });
    }

    try {
        const [vendors] = await db.query('SELECT * FROM vendors WHERE id = ?', [vendorId]);
        if (vendors.length === 0) {
            return res.render('error', { message: 'Vendor record not found.' });
        }
        res.render('vendors/edit', { vendor: vendors[0], title: 'Edit Vendor' });
    } catch (err) {
        console.error('Show Edit Vendor Error:', err);
        res.render('error', { message: 'Database Error: Could not retrieve vendor profile.' });
    }
}

// Update Vendor (Raw SQL with Validation)
async function updateVendor(req, res) {
    const vendorId = parseInt(req.params.id, 10);
    if (isNaN(vendorId)) {
        return res.render('error', { message: 'Invalid vendor ID provided.' });
    }

    const company_name = sanitize(req.body.company_name);
    const contact_person = sanitize(req.body.contact_person);
    const email = sanitize(req.body.email);
    const phone = sanitize(req.body.phone);
    const address = sanitize(req.body.address);
    const material_category = sanitize(req.body.material_category) || 'General Supplies';
    const rating = req.body.rating;

    // Validation
    if (!isRequired(company_name) || company_name.length < 2) {
        return res.render('error', { message: 'Validation Error: Vendor company name is required and must be at least 2 characters.' });
    }
    if (!isRequired(phone)) {
        return res.render('error', { message: 'Validation Error: Contact phone number is required.' });
    }
    if (email && !isValidEmail(email)) {
        return res.render('error', { message: 'Validation Error: Invalid email format.' });
    }
    if (rating && (!isPositiveNumber(rating) || parseFloat(rating) < 0 || parseFloat(rating) > 9.99)) {
        return res.render('error', { message: 'Validation Error: Rating must be between 0.0 and 9.99.' });
    }

    try {
        await db.query(
            'UPDATE vendors SET company_name = ?, contact_person = ?, email = ?, phone = ?, address = ?, material_category = ?, rating = ? WHERE id = ?',
            [company_name, contact_person || null, email || null, phone, address || null, material_category, parseFloat(rating || 5.00), vendorId]
        );
        res.redirect('/vendors');
    } catch (err) {
        console.error('Update Vendor Error:', err);
        res.render('error', { message: 'Database Error: Could not update vendor record.' });
    }
}

// Delete Vendor (Raw SQL with Error Handling)
async function deleteVendor(req, res) {
    const vendorId = parseInt(req.params.id, 10);
    if (isNaN(vendorId)) {
        return res.render('error', { message: 'Invalid vendor ID provided.' });
    }

    try {
        await db.query('DELETE FROM vendors WHERE id = ?', [vendorId]);
        res.redirect('/vendors');
    } catch (err) {
        console.error('Delete Vendor Error:', err);
        res.render('error', { message: 'Database Error: Cannot delete this vendor because they have active purchase orders or contracts.' });
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
