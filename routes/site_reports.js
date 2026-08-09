const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { isAuthenticated, hasRole } = require('../middleware/auth');

// GET /site-reports - List Daily Site Reports (Member C)
router.get('/', isAuthenticated, async (req, res) => {
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
            query += ` AND dsr.project_id = ? `;
            params.push(project_id);
        }
        if (report_date && report_date !== '') {
            query += ` AND dsr.report_date = ? `;
            params.push(report_date);
        }

        query += ` ORDER BY dsr.report_date DESC, dsr.created_at DESC`;

        const [reports] = await db.query(query, params);
        const [projects] = await db.query('SELECT id, name FROM projects ORDER BY name ASC');

        res.render('site_reports/index', {
            title: 'Daily Site Progress Reports',
            reports,
            projects,
            selectedProject: project_id || '',
            selectedDate: report_date || '',
            user: req.session.user
        });
    } catch (err) {
        console.error('Error fetching site reports:', err);
        res.render('site_reports/index', { title: 'Daily Site Reports', reports: [], projects: [], selectedProject: '', selectedDate: '', user: req.session.user });
    }
});

// GET /site-reports/generate - Form to Generate Daily Site Log
router.get('/generate', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer'), async (req, res) => {
    try {
        const { project_id, report_date } = req.query;
        const defaultDate = report_date || new Date().toISOString().split('T')[0];

        const [projects] = await db.query('SELECT * FROM projects WHERE status = "Ongoing" ORDER BY name ASC');
        
        let autoData = null;
        if (project_id) {
            // Fetch labor log for this date
            const [labor] = await db.query('SELECT SUM(headcount) as total_workers, SUM(total_cost) as total_wage, GROUP_CONCAT(notes) as labor_notes FROM labor_logs WHERE project_id = ? AND log_date = ?', [project_id, defaultDate]);
            // Fetch emergency requests or transfers arriving on this date
            const [transfers] = await db.query('SELECT * FROM inventory_transfers WHERE to_project_id = ? AND DATE(created_at) = ?', [project_id, defaultDate]);
            
            autoData = {
                workers: labor[0].total_workers || 0,
                wages: labor[0].total_wage || 0,
                notes: labor[0].labor_notes || 'Standard operational tasks completed per site specifications.',
                transfersCount: transfers.length
            };
        }

        res.render('site_reports/generate', {
            title: 'Generate Daily Site Report',
            projects,
            selectedProjectId: project_id || '',
            defaultDate,
            autoData,
            user: req.session.user
        });
    } catch (err) {
        console.error('Error in report generate form:', err);
        res.redirect('/site-reports');
    }
});

// POST /site-reports/create - Save Daily Site Report
router.post('/create', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer'), async (req, res) => {
    const { project_id, report_date, weather_condition, general_progress, safety_incidents } = req.body;
    const site_engineer_id = req.session.user.id;

    try {
        const [result] = await db.query(
            'INSERT INTO daily_site_reports (project_id, report_date, weather_condition, general_progress, safety_incidents, site_engineer_id) VALUES (?, ?, ?, ?, ?, ?)',
            [project_id, report_date, weather_condition || 'Sunny & Clear', general_progress, safety_incidents || 'No incidents reported. Zero harm site.', site_engineer_id]
        );
        res.redirect(`/site-reports/${result.insertId}`);
    } catch (err) {
        console.error('Error creating daily site report:', err);
        res.redirect('/site-reports/generate');
    }
});

// GET /site-reports/:id - View specific Daily Site Report & System-Aggregated Log Data
router.get('/:id', isAuthenticated, async (req, res) => {
    try {
        const reportId = req.params.id;
        const [reportRows] = await db.query(`
            SELECT dsr.*, p.name as project_name, p.location, u.name as engineer_name, u.email as engineer_email
            FROM daily_site_reports dsr
            JOIN projects p ON dsr.project_id = p.id
            LEFT JOIN users u ON dsr.site_engineer_id = u.id
            WHERE dsr.id = ?
        `, [reportId]);

        if (reportRows.length === 0) {
            return res.status(404).render('error', { message: 'Daily Site Report not found' });
        }
        const report = reportRows[0];
        const dateStr = new Date(report.report_date).toISOString().split('T')[0];

        // System-generated aggregations for that exact day & project
        const [laborLogs] = await db.query(`
            SELECT ll.*, u.name as recorder 
            FROM labor_logs ll 
            LEFT JOIN users u ON ll.created_by = u.id
            WHERE ll.project_id = ? AND ll.log_date = ?
        `, [report.project_id, dateStr]);

        const [wasteLogs] = await db.query(`
            SELECT w.*, m.name as material_name, m.unit
            FROM material_waste_logs w
            JOIN materials m ON w.material_id = m.id
            WHERE w.project_id = ? AND w.log_date = ?
        `, [report.project_id, dateStr]);

        const [emergencyRequests] = await db.query(`
            SELECT mr.*, m.name as material_name, m.unit
            FROM material_requests mr
            JOIN materials m ON mr.material_id = m.id
            WHERE mr.project_id = ? AND DATE(mr.created_at) = ?
        `, [report.project_id, dateStr]);

        let totalHeadcount = 0;
        let totalLaborCost = 0;
        laborLogs.forEach(l => {
            totalHeadcount += parseInt(l.headcount || 0);
            totalLaborCost += parseFloat(l.total_cost || 0);
        });

        res.render('site_reports/view', {
            title: `Daily Site Report #${report.id}`,
            report,
            laborLogs,
            wasteLogs,
            emergencyRequests,
            totalHeadcount,
            totalLaborCost,
            user: req.session.user
        });
    } catch (err) {
        console.error('Error loading daily site report:', err);
        res.redirect('/site-reports');
    }
});

module.exports = router;
