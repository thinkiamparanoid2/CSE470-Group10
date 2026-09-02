const db = require('../config/db');
const { isValidDate } = require('../middleware/validate');

// Helper function to aggregate financials for a project
async function calculateProjectFinancials(projectId, startDate = null, endDate = null) {
    let dateFilterLabor = '';
    let dateFilterWaste = '';
    let dateFilterReq = '';

    const laborParams = startDate && endDate ? [projectId, startDate, endDate] : [projectId];
    const wasteParams = startDate && endDate ? [projectId, startDate, endDate] : [projectId];
    const reqParams = startDate && endDate ? [projectId, startDate, endDate + ' 23:59:59'] : [projectId];

    if (startDate && endDate) {
        dateFilterLabor = ' AND log_date BETWEEN ? AND ? ';
        dateFilterWaste = ' AND w.log_date BETWEEN ? AND ? ';
        dateFilterReq = ' AND mr.created_at BETWEEN ? AND ? ';
    }

    const [laborRows] = await db.query(`
        SELECT COALESCE(SUM(total_cost), 0) as labor_cost, COALESCE(SUM(headcount), 0) as headcount, COUNT(*) as log_days
        FROM labor_logs WHERE project_id = ? ${dateFilterLabor}
    `, laborParams);

    const [wasteRows] = await db.query(`
        SELECT COALESCE(SUM(w.waste_quantity * m.unit_price_est), 0) as waste_cost, COALESCE(SUM(w.waste_quantity), 0) as total_waste_qty
        FROM material_waste_logs w JOIN materials m ON w.material_id = m.id
        WHERE w.project_id = ? ${dateFilterWaste}
    `, wasteParams);

    // Only Approved/Fulfilled requests represent real or committed spend — Pending and
    // Rejected requests must never be counted, or the report overstates expenditure
    // for money that was never actually spent.
    const [matRows] = await db.query(`
        SELECT COALESCE(SUM(mr.quantity * m.unit_price_est), 0) as material_req_cost
        FROM material_requests mr JOIN materials m ON mr.material_id = m.id
        WHERE mr.project_id = ? AND mr.status IN ('Approved', 'Fulfilled') ${dateFilterReq}
    `, reqParams);

    // Only count transfers that have actually completed delivery — a merely Requested,
    // Approved-but-not-moved, In Transit, or Rejected transfer has not yet cost the
    // receiving project anything.
    const [transferRows] = await db.query(`
        SELECT COALESCE(SUM(it.quantity * m.unit_price_est), 0) as transfer_cost
        FROM inventory_transfers it JOIN materials m ON it.material_id = m.id
        WHERE it.to_project_id = ? AND it.status = 'Completed'
    `, [projectId]);

    const laborCost = parseFloat(laborRows[0].labor_cost);
    const wasteCost = parseFloat(wasteRows[0].waste_cost);
    const materialCost = parseFloat(matRows[0].material_req_cost) + parseFloat(transferRows[0].transfer_cost);
    const totalExpenditure = laborCost + wasteCost + materialCost;

    return {
        labor: { cost: laborCost, headcount: laborRows[0].headcount, days: laborRows[0].log_days },
        waste: { cost: wasteCost, quantity: wasteRows[0].total_waste_qty },
        materialCost,
        totalExpenditure
    };
}

// Project Expense Overview
async function listExpenses(req, res) {
    try {
        const [projects] = await db.query('SELECT * FROM projects ORDER BY name ASC');
        for (let p of projects) {
            const financials = await calculateProjectFinancials(p.id);
            p.totalExpenditure = financials.totalExpenditure;
            p.remainingBudget = parseFloat(p.budget) - financials.totalExpenditure;
        }
        res.render('expenses/index', { title: 'Project Expense Report & Financials Export', projects, user: req.session.user });
    } catch (err) {
        console.error('List Expenses Error:', err);
        res.render('expenses/index', { title: 'Project Expense Reports', projects: [], user: req.session.user, error: 'Could not load expense overview.' });
    }
}

