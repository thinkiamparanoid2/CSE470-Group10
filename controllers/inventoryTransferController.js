const db = require('../config/db');

// List Inventory Transfers
async function listTransfers(req, res) {
    try {
        const [transfers] = await db.query(`
            SELECT it.*, m.name as material_name, m.unit, 
                   p1.name as from_project_name, 
                   p2.name as to_project_name, 
                   u.name as created_by_name 
            FROM inventory_transfers it
            JOIN materials m ON it.material_id = m.id
            JOIN projects p1 ON it.from_project_id = p1.id
            JOIN projects p2 ON it.to_project_id = p2.id
            LEFT JOIN users u ON it.created_by = u.id
            ORDER BY it.created_at DESC
        `);
        res.render('inventory_transfers/index', { transfers, title: 'Inventory Transfers' });
    } catch (err) {
        console.error(err);
        res.render('inventory_transfers/index', { transfers: [], title: 'Inventory Transfers' });
    }
}

// Show Create Transfer Form
async function showCreateForm(req, res) {
    try {
        const [materials] = await db.query('SELECT * FROM materials');
        const [projects] = await db.query('SELECT * FROM projects WHERE status = "Ongoing"');
        res.render('inventory_transfers/create', { materials, projects, title: 'Request Inventory Transfer' });
    } catch (err) {
        console.error(err);
        res.redirect('/inventory-transfers');
    }
}

// Create Transfer Request (Raw SQL)
async function createTransfer(req, res) {
    const { material_id, from_project_id, to_project_id, quantity } = req.body;
    const created_by = req.session.user.id;

    if (from_project_id === to_project_id) {
        return res.redirect('/inventory-transfers/create');
    }

    try {
        await db.query(
            'INSERT INTO inventory_transfers (material_id, from_project_id, to_project_id, quantity, created_by) VALUES (?, ?, ?, ?, ?)',
            [material_id, from_project_id, to_project_id, quantity, created_by]
        );
        res.redirect('/inventory-transfers');
    } catch (err) {
        console.error(err);
        res.redirect('/inventory-transfers/create');
    }
}

// Update Transfer Status (Raw SQL)
async function updateStatus(req, res) {
    const { status } = req.body;
    try {
        await db.query('UPDATE inventory_transfers SET status = ? WHERE id = ?', [status, req.params.id]);
        res.redirect('/inventory-transfers');
    } catch (err) {
        console.error(err);
        res.redirect('/inventory-transfers');
    }
}

module.exports = {
    listTransfers,
    showCreateForm,
    createTransfer,
    updateStatus
};
