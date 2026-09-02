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
    const userRole = req.session.user.role;
    const validStatuses = ['Pending', 'In Transit', 'Delivered'];

    if (isNaN(deliveryId) || !validStatuses.includes(status)) {
        return res.render('error', { message: 'Validation Error: Invalid delivery record or status update.' });
    }

    const connection = await db.getConnection();
    try {
        // Look up the delivery's vendor to (a) confirm a Vendor caller owns this
        // shipment and (b) enforce who is allowed to set which status. Without this,
        // a vendor could self-certify their own delivery as "Delivered" and trigger
        // the linked PO into a payment-eligible state without ever actually shipping.
        const [[deliveryInfo]] = await connection.query(
            `SELECT d.id, d.status AS current_status, d.po_id, v.user_id AS vendor_user_id
             FROM deliveries d
             JOIN purchase_orders po ON d.po_id = po.id
             JOIN vendors v ON po.vendor_id = v.id
             WHERE d.id = ?`,
            [deliveryId]
        );
        if (!deliveryInfo) {
            return res.status(404).render('error', { message: 'Validation Error: Delivery record not found.' });
        }
        if (userRole === 'Vendor' && deliveryInfo.vendor_user_id !== userId) {
            return res.status(403).render('error', { message: 'Access Denied: You can only update deliveries for your own purchase orders.' });
        }

        const canMarkInTransit = userRole === 'SuperAdmin' || userRole === 'Vendor';
        const canMarkDelivered = userRole === 'SuperAdmin' || userRole === 'Project Manager' || userRole === 'Site Engineer';
        if (status === 'In Transit' && !canMarkInTransit) {
            return res.status(403).render('error', { message: 'Access Denied: Only the supplying vendor can dispatch this shipment.' });
        }
        if (status === 'Delivered' && !canMarkDelivered) {
            return res.status(403).render('error', { message: 'Access Denied: Only site staff can confirm receipt of a delivery.' });
        }
        if (status === 'Pending' && userRole !== 'SuperAdmin') {
            return res.status(403).render('error', { message: 'Access Denied: Only a SuperAdmin can reset a delivery to Pending.' });
        }

        await connection.beginTransaction();

        if (status === 'Delivered') {
            // Re-read the status under a row lock, inside the transaction, right before
            // deciding whether to credit stock. The earlier `deliveryInfo.current_status`
            // was read before the transaction even opened — relying on that stale value
            // here would let two near-simultaneous requests (e.g. a double-clicked
            // "Receive Delivery" button) both see "not yet Delivered" and both credit
            // stock, double-counting the same shipment.
            const [[locked]] = await connection.query(
                'SELECT status FROM deliveries WHERE id = ? FOR UPDATE', [deliveryId]
            );
            const alreadyDelivered = locked.status === 'Delivered';

            await connection.query('UPDATE deliveries SET status = ?, received_by = ? WHERE id = ?', [status, userId, deliveryId]);
            await connection.query('UPDATE purchase_orders SET status = ? WHERE id = ?', ['Delivered', deliveryInfo.po_id]);

            if (!alreadyDelivered) {
                const [items] = await connection.query(
                    'SELECT material_id, quantity FROM purchase_order_items WHERE po_id = ?', [deliveryInfo.po_id]
                );
                for (const item of items) {
                    await connection.query(
                        'UPDATE materials SET current_stock = current_stock + ? WHERE id = ?',
                        [item.quantity, item.material_id]
                    );
                }
            }
        } else {
            await connection.query('UPDATE deliveries SET status = ? WHERE id = ?', [status, deliveryId]);
        }

        await connection.commit();
        res.redirect('/deliveries');
    } catch (err) {
        await connection.rollback();
        console.error('Update Delivery Status Error:', err);
        res.render('error', { message: 'Database Error: Failed to update delivery status.' });
    } finally {
        connection.release();
    }
}

module.exports = {
    listDeliveries,
    updateStatus
};
