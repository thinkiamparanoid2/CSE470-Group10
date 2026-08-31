const db = require('../config/db');

// List Deliveries
async function listDeliveries(req, res) {
    try {
        let query = `
            SELECT d.*, po.expected_date, v.company_name, po.total_amount 
            FROM deliveries d
            JOIN purchase_orders po ON d.po_id = po.id
            JOIN vendors v ON po.vendor_id = v.id
        `;
        let params = [];

        if (req.session.user.role === 'Vendor') {
            query += ` WHERE v.user_id = ?`;
            params.push(req.session.user.id);
        }

        query += ` ORDER BY d.created_at DESC`;
        const [deliveries] = await db.query(query, params);

        res.render('deliveries/index', { deliveries, title: 'Delivery Scheduling' });
    } catch (err) {
        console.error('List Deliveries Error:', err);
        res.render('deliveries/index', { deliveries: [], title: 'Delivery Scheduling', error: 'Failed to load deliveries.' });
    }
}

// Update Delivery Status (Raw SQL with Validation & Cascading Updates)
async function updateStatus(req, res) {
    const deliveryId = parseInt(req.params.id, 10);
    const { status } = req.body;
    const userId = req.session.user.id;
    const validStatuses = ['Pending', 'In Transit', 'Delivered'];

    if (isNaN(deliveryId) || !validStatuses.includes(status)) {
        return res.render('error', { message: 'Validation Error: Invalid delivery record or status update.' });
    }

    try {
        if (status === 'Delivered') {
            await db.query('UPDATE deliveries SET status = ?, received_by = ? WHERE id = ?', [status, userId, deliveryId]);
            const [[delivery]] = await db.query('SELECT po_id FROM deliveries WHERE id = ?', [deliveryId]);
            if (delivery) {
                await db.query('UPDATE purchase_orders SET status = ? WHERE id = ?', ['Delivered', delivery.po_id]);
            }
        } else {
            await db.query('UPDATE deliveries SET status = ? WHERE id = ?', [status, deliveryId]);
        }
        res.redirect('/deliveries');
    } catch (err) {
        console.error('Update Delivery Status Error:', err);
        res.render('error', { message: 'Database Error: Failed to update delivery status.' });
    }
}

module.exports = {
    listDeliveries,
    updateStatus
};
