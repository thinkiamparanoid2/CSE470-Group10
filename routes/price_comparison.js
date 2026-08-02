const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', isAuthenticated, async (req, res) => {
    try {
        const materialId = req.query.material_id;
        
        // Fetch all materials for the dropdown
        const [materials] = await db.query('SELECT id, name FROM materials ORDER BY name ASC');
        
        let quotations = [];
        let selectedMaterial = null;

        if (materialId) {
            // Find the selected material name
            selectedMaterial = materials.find(m => m.id == materialId);
            
            // Fetch quotations for the selected material, joined with vendor details
            const query = `
                SELECT vq.price, vq.last_updated, v.company_name, v.rating, v.phone
                FROM vendor_quotations vq
                JOIN vendors v ON vq.vendor_id = v.id
                WHERE vq.material_id = ?
                ORDER BY vq.price ASC
            `;
            const [results] = await db.query(query, [materialId]);
            quotations = results;
        }

        res.render('price_comparison/index', {
            title: 'Price Comparison Engine',
            user: req.session.user,
            materials,
            selectedMaterial,
            quotations
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
