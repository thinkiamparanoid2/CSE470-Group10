const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { isAuthenticated } = require('../middleware/auth');

// Dashboard Overview (Raw SQL queries for statistics)
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const [[{ totalMaterials }]] = await db.query('SELECT COUNT(*) AS totalMaterials FROM materials');
        const [[{ totalVendors }]] = await db.query('SELECT COUNT(*) AS totalVendors FROM vendors');
        const [[{ totalProjects }]] = await db.query('SELECT COUNT(*) AS totalProjects FROM projects');
        const [recentMaterials] = await db.query('SELECT * FROM materials ORDER BY created_at DESC LIMIT 5');
        const [recentVendors] = await db.query('SELECT * FROM vendors ORDER BY created_at DESC LIMIT 5');

        res.render('dashboard', {
            totalMaterials,
            totalVendors,
            totalProjects,
            recentMaterials,
            recentVendors,
            title: 'Dashboard | Smarstruction'
        });
    } catch (err) {
        console.error(err);
        res.render('dashboard', {
            totalMaterials: 0,
            totalVendors: 0,
            totalProjects: 0,
            recentMaterials: [],
            recentVendors: [],
            title: 'Dashboard | Smarstruction'
        });
    }
});

module.exports = router;
