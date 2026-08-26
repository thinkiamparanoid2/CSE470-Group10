const db = require('../config/db');
const { isRequired, isPositiveNumber, sanitize } = require('../middleware/validate');

// Member A: Feature 1 - Material Stock Tracking List
async function listMaterials(req, res) {
    try {
        const [materials] = await db.query('SELECT * FROM materials ORDER BY name ASC');
        res.render('materials/index', { materials, title: 'Material Stock Tracking | Member A' });
    } catch (err) {
        console.error('List Materials Error:', err);
        res.render('materials/index', { materials: [], title: 'Material Stock Tracking', error: 'Failed to load materials.' });
    }
}

// Show Create Material Form
function showCreateForm(req, res) {
    res.render('materials/create', { title: 'Add New Material', error: null });
}

// Create Material (Raw SQL with Validation)
async function createMaterial(req, res) {
    const name = sanitize(req.body.name);
    const category = sanitize(req.body.category) || 'General';
    const unit = sanitize(req.body.unit);
    const current_stock = req.body.current_stock;
    const reorder_level = req.body.reorder_level;
    const unit_price_est = req.body.unit_price_est;

    // Validation
    if (!isRequired(name) || name.length < 2) {
        return res.render('error', { message: 'Validation Error: Material name is required and must be at least 2 characters.' });
    }
    if (!isRequired(unit)) {
        return res.render('error', { message: 'Validation Error: Measurement unit is required (e.g. Bags, Tons, Pcs, Cft).' });
    }
    if (!isPositiveNumber(current_stock) || parseFloat(current_stock) < 0) {
        return res.render('error', { message: 'Validation Error: Current stock quantity cannot be negative.' });
    }
    if (!isPositiveNumber(reorder_level) || parseFloat(reorder_level) < 0) {
        return res.render('error', { message: 'Validation Error: Reorder level threshold cannot be negative.' });
    }
    if (unit_price_est && (!isPositiveNumber(unit_price_est) || parseFloat(unit_price_est) < 0)) {
        return res.render('error', { message: 'Validation Error: Estimated unit price must be a valid positive number.' });
    }

    try {
        await db.query(
            'INSERT INTO materials (name, category, unit, current_stock, reorder_level, unit_price_est) VALUES (?, ?, ?, ?, ?, ?)',
            [name, category, unit, parseFloat(current_stock), parseFloat(reorder_level), parseFloat(unit_price_est || 0)]
        );
        res.redirect('/materials');
    } catch (err) {
        console.error('Create Material Error:', err);
        res.render('error', { message: 'Database Error: Could not save material item. Please try again.' });
    }
}

// Show Edit Material Form
async function showEditForm(req, res) {
    try {
        const materialId = parseInt(req.params.id, 10);
        if (isNaN(materialId)) {
            return res.render('error', { message: 'Invalid material ID provided.' });
        }
        const [materials] = await db.query('SELECT * FROM materials WHERE id = ?', [materialId]);
        if (materials.length === 0) {
            return res.render('error', { message: 'Material not found in database.' });
        }
        res.render('materials/edit', { material: materials[0], title: 'Edit Material' });
    } catch (err) {
        console.error('Show Edit Material Form Error:', err);
        res.render('error', { message: 'Database Error: Failed to retrieve material details.' });
    }
}

// Update Material (Raw SQL with Validation)
async function updateMaterial(req, res) {
    const materialId = parseInt(req.params.id, 10);
    if (isNaN(materialId)) {
        return res.render('error', { message: 'Invalid material ID provided.' });
    }

    const name = sanitize(req.body.name);
    const category = sanitize(req.body.category) || 'General';
    const unit = sanitize(req.body.unit);
    const current_stock = req.body.current_stock;
    const reorder_level = req.body.reorder_level;
    const unit_price_est = req.body.unit_price_est;

    // Validation
    if (!isRequired(name) || name.length < 2) {
        return res.render('error', { message: 'Validation Error: Material name is required and must be at least 2 characters.' });
    }
    if (!isRequired(unit)) {
        return res.render('error', { message: 'Validation Error: Measurement unit is required.' });
    }
    if (!isPositiveNumber(current_stock) || parseFloat(current_stock) < 0) {
        return res.render('error', { message: 'Validation Error: Current stock quantity cannot be negative.' });
    }
    if (!isPositiveNumber(reorder_level) || parseFloat(reorder_level) < 0) {
        return res.render('error', { message: 'Validation Error: Reorder level threshold cannot be negative.' });
    }
    if (unit_price_est && (!isPositiveNumber(unit_price_est) || parseFloat(unit_price_est) < 0)) {
        return res.render('error', { message: 'Validation Error: Estimated unit price must be a valid positive number.' });
    }

    try {
        await db.query(
            'UPDATE materials SET name = ?, category = ?, unit = ?, current_stock = ?, reorder_level = ?, unit_price_est = ? WHERE id = ?',
            [name, category, unit, parseFloat(current_stock), parseFloat(reorder_level), parseFloat(unit_price_est || 0), materialId]
        );
        res.redirect('/materials');
    } catch (err) {
        console.error('Update Material Error:', err);
        res.render('error', { message: 'Database Error: Could not update material record.' });
    }
}

// Delete Material (Raw SQL with Error Handling)
async function deleteMaterial(req, res) {
    const materialId = parseInt(req.params.id, 10);
    if (isNaN(materialId)) {
        return res.render('error', { message: 'Invalid material ID provided.' });
    }

    try {
        await db.query('DELETE FROM materials WHERE id = ?', [materialId]);
        res.redirect('/materials');
    } catch (err) {
        console.error('Delete Material Error:', err);
        res.render('error', { message: 'Database Error: Cannot delete this material because it is referenced in purchase orders, transfers, or BOQs.' });
    }
}

module.exports = {
    listMaterials,
    showCreateForm,
    createMaterial,
    showEditForm,
    updateMaterial,
    deleteMaterial
};
