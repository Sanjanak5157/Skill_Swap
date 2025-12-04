// import db from '../config/database.js';

// class College {
//     // Create colleges table
//     static async createTable() {
//         const sql = `
//             CREATE TABLE IF NOT EXISTS colleges (
//                 id INT AUTO_INCREMENT PRIMARY KEY,
//                 name VARCHAR(255) NOT NULL UNIQUE,
//                 description TEXT,
//                 location VARCHAR(255),
//                 website_url VARCHAR(500),
//                 logo_url VARCHAR(500),
//                 established_year INT,
//                 type ENUM('public', 'private', 'deemed') DEFAULT 'public',
//                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//             )
//         `;
//         try {
//             await db.promise().execute(sql);
//             console.log('✅ Colleges table created/verified');
//         } catch (error) {
//             console.error('❌ Error creating colleges table:', error);
//             throw error;
//         }
//     }

//     // Create a new college
//     static async create(collegeData) {
//         const sql = `
//             INSERT INTO colleges (name, description, location, website_url, logo_url, established_year, type) 
//             VALUES (?, ?, ?, ?, ?, ?, ?)
//         `;
//         try {
//             const [result] = await db.promise().execute(sql, [
//                 collegeData.name,
//                 collegeData.description,
//                 collegeData.location || null,
//                 collegeData.website_url || null,
//                 collegeData.logo_url || null,
//                 collegeData.established_year || null,
//                 collegeData.type || 'public'
//             ]);
//             return { id: result.insertId, ...collegeData };
//         } catch (error) {
//             console.error('Error creating college:', error);
//             throw error;
//         }
//     }

//     // Get all colleges
//     static async findAll() {
//         const sql = `
//             SELECT c.*, 
//                    COUNT(DISTINCT u.id) as student_count
//             FROM colleges c
//             LEFT JOIN users u ON u.college = c.name
//             GROUP BY c.id
//             ORDER BY c.name ASC
//         `;
//         try {
//             const [rows] = await db.promise().execute(sql);
//             return rows;
//         } catch (error) {
//             console.error('Error fetching colleges:', error);
//             throw error;
//         }
//     }

//     // Search colleges
//     static async search(query) {
//         const searchQuery = `%${query}%`;
//         const sql = `
//             SELECT c.*, 
//                    COUNT(DISTINCT u.id) as student_count
//             FROM colleges c
//             LEFT JOIN users u ON u.college = c.name
//             WHERE c.name LIKE ? OR c.location LIKE ? OR c.description LIKE ?
//             GROUP BY c.id
//             ORDER BY c.name ASC
//         `;
//         try {
//             const [rows] = await db.promise().execute(sql, [searchQuery, searchQuery, searchQuery]);
//             return rows;
//         } catch (error) {
//             console.error('Error searching colleges:', error);
//             throw error;
//         }
//     }

//     // Get students by college name
//     static async getStudents(collegeName) {
//         const sql = `
//             SELECT id, name, email, branch, semester, avatar_url, created_at
//             FROM users 
//             WHERE college = ? 
//             ORDER BY name ASC
//         `;
//         try {
//             const [rows] = await db.promise().execute(sql, [collegeName]);
//             return rows;
//         } catch (error) {
//             console.error('Error fetching college students:', error);
//             throw error;
//         }
//     }
// }

// export default College;
import { promisePool } from '../config/database.js';

class College {
    // Create colleges table
    static async createTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS colleges (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE,
                description TEXT,
                location VARCHAR(255),
                website_url VARCHAR(500),
                logo_url VARCHAR(500),
                established_year INT,
                type ENUM('public', 'private', 'deemed') DEFAULT 'public',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        try {
            await promisePool.execute(sql);
            console.log('✅ Colleges table created/verified');
        } catch (error) {
            console.error('❌ Error creating colleges table:', error);
            throw error;
        }
    }

    // Create a new college
    static async create(collegeData) {
        const sql = `
            INSERT INTO colleges (name, description, location, website_url, logo_url, established_year, type) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        try {
            const [result] = await promisePool.execute(sql, [
                collegeData.name,
                collegeData.description,
                collegeData.location || null,
                collegeData.website_url || null,
                collegeData.logo_url || null,
                collegeData.established_year || null,
                collegeData.type || 'public'
            ]);
            return { id: result.insertId, ...collegeData };
        } catch (error) {
            console.error('Error creating college:', error);
            throw error;
        }
    }

    // Get all colleges
    static async findAll() {
        const sql = `
            SELECT c.*, 
                   COUNT(DISTINCT u.id) as student_count
            FROM colleges c
            LEFT JOIN users u ON u.college = c.name
            GROUP BY c.id
            ORDER BY c.name ASC
        `;
        try {
            const [rows] = await promisePool.execute(sql);
            return rows;
        } catch (error) {
            console.error('Error fetching colleges:', error);
            throw error;
        }
    }

    // Search colleges
    static async search(query) {
        const searchQuery = `%${query}%`;
        const sql = `
            SELECT c.*, 
                   COUNT(DISTINCT u.id) as student_count
            FROM colleges c
            LEFT JOIN users u ON u.college = c.name
            WHERE c.name LIKE ? OR c.location LIKE ? OR c.description LIKE ?
            GROUP BY c.id
            ORDER BY c.name ASC
        `;
        try {
            const [rows] = await promisePool.execute(sql, [searchQuery, searchQuery, searchQuery]);
            return rows;
        } catch (error) {
            console.error('Error searching colleges:', error);
            throw error;
        }
    }

    // Get students by college name
    static async getStudents(collegeName) {
        const sql = `
            SELECT id, name, email, branch, semester, avatar_url, created_at
            FROM users 
            WHERE college = ? 
            ORDER BY name ASC
        `;
        try {
            const [rows] = await promisePool.execute(sql, [collegeName]);
            return rows;
        } catch (error) {
            console.error('Error fetching college students:', error);
            throw error;
        }
    }
}

export default College;