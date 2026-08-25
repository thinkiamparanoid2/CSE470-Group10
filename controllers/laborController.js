const db = require('../config/db');

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
        console.error(err);
        res.render('labor/index', { laborLogs: [], title: 'Labor Attendance & Cost' });
    }
}

// Show Create Labor Log Form
async function showCreateForm(req, res) {
    try {
        const [projects] = await db.query('SELECT * FROM projects WHERE status = "Ongoing"');
        res.render('labor/create', { projects, title: 'Log Daily Labor' });
    } catch (err) {
        console.error(err);
        res.redirect('/labor');
    }
}

// Create Labor Log (Raw SQL)
async function createLaborLog(req, res) {
    const { project_id, log_date, headcount, total_cost, notes } = req.body;
    const created_by = req.session.user.id;

    try {
        await db.query(
            'INSERT INTO labor_logs (project_id, log_date, headcount, total_cost, notes, created_by) VALUES (?, ?, ?, ?, ?, ?)',
            [project_id, log_date, headcount, total_cost, notes, created_by]
        );
        res.redirect('/labor');
    } catch (err) {
        console.error(err);
        res.redirect('/labor/create');
    }
}

module.exports = {
    listLaborLogs,
    showCreateForm,
    createLaborLog
};
