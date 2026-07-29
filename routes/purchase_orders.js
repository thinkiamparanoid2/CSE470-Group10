const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { isAuthenticated, hasRole } = require('../middleware/auth');

// List Purchase Orders
router.get('/', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer'), async (req, res) => {
    try {
        const [purchaseOrders] = await db.query(`
            SELECT po.*, v.company_name as vendor_name, u.name as created_by_name 
            FROM purchase_orders po 
            LEFT JOIN vendors v ON po.vendor_id = v.id 
            LEFT JOIN users u ON po.created_by = u.id 
            ORDER BY po.created_at DESC
        `);
        res.render('purchase_orders/index', { purchaseOrders, title: 'Purchase Orders' });
    } catch (err) {
        console.error(err);
        res.render('purchase_orders/index', { purchaseOrders: [], title: 'Purchase Orders' });
    }
});

// Create Purchase Order Form
router.get('/create', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), async (req, res) => {
    try {
        const [vendors] = await db.query('SELECT * FROM vendors');
        const [materials] = await db.query('SELECT * FROM materials');
        res.render('purchase_orders/create', { vendors, materials, title: 'Create Purchase Order' });
    } catch (err) {
        console.error(err);
        res.redirect('/purchase_orders');
    }
});

// Create Purchase Order Action
router.post('/create', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), async (req, res) => {
    const { vendor_id, expected_date, material_id, quantity, unit_price } = req.body;
    const created_by = req.session.user.id;

    // Handle single or multiple items
    const materialIds = Array.isArray(material_id) ? material_id : [material_id];
    const quantities = Array.isArray(quantity) ? quantity : [quantity];
    const unitPrices = Array.isArray(unit_price) ? unit_price : [unit_price];

    // Calculate total amount
    let totalAmount = 0;
    for (let i = 0; i < materialIds.length; i++) {
        if (materialIds[i] && quantities[i] && unitPrices[i]) {
            totalAmount += parseFloat(quantities[i]) * parseFloat(unitPrices[i]);
        }
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const [poResult] = await connection.query(
            'INSERT INTO purchase_orders (vendor_id, expected_date, total_amount, created_by) VALUES (?, ?, ?, ?)',
            [vendor_id, expected_date, totalAmount, created_by]
        );
        const poId = poResult.insertId;

        for (let i = 0; i < materialIds.length; i++) {
            if (materialIds[i] && quantities[i] && unitPrices[i]) {
                await connection.query(
                    'INSERT INTO purchase_order_items (po_id, material_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
                    [poId, materialIds[i], quantities[i], unitPrices[i]]
                );
            }
        }

        await connection.commit();
        res.redirect('/purchase_orders');
    } catch (err) {
        await connection.rollback();
        console.error(err);
        res.redirect('/purchase_orders/create');
    } finally {
        connection.release();
    }
});

// Update Status Action
router.post('/status/:id', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), async (req, res) => {
    const { status } = req.body;
    const poId = req.params.id;

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        
        await connection.query('UPDATE purchase_orders SET status = ? WHERE id = ?', [status, poId]);
        
        // If approved, create a pending delivery
        if (status === 'Approved') {
            await connection.query(
                'INSERT INTO deliveries (po_id, status) VALUES (?, ?)',
                [poId, 'Pending']
            );
        }

        await connection.commit();
        res.redirect('/purchase_orders');
    } catch (err) {
        await connection.rollback();
        console.error(err);
        res.redirect('/purchase_orders');
    } finally {
        connection.release();
    }
});

module.exports = router;
