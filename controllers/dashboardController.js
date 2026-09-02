const db = require('../config/db');

// Blank shape for every dashboard variable, so the view never has to guess
// which fields exist for which role — both branches below always fill this in full.
const EMPTY_DASHBOARD_DATA = {
    isVendor: false,
    totalMaterials: 0, totalVendors: 0, totalProjects: 0,
    totalBoqs: 0, totalEquipment: 0, totalReports: 0,
    recentMaterials: [], recentVendors: [],
    recentSiteReports: [], upcomingMaintenance: [],
    vendorProfile: null, totalPOs: 0, totalBilled: 0, totalPaid: 0,
    outstandingBalance: 0, pendingDeliveries: 0,
    recentPOs: [], recentDeliveries: []
};

// A Vendor is an external supplier account, not internal staff — their dashboard
// must only ever surface their OWN purchase orders, deliveries and payment ledger,
// never other companies' bids, internal site reports, or fleet/inventory data.
async function buildVendorDashboard(userId) {
    const [[vendorRow]] = await db.query('SELECT id, company_name, material_category, rating FROM vendors WHERE user_id = ?', [userId]);

    if (!vendorRow) {
        return { ...EMPTY_DASHBOARD_DATA, isVendor: true };
    }

    const vendorId = vendorRow.id;

    const [[{ totalPOs }]] = await db.query('SELECT COUNT(*) AS totalPOs FROM purchase_orders WHERE vendor_id = ?', [vendorId]);
    const [[{ totalBilled }]] = await db.query(
        `SELECT COALESCE(SUM(total_amount), 0) AS totalBilled FROM purchase_orders WHERE vendor_id = ? AND status != 'Rejected'`,
        [vendorId]
    );
    const [[{ totalPaid }]] = await db.query('SELECT COALESCE(SUM(amount), 0) AS totalPaid FROM vendor_payments WHERE vendor_id = ?', [vendorId]);
    const [[{ pendingDeliveries }]] = await db.query(
        `SELECT COUNT(*) AS pendingDeliveries FROM deliveries d JOIN purchase_orders po ON d.po_id = po.id WHERE po.vendor_id = ? AND d.status != 'Delivered'`,
        [vendorId]
    );

    const [recentPOs] = await db.query('SELECT * FROM purchase_orders WHERE vendor_id = ? ORDER BY created_at DESC LIMIT 4', [vendorId]);
    const [recentDeliveries] = await db.query(
        `SELECT d.*, po.total_amount FROM deliveries d JOIN purchase_orders po ON d.po_id = po.id WHERE po.vendor_id = ? ORDER BY d.created_at DESC LIMIT 4`,
        [vendorId]
    );

    return {
        ...EMPTY_DASHBOARD_DATA,
        isVendor: true,
        vendorProfile: vendorRow,
        totalPOs, totalBilled: Number(totalBilled), totalPaid: Number(totalPaid),
        outstandingBalance: Number(totalBilled) - Number(totalPaid),
        pendingDeliveries,
        recentPOs, recentDeliveries
    };
}

async function buildInternalDashboard() {
    const [[{ totalMaterials }]] = await db.query('SELECT COUNT(*) AS totalMaterials FROM materials');
    const [[{ totalVendors }]] = await db.query('SELECT COUNT(*) AS totalVendors FROM vendors');
    const [[{ totalProjects }]] = await db.query('SELECT COUNT(*) AS totalProjects FROM projects');

    // Sprint 4 Statistics & Metrics
    const [[{ totalBoqs }]] = await db.query('SELECT COUNT(*) AS totalBoqs FROM boqs');
    const [[{ totalEquipment }]] = await db.query('SELECT COUNT(*) AS totalEquipment FROM equipment');
    const [[{ totalReports }]] = await db.query('SELECT COUNT(*) AS totalReports FROM daily_site_reports');

    const [recentMaterials] = await db.query('SELECT * FROM materials ORDER BY created_at DESC LIMIT 4');
    const [recentVendors] = await db.query('SELECT * FROM vendors ORDER BY created_at DESC LIMIT 4');

    // Recent Sprint 4 data for Dashboard Widgets
    const [recentSiteReports] = await db.query('SELECT dsr.*, p.name as project_name FROM daily_site_reports dsr JOIN projects p ON dsr.project_id = p.id ORDER BY dsr.report_date DESC, dsr.created_at DESC LIMIT 4');
    const [upcomingMaintenance] = await db.query('SELECT ms.*, e.name as equipment_name, e.equipment_code FROM maintenance_schedules ms JOIN equipment e ON ms.equipment_id = e.id WHERE ms.status != "Completed" ORDER BY ms.scheduled_date ASC LIMIT 4');

    return {
        ...EMPTY_DASHBOARD_DATA,
        isVendor: false,
        totalMaterials, totalVendors, totalProjects,
        totalBoqs, totalEquipment, totalReports,
        recentMaterials, recentVendors,
        recentSiteReports, upcomingMaintenance
    };
}

// Dashboard Overview (Raw SQL queries for statistics across all Sprints)
async function showDashboard(req, res) {
    try {
        const data = req.session.user.role === 'Vendor'
            ? await buildVendorDashboard(req.session.user.id)
            : await buildInternalDashboard();

        res.render('dashboard', { ...data, title: 'Dashboard | SmartConstruction Platform' });
    } catch (err) {
        console.error(err);
        res.render('dashboard', { ...EMPTY_DASHBOARD_DATA, title: 'Dashboard | SmartConstruction Platform' });
    }
}

// Public CMS Landing Page (Member D)
async function showHomePage(req, res) {
    try {
        const [notices] = await db.query('SELECT * FROM notices ORDER BY created_at DESC LIMIT 5');
        const [projects] = await db.query('SELECT * FROM projects LIMIT 3');
        const [[{ siteCount }]] = await db.query('SELECT COUNT(*) AS siteCount FROM projects');
        const [[{ vendorCount }]] = await db.query('SELECT COUNT(*) AS vendorCount FROM vendors');
        const [[{ materialCount }]] = await db.query('SELECT COUNT(*) AS materialCount FROM materials');
        res.render('home', {
            notices, projects, siteCount, vendorCount, materialCount,
            title: 'SmartConstruction | Smart Construction Platform'
        });
    } catch (err) {
        console.error(err);
        res.render('home', {
            notices: [], projects: [], siteCount: 0, vendorCount: 0, materialCount: 0,
            title: 'SmartConstruction'
        });
    }
}

module.exports = {
    showDashboard,
    showHomePage
};