// Detailed Expense Report (with Validation)
async function generateReport(req, res) {
    const projectId = parseInt(req.query.project_id, 10);
    const { start_date, end_date } = req.query;

    if (isNaN(projectId)) {
        return res.redirect('/expenses');
    }

    if (start_date && !isValidDate(start_date)) {
        return res.render('error', { message: 'Validation Error: Invalid start date filter.' });
    }
    if (end_date && !isValidDate(end_date)) {
        return res.render('error', { message: 'Validation Error: Invalid end date filter.' });
    }
    if (start_date && end_date && new Date(start_date) > new Date(end_date)) {
        return res.render('error', { message: 'Validation Error: Filter start date cannot be later than end date.' });
    }

    try {
        const [pRows] = await db.query('SELECT * FROM projects WHERE id = ?', [projectId]);
        if (pRows.length === 0) return res.status(404).render('error', { message: 'Project site record not found.' });
        const project = pRows[0];
        const financials = await calculateProjectFinancials(projectId, start_date, end_date);

        const laborParams = start_date && end_date ? [projectId, start_date, end_date] : [projectId];
        const wasteParams = start_date && end_date ? [projectId, start_date, end_date] : [projectId];
        const reqParams = start_date && end_date ? [projectId, start_date, end_date + ' 23:59:59'] : [projectId];

        const dateFilterLabor = start_date && end_date ? ' AND ll.log_date BETWEEN ? AND ? ' : '';
        const dateFilterWaste = start_date && end_date ? ' AND w.log_date BETWEEN ? AND ? ' : '';
        const dateFilterReq = start_date && end_date ? ' AND mr.created_at BETWEEN ? AND ? ' : '';

        const [laborLogs] = await db.query(`
            SELECT ll.*, u.name as recorder FROM labor_logs ll 
            LEFT JOIN users u ON ll.created_by = u.id
            WHERE ll.project_id = ? ${dateFilterLabor} ORDER BY ll.log_date DESC
        `, laborParams);

        const [wasteLogs] = await db.query(`
            SELECT w.*, m.name as material_name, m.unit, m.unit_price_est, (w.waste_quantity * m.unit_price_est) as est_loss
            FROM material_waste_logs w JOIN materials m ON w.material_id = m.id
            WHERE w.project_id = ? ${dateFilterWaste} ORDER BY w.log_date DESC
        `, wasteParams);

        const [matRequests] = await db.query(`
            SELECT mr.*, m.name as material_name, m.unit, m.unit_price_est, (mr.quantity * m.unit_price_est) as est_cost
            FROM material_requests mr JOIN materials m ON mr.material_id = m.id
            WHERE mr.project_id = ? ${dateFilterReq} ORDER BY mr.created_at DESC
        `, reqParams);

        const [transfersIn] = await db.query(`
            SELECT it.*, m.name as material_name, m.unit, m.unit_price_est, (it.quantity * m.unit_price_est) as est_cost,
                   p.name as from_project_name
            FROM inventory_transfers it
            JOIN materials m ON it.material_id = m.id
            JOIN projects p ON it.from_project_id = p.id
            WHERE it.to_project_id = ? ORDER BY it.created_at DESC
        `, [projectId]);

        res.render('expenses/report', {
            title: `Expense Report: ${project.name}`,
            project, financials, laborLogs, wasteLogs, matRequests, transfersIn,
            startDate: start_date || '', endDate: end_date || '',
            user: req.session.user
        });
    } catch (err) {
        console.error('Generate Expense Report Error:', err);
        res.render('error', { message: 'Database Error: Could not compute consolidated project expenses.' });
    }
}

// Export CSV (with Validation & Error Handling)
async function exportCsv(req, res) {
    const projectId = parseInt(req.query.project_id, 10);
    const { start_date, end_date } = req.query;

    if (isNaN(projectId)) {
        return res.status(400).send('Project ID is required');
    }

    try {
        const [pRows] = await db.query('SELECT * FROM projects WHERE id = ?', [projectId]);
        if (pRows.length === 0) return res.status(404).send('Project not found');
        const project = pRows[0];

        const financials = await calculateProjectFinancials(projectId, start_date, end_date);
        const [laborLogs] = await db.query('SELECT * FROM labor_logs WHERE project_id = ? ORDER BY log_date DESC', [projectId]);
        const [wasteLogs] = await db.query(`
            SELECT w.*, m.name as material_name, m.unit, (w.waste_quantity * m.unit_price_est) as est_loss
            FROM material_waste_logs w JOIN materials m ON w.material_id = m.id WHERE w.project_id = ? ORDER BY w.log_date DESC
        `, [projectId]);

        let csv = '\uFEFF';
        csv += `Consolidated Project Expense & Financial Report\n`;
        csv += `Project Name,${project.name.replace(/,/g, ' ')}\n`;
        csv += `Location,${(project.location || '').replace(/,/g, ' ')}\n`;
        csv += `Report Date,${new Date().toLocaleDateString()}\n`;
        if (start_date && end_date) csv += `Filter Period,${start_date} to ${end_date}\n`;
        csv += `\n--- Financial Executive Summary ---\n`;
        csv += `Total Project Budget (BDT),${project.budget}\n`;
        csv += `Estimated Material & Transfer Spend (BDT),${financials.materialCost.toFixed(2)}\n`;
        csv += `Total Workforce Labor Cost (BDT),${financials.labor.cost.toFixed(2)}\n`;
        csv += `Material Wastage Valuation Loss (BDT),${financials.waste.cost.toFixed(2)}\n`;
        csv += `Grand Total Expenditure (BDT),${financials.totalExpenditure.toFixed(2)}\n`;
        csv += `Remaining Budget Variance (BDT),${(parseFloat(project.budget) - financials.totalExpenditure).toFixed(2)}\n\n`;

        csv += `--- Labor Attendance & Wage Log Details ---\n`;
        csv += `Log Date,Headcount,Total Cost (BDT),Notes\n`;
        laborLogs.forEach(ll => {
            csv += `${new Date(ll.log_date).toLocaleDateString()},${ll.headcount},${ll.total_cost},"${(ll.notes || '').replace(/"/g, '""')}"\n`;
        });

        csv += `\n--- Material Waste & Damage Log Details ---\n`;
        csv += `Log Date,Material Name,Waste Quantity,Estimated Loss Valuation (BDT),Reason\n`;
        wasteLogs.forEach(wl => {
            csv += `${new Date(wl.log_date).toLocaleDateString()},"${wl.material_name}",${wl.waste_quantity} ${wl.unit},${parseFloat(wl.est_loss || 0).toFixed(2)},"${(wl.reason || '').replace(/"/g, '""')}"\n`;
        });

        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="Expense_Report_Project_${projectId}.csv"`);
        res.status(200).send(csv);
    } catch (err) {
        console.error('Export Expense CSV Error:', err);
        res.status(500).send('Server Error generating CSV export.');
    }
}

module.exports = {
    listExpenses,
    generateReport,
    exportCsv
};
