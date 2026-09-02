const db = require('../config/db');
const { isPositiveNumber, isValidDate, sanitize } = require('../middleware/validate');

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
        let txParams = [];
        if (req.session.user.role === 'Vendor') {
            txQuery += ` WHERE v.user_id = ? `;
            txParams.push(req.session.user.id);
        }
        txQuery += ` ORDER BY p.payment_date DESC, p.created_at DESC LIMIT 20`;

        const [recentPayments] = await db.query(txQuery, txParams);

        res.render('payments/index', {
            title: 'Vendor Payment Tracker',
            vendors, recentPayments,
            user: req.session.user
        });
    } catch (err) {
        console.error('List Payments Error:', err);
        res.render('payments/index', {
            title: 'Vendor Payment Tracker',
            vendors: [], recentPayments: [],
            user: req.session.user,
            error: 'Failed to retrieve financial payment logs.'
        });
    }
}

// Show Record Payment Form
async function showCreateForm(req, res) {
    try {
        const [vendors] = await db.query('SELECT id, company_name FROM vendors ORDER BY company_name ASC');
        const [pos] = await db.query('SELECT id, vendor_id, total_amount, status FROM purchase_orders ORDER BY id DESC');
        // "Record Payment" links from a vendor's ledger statement pass ?vendor_id= so
        // the form opens pre-scoped to that supplier — honor it here.
        const selectedVendorId = req.query.vendor_id ? parseInt(req.query.vendor_id, 10) : null;
        res.render('payments/create', { vendors, pos, selectedVendorId: !isNaN(selectedVendorId) ? selectedVendorId : null, title: 'Record Vendor Payment' });
    } catch (err) {
        console.error('Show Create Payment Form Error:', err);
        res.render('error', { message: 'Database Error: Could not load vendors or POs for payment entry.' });
    }
}

// Record Payment (Raw SQL with Validation)
async function createPayment(req, res) {
    const vendor_id = parseInt(req.body.vendor_id, 10);
    const po_id = req.body.po_id ? parseInt(req.body.po_id, 10) : null;
    const amount = req.body.amount;
    const payment_type = sanitize(req.body.payment_type) || 'Advance';
    const payment_method = sanitize(req.body.payment_method) || 'Bank Transfer';
    const reference_no = sanitize(req.body.reference_no);
    const payment_date = req.body.payment_date;
    const notes = sanitize(req.body.notes);
    const recorded_by = req.session.user.id;

    // Validation
    if (isNaN(vendor_id)) {
        return res.render('error', { message: 'Validation Error: Please select a valid vendor beneficiary.' });
    }
    if (!isPositiveNumber(amount) || parseFloat(amount) <= 0) {
        return res.render('error', { message: 'Validation Error: Payment amount must be greater than zero.' });
    }
    if (payment_date && !isValidDate(payment_date)) {
        return res.render('error', { message: 'Validation Error: A valid payment settlement date is required.' });
    }

    try {
        await db.query(
            'INSERT INTO vendor_payments (vendor_id, po_id, amount, payment_type, payment_method, reference_no, payment_date, notes, recorded_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [vendor_id, po_id && !isNaN(po_id) ? po_id : null, parseFloat(amount), payment_type, payment_method, reference_no || null, payment_date || new Date(), notes || null, recorded_by]
        );
        res.redirect('/payments');
    } catch (err) {
        console.error('Create Payment Error:', err);
        res.render('error', { message: 'Database Error: Failed to record payment transaction.' });
    }
}

// Vendor Ledger Account Statement
async function vendorStatement(req, res) {
    const vendorId = parseInt(req.params.id, 10);
    if (isNaN(vendorId)) {
        return res.render('error', { message: 'Invalid vendor ID specified.' });
    }

    try {
        if (req.session.user.role === 'Vendor') {
            const [vCheck] = await db.query('SELECT id FROM vendors WHERE id = ? AND user_id = ?', [vendorId, req.session.user.id]);
            if (vCheck.length === 0) {
                return res.status(403).render('error', { message: 'Access Denied: You cannot view financial statements belonging to other vendors.' });
            }
        }

        const [vendorRows] = await db.query(`
            SELECT v.*,
                   COALESCE((SELECT SUM(total_amount) FROM purchase_orders WHERE vendor_id = v.id AND status != 'Rejected'), 0) as total_billed,
                   COALESCE((SELECT SUM(amount) FROM vendor_payments WHERE vendor_id = v.id), 0) as total_paid
            FROM vendors v WHERE v.id = ?
        `, [vendorId]);

        if (vendorRows.length === 0) {
            return res.status(404).render('error', { message: 'Vendor profile not found.' });
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
        console.error('Vendor Statement Error:', err);
        res.render('error', { message: 'Database Error: Failed to generate ledger statement.' });
    }
}

module.exports = {
    listPayments,
    showCreateForm,
    createPayment,
    vendorStatement
};
