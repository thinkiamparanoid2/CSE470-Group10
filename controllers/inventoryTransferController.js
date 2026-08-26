const db = require('../config/db');
const { isPositiveNumber } = require('../middleware/validate');

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
        console.error('List Transfers Error:', err);
        res.render('inventory_transfers/index', { transfers: [], title: 'Inventory Transfers', error: 'Failed to load transfer records.' });
    }
}

// Show Create Transfer Form
async function showCreateForm(req, res) {
    try {
        const [materials] = await db.query('SELECT * FROM materials ORDER BY name ASC');
        const [projects] = await db.query('SELECT * FROM projects WHERE status = "Ongoing" ORDER BY name ASC');
        res.render('inventory_transfers/create', { materials, projects, title: 'Request Inventory Transfer' });
    } catch (err) {
        console.error('Show Create Transfer Form Error:', err);
        res.render('error', { message: 'Database Error: Could not load transfer form resources.' });
    }
}

// Create Transfer Request (Raw SQL with Validation)
async function createTransfer(req, res) {
    const material_id = parseInt(req.body.material_id, 10);
    const from_project_id = parseInt(req.body.from_project_id, 10);
    const to_project_id = parseInt(req.body.to_project_id, 10);
    const quantity = req.body.quantity;
    const created_by = req.session.user.id;

    // Validation
    if (isNaN(material_id)) {
        return res.render('error', { message: 'Validation Error: Please select a valid material to transfer.' });
    }
    if (isNaN(from_project_id) || isNaN(to_project_id)) {
        return res.render('error', { message: 'Validation Error: Both Source and Destination projects must be selected.' });
    }
    if (from_project_id === to_project_id) {
        return res.render('error', { message: 'Validation Error: Source and Destination construction sites cannot be the same project.' });
    }
    if (!isPositiveNumber(quantity) || parseFloat(quantity) <= 0) {
        return res.render('error', { message: 'Validation Error: Transfer quantity must be greater than zero.' });
    }

    try {
        await db.query(
            'INSERT INTO inventory_transfers (material_id, from_project_id, to_project_id, quantity, created_by) VALUES (?, ?, ?, ?, ?)',
            [material_id, from_project_id, to_project_id, parseFloat(quantity), created_by]
        );
        res.redirect('/inventory-transfers');
    } catch (err) {
        console.error('Create Transfer Error:', err);
        res.render('error', { message: 'Database Error: Failed to record inventory transfer request.' });
    }
}

// Update Transfer Status (Raw SQL with Validation)
async function updateStatus(req, res) {
    const transferId = parseInt(req.params.id, 10);
    const { status } = req.body;
    const validStatuses = ['Requested', 'Approved', 'In Transit', 'Completed', 'Rejected'];

    if (isNaN(transferId) || !validStatuses.includes(status)) {
        return res.render('error', { message: 'Validation Error: Invalid transfer record or status action.' });
    }

    try {
        const [existing] = await db.query('SELECT id, status FROM inventory_transfers WHERE id = ?', [transferId]);
        if (existing.length === 0) {
            return res.render('error', { message: 'Validation Error: Transfer record not found.' });
        }

        await db.query('UPDATE inventory_transfers SET status = ? WHERE id = ?', [status, transferId]);
        res.redirect('/inventory-transfers');
    } catch (err) {
        console.error('Update Transfer Status Error:', err);
        res.render('error', { message: 'Database Error: Could not update transfer status.' });
    }
}

module.exports = {
    listTransfers,
    showCreateForm,
    createTransfer,
    updateStatus
};
