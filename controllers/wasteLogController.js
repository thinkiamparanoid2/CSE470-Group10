const db = require('../config/db');

// List Waste Logs
async function listWasteLogs(req, res) {
    try {
        const [logs] = await db.query(`
            SELECT wl.*, p.name AS project_name, m.name AS material_name, u.name AS logger_name 
            FROM material_waste_logs wl
            JOIN projects p ON wl.project_id = p.id
            JOIN materials m ON wl.material_id = m.id
            LEFT JOIN users u ON wl.logged_by = u.id
            ORDER BY wl.log_date DESC, wl.created_at DESC
        `);

        const [projects] = await db.query('SELECT id, name FROM projects WHERE status = "Ongoing"');
        const [materials] = await db.query('SELECT id, name FROM materials');

        res.render('waste_logs/index', {
            title: 'Material Waste Logs',
            user: req.session.user,
            logs, projects, materials,
            error: null
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}

// Create Waste Log (Raw SQL)
async function createWasteLog(req, res) {
    const { project_id, material_id, waste_quantity, reason, log_date } = req.body;
    try {
        await db.query(
            'INSERT INTO material_waste_logs (project_id, material_id, waste_quantity, reason, log_date, logged_by) VALUES (?, ?, ?, ?, ?, ?)',
            [project_id, material_id, waste_quantity, reason, log_date, req.session.user.id]
        );
        res.redirect('/waste-logs');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}

module.exports = {
    listWasteLogs,
    createWasteLog
};
