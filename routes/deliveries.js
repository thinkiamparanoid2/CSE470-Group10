const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { isAuthenticated, hasRole } = require('../middleware/auth');

// List Deliveries
router.get('/', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer', 'Vendor'), async (req, res) => {
    try {
        let query = `
            SELECT d.*, po.expected_date, v.company_name, po.total_amount 
            FROM deliveries d
            JOIN purchase_orders po ON d.po_id = po.id
            JOIN vendors v ON po.vendor_id = v.id
        `;
        let params = [];

        // If user is a Vendor, only show their deliveries
        if (req.session.user.role === 'Vendor') {
            query += ` WHERE v.user_id = ?`;
            params.push(req.session.user.id);
        }

        query += ` ORDER BY d.created_at DESC`;
        const [deliveries] = await db.query(query, params);

        res.render('deliveries/index', { deliveries, title: 'Delivery Scheduling' });
    } catch (err) {
        console.error(err);
        res.render('deliveries/index', { deliveries: [], title: 'Delivery Scheduling' });
    }
});

// Update Delivery Status
router.post('/status/:id', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer', 'Vendor'), async (req, res) => {
    const { status } = req.body;
    const deliveryId = req.params.id;
    const userId = req.session.user.id;

    try {
        if (status === 'Delivered') {
            await db.query('UPDATE deliveries SET status = ?, received_by = ? WHERE id = ?', [status, userId, deliveryId]);
            // Optional: When delivered, update PO status to Delivered
            const [[delivery]] = await db.query('SELECT po_id FROM deliveries WHERE id = ?', [deliveryId]);
            if (delivery) {
                await db.query('UPDATE purchase_orders SET status = ? WHERE id = ?', ['Delivered', delivery.po_id]);
                // Optional: Stock increment could go here, but omitted to keep it simple unless specified.
            }
        } else {
            await db.query('UPDATE deliveries SET status = ? WHERE id = ?', [status, deliveryId]);
        }
        res.redirect('/deliveries');
    } catch (err) {
        console.error(err);
        res.redirect('/deliveries');
    }
});

module.exports = router;
