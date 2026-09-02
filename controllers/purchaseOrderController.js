const db = require('../config/db');
const { isPositiveNumber, isValidDate } = require('../middleware/validate');

// List Purchase Orders
async function listPurchaseOrders(req, res) {
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
        console.error('List Purchase Orders Error:', err);
        res.render('purchase_orders/index', { purchaseOrders: [], title: 'Purchase Orders', error: 'Failed to load purchase orders.' });
    }
}

// Create Purchase Order Form
async function showCreateForm(req, res) {
    try {
        const [vendors] = await db.query('SELECT * FROM vendors ORDER BY company_name ASC');
        const [materials] = await db.query('SELECT * FROM materials ORDER BY name ASC');
        res.render('purchase_orders/create', { vendors, materials, title: 'Create Purchase Order' });
    } catch (err) {
        console.error('Show Create PO Form Error:', err);
        res.render('error', { message: 'Database Error: Could not load vendors or materials for PO creation.' });
    }
}

// Create Purchase Order Action (Raw SQL with Transaction & Validation)
async function createPurchaseOrder(req, res) {
    const vendor_id = parseInt(req.body.vendor_id, 10);
    const expected_date = req.body.expected_date || req.body.delivery_deadline;
    const { material_id, quantity, unit_price } = req.body;
    const created_by = req.session.user.id;

    // Validation
    if (isNaN(vendor_id)) {
        return res.render('error', { message: 'Validation Error: Please select a valid vendor for the Purchase Order.' });
    }
    if (expected_date && !isValidDate(expected_date)) {
        return res.render('error', { message: 'Validation Error: Invalid expected delivery date format.' });
    }

    const materialIds = Array.isArray(material_id) ? material_id : [material_id];
    const quantities = Array.isArray(quantity) ? quantity : [quantity];
    const unitPrices = Array.isArray(unit_price) ? unit_price : [unit_price];

    let totalAmount = 0;
    const validItems = [];

    for (let i = 0; i < materialIds.length; i++) {
        const matId = parseInt(materialIds[i], 10);
        const qty = parseFloat(quantities[i]);
        const price = parseFloat(unitPrices[i]);

        if (isNaN(matId) || isNaN(qty) || isNaN(price)) {
            continue;
        }

        if (qty <= 0) {
            return res.render('error', { message: 'Validation Error: Order item quantity must be greater than zero.' });
        }
        if (price < 0) {
            return res.render('error', { message: 'Validation Error: Order item unit price cannot be negative.' });
        }

        totalAmount += qty * price;
        validItems.push({ matId, qty, price });
    }

    if (validItems.length === 0) {
        return res.render('error', { message: 'Validation Error: At least one valid material line item is required in the PO.' });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const [poResult] = await connection.query(
            'INSERT INTO purchase_orders (vendor_id, expected_date, total_amount, created_by) VALUES (?, ?, ?, ?)',
            [vendor_id, expected_date || null, totalAmount, created_by]
        );
        const poId = poResult.insertId;

        for (let item of validItems) {
            await connection.query(
                'INSERT INTO purchase_order_items (po_id, material_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
                [poId, item.matId, item.qty, item.price]
            );
        }

        await connection.commit();
        res.redirect('/purchase_orders');
    } catch (err) {
        await connection.rollback();
        console.error('Create PO Transaction Error:', err);
        res.render('error', { message: 'Database Transaction Error: Failed to create purchase order. All changes were safely rolled back.' });
    } finally {
        connection.release();
    }
}

// Update PO Status (Raw SQL with Transaction & Validation)
async function updateStatus(req, res) {
    const poId = parseInt(req.params.id, 10);
    const { status } = req.body;
    // "Shipped" and "Delivered" are intentionally NOT settable here — those transitions
    // must only ever happen through the Deliveries workflow (deliveryController), which
    // keeps the linked delivery record in sync and credits received stock. Allowing this
    // endpoint to jump straight to Delivered would desync the PO from its delivery record
    // and silently skip the stock-credit step.
    const validStatuses = ['Pending', 'Approved'];

    if (isNaN(poId) || !validStatuses.includes(status)) {
        return res.render('error', { message: 'Validation Error: Invalid PO ID or status transition.' });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        await connection.query('UPDATE purchase_orders SET status = ? WHERE id = ?', [status, poId]);

        if (status === 'Approved') {
            // Check if delivery already exists
            const [existingDelivery] = await connection.query('SELECT id FROM deliveries WHERE po_id = ?', [poId]);
            if (existingDelivery.length === 0) {
                await connection.query(
                    'INSERT INTO deliveries (po_id, status) VALUES (?, ?)',
                    [poId, 'Pending']
                );
            }
        }

        await connection.commit();
        res.redirect('/purchase_orders');
    } catch (err) {
        await connection.rollback();
        console.error('Update PO Status Error:', err);
        res.render('error', { message: 'Database Error: Could not update PO status. Transaction rolled back.' });
    } finally {
        connection.release();
    }
}

module.exports = {
    listPurchaseOrders,
    showCreateForm,
    createPurchaseOrder,
    updateStatus
};
