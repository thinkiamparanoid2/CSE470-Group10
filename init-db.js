const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initDB() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            multipleStatements: true
        });

        const schemaPath = path.join(__dirname, 'database', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        console.log('Executing schema...');
        await connection.query(schema);
        console.log('Database initialized successfully!');
        
        await connection.end();
    } catch (err) {
        console.error('Error initializing database:', err);
        if (err.message && err.message.includes('ECONNREFUSED')) {
            console.error('It seems MySQL is not running on ' + (process.env.DB_HOST || 'localhost') + ':3306');
        }
    }
}

initDB();
