const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { isAuthenticated, hasRole } = require('../middleware/auth');

// GET /boq - List all Bill of Quantities (Member A)
router.get('/', isAuthenticated, async (req, res) => {
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
});

// GET /boq/create - Create BOQ Form
router.get('/create', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer'), async (req, res) => {
    try {
        const [projects] = await db.query('SELECT * FROM projects ORDER BY name ASC');
        res.render('boq/create', { projects, title: 'Create New BOQ' });
    } catch (err) {
        console.error(err);
        res.redirect('/boq');
    }
});

// POST /boq/create - Create BOQ Action
router.post('/create', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer'), async (req, res) => {
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
});

// GET /boq/:id - View specific BOQ worksheet & items
router.get('/:id', isAuthenticated, async (req, res) => {
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

        const [items] = await db.query(
            'SELECT * FROM boq_items WHERE boq_id = ? ORDER BY id ASC',
            [boqId]
        );

        // Calculate totals
        let totalCost = 0;
        items.forEach(i => {
            i.total_item_price = parseFloat(i.quantity_estimated) * parseFloat(i.unit_price_estimated);
            totalCost += i.total_item_price;
        });

        // Fetch existing materials catalog for autocomplete/selection in add item form
        const [materials] = await db.query('SELECT name, category, unit, unit_price_est FROM materials ORDER BY name ASC');

        res.render('boq/view', { boq, items, totalCost, materials, title: `BOQ: ${boq.title}` });
    } catch (err) {
        console.error(err);
        res.redirect('/boq');
    }
});

// POST /boq/:id/add-item - Add Item to BOQ
router.post('/:id/add-item', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer'), async (req, res) => {
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
});

// POST /boq/delete-item/:itemId - Remove Item from BOQ
router.post('/delete-item/:itemId', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer'), async (req, res) => {
    const itemId = req.params.itemId;
    const { boq_id } = req.body;
    try {
        await db.query('DELETE FROM boq_items WHERE id = ?', [itemId]);
        res.redirect(`/boq/${boq_id}`);
    } catch (err) {
        console.error(err);
        res.redirect(`/boq/${boq_id || ''}`);
    }
});

// GET /boq/:id/export-csv - Export BOQ to Excel-compatible CSV
router.get('/:id/export-csv', isAuthenticated, async (req, res) => {
    try {
        const boqId = req.params.id;
        const [boqRows] = await db.query(`
            SELECT b.*, p.name as project_name 
            FROM boqs b
            JOIN projects p ON b.project_id = p.id
            WHERE b.id = ?
        `, [boqId]);

        if (boqRows.length === 0) {
            return res.status(404).send('BOQ Not Found');
        }
        const boq = boqRows[0];

        const [items] = await db.query('SELECT * FROM boq_items WHERE boq_id = ? ORDER BY id ASC', [boqId]);

        // Build CSV content
        let csv = '\uFEFF'; // UTF-8 BOM for Excel formatting support
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
});

module.exports = router;
