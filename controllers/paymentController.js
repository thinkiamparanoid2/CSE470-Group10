const db = require('../config/db');

// Vendor Payment Tracker Dashboard - Member B
async function listPayments(req, res) {
    try {
        let vendorQuery = `
            SELECT v.id, v.company_name, v.contact_person, v.phone, v.material_category, v.rating,
                   COALESCE(po_sum.total_billed, 0) as total_billed,
                   COALESCE(pay_sum.total_paid, 0) as total_paid,
                   (COALESCE(po_sum.total_billed, 0) - COALESCE(pay_sum.total_paid, 0)) as outstanding_balance
            FROM vendors v
            LEFT JOIN (
                SELECT vendor_id, SUM(total_amount) as total_billed 
                FROM purchase_orders WHERE status != 'Rejected' GROUP BY vendor_id
            ) po_sum ON v.id = po_sum.vendor_id
            LEFT JOIN (
                SELECT vendor_id, SUM(amount) as total_paid 
                FROM vendor_payments GROUP BY vendor_id
            ) pay_sum ON v.id = pay_sum.vendor_id
        `;
        let vendorParams = [];

        if (req.session.user.role === 'Vendor') {
            vendorQuery += ` WHERE v.user_id = ? `;
            vendorParams.push(req.session.user.id);
        }
        vendorQuery += ` ORDER BY company_name ASC`;

        const [vendors] = await db.query(vendorQuery, vendorParams);

        let txQuery = `
            SELECT p.*, v.company_name as vendor_name, u.name as recorder_name
            FROM vendor_payments p
            JOIN vendors v ON p.vendor_id = v.id
            LEFT JOIN users u ON p.recorded_by = u.id
        `;
        if (req.session.user.role === 'Vendor') {
            txQuery += ` WHERE v.user_id = ? `;
        }
        txQuery += ` ORDER BY p.payment_date DESC, p.created_at DESC LIMIT 20`;

        const txParams = req.session.user.role === 'Vendor' ? [req.session.user.id] : [];
        const [recentPayments] = await db.query(txQuery, txParams);

        res.render('payments/index', {
            title: 'Vendor Payment Tracker',
            vendors, recentPayments,
            user: req.session.user
        });
    } catch (err) {
        console.error('Error fetching payment tracker data:', err);
        res.render('payments/index', {
            title: 'Vendor Payment Tracker',
            vendors: [], recentPayments: [],
            user: req.session.user
        });
    }
}

// Show Record Payment Form
async function showCreateForm(req, res) {
    try {
        const [vendors] = await db.query('SELECT id, company_name FROM vendors ORDER BY company_name ASC');
        const [pos] = await db.query('SELECT id, vendor_id, total_amount, status FROM purchase_orders ORDER BY id DESC');
        res.render('payments/create', { vendors, pos, title: 'Record Vendor Payment' });
    } catch (err) {
        console.error(err);
        res.redirect('/payments');
    }
}

// Record Payment (Raw SQL)
async function createPayment(req, res) {
    const { vendor_id, po_id, amount, payment_type, payment_method, reference_no, payment_date, notes } = req.body;
    const recorded_by = req.session.user.id;
    const cleanPoId = (po_id && po_id !== '') ? po_id : null;

    try {
        await db.query(
            'INSERT INTO vendor_payments (vendor_id, po_id, amount, payment_type, payment_method, reference_no, payment_date, notes, recorded_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [vendor_id, cleanPoId, amount, payment_type || 'Advance', payment_method || 'Bank Transfer', reference_no, payment_date, notes, recorded_by]
        );
        res.redirect('/payments');
    } catch (err) {
        console.error('Error creating payment record:', err);
        res.redirect('/payments/create');
    }
}

// Vendor Ledger Account Statement
async function vendorStatement(req, res) {
    try {
        const vendorId = req.params.id;

        if (req.session.user.role === 'Vendor') {
            const [vCheck] = await db.query('SELECT id FROM vendors WHERE id = ? AND user_id = ?', [vendorId, req.session.user.id]);
            if (vCheck.length === 0) {
                return res.status(403).render('error', { message: 'Access Denied: You cannot view financial statements of other vendors.' });
            }
        }

        const [vendorRows] = await db.query(`
            SELECT v.*,
                   COALESCE((SELECT SUM(total_amount) FROM purchase_orders WHERE vendor_id = v.id AND status != 'Rejected'), 0) as total_billed,
                   COALESCE((SELECT SUM(amount) FROM vendor_payments WHERE vendor_id = v.id), 0) as total_paid
            FROM vendors v WHERE v.id = ?
        `, [vendorId]);

        if (vendorRows.length === 0) {
            return res.status(404).render('error', { message: 'Vendor Not Found' });
        }

        const vendor = vendorRows[0];
        vendor.outstanding_balance = parseFloat(vendor.total_billed) - parseFloat(vendor.total_paid);

        const [purchaseOrders] = await db.query('SELECT * FROM purchase_orders WHERE vendor_id = ? ORDER BY created_at DESC', [vendorId]);
        const [payments] = await db.query('SELECT * FROM vendor_payments WHERE vendor_id = ? ORDER BY payment_date DESC, created_at DESC', [vendorId]);

        res.render('payments/vendor_statement', {
            title: `Account Statement: ${vendor.company_name}`,
            vendor, purchaseOrders, payments,
            user: req.session.user
        });
    } catch (err) {
        console.error('Error fetching vendor statement:', err);
        res.redirect('/payments');
    }
}

module.exports = {
    listPayments,
    showCreateForm,
    createPayment,
    vendorStatement
};
