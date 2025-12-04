import { promisePool } from './config/database.js';

async function testDatabase() {
    try {
        // Test connection
        const [rows] = await promisePool.execute('SELECT 1 + 1 AS solution');
        console.log('✅ Database connection test passed:', rows[0].solution === 2);
        
        // Test if tables exist
        const [tables] = await promisePool.execute('SHOW TABLES');
        console.log('📊 Existing tables:', tables.map(t => Object.values(t)[0]));
        
    } catch (error) {
        console.error('❌ Database test failed:', error.message);
    } finally {
        process.exit();
    }
}

testDatabase();