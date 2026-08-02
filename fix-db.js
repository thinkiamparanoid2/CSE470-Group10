const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixDB() {
    try {
        const c = await mysql.createConnection({host:'localhost', user:'root', database:'smarstruction_db'});
        
        // Disable FK checks
        await c.query('SET FOREIGN_KEY_CHECKS = 0');
        
        // Delete all data to reset
        await c.query('TRUNCATE TABLE vendors');
        await c.query('TRUNCATE TABLE vendor_quotations');
        
        // Re-insert vendors with exact IDs
        await c.query(`
            INSERT INTO vendors (id, company_name, contact_person, email, phone, material_category, rating, user_id) VALUES
            (1, 'BSRM Steels Bangladesh', 'Mr. Tanvir', 'sales@bsrm.bd', '+8801700000001', 'Steel/Rod', 4.90, 4),
            (2, 'Seven Rings Cement', 'Mr. Karim', 'orders@sevenrings.bd', '+8801800000002', 'Cement', 4.70, NULL),
            (3, 'Bengal Auto Bricks', 'Mr. Hafiz', 'info@bengalbricks.bd', '+8801900000003', 'Bricks', 4.50, NULL),
            (4, 'Anwar Ispat', 'Mr. Rahim', 'sales@anwar.bd', '+8801700000005', 'Steel/Rod', 4.60, NULL),
            (5, 'Crown Cement', 'Mr. Hasan', 'info@crowncement.bd', '+8801800000006', 'Cement', 4.80, NULL)
        `);
        
        // Re-insert vendor quotations matching those IDs
        await c.query(`
            INSERT INTO vendor_quotations (vendor_id, material_id, price) VALUES
            (1, 2, 98000.00),
            (4, 2, 96500.00),
            (2, 1, 560.00),
            (5, 1, 550.00),
            (3, 3, 12.50)
        `);
        
        await c.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('Database fixed!');
        c.end();
    } catch (e) {
        console.error(e);
    }
}

fixDB();
