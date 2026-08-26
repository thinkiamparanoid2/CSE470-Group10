const db = require('../config/db');
const { isPositiveNumber, sanitize } = require('../middleware/validate');

// List Material Requests (sorted by priority)
async function listRequests(req, res) {
    try {
        const [requests] = await db.query(`
            SELECT mr.*, p.name AS project_name, m.name AS material_name, u.name AS requester_name 
            FROM material_requests mr
            JOIN projects p ON mr.project_id = p.id
            JOIN materials m ON mr.material_id = m.id
            LEFT JOIN users u ON mr.requested_by = u.id
            ORDER BY 
                CASE mr.priority
                    WHEN 'Emergency' THEN 1
                    WHEN 'High' THEN 2
                    WHEN 'Normal' THEN 3
                END ASC,
                mr.created_at DESC
        `);

        const [projects] = await db.query('SELECT id, name FROM projects WHERE status = "Ongoing" ORDER BY name ASC');
        const [materials] = await db.query('SELECT id, name FROM materials ORDER BY name ASC');

        res.render('material_requests/index', {
            title: 'Material Requests',
            user: req.session.user,
            requests, projects, materials,
            error: null
        });
    } catch (err) {
        console.error('List Material Requests Error:', err);
        res.render('error', { message: 'Database Error: Could not retrieve material requests.' });
    }
}

// Create Material Request (Raw SQL with Validation)
async function createRequest(req, res) {
    const project_id = parseInt(req.body.project_id, 10);
    const material_id = parseInt(req.body.material_id, 10);
    const quantity = req.body.quantity;
    let priority = sanitize(req.body.priority) || 'Normal';
    if (priority === 'Urgent') priority = 'Emergency';
    const validPriorities = ['Emergency', 'High', 'Normal'];

    // Validation
    if (isNaN(project_id) || isNaN(material_id)) {
        return res.render('error', { message: 'Validation Error: Please select both a valid Project and Material.' });
    }
    if (!isPositiveNumber(quantity) || parseFloat(quantity) <= 0) {
        return res.render('error', { message: 'Validation Error: Requested quantity must be greater than zero.' });
    }
    if (!validPriorities.includes(priority)) {
        return res.render('error', { message: 'Validation Error: Invalid priority level specified.' });
    }

    try {
        await db.query(
            'INSERT INTO material_requests (project_id, material_id, quantity, priority, requested_by) VALUES (?, ?, ?, ?, ?)',
            [project_id, material_id, parseFloat(quantity), priority, req.session.user.id]
        );
        res.redirect('/material-requests');
    } catch (err) {
        console.error('Create Material Request Error:', err);
        res.render('error', { message: 'Database Error: Failed to submit material request.' });
    }
}

// Update Request Status (PM/SuperAdmin only)
async function updateStatus(req, res) {
    const requestId = parseInt(req.params.id, 10);
    const { status } = req.body;
    const validStatuses = ['Pending', 'Approved', 'Fulfilled', 'Rejected'];

    if (isNaN(requestId) || !validStatuses.includes(status)) {
        return res.render('error', { message: 'Validation Error: Invalid request record or status update.' });
    }

    try {
        await db.query('UPDATE material_requests SET status = ? WHERE id = ?', [status, requestId]);
        res.redirect('/material-requests');
    } catch (err) {
        console.error('Update Request Status Error:', err);
        res.render('error', { message: 'Database Error: Could not update material request status.' });
    }
}

module.exports = {
    listRequests,
    createRequest,
    updateStatus
};
