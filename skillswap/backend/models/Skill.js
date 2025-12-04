// import db from '../config/database.js';

// class Skill {
//     static createTable() {
//         const sql = `
//             CREATE TABLE IF NOT EXISTS skills (
//                 id INT AUTO_INCREMENT PRIMARY KEY,
//                 user_id INT NOT NULL,
//                 name VARCHAR(255) NOT NULL,
//                 description TEXT,
//                 image VARCHAR(255),
//                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//                 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
//             )
//         `;
//         return db.promise().execute(sql);
//     }

//     static create(skillData) {
//         const sql = `INSERT INTO skills (user_id, name, description, image) VALUES (?, ?, ?, ?)`;
//         return db.promise().execute(sql, [
//             skillData.user_id,
//             skillData.name,
//             skillData.description,
//             skillData.image
//         ]);
//     }

//     static findByUserId(userId) {
//         const sql = `SELECT * FROM skills WHERE user_id = ?`;
//         return db.promise().execute(sql, [userId]);
//     }

//     static findAll() {
//         const sql = `
//             SELECT s.*, u.name as user_name, u.college 
//             FROM skills s 
//             JOIN users u ON s.user_id = u.id
//         `;
//         return db.promise().execute(sql);
//     }

//     static search(query) {
//         const sql = `
//             SELECT s.*, u.name as user_name, u.college 
//             FROM skills s 
//             JOIN users u ON s.user_id = u.id 
//             WHERE s.name LIKE ? OR u.name LIKE ? OR s.description LIKE ?
//         `;
//         const searchQuery = `%${query}%`;
//         return db.promise().execute(sql, [searchQuery, searchQuery, searchQuery]);
//     }
// }

// export default Skill;
// import db from '../config/database.js';

// class Skill {
//     // Create skills table
//     static async createTable() {
//         const sql = `
//             CREATE TABLE IF NOT EXISTS skills (
//                 id INT AUTO_INCREMENT PRIMARY KEY,
//                 user_id INT NOT NULL,
//                 name VARCHAR(255) NOT NULL,
//                 description TEXT,
//                 proficiency_level ENUM('beginner', 'intermediate', 'advanced', 'expert') DEFAULT 'intermediate',
//                 category VARCHAR(100),
//                 image_url VARCHAR(500),
//                 is_public BOOLEAN DEFAULT TRUE,
//                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//                 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//                 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
//                 INDEX idx_user_id (user_id),
//                 INDEX idx_category (category),
//                 INDEX idx_public (is_public)
//             )
//         `;
//         try {
//             await db.promise().execute(sql);
//             console.log('✅ Skills table created/verified');
//         } catch (error) {
//             console.error('❌ Error creating skills table:', error);
//             throw error;
//         }
//     }

//     // Create a new skill
//     static async create(skillData) {
//         const sql = `
//             INSERT INTO skills (user_id, name, description, proficiency_level, category, image_url, is_public) 
//             VALUES (?, ?, ?, ?, ?, ?, ?)
//         `;
//         try {
//             const [result] = await db.promise().execute(sql, [
//                 skillData.user_id,
//                 skillData.name,
//                 skillData.description,
//                 skillData.proficiency_level || 'intermediate',
//                 skillData.category || null,
//                 skillData.image_url || null,
//                 skillData.is_public !== undefined ? skillData.is_public : true
//             ]);
//             return { id: result.insertId, ...skillData };
//         } catch (error) {
//             console.error('Error creating skill:', error);
//             throw error;
//         }
//     }

//     // Get all public skills with user info
//     static async findAllPublic() {
//         const sql = `
//             SELECT s.*, u.name as user_name, u.college, u.avatar_url
//             FROM skills s 
//             JOIN users u ON s.user_id = u.id 
//             WHERE s.is_public = TRUE
//             ORDER BY s.created_at DESC
//         `;
//         try {
//             const [rows] = await db.promise().execute(sql);
//             return rows;
//         } catch (error) {
//             console.error('Error fetching public skills:', error);
//             throw error;
//         }
//     }

