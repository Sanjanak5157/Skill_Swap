// import db from '../config/database.js';

// class Course {
//     static createTable() {
//         const sql = `
//             CREATE TABLE IF NOT EXISTS courses (
//                 id INT AUTO_INCREMENT PRIMARY KEY,
//                 user_id INT NOT NULL,
//                 name VARCHAR(255) NOT NULL,
//                 description TEXT,
//                 video_url VARCHAR(255),
//                 modules TEXT,
//                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//                 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
//             )
//         `;
//         return db.promise().execute(sql);
//     }

//     static create(courseData) {
//         const sql = `INSERT INTO courses (user_id, name, description, video_url, modules) VALUES (?, ?, ?, ?, ?)`;
//         return db.promise().execute(sql, [
//             courseData.user_id,
//             courseData.name,
//             courseData.description,
//             courseData.video_url,
//             courseData.modules
//         ]);
//     }

//     static findAll() {
//         const sql = `
//             SELECT c.*, u.name as user_name 
//             FROM courses c 
//             JOIN users u ON c.user_id = u.id
//         `;
//         return db.promise().execute(sql);
//     }

//     static search(query) {
//         const sql = `
//             SELECT c.*, u.name as user_name 
//             FROM courses c 
//             JOIN users u ON c.user_id = u.id 
//             WHERE c.name LIKE ? OR c.description LIKE ? OR u.name LIKE ?
//         `;
//         const searchQuery = `%${query}%`;
//         return db.promise().execute(sql, [searchQuery, searchQuery, searchQuery]);
//     }
// }

// export default Course;
// import db from '../config/database.js';

// class Course {
//     // Create courses table
//     static async createTable() {
//         const sql = `
//             CREATE TABLE IF NOT EXISTS courses (
//                 id INT AUTO_INCREMENT PRIMARY KEY,
//                 user_id INT NOT NULL,
//                 title VARCHAR(255) NOT NULL,
//                 description TEXT,
//                 category VARCHAR(100),
//                 video_url VARCHAR(500),
//                 thumbnail_url VARCHAR(500),
//                 duration_minutes INT,
//                 difficulty_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
//                 price DECIMAL(10,2) DEFAULT 0.00,
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
//             console.log('✅ Courses table created/verified');
//         } catch (error) {
//             console.error('❌ Error creating courses table:', error);
//             throw error;
//         }
//     }

//     // Create a new course
//     static async create(courseData) {
//         const sql = `
//             INSERT INTO courses (user_id, title, description, category, video_url, thumbnail_url, duration_minutes, difficulty_level, price, is_public) 
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//         `;
//         try {
//             const [result] = await db.promise().execute(sql, [
//                 courseData.user_id,
//                 courseData.title,
//                 courseData.description,
//                 courseData.category || null,
//                 courseData.video_url || null,
//                 courseData.thumbnail_url || null,
//                 courseData.duration_minutes || null,
//                 courseData.difficulty_level || 'beginner',
//                 courseData.price || 0.00,
//                 courseData.is_public !== undefined ? courseData.is_public : true
//             ]);
//             return { id: result.insertId, ...courseData };
//         } catch (error) {
//             console.error('Error creating course:', error);
//             throw error;
//         }
//     }

//     // Get all public courses with user info
//     static async findAllPublic() {
//         const sql = `
//             SELECT c.*, u.name as instructor_name, u.avatar_url
//             FROM courses c 
//             JOIN users u ON c.user_id = u.id 
//             WHERE c.is_public = TRUE
//             ORDER BY c.created_at DESC
//         `;
//         try {
//             const [rows] = await db.promise().execute(sql);
//             return rows;
//         } catch (error) {
//             console.error('Error fetching public courses:', error);
//             throw error;
//         }
//     }

//     // Get courses by user ID
//     static async findByUserId(userId) {
//         const sql = `SELECT * FROM courses WHERE user_id = ? ORDER BY created_at DESC`;
//         try {
//             const [rows] = await db.promise().execute(sql, [userId]);
//             return rows;
//         } catch (error) {
//             console.error('Error fetching user courses:', error);
//             throw error;
//         }
//     }

//     // Search courses
//     static async search(query) {
//         const searchQuery = `%${query}%`;
//         const sql = `
//             SELECT c.*, u.name as instructor_name, u.avatar_url
//             FROM courses c 
//             JOIN users u ON c.user_id = u.id 
//             WHERE c.is_public = TRUE 
//             AND (c.title LIKE ? OR c.description LIKE ? OR c.category LIKE ? OR u.name LIKE ?)
//             ORDER BY c.created_at DESC
//         `;
//         try {
//             const [rows] = await db.promise().execute(sql, [searchQuery, searchQuery, searchQuery, searchQuery]);
//             return rows;
//         } catch (error) {
//             console.error('Error searching courses:', error);
//             throw error;
//         }
//     }
// }

// export default Course;
import { promisePool } from '../config/database.js';

class Course {
    // Create courses table
    static async createTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS courses (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                category VARCHAR(100),
                video_url VARCHAR(500),
                thumbnail_url VARCHAR(500),
                duration_minutes INT,
                difficulty_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
                price DECIMAL(10,2) DEFAULT 0.00,
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
            console.log('✅ Courses table created/verified');
        } catch (error) {
            console.error('❌ Error creating courses table:', error);
            throw error;
        }
    }

    // Create a new course
    static async create(courseData) {
        const sql = `
            INSERT INTO courses (user_id, title, description, category, video_url, thumbnail_url, duration_minutes, difficulty_level, price, is_public) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        try {
            const [result] = await promisePool.execute(sql, [
                courseData.user_id,
                courseData.title,
                courseData.description,
                courseData.category || null,
                courseData.video_url || null,
                courseData.thumbnail_url || null,
                courseData.duration_minutes || null,
                courseData.difficulty_level || 'beginner',
                courseData.price || 0.00,
                courseData.is_public !== undefined ? courseData.is_public : true
            ]);
            return { id: result.insertId, ...courseData };
        } catch (error) {
            console.error('Error creating course:', error);
            throw error;
        }
    }

    // Get all public courses with user info
    static async findAllPublic() {
        const sql = `
            SELECT c.*, u.name as instructor_name
            FROM courses c 
            JOIN users u ON c.user_id = u.id 
            WHERE c.is_public = TRUE
            ORDER BY c.created_at DESC
        `;
        try {
            const [rows] = await promisePool.execute(sql);
            return rows;
        } catch (error) {
            console.error('Error fetching public courses:', error);
            throw error;
        }
    }


    // Get courses by user ID
    static async findByUserId(userId) {
        const sql = `SELECT * FROM courses WHERE user_id = ? ORDER BY created_at DESC`;
        try {
            const [rows] = await promisePool.execute(sql, [userId]);
            return rows;
        } catch (error) {
            console.error('Error fetching user courses:', error);
            throw error;
        }
    }

    // Search courses
    static async search(query) {
        const searchQuery = `%${query}%`;
        const sql = `
            SELECT c.*, u.name as instructor_name
            FROM courses c 
            JOIN users u ON c.user_id = u.id 
            WHERE c.is_public = TRUE 
            AND (c.title LIKE ? OR c.description LIKE ? OR c.category LIKE ? OR u.name LIKE ?)
            ORDER BY c.created_at DESC
        `;
        try {
            const [rows] = await promisePool.execute(sql, [searchQuery, searchQuery, searchQuery, searchQuery]);
            return rows;
        } catch (error) {
            console.error('Error searching courses:', error);
            throw error;
        }
    }
}

export default Course;