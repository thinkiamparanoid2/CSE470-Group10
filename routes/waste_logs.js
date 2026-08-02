const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { isAuthenticated } = require('../middleware/auth');

// GET /waste-logs
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const query = `
            SELECT wl.*, p.name AS project_name, m.name AS material_name, u.name AS logger_name 
            FROM material_waste_logs wl
            JOIN projects p ON wl.project_id = p.id
            JOIN materials m ON wl.material_id = m.id
            LEFT JOIN users u ON wl.logged_by = u.id
            ORDER BY wl.log_date DESC, wl.created_at DESC
        `;
        const [logs] = await db.query(query);

        // Fetch projects and materials for the logging form
        const [projects] = await db.query('SELECT id, name FROM projects WHERE status = "Ongoing"');
        const [materials] = await db.query('SELECT id, name FROM materials');

        res.render('waste_logs/index', {
            title: 'Material Waste Logs',
            user: req.session.user,
            logs,
            projects,
            materials,
            error: null
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// POST /waste-logs
router.post('/', isAuthenticated, async (req, res) => {
    const { project_id, material_id, waste_quantity, reason, log_date } = req.body;
    try {
        await db.query(
            'INSERT INTO material_waste_logs (project_id, material_id, waste_quantity, reason, log_date, logged_by) VALUES (?, ?, ?, ?, ?, ?)',
            [project_id, material_id, waste_quantity, reason, log_date, req.session.user.id]
        );
        
        // Optional: Could deduct from inventory here, but keeping it simple for logging purposes.
        // await db.query('UPDATE materials SET current_stock = current_stock - ? WHERE id = ?', [waste_quantity, material_id]);

        res.redirect('/waste-logs');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
