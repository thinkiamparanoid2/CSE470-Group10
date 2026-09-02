const db = require('../config/db');
const { isRequired, isPositiveNumber, sanitize, sanitizeCsvCell } = require('../middleware/validate');

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
        console.error('List BOQs Error:', err);
        res.render('boq/index', { boqs: [], title: 'Bill of Quantities (BOQ) Generator', error: 'Failed to retrieve BOQs.' });
    }
}

// Show Create BOQ Form
async function showCreateForm(req, res) {
    try {
        const [projects] = await db.query('SELECT * FROM projects ORDER BY name ASC');
        res.render('boq/create', { projects, title: 'Create New BOQ' });
    } catch (err) {
        console.error('Show Create BOQ Form Error:', err);
        res.render('error', { message: 'Database Error: Could not load projects for BOQ creation.' });
    }
}

// Create BOQ (Raw SQL with Validation)
async function createBoq(req, res) {
    const project_id = parseInt(req.body.project_id, 10);
    const title = sanitize(req.body.title);
    const notes = sanitize(req.body.notes);
    const created_by = req.session.user.id;

    // Validation
    if (isNaN(project_id)) {
        return res.render('error', { message: 'Validation Error: Please select a valid project for the BOQ worksheet.' });
    }
    if (!isRequired(title) || title.length < 3) {
        return res.render('error', { message: 'Validation Error: BOQ title is required and must be at least 3 characters.' });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO boqs (project_id, title, notes, created_by) VALUES (?, ?, ?, ?)',
            [project_id, title, notes || null, created_by]
        );
        res.redirect(`/boq/${result.insertId}`);
    } catch (err) {
        console.error('Create BOQ Error:', err);
        res.render('error', { message: 'Database Error: Could not create BOQ sheet.' });
    }
}

// View specific BOQ worksheet
async function viewBoq(req, res) {
    const boqId = parseInt(req.params.id, 10);
    if (isNaN(boqId)) {
        return res.render('error', { message: 'Invalid BOQ ID.' });
    }

    try {
        const [boqRows] = await db.query(`
            SELECT b.*, p.name as project_name, p.budget as project_budget, u.name as created_by_name
            FROM boqs b
            JOIN projects p ON b.project_id = p.id
            LEFT JOIN users u ON b.created_by = u.id
            WHERE b.id = ?
        `, [boqId]);

        if (boqRows.length === 0) {
            return res.status(404).render('error', { message: 'Bill of Quantities (BOQ) not found.' });
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
        console.error('View BOQ Error:', err);
        res.render('error', { message: 'Database Error: Failed to render BOQ worksheet.' });
    }
}

// Add Item to BOQ (Raw SQL with Validation)
async function addItem(req, res) {
    const boqId = parseInt(req.params.id, 10);
    if (isNaN(boqId)) {
        return res.render('error', { message: 'Invalid BOQ ID.' });
    }

    const material_name = sanitize(req.body.material_name);
    const unit = sanitize(req.body.unit);
    const quantity_estimated = req.body.quantity_estimated;
    const unit_price_estimated = req.body.unit_price_estimated;
    const item_category = sanitize(req.body.item_category) || 'Material';

    // Validation
    if (!isRequired(material_name) || material_name.length < 2) {
        return res.render('error', { message: 'Validation Error: Item or material description is required.' });
    }
    if (!isRequired(unit)) {
        return res.render('error', { message: 'Validation Error: Measurement unit is required.' });
    }
    if (!isPositiveNumber(quantity_estimated) || parseFloat(quantity_estimated) <= 0) {
        return res.render('error', { message: 'Validation Error: Estimated quantity must be greater than zero.' });
    }
    if (!isPositiveNumber(unit_price_estimated) || parseFloat(unit_price_estimated) < 0) {
        return res.render('error', { message: 'Validation Error: Estimated unit rate cannot be negative.' });
    }

    try {
        await db.query(
            'INSERT INTO boq_items (boq_id, material_name, unit, quantity_estimated, unit_price_estimated, item_category) VALUES (?, ?, ?, ?, ?, ?)',
            [boqId, material_name, unit, parseFloat(quantity_estimated), parseFloat(unit_price_estimated), item_category]
        );
        res.redirect(`/boq/${boqId}`);
    } catch (err) {
        console.error('Add BOQ Item Error:', err);
        res.render('error', { message: 'Database Error: Could not add item to BOQ.' });
    }
}

// Delete Item from BOQ (Raw SQL with Error Handling)
async function deleteItem(req, res) {
    const itemId = parseInt(req.params.itemId, 10);
    const boqId = parseInt(req.body.boq_id, 10);

    if (isNaN(itemId)) {
        return res.render('error', { message: 'Invalid item ID for deletion.' });
    }

    try {
        await db.query('DELETE FROM boq_items WHERE id = ?', [itemId]);
        res.redirect(`/boq/${!isNaN(boqId) ? boqId : ''}`);
    } catch (err) {
        console.error('Delete BOQ Item Error:', err);
        res.render('error', { message: 'Database Error: Failed to delete BOQ line item.' });
    }
}

// Export BOQ to CSV (with Validation & Error Handling)
async function exportCsv(req, res) {
    const boqId = parseInt(req.params.id, 10);
    if (isNaN(boqId)) {
        return res.status(400).send('Invalid BOQ ID');
    }

    try {
        const [boqRows] = await db.query(`
            SELECT b.*, p.name as project_name FROM boqs b
            JOIN projects p ON b.project_id = p.id WHERE b.id = ?
        `, [boqId]);

        if (boqRows.length === 0) return res.status(404).send('BOQ Not Found');
        const boq = boqRows[0];

        const [items] = await db.query('SELECT * FROM boq_items WHERE boq_id = ? ORDER BY id ASC', [boqId]);

        let csv = '\uFEFF'; // UTF-8 BOM for Excel support
        csv += `Bill of Quantities (BOQ) Report\n`;
        csv += `Title,${sanitizeCsvCell(boq.title.replace(/,/g, ' '))}\n`;
        csv += `Project,${sanitizeCsvCell(boq.project_name.replace(/,/g, ' '))}\n`;
        csv += `Date Created,${new Date(boq.created_at).toLocaleDateString()}\n\n`;
        csv += `Item #,Category,Material / Item Name,Unit,Estimated Quantity,Unit Price (EST BDT),Total Estimated Cost (BDT)\n`;

        let grandTotal = 0;
        items.forEach((item, index) => {
            const rowTotal = parseFloat(item.quantity_estimated) * parseFloat(item.unit_price_estimated);
            grandTotal += rowTotal;
            csv += `${index + 1},"${sanitizeCsvCell(item.item_category)}","${sanitizeCsvCell(item.material_name)}","${sanitizeCsvCell(item.unit)}",${item.quantity_estimated},${item.unit_price_estimated},${rowTotal.toFixed(2)}\n`;
        });

        csv += `\n,,,,,Grand Total Estimated Cost:,${grandTotal.toFixed(2)}\n`;

        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="BOQ_Project_${boq.project_id}_Report.csv"`);
        res.status(200).send(csv);
    } catch (err) {
        console.error('Export BOQ CSV Error:', err);
        res.status(500).send('Server Error generating CSV export.');
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
