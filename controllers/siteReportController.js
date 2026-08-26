const db = require('../config/db');
const { isRequired, isValidDate, sanitize } = require('../middleware/validate');

// List Daily Site Reports
async function listReports(req, res) {
    try {
        const { project_id, report_date } = req.query;
        let query = `
            SELECT dsr.*, p.name as project_name, p.location, u.name as engineer_name
            FROM daily_site_reports dsr
            JOIN projects p ON dsr.project_id = p.id
            LEFT JOIN users u ON dsr.site_engineer_id = u.id
            WHERE 1=1
        `;
        const params = [];
        if (project_id && project_id !== '') { 
            const pid = parseInt(project_id, 10);
            if (!isNaN(pid)) {
                query += ` AND dsr.project_id = ? `; 
                params.push(pid); 
            }
        }
        if (report_date && report_date !== '' && isValidDate(report_date)) { 
            query += ` AND dsr.report_date = ? `; 
            params.push(report_date); 
        }
        query += ` ORDER BY dsr.report_date DESC, dsr.created_at DESC`;

        const [reports] = await db.query(query, params);
        const [projects] = await db.query('SELECT id, name FROM projects ORDER BY name ASC');

        res.render('site_reports/index', {
            title: 'Daily Site Progress Reports',
            reports, projects,
            selectedProject: project_id || '', selectedDate: report_date || '',
            user: req.session.user
        });
    } catch (err) {
        console.error('List Site Reports Error:', err);
        res.render('site_reports/index', { title: 'Daily Site Reports', reports: [], projects: [], selectedProject: '', selectedDate: '', user: req.session.user, error: 'Could not load site reports.' });
    }
}

// Show Generate Report Form
async function showGenerateForm(req, res) {
    try {
        const { project_id, report_date } = req.query;
        const defaultDate = (report_date && isValidDate(report_date)) ? report_date : new Date().toISOString().split('T')[0];
        const [projects] = await db.query('SELECT * FROM projects WHERE status = "Ongoing" ORDER BY name ASC');

        let autoData = null;
        const parsedProjectId = project_id ? parseInt(project_id, 10) : null;

        if (parsedProjectId && !isNaN(parsedProjectId)) {
            const [labor] = await db.query('SELECT SUM(headcount) as total_workers, SUM(total_cost) as total_wage, GROUP_CONCAT(notes) as labor_notes FROM labor_logs WHERE project_id = ? AND log_date = ?', [parsedProjectId, defaultDate]);
            const [transfers] = await db.query('SELECT * FROM inventory_transfers WHERE to_project_id = ? AND DATE(created_at) = ?', [parsedProjectId, defaultDate]);
            autoData = {
                workers: (labor[0] && labor[0].total_workers) ? labor[0].total_workers : 0,
                wages: (labor[0] && labor[0].total_wage) ? labor[0].total_wage : 0,
                notes: (labor[0] && labor[0].labor_notes) ? labor[0].labor_notes : 'Standard operational tasks completed per site specifications.',
                transfersCount: transfers.length
            };
        }

        res.render('site_reports/generate', {
            title: 'Generate Daily Site Report',
            projects, selectedProjectId: project_id || '',
            defaultDate, autoData, user: req.session.user
        });
    } catch (err) {
        console.error('Show Generate Report Form Error:', err);
        res.render('error', { message: 'Database Error: Failed to initialize daily report generator.' });
    }
}

// Create Daily Site Report (Raw SQL with Validation)
async function createReport(req, res) {
    const project_id = parseInt(req.body.project_id, 10);
    const report_date = req.body.report_date;
    const weather_condition = sanitize(req.body.weather_condition) || 'Sunny & Clear';
    const general_progress = sanitize(req.body.general_progress);
    const safety_incidents = sanitize(req.body.safety_incidents) || 'No incidents reported. Zero harm site.';
    const site_engineer_id = req.session.user.id;

    // Validation
    if (isNaN(project_id)) {
        return res.render('error', { message: 'Validation Error: Please select a valid project for this site report.' });
    }
    if (!report_date || !isValidDate(report_date)) {
        return res.render('error', { message: 'Validation Error: A valid report date is required.' });
    }
    if (!isRequired(general_progress) || general_progress.length < 5) {
        return res.render('error', { message: 'Validation Error: General progress field must have a descriptive summary (at least 5 characters).' });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO daily_site_reports (project_id, report_date, weather_condition, general_progress, safety_incidents, site_engineer_id) VALUES (?, ?, ?, ?, ?, ?)',
            [project_id, report_date, weather_condition, general_progress, safety_incidents, site_engineer_id]
        );
        res.redirect(`/site-reports/${result.insertId}`);
    } catch (err) {
        console.error('Create Site Report Error:', err);
        res.render('error', { message: 'Database Error: Could not save daily site report.' });
    }
}

// View Specific Report with Aggregated Data
async function viewReport(req, res) {
    const reportId = parseInt(req.params.id, 10);
    if (isNaN(reportId)) {
        return res.render('error', { message: 'Invalid report ID.' });
    }

    try {
        const [reportRows] = await db.query(`
            SELECT dsr.*, p.name as project_name, p.location, u.name as engineer_name, u.email as engineer_email
            FROM daily_site_reports dsr
            JOIN projects p ON dsr.project_id = p.id
            LEFT JOIN users u ON dsr.site_engineer_id = u.id
            WHERE dsr.id = ?
        `, [reportId]);

        if (reportRows.length === 0) return res.status(404).render('error', { message: 'Daily Site Report not found in database.' });
        const report = reportRows[0];
        const dateStr = new Date(report.report_date).toISOString().split('T')[0];

        const [laborLogs] = await db.query(`SELECT ll.*, u.name as recorder FROM labor_logs ll LEFT JOIN users u ON ll.created_by = u.id WHERE ll.project_id = ? AND ll.log_date = ?`, [report.project_id, dateStr]);
        const [wasteLogs] = await db.query(`SELECT w.*, m.name as material_name, m.unit FROM material_waste_logs w JOIN materials m ON w.material_id = m.id WHERE w.project_id = ? AND w.log_date = ?`, [report.project_id, dateStr]);
        const [emergencyRequests] = await db.query(`SELECT mr.*, m.name as material_name, m.unit FROM material_requests mr JOIN materials m ON mr.material_id = m.id WHERE mr.project_id = ? AND DATE(mr.created_at) = ?`, [report.project_id, dateStr]);

        let totalHeadcount = 0, totalLaborCost = 0;
        laborLogs.forEach(l => { totalHeadcount += parseInt(l.headcount || 0); totalLaborCost += parseFloat(l.total_cost || 0); });

        res.render('site_reports/view', {
            title: `Daily Site Report #${report.id}`,
            report, laborLogs, wasteLogs, emergencyRequests,
            totalHeadcount, totalLaborCost, user: req.session.user
        });
    } catch (err) {
        console.error('View Site Report Error:', err);
        res.render('error', { message: 'Database Error: Failed to load detailed site report.' });
    }
}

module.exports = {
    listReports,
    showGenerateForm,
    createReport,
    viewReport
};
