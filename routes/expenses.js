const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { isAuthenticated } = require('../middleware/auth');

// Helper function to aggregate financials for a project
async function calculateProjectFinancials(projectId, startDate = null, endDate = null) {
    let dateFilterLabor = '';
    let dateFilterWaste = '';
    let dateFilterReq = '';
    let params = [projectId];

    if (startDate && endDate) {
        dateFilterLabor = ' AND log_date BETWEEN ? AND ? ';
        dateFilterWaste = ' AND w.log_date BETWEEN ? AND ? ';
        dateFilterReq = ' AND mr.created_at BETWEEN ? AND ? ';
        params = [projectId, startDate, endDate + ' 23:59:59'];
    }

    // 1. Labor Costs
    const [laborRows] = await db.query(`
        SELECT COALESCE(SUM(total_cost), 0) as labor_cost, COALESCE(SUM(headcount), 0) as headcount, COUNT(*) as log_days
        FROM labor_logs WHERE project_id = ? ${dateFilterLabor}
    `, startDate && endDate ? [projectId, startDate, endDate] : [projectId]);

    // 2. Material Waste Loss
    const [wasteRows] = await db.query(`
        SELECT COALESCE(SUM(w.waste_quantity * m.unit_price_est), 0) as waste_cost, COALESCE(SUM(w.waste_quantity), 0) as total_waste_qty
        FROM material_waste_logs w
        JOIN materials m ON w.material_id = m.id
        WHERE w.project_id = ? ${dateFilterWaste}
    `, startDate && endDate ? [projectId, startDate, endDate] : [projectId]);

    // 3. Material Utilization & Emergency Request Costs (Estimated spend from site transfers and material requests)
    const [matRows] = await db.query(`
        SELECT COALESCE(SUM(mr.quantity * m.unit_price_est), 0) as material_req_cost
        FROM material_requests mr
        JOIN materials m ON mr.material_id = m.id
        WHERE mr.project_id = ? ${dateFilterReq}
    `, startDate && endDate ? [projectId, startDate, endDate + ' 23:59:59'] : [projectId]);

    // 4. Also include inventory transfer arrivals to this site
    const [transferRows] = await db.query(`
        SELECT COALESCE(SUM(it.quantity * m.unit_price_est), 0) as transfer_cost
        FROM inventory_transfers it
        JOIN materials m ON it.material_id = m.id
        WHERE it.to_project_id = ?
    `, [projectId]);

    const laborCost = parseFloat(laborRows[0].labor_cost);
    const wasteCost = parseFloat(wasteRows[0].waste_cost);
    const materialCost = parseFloat(matRows[0].material_req_cost) + parseFloat(transferRows[0].transfer_cost);
    const totalExpenditure = laborCost + wasteCost + materialCost;

    return {
        labor: {
            cost: laborCost,
            headcount: laborRows[0].headcount,
            days: laborRows[0].log_days
        },
        waste: {
            cost: wasteCost,
            quantity: wasteRows[0].total_waste_qty
        },
        materialCost,
        totalExpenditure
    };
}

// GET /expenses - Project Expense Selection & Overview (Member C)
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const [projects] = await db.query('SELECT * FROM projects ORDER BY name ASC');
        
        // Compute quick financial summaries for all projects
        for (let p of projects) {
            const financials = await calculateProjectFinancials(p.id);
            p.totalExpenditure = financials.totalExpenditure;
            p.remainingBudget = parseFloat(p.budget) - financials.totalExpenditure;
        }

        res.render('expenses/index', {
            title: 'Project Expense Report Export',
            projects,
            user: req.session.user
        });
    } catch (err) {
        console.error('Error fetching projects for expense reports:', err);
        res.render('expenses/index', { title: 'Project Expense Reports', projects: [], user: req.session.user });
    }
});

