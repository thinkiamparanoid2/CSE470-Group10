const db = require('../config/db');

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

        const [projects] = await db.query('SELECT id, name FROM projects WHERE status = "Ongoing"');
        const [materials] = await db.query('SELECT id, name FROM materials');

        res.render('material_requests/index', {
            title: 'Material Requests',
            user: req.session.user,
            requests, projects, materials,
            error: null
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}

// Create Material Request (Raw SQL)
async function createRequest(req, res) {
    const { project_id, material_id, quantity, priority } = req.body;
    try {
        await db.query(
            'INSERT INTO material_requests (project_id, material_id, quantity, priority, requested_by) VALUES (?, ?, ?, ?, ?)',
            [project_id, material_id, quantity, priority, req.session.user.id]
        );
        res.redirect('/material-requests');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}

// Update Request Status (PM/SuperAdmin only)
async function updateStatus(req, res) {
    const { status } = req.body;
    try {
        await db.query('UPDATE material_requests SET status = ? WHERE id = ?', [status, req.params.id]);
        res.redirect('/material-requests');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}

module.exports = {
    listRequests,
    createRequest,
    updateStatus
};
