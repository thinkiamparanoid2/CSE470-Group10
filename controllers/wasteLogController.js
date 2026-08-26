const db = require('../config/db');
const { isPositiveNumber, isRequired, isValidDate, sanitize } = require('../middleware/validate');

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

        const [projects] = await db.query('SELECT id, name FROM projects WHERE status = "Ongoing" ORDER BY name ASC');
        const [materials] = await db.query('SELECT id, name FROM materials ORDER BY name ASC');

        res.render('waste_logs/index', {
            title: 'Material Waste Logs',
            user: req.session.user,
            logs, projects, materials,
            error: null
        });
    } catch (err) {
        console.error('List Waste Logs Error:', err);
        res.render('error', { message: 'Database Error: Failed to retrieve waste logs.' });
    }
}

// Create Waste Log (Raw SQL with Validation)
async function createWasteLog(req, res) {
    const project_id = parseInt(req.body.project_id, 10);
    const material_id = parseInt(req.body.material_id, 10);
    const waste_quantity = req.body.waste_quantity;
    const reason = sanitize(req.body.reason);
    const log_date = req.body.log_date;

    // Validation
    if (isNaN(project_id) || isNaN(material_id)) {
        return res.render('error', { message: 'Validation Error: Please select both a Project and Material.' });
    }
    if (!isPositiveNumber(waste_quantity) || parseFloat(waste_quantity) <= 0) {
        return res.render('error', { message: 'Validation Error: Wasted quantity must be greater than zero.' });
    }
    if (!isRequired(reason) || reason.length < 3) {
        return res.render('error', { message: 'Validation Error: Please provide a descriptive reason for material wastage.' });
    }
    if (!log_date || !isValidDate(log_date)) {
        return res.render('error', { message: 'Validation Error: A valid incident log date is required.' });
    }

    try {
        await db.query(
            'INSERT INTO material_waste_logs (project_id, material_id, waste_quantity, reason, log_date, logged_by) VALUES (?, ?, ?, ?, ?, ?)',
            [project_id, material_id, parseFloat(waste_quantity), reason, log_date, req.session.user.id]
        );
        res.redirect('/waste-logs');
    } catch (err) {
        console.error('Create Waste Log Error:', err);
        res.render('error', { message: 'Database Error: Could not save material waste log.' });
    }
}

module.exports = {
    listWasteLogs,
    createWasteLog
};
