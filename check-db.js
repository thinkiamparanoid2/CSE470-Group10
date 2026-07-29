const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkDB() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: 'smarstruction_db'
        });

        // Set user_id=null for any vendor that currently has 4
        await connection.query('UPDATE vendors SET user_id = NULL WHERE user_id = 4');
        
        // The user created PO #1 with vendor_id = 5. Let's make vendor 5 the actual BSRM linked to user 4
        await connection.query('UPDATE vendors SET user_id = 4 WHERE id = 5');
        
        console.log('Fixed BSRM user_id for Vendor 5.');
        
        await connection.end();
    } catch (err) {
        console.error(err);
    }
}
checkDB();
