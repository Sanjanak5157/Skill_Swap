import { promisePool } from '../config/database.js';

async function fixDatabaseSchema() {
    console.log('🔧 Fixing database schema...');
    
    try {
        // Add is_public column to tables if missing
        const tablesToFix = [
            { table: 'courses', column: 'is_public', definition: 'BOOLEAN DEFAULT TRUE' },
            { table: 'projects', column: 'is_public', definition: 'BOOLEAN DEFAULT TRUE' },
            { table: 'notes', column: 'is_public', definition: 'BOOLEAN DEFAULT TRUE' },
            { table: 'datasets', column: 'is_public', definition: 'BOOLEAN DEFAULT TRUE' },
            { table: 'skills', column: 'is_public', definition: 'BOOLEAN DEFAULT TRUE' }
        ];
        
        for (const { table, column, definition } of tablesToFix) {
            try {
                // Check if column exists
                const [result] = await promisePool.execute(`
                    SELECT COUNT(*) as count 
                    FROM INFORMATION_SCHEMA.COLUMNS 
                    WHERE TABLE_SCHEMA = DATABASE() 
                    AND TABLE_NAME = ? 
                    AND COLUMN_NAME = ?
                `, [table, column]);
                
                if (result[0].count === 0) {
                    console.log(`➕ Adding ${column} to ${table}...`);
                    await promisePool.execute(
                        `ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`
                    );
                    console.log(`✅ Added ${column} to ${table}`);
                } else {
                    console.log(`✅ ${column} already exists in ${table}`);
                }
            } catch (error) {
                console.error(`❌ Error fixing ${table}:`, error.message);
            }
        }
        
        console.log('🎉 Database schema fixed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Failed to fix database:', error);
        process.exit(1);
    }
}

fixDatabaseSchema();