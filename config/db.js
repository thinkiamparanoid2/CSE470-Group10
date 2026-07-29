const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'smarstruction_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test DB Connection function
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ MySQL Database connected successfully!');
        connection.release();
    } catch (err) {
        console.error('⚠️ MySQL Connection Warning:', err.message);
        console.log('👉 Make sure MySQL is running and database "smarstruction_db" is created using database/schema.sql');
    }
}

testConnection();

module.exports = pool;
