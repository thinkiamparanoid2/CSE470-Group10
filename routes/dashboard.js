const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { isAuthenticated } = require('../middleware/auth');

// Dashboard Overview (Raw SQL queries for statistics across all Sprints)
router.get('/', isAuthenticated, async (req, res) => {
    try {
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

        res.render('dashboard', {
            totalMaterials,
            totalVendors,
            totalProjects,
            totalBoqs,
            totalEquipment,
            totalReports,
            recentMaterials,
            recentVendors,
            recentSiteReports,
            upcomingMaintenance,
            title: 'Dashboard | Smarstruction Platform'
        });
    } catch (err) {
        console.error(err);
        res.render('dashboard', {
            totalMaterials: 0,
            totalVendors: 0,
            totalProjects: 0,
            totalBoqs: 0,
            totalEquipment: 0,
            totalReports: 0,
            recentMaterials: [],
            recentVendors: [],
            recentSiteReports: [],
            upcomingMaintenance: [],
            title: 'Dashboard | Smarstruction Platform'
        });
    }
});

module.exports = router;
