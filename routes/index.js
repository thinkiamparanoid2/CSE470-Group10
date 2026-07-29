const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Public CMS Landing Page (Member D)
router.get('/', async (req, res) => {
    try {
        // Raw SQL to fetch notices & stats
        const [notices] = await db.query('SELECT * FROM notices ORDER BY created_at DESC LIMIT 5');
        const [projects] = await db.query('SELECT * FROM projects LIMIT 3');
        res.render('home', { notices, projects, title: 'Smarstruction | Smart Construction Platform' });
    } catch (err) {
        console.error(err);
        res.render('home', { notices: [], projects: [], title: 'Smarstruction' });
    }
});

module.exports = router;
