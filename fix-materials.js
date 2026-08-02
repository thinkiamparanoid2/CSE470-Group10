const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixMaterials() {
    try {
        const c = await mysql.createConnection({host:'localhost', user:'root', database:'smarstruction_db'});
        
        // Disable FK checks
        await c.query('SET FOREIGN_KEY_CHECKS = 0');
        
        // Map of wrong ID -> correct ID
        const updates = {
            6: 1, 10: 1, 14: 1, // Portland Cement
            7: 2, 11: 2, 15: 2, // Deformed Bar 60G
            8: 3, 12: 3, 16: 3, // Bricks
            9: 4, 13: 4, 17: 4  // Sand
        };
        
        for (const [wrongId, correctId] of Object.entries(updates)) {
            // Update dependencies
            await c.query('UPDATE material_waste_logs SET material_id = ? WHERE material_id = ?', [correctId, wrongId]);
            await c.query('UPDATE purchase_order_items SET material_id = ? WHERE material_id = ?', [correctId, wrongId]);
            await c.query('UPDATE inventory_transfers SET material_id = ? WHERE material_id = ?', [correctId, wrongId]);
            await c.query('UPDATE material_requests SET material_id = ? WHERE material_id = ?', [correctId, wrongId]);
            
            // Delete duplicate material
            await c.query('DELETE FROM materials WHERE id = ?', [wrongId]);
        }
        
        await c.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('Materials deduplicated successfully!');
        c.end();
    } catch (e) {
        console.error(e);
    }
}

fixMaterials();
