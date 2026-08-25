const db = require('../config/db');

// List all BOQs
async function listBoqs(req, res) {
    try {
        const [boqs] = await db.query(`
            SELECT b.*, p.name as project_name, u.name as created_by_name,
                   COALESCE(SUM(bi.quantity_estimated * bi.unit_price_estimated), 0) as total_estimated_cost
            FROM boqs b
            JOIN projects p ON b.project_id = p.id
            LEFT JOIN users u ON b.created_by = u.id
            LEFT JOIN boq_items bi ON b.id = bi.boq_id
            GROUP BY b.id
            ORDER BY b.created_at DESC
        `);
        res.render('boq/index', { boqs, title: 'Bill of Quantities (BOQ) Generator' });
    } catch (err) {
        console.error('Error fetching BOQs:', err);
        res.render('boq/index', { boqs: [], title: 'Bill of Quantities (BOQ) Generator' });
    }
}

// Show Create BOQ Form
async function showCreateForm(req, res) {
    try {
        const [projects] = await db.query('SELECT * FROM projects ORDER BY name ASC');
        res.render('boq/create', { projects, title: 'Create New BOQ' });
    } catch (err) {
        console.error(err);
        res.redirect('/boq');
    }
}

// Create BOQ (Raw SQL)
async function createBoq(req, res) {
    const { project_id, title, notes } = req.body;
    const created_by = req.session.user.id;
    try {
        const [result] = await db.query(
            'INSERT INTO boqs (project_id, title, notes, created_by) VALUES (?, ?, ?, ?)',
            [project_id, title, notes, created_by]
        );
        res.redirect(`/boq/${result.insertId}`);
    } catch (err) {
        console.error(err);
        res.redirect('/boq/create');
    }
}

// View specific BOQ worksheet
async function viewBoq(req, res) {
    try {
        const boqId = req.params.id;
        const [boqRows] = await db.query(`
            SELECT b.*, p.name as project_name, p.budget as project_budget, u.name as created_by_name
            FROM boqs b
            JOIN projects p ON b.project_id = p.id
            LEFT JOIN users u ON b.created_by = u.id
            WHERE b.id = ?
        `, [boqId]);

        if (boqRows.length === 0) {
            return res.status(404).render('error', { message: 'BOQ not found' });
        }

        const boq = boqRows[0];
        const [items] = await db.query('SELECT * FROM boq_items WHERE boq_id = ? ORDER BY id ASC', [boqId]);

        let totalCost = 0;
        items.forEach(i => {
            i.total_item_price = parseFloat(i.quantity_estimated) * parseFloat(i.unit_price_estimated);
            totalCost += i.total_item_price;
        });

        const [materials] = await db.query('SELECT name, category, unit, unit_price_est FROM materials ORDER BY name ASC');

        res.render('boq/view', { boq, items, totalCost, materials, title: `BOQ: ${boq.title}` });
    } catch (err) {
        console.error(err);
        res.redirect('/boq');
    }
}

// Add Item to BOQ (Raw SQL)
async function addItem(req, res) {
    const boqId = req.params.id;
    const { material_name, unit, quantity_estimated, unit_price_estimated, item_category } = req.body;
    try {
        await db.query(
            'INSERT INTO boq_items (boq_id, material_name, unit, quantity_estimated, unit_price_estimated, item_category) VALUES (?, ?, ?, ?, ?, ?)',
            [boqId, material_name, unit, quantity_estimated, unit_price_estimated, item_category || 'Material']
        );
        res.redirect(`/boq/${boqId}`);
    } catch (err) {
        console.error(err);
        res.redirect(`/boq/${boqId}`);
    }
}

// Delete Item from BOQ (Raw SQL)
async function deleteItem(req, res) {
    const { boq_id } = req.body;
    try {
        await db.query('DELETE FROM boq_items WHERE id = ?', [req.params.itemId]);
        res.redirect(`/boq/${boq_id}`);
    } catch (err) {
        console.error(err);
        res.redirect(`/boq/${boq_id || ''}`);
    }
}

// Export BOQ to CSV
async function exportCsv(req, res) {
    try {
        const boqId = req.params.id;
        const [boqRows] = await db.query(`
            SELECT b.*, p.name as project_name FROM boqs b
            JOIN projects p ON b.project_id = p.id WHERE b.id = ?
        `, [boqId]);

        if (boqRows.length === 0) return res.status(404).send('BOQ Not Found');
        const boq = boqRows[0];

        const [items] = await db.query('SELECT * FROM boq_items WHERE boq_id = ? ORDER BY id ASC', [boqId]);

        let csv = '\uFEFF';
        csv += `Bill of Quantities (BOQ) Report\n`;
        csv += `Title,${boq.title.replace(/,/g, ' ')}\n`;
        csv += `Project,${boq.project_name.replace(/,/g, ' ')}\n`;
        csv += `Date Created,${new Date(boq.created_at).toLocaleDateString()}\n\n`;
        csv += `Item #,Category,Material / Item Name,Unit,Estimated Quantity,Unit Price (EST BDT),Total Estimated Cost (BDT)\n`;

        let grandTotal = 0;
        items.forEach((item, index) => {
            const rowTotal = parseFloat(item.quantity_estimated) * parseFloat(item.unit_price_estimated);
            grandTotal += rowTotal;
            csv += `${index + 1},"${item.item_category}","${item.material_name}",${item.unit},${item.quantity_estimated},${item.unit_price_estimated},${rowTotal.toFixed(2)}\n`;
        });

        csv += `\n,,,,,Grand Total Estimated Cost:,${grandTotal.toFixed(2)}\n`;

        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="BOQ_Project_${boq.project_id}_Report.csv"`);
        res.status(200).send(csv);
    } catch (err) {
        console.error('Error exporting BOQ CSV:', err);
        res.status(500).send('Error exporting report');
    }
}

module.exports = {
    listBoqs,
    showCreateForm,
    createBoq,
    viewBoq,
    addItem,
    deleteItem,
    exportCsv
};