// GET /expenses/report - Detailed Expense Report Generator
router.get('/report', isAuthenticated, async (req, res) => {
    try {
        const { project_id, start_date, end_date } = req.query;
        if (!project_id) {
            return res.redirect('/expenses');
        }

        const [pRows] = await db.query('SELECT * FROM projects WHERE id = ?', [project_id]);
        if (pRows.length === 0) {
            return res.status(404).render('error', { message: 'Project site not found' });
        }
        const project = pRows[0];
        const financials = await calculateProjectFinancials(project_id, start_date, end_date);

        // Fetch granular items for display in tables
        let dateFilterLabor = '';
        let dateFilterWaste = '';
        let dateFilterReq = '';
        let params = [project_id];
        if (start_date && end_date) {
            dateFilterLabor = ' AND ll.log_date BETWEEN ? AND ? ';
            dateFilterWaste = ' AND w.log_date BETWEEN ? AND ? ';
            dateFilterReq = ' AND mr.created_at BETWEEN ? AND ? ';
            params = [project_id, start_date, end_date + ' 23:59:59'];
        }

        const [laborLogs] = await db.query(`
            SELECT ll.*, u.name as recorder 
            FROM labor_logs ll 
            LEFT JOIN users u ON ll.created_by = u.id
            WHERE ll.project_id = ? ${dateFilterLabor}
            ORDER BY ll.log_date DESC
        `, start_date && end_date ? [project_id, start_date, end_date] : [project_id]);

        const [wasteLogs] = await db.query(`
            SELECT w.*, m.name as material_name, m.unit, m.unit_price_est, (w.waste_quantity * m.unit_price_est) as est_loss
            FROM material_waste_logs w
            JOIN materials m ON w.material_id = m.id
            WHERE w.project_id = ? ${dateFilterWaste}
            ORDER BY w.log_date DESC
        `, start_date && end_date ? [project_id, start_date, end_date] : [project_id]);

        const [matRequests] = await db.query(`
            SELECT mr.*, m.name as material_name, m.unit, m.unit_price_est, (mr.quantity * m.unit_price_est) as est_cost
            FROM material_requests mr
            JOIN materials m ON mr.material_id = m.id
            WHERE mr.project_id = ? ${dateFilterReq}
            ORDER BY mr.created_at DESC
        `, start_date && end_date ? [project_id, start_date, end_date + ' 23:59:59'] : [project_id]);

        res.render('expenses/report', {
            title: `Expense Report: ${project.name}`,
            project,
            financials,
            laborLogs,
            wasteLogs,
            matRequests,
            startDate: start_date || '',
            endDate: end_date || '',
            user: req.session.user
        });
    } catch (err) {
        console.error('Error generating expense report:', err);
        res.redirect('/expenses');
    }
});

// GET /expenses/export-csv - Download Excel CSV Expense Report
router.get('/export-csv', isAuthenticated, async (req, res) => {
    try {
        const { project_id, start_date, end_date } = req.query;
        if (!project_id) return res.status(400).send('Project ID required');

        const [pRows] = await db.query('SELECT * FROM projects WHERE id = ?', [project_id]);
        if (pRows.length === 0) return res.status(404).send('Project not found');
        const project = pRows[0];

        const financials = await calculateProjectFinancials(project_id, start_date, end_date);

        const [laborLogs] = await db.query('SELECT * FROM labor_logs WHERE project_id = ? ORDER BY log_date DESC', [project_id]);
        const [wasteLogs] = await db.query(`
            SELECT w.*, m.name as material_name, m.unit, (w.waste_quantity * m.unit_price_est) as est_loss
            FROM material_waste_logs w JOIN materials m ON w.material_id = m.id WHERE w.project_id = ? ORDER BY w.log_date DESC
        `, [project_id]);

        let csv = '\uFEFF';
        csv += `Consolidated Project Expense & Financial Report\n`;
        csv += `Project Name,${project.name.replace(/,/g, ' ')}\n`;
        csv += `Location,${(project.location || '').replace(/,/g, ' ')}\n`;
        csv += `Report Date,${new Date().toLocaleDateString()}\n`;
        if (start_date && end_date) {
            csv += `Filter Period,${start_date} to ${end_date}\n`;
        }
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
        res.setHeader('Content-Disposition', `attachment; filename="Expense_Report_Project_${project_id}.csv"`);
        res.status(200).send(csv);
    } catch (err) {
        console.error('Error exporting CSV:', err);
        res.status(500).send('Server Error generating CSV');
    }
});

module.exports = router;
