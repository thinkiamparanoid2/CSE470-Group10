const db = require('../config/db');
const { isPositiveNumber, isValidDate, sanitize } = require('../middleware/validate');

// List Labor Logs
async function listLaborLogs(req, res) {
    try {
        const [laborLogs] = await db.query(`
            SELECT ll.*, p.name as project_name, u.name as created_by_name 
            FROM labor_logs ll
            JOIN projects p ON ll.project_id = p.id
            LEFT JOIN users u ON ll.created_by = u.id
            ORDER BY ll.log_date DESC, ll.created_at DESC
        `);
        res.render('labor/index', { laborLogs, title: 'Labor Attendance & Cost' });
    } catch (err) {
        console.error('List Labor Logs Error:', err);
        res.render('labor/index', { laborLogs: [], title: 'Labor Attendance & Cost', error: 'Failed to load labor logs.' });
    }
}

// Show Create Labor Log Form
async function showCreateForm(req, res) {
    try {
        const [projects] = await db.query('SELECT * FROM projects WHERE status = "Ongoing" ORDER BY name ASC');
        res.render('labor/create', { projects, title: 'Log Daily Labor' });
    } catch (err) {
        console.error('Show Create Labor Form Error:', err);
        res.render('error', { message: 'Database Error: Could not load projects for labor logging.' });
    }
}

// Create Labor Log (Raw SQL with Validation)
async function createLaborLog(req, res) {
    const project_id = parseInt(req.body.project_id, 10);
    const log_date = req.body.log_date;
    const headcount = parseInt(req.body.headcount, 10);
    const total_cost = req.body.total_cost;
    const notes = sanitize(req.body.notes);
    const created_by = req.session.user.id;

    // Validation
    if (isNaN(project_id)) {
        return res.render('error', { message: 'Validation Error: Please select a valid construction project.' });
    }
    if (!log_date || !isValidDate(log_date)) {
        return res.render('error', { message: 'Validation Error: A valid attendance date is required.' });
    }
    if (isNaN(headcount) || headcount <= 0) {
        return res.render('error', { message: 'Validation Error: Worker headcount must be a whole number of at least 1.' });
    }
    if (!isPositiveNumber(total_cost) || parseFloat(total_cost) < 0) {
        return res.render('error', { message: 'Validation Error: Total daily labor wage cost cannot be negative.' });
    }

    try {
        await db.query(
            'INSERT INTO labor_logs (project_id, log_date, headcount, total_cost, notes, created_by) VALUES (?, ?, ?, ?, ?, ?)',
            [project_id, log_date, headcount, parseFloat(total_cost), notes || null, created_by]
        );
        res.redirect('/labor');
    } catch (err) {
        console.error('Create Labor Log Error:', err);
        res.render('error', { message: 'Database Error: Failed to save daily labor log.' });
    }
}

module.exports = {
    listLaborLogs,
    showCreateForm,
    createLaborLog
};
