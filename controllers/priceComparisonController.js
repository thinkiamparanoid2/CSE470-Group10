const db = require('../config/db');

// Price Comparison Engine - Member B
async function comparePrices(req, res) {
    try {
        const materialId = req.query.material_id;
        const [materials] = await db.query('SELECT id, name FROM materials ORDER BY name ASC');

        let quotations = [];
        let selectedMaterial = null;

        if (materialId) {
            selectedMaterial = materials.find(m => m.id == materialId);
            const [results] = await db.query(`
                SELECT vq.price, vq.last_updated, v.company_name, v.rating, v.phone
                FROM vendor_quotations vq
                JOIN vendors v ON vq.vendor_id = v.id
                WHERE vq.material_id = ?
                ORDER BY vq.price ASC
            `, [materialId]);
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
}

module.exports = {
    comparePrices
};
