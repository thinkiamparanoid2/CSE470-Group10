const db = require('../config/db');

// Member A: Feature 1 - Material Stock Tracking List
async function listMaterials(req, res) {
    try {
        const [materials] = await db.query('SELECT * FROM materials ORDER BY name ASC');
        res.render('materials/index', { materials, title: 'Material Stock Tracking | Member A' });
    } catch (err) {
        console.error(err);
        res.render('materials/index', { materials: [], title: 'Material Stock Tracking' });
    }
}

// Show Create Material Form
function showCreateForm(req, res) {
    res.render('materials/create', { title: 'Add New Material' });
}

// Create Material (Raw SQL)
async function createMaterial(req, res) {
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
}

// Show Edit Material Form
async function showEditForm(req, res) {
    try {
        const [materials] = await db.query('SELECT * FROM materials WHERE id = ?', [req.params.id]);
        if (materials.length === 0) return res.redirect('/materials');
        res.render('materials/edit', { material: materials[0], title: 'Edit Material' });
    } catch (err) {
        console.error(err);
        res.redirect('/materials');
    }
}

// Update Material (Raw SQL)
async function updateMaterial(req, res) {
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
}

// Delete Material (Raw SQL)
async function deleteMaterial(req, res) {
    try {
        await db.query('DELETE FROM materials WHERE id = ?', [req.params.id]);
        res.redirect('/materials');
    } catch (err) {
        console.error(err);
        res.redirect('/materials');
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
