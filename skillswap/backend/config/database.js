
import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

// Create connection pool for better performance
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Sanjana@123',
    database: process.env.DB_NAME || 'skillswap',
    charset: 'utf8mb4',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Get promise-based interface from the pool
const promisePool = pool.promise();

// Test connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Database connection failed: ' + err.stack);
        console.error('💡 Please check your MySQL server and database configuration');
        return;
    }
    console.log('✅ Connected to database as id ' + connection.threadId);
    connection.release();
});

export { pool, promisePool };