//     // Get skills by user ID
//     static async findByUserId(userId) {
//         const sql = `SELECT * FROM skills WHERE user_id = ? ORDER BY created_at DESC`;
//         try {
//             const [rows] = await db.promise().execute(sql, [userId]);
//             return rows;
//         } catch (error) {
//             console.error('Error fetching user skills:', error);
//             throw error;
//         }
//     }

//     // Search skills
//     static async search(query) {
//         const searchQuery = `%${query}%`;
//         const sql = `
//             SELECT s.*, u.name as user_name, u.college, u.avatar_url
//             FROM skills s 
//             JOIN users u ON s.user_id = u.id 
//             WHERE s.is_public = TRUE 
//             AND (s.name LIKE ? OR s.description LIKE ? OR s.category LIKE ? OR u.name LIKE ?)
//             ORDER BY s.created_at DESC
//         `;
//         try {
//             const [rows] = await db.promise().execute(sql, [searchQuery, searchQuery, searchQuery, searchQuery]);
//             return rows;
//         } catch (error) {
//             console.error('Error searching skills:', error);
//             throw error;
//         }
//     }

//     // Update skill
//     static async update(id, userId, updateData) {
//         const allowedFields = ['name', 'description', 'proficiency_level', 'category', 'image_url', 'is_public'];
//         const fields = Object.keys(updateData).filter(field => allowedFields.includes(field));
        
//         if (fields.length === 0) {
//             throw new Error('No valid fields to update');
//         }

//         const setClause = fields.map(field => `${field} = ?`).join(', ');
//         const values = fields.map(field => updateData[field]);
//         values.push(id, userId);

//         const sql = `UPDATE skills SET ${setClause} WHERE id = ? AND user_id = ?`;
        
//         try {
//             const [result] = await db.promise().execute(sql, values);
//             return result.affectedRows > 0;
//         } catch (error) {
//             console.error('Error updating skill:', error);
//             throw error;
//         }
//     }

//     // Delete skill
//     static async delete(id, userId) {
//         const sql = `DELETE FROM skills WHERE id = ? AND user_id = ?`;
//         try {
//             const [result] = await db.promise().execute(sql, [id, userId]);
//             return result.affectedRows > 0;
//         } catch (error) {
//             console.error('Error deleting skill:', error);
//             throw error;
//         }
//     }
// }

// export default Skill;
// import { promisePool } from '../config/database.js';

// class Skill {
//     // Create skills table
//     static async createTable() {
//         const sql = `
//             CREATE TABLE IF NOT EXISTS skills (
//                 id INT AUTO_INCREMENT PRIMARY KEY,
//                 user_id INT NOT NULL,
//                 name VARCHAR(255) NOT NULL,
//                 description TEXT,
//                 proficiency_level ENUM('beginner', 'intermediate', 'advanced', 'expert') DEFAULT 'intermediate',
//                 category VARCHAR(100),
//                 image_url VARCHAR(500),
//                 is_public BOOLEAN DEFAULT TRUE,
//                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//                 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//                 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
//                 INDEX idx_user_id (user_id),
//                 INDEX idx_category (category),
//                 INDEX idx_public (is_public)
//             )
//         `;
//         try {
//             await promisePool.execute(sql);
//             console.log('✅ Skills table created/verified');
//         } catch (error) {
//             console.error('❌ Error creating skills table:', error);
//             throw error;
//         }
//     }

//     // Create a new skill
//     static async create(skillData) {
//         const sql = `
//             INSERT INTO skills (user_id, name, description, proficiency_level, category, image_url, is_public) 
//             VALUES (?, ?, ?, ?, ?, ?, ?)
//         `;
//         try {
//             const [result] = await promisePool.execute(sql, [
//                 skillData.user_id,
//                 skillData.name,
//                 skillData.description,
//                 skillData.proficiency_level || 'intermediate',
//                 skillData.category || null,
//                 skillData.image_url || null,
//                 skillData.is_public !== undefined ? skillData.is_public : true
//             ]);
//             return { id: result.insertId, ...skillData };
//         } catch (error) {
//             console.error('Error creating skill:', error);
//             throw error;
//         }
//     }

