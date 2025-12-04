// import db from '../config/database.js';

// class Dataset {
//     // Create datasets table
//     static async createTable() {
//         const sql = `
//             CREATE TABLE IF NOT EXISTS datasets (
//                 id INT AUTO_INCREMENT PRIMARY KEY,
//                 user_id INT NOT NULL,
//                 title VARCHAR(255) NOT NULL,
//                 description TEXT,
//                 category VARCHAR(100),
//                 file_url VARCHAR(500) NOT NULL,
//                 file_size BIGINT,
//                 file_format VARCHAR(50),
//                 download_count INT DEFAULT 0,
//                 tags TEXT,
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
//             console.log('✅ Datasets table created/verified');
//         } catch (error) {
//             console.error('❌ Error creating datasets table:', error);
//             throw error;
//         }
//     }

//     // Create a new dataset
//     static async create(datasetData) {
//         const sql = `
//             INSERT INTO datasets (user_id, title, description, category, file_url, file_size, file_format, tags, is_public) 
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
//         `;
//         try {
//             const [result] = await db.promise().execute(sql, [
//                 datasetData.user_id,
//                 datasetData.title,
//                 datasetData.description,
//                 datasetData.category || null,
//                 datasetData.file_url,
//                 datasetData.file_size || 0,
//                 datasetData.file_format || 'unknown',
//                 datasetData.tags ? JSON.stringify(datasetData.tags) : null,
//                 datasetData.is_public !== undefined ? datasetData.is_public : true
//             ]);
//             return { id: result.insertId, ...datasetData };
//         } catch (error) {
//             console.error('Error creating dataset:', error);
//             throw error;
//         }
//     }

//     // Get all public datasets with user info
//     static async findAllPublic() {
//         const sql = `
//             SELECT d.*, u.name as author_name, u.avatar_url
//             FROM datasets d 
//             JOIN users u ON d.user_id = u.id 
//             WHERE d.is_public = TRUE
//             ORDER BY d.created_at DESC
//         `;
//         try {
//             const [rows] = await db.promise().execute(sql);
//             return rows;
//         } catch (error) {
//             console.error('Error fetching public datasets:', error);
//             throw error;
//         }
//     }

//     // Get datasets by user ID
//     static async findByUserId(userId) {
//         const sql = `SELECT * FROM datasets WHERE user_id = ? ORDER BY created_at DESC`;
//         try {
//             const [rows] = await db.promise().execute(sql, [userId]);
//             return rows;
//         } catch (error) {
//             console.error('Error fetching user datasets:', error);
//             throw error;
//         }
//     }

//     // Search datasets
//     static async search(query) {
//         const searchQuery = `%${query}%`;
//         const sql = `
//             SELECT d.*, u.name as author_name, u.avatar_url
//             FROM datasets d 
//             JOIN users u ON d.user_id = u.id 
//             WHERE d.is_public = TRUE 
//             AND (d.title LIKE ? OR d.description LIKE ? OR d.category LIKE ? OR d.tags LIKE ? OR u.name LIKE ?)
//             ORDER BY d.created_at DESC
//         `;
//         try {
//             const [rows] = await db.promise().execute(sql, [searchQuery, searchQuery, searchQuery, searchQuery, searchQuery]);
//             return rows;
//         } catch (error) {
//             console.error('Error searching datasets:', error);
//             throw error;
//         }
//     }

//     // Increment download count
//     static async incrementDownload(id) {
//         const sql = `UPDATE datasets SET download_count = download_count + 1 WHERE id = ?`;
//         try {
//             await db.promise().execute(sql, [id]);
//         } catch (error) {
//             console.error('Error incrementing download count:', error);
//             throw error;
//         }
//     }
// }

// export default Dataset;
import { promisePool } from '../config/database.js';

class Dataset {
    // Create datasets table
    static async createTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS datasets (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                category VARCHAR(100),
                file_url VARCHAR(500) NOT NULL,
                file_size BIGINT,
                file_format VARCHAR(50),
                download_count INT DEFAULT 0,
                tags TEXT,
                is_public BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_user_id (user_id),
                INDEX idx_category (category),
                INDEX idx_public (is_public)
            )
        `;
        try {
            await promisePool.execute(sql);
            console.log('✅ Datasets table created/verified');
        } catch (error) {
            console.error('❌ Error creating datasets table:', error);
            throw error;
        }
    }

    // Create a new dataset
    static async create(datasetData) {
        const sql = `
            INSERT INTO datasets (user_id, title, description, category, file_url, file_size, file_format, tags, is_public) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        try {
            const [result] = await promisePool.execute(sql, [
                datasetData.user_id,
                datasetData.title,
                datasetData.description,
                datasetData.category || null,
                datasetData.file_url,
                datasetData.file_size || 0,
                datasetData.file_format || 'unknown',
                datasetData.tags ? JSON.stringify(datasetData.tags) : null,
                datasetData.is_public !== undefined ? datasetData.is_public : true
            ]);
            return { id: result.insertId, ...datasetData };
        } catch (error) {
            console.error('Error creating dataset:', error);
            throw error;
        }
    }

    // Get all public datasets with user info
    static async findAllPublic() {
        const sql = `
            SELECT d.*, u.name as author_name
            FROM datasets d 
            JOIN users u ON d.user_id = u.id 
            WHERE d.is_public = TRUE
            ORDER BY d.created_at DESC
        `;
        try {
            const [rows] = await promisePool.execute(sql);
            return rows;
        } catch (error) {
            console.error('Error fetching public datasets:', error);
            throw error;
        }
    }

    // Get datasets by user ID
    static async findByUserId(userId) {
        const sql = `SELECT * FROM datasets WHERE user_id = ? ORDER BY created_at DESC`;
        try {
            const [rows] = await promisePool.execute(sql, [userId]);
            return rows;
        } catch (error) {
            console.error('Error fetching user datasets:', error);
            throw error;
        }
    }

    // Search datasets
    static async search(query) {
        const searchQuery = `%${query}%`;
        const sql = `
            SELECT d.*, u.name as author_name
            FROM datasets d 
            JOIN users u ON d.user_id = u.id 
            WHERE d.is_public = TRUE 
            AND (d.title LIKE ? OR d.description LIKE ? OR d.category LIKE ? OR d.tags LIKE ? OR u.name LIKE ?)
            ORDER BY d.created_at DESC
        `;
        try {
            const [rows] = await promisePool.execute(sql, [searchQuery, searchQuery, searchQuery, searchQuery, searchQuery]);
            return rows;
        } catch (error) {
            console.error('Error searching datasets:', error);
            throw error;
        }
    }

    // Increment download count
    static async incrementDownload(id) {
        const sql = `UPDATE datasets SET download_count = download_count + 1 WHERE id = ?`;
        try {
            await promisePool.execute(sql, [id]);
        } catch (error) {
            console.error('Error incrementing download count:', error);
            throw error;
        }
    }
}

export default Dataset;