//     // Get all public skills with user info
//     static async findAllPublic() {
//         const sql = `
//             SELECT s.*, u.name as user_name, u.college
//             FROM skills s 
//             JOIN users u ON s.user_id = u.id 
//             WHERE s.is_public = TRUE
//             ORDER BY s.created_at DESC
//     `   ;
//         try {
//             const [rows] = await promisePool.execute(sql);
//             return rows;
//         } catch (error) {
//             console.error('Error fetching public skills:', error);
//             throw error;
//         }
//     }
//     // Get skills by user ID
//     static async findByUserId(userId) {
//         const sql = `SELECT * FROM skills WHERE user_id = ? ORDER BY created_at DESC`;
//         try {
//             const [rows] = await promisePool.execute(sql, [userId]);
//             return rows;
//         } catch (error) {
//             console.error('Error fetching user skills:', error);
//             throw error;
//         }
//     }

//     // Search skills
//     static async search(query) {
//         const searchQuery = `%${query}%`;
//         const sql = `
//             SELECT s.*, u.name as user_name, u.college
//             FROM skills s 
//             JOIN users u ON s.user_id = u.id 
//             WHERE s.is_public = TRUE 
//             AND (s.name LIKE ? OR s.description LIKE ? OR s.category LIKE ? OR u.name LIKE ?)
//             ORDER BY s.created_at DESC
//         `;
//         try {
//             const [rows] = await promisePool.execute(sql, [searchQuery, searchQuery, searchQuery, searchQuery]);
//             return rows;
//         } catch (error) {
//             console.error('Error searching skills:', error);
//             throw error;
//         }
//     }
// }

// export default Skill;
import { promisePool } from '../config/database.js';

class Skill {
    // Create skills table - MATCHING YOUR ACTUAL DATABASE SCHEMA
    static async createTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS skills (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                image VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `;
        try {
            await promisePool.execute(sql);
            console.log('✅ Skills table created/verified');
        } catch (error) {
            console.error('❌ Error creating skills table:', error);
            throw error;
        }
    }

    // Create a new skill - USING ONLY COLUMNS THAT EXIST
    static async create(skillData) {
        const sql = `
            INSERT INTO skills (user_id, name, description, image) 
            VALUES (?, ?, ?, ?)
        `;
        try {
            const [result] = await promisePool.execute(sql, [
                skillData.user_id,
                skillData.name,
                skillData.description,
                skillData.image || null
            ]);
            return { id: result.insertId, ...skillData };
        } catch (error) {
            console.error('Error creating skill:', error);
            throw error;
        }
    }

    // Get all skills with user info - REMOVED is_public FILTER
    static async findAll() {
        const sql = `
            SELECT s.*, u.name as user_name, u.college
            FROM skills s 
            JOIN users u ON s.user_id = u.id 
            ORDER BY s.created_at DESC
        `;
        try {
            const [rows] = await promisePool.execute(sql);
            return rows;
        } catch (error) {
            console.error('Error fetching skills:', error);
            throw error;
        }
    }

    // Get skills by user ID
    static async findByUserId(userId) {
        const sql = `SELECT * FROM skills WHERE user_id = ? ORDER BY created_at DESC`;
        try {
            const [rows] = await promisePool.execute(sql, [userId]);
            return rows;
        } catch (error) {
            console.error('Error fetching user skills:', error);
            throw error;
        }
    }

    // Search skills - REMOVED is_public and category FILTERS
    static async search(query) {
        const searchQuery = `%${query}%`;
        const sql = `
            SELECT s.*, u.name as user_name, u.college
            FROM skills s 
            JOIN users u ON s.user_id = u.id 
            WHERE s.name LIKE ? OR u.name LIKE ? OR s.description LIKE ?
            ORDER BY s.created_at DESC
        `;
        try {
            const [rows] = await promisePool.execute(sql, [searchQuery, searchQuery, searchQuery]);
            return rows;
        } catch (error) {
            console.error('Error searching skills:', error);
            throw error;
        }
    }
}

export default Skill;
