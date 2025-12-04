// import db from '../config/database.js';
// import bcrypt from 'bcryptjs';

// class User {
//     static createTable() {
//         const sql = `
//             CREATE TABLE IF NOT EXISTS users (
//                 id INT AUTO_INCREMENT PRIMARY KEY,
//                 name VARCHAR(255) NOT NULL,
//                 email VARCHAR(255) UNIQUE NOT NULL,
//                 password VARCHAR(255) NOT NULL,
//                 phone VARCHAR(20),
//                 college VARCHAR(255),
//                 branch VARCHAR(255),
//                 semester VARCHAR(50),
//                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//             )
//         `;
//         return db.promise().execute(sql);
//     }

//     static async create(userData) {
//         const hashedPassword = await bcrypt.hash(userData.password, 10);
//         const sql = `INSERT INTO users (name, email, password, phone, college, branch, semester) VALUES (?, ?, ?, ?, ?, ?, ?)`;
//         return db.promise().execute(sql, [
//             userData.name,
//             userData.email,
//             hashedPassword,
//             userData.phone,
//             userData.college,
//             userData.branch,
//             userData.semester
//         ]);
//     }

//     static findByEmail(email) {
//         const sql = `SELECT * FROM users WHERE email = ?`;
//         return db.promise().execute(sql, [email]);
//     }

//     static findById(id) {
//         const sql = `SELECT id, name, email, phone, college, branch, semester, created_at FROM users WHERE id = ?`;
//         return db.promise().execute(sql, [id]);
//     }

//     static updateProfile(id, updateData) {
//         const sql = `UPDATE users SET name = ?, phone = ?, college = ?, branch = ?, semester = ? WHERE id = ?`;
//         return db.promise().execute(sql, [
//             updateData.name,
//             updateData.phone,
//             updateData.college,
//             updateData.branch,
//             updateData.semester,
//             id
//         ]);
//     }
// }

// export default User;
// import db from '../config/database.js';
// import bcrypt from 'bcryptjs';

// class User {
//     // Create users table
//     static async createTable() {
//         const sql = `
//             CREATE TABLE IF NOT EXISTS users (
//                 id INT AUTO_INCREMENT PRIMARY KEY,
//                 name VARCHAR(255) NOT NULL,
//                 email VARCHAR(255) UNIQUE NOT NULL,
//                 password VARCHAR(255) NOT NULL,
//                 phone VARCHAR(20),
//                 college VARCHAR(255),
//                 branch VARCHAR(255),
//                 semester VARCHAR(50),
//                 avatar_url VARCHAR(500),
//                 bio TEXT,
//                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//                 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
//             )
//         `;
//         try {
//             await db.promise().execute(sql);
//             console.log('✅ Users table created/verified');
//         } catch (error) {
//             console.error('❌ Error creating users table:', error);
//             throw error;
//         }
//     }

//     // Create a new user
//     static async create(userData) {
//         const hashedPassword = await bcrypt.hash(userData.password, 12);
//         const sql = `
//             INSERT INTO users (name, email, password, phone, college, branch, semester) 
//             VALUES (?, ?, ?, ?, ?, ?, ?)
//         `;
//         try {
//             const [result] = await db.promise().execute(sql, [
//                 userData.name,
//                 userData.email,
//                 hashedPassword,
//                 userData.phone || null,
//                 userData.college || null,
//                 userData.branch || null,
//                 userData.semester || null
//             ]);
//             return { id: result.insertId, ...userData };
//         } catch (error) {
//             console.error('Error creating user:', error);
//             throw error;
//         }
//     }

//     // Find user by email
//     static async findByEmail(email) {
//         const sql = `SELECT * FROM users WHERE email = ?`;
//         try {
//             const [rows] = await db.promise().execute(sql, [email]);
//             return rows[0];
//         } catch (error) {
//             console.error('Error finding user by email:', error);
//             throw error;
//         }
//     }

//     // Find user by ID
//     static async findById(id) {
//         const sql = `SELECT id, name, email, phone, college, branch, semester, avatar_url, bio, created_at FROM users WHERE id = ?`;
//         try {
//             const [rows] = await db.promise().execute(sql, [id]);
//             return rows[0];
//         } catch (error) {
//             console.error('Error finding user by id:', error);
//             throw error;
//         }
//     }

//     // Update user profile
//     static async update(id, updateData) {
//         const allowedFields = ['name', 'phone', 'college', 'branch', 'semester', 'avatar_url', 'bio'];
//         const fields = Object.keys(updateData).filter(field => allowedFields.includes(field));
        
//         if (fields.length === 0) {
//             throw new Error('No valid fields to update');
//         }

//         const setClause = fields.map(field => `${field} = ?`).join(', ');
//         const values = fields.map(field => updateData[field]);
//         values.push(id);

//         const sql = `UPDATE users SET ${setClause} WHERE id = ?`;
        
//         try {
//             const [result] = await db.promise().execute(sql, values);
//             return result.affectedRows > 0;
//         } catch (error) {
//             console.error('Error updating user:', error);
//             throw error;
//         }
//     }

//     // Verify password
//     static async verifyPassword(plainPassword, hashedPassword) {
//         return await bcrypt.compare(plainPassword, hashedPassword);
//     }
// }

// export default User;
// import { promisePool } from '../config/database.js';
// import bcrypt from 'bcryptjs';

// class User {
//     // Create users table
//     static async createTable() {
//         const sql = `
//             CREATE TABLE IF NOT EXISTS users (
//                 id INT AUTO_INCREMENT PRIMARY KEY,
//                 name VARCHAR(255) NOT NULL,
//                 email VARCHAR(255) UNIQUE NOT NULL,
//                 password VARCHAR(255) NOT NULL,
//                 phone VARCHAR(20),
//                 college VARCHAR(255),
//                 branch VARCHAR(255),
//                 semester VARCHAR(50),
//                 avatar_url VARCHAR(500),
//                 bio TEXT,
//                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//                 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
//             )
//         `;
//         try {
//             await promisePool.execute(sql);
//             console.log('✅ Users table created/verified');
//         } catch (error) {
//             console.error('❌ Error creating users table:', error);
//             throw error;
//         }
//     }

//     // Create a new user
//     static async create(userData) {
//         const hashedPassword = await bcrypt.hash(userData.password, 12);
//         const sql = `
//             INSERT INTO users (name, email, password, phone, college, branch, semester) 
//             VALUES (?, ?, ?, ?, ?, ?, ?)
//         `;
//         try {
//             const [result] = await promisePool.execute(sql, [
//                 userData.name,
//                 userData.email,
//                 hashedPassword,
//                 userData.phone || null,
//                 userData.college || null,
//                 userData.branch || null,
//                 userData.semester || null
//             ]);
//             return { id: result.insertId, ...userData };
//         } catch (error) {
//             console.error('Error creating user:', error);
//             throw error;
//         }
//     }

//     // Find user by email
//     // Find user by ID
//     static async findById(id) {
//         const sql = `SELECT id, name, email, phone, college, branch, semester, created_at FROM users WHERE id = ?`;
//         try {
//             const [rows] = await promisePool.execute(sql, [id]);
//             return rows[0];
//         } catch (error) {
//             console.error('Error finding user by id:', error);
//             throw error;
//         }
//     }

//     // Find user by ID
//     // static async findById(id) {
//     //     const sql = `SELECT id, name, email, phone, college, branch, semester, avatar_url, bio, created_at FROM users WHERE id = ?`;
//     //     try {
//     //         const [rows] = await promisePool.execute(sql, [id]);
//     //         return rows[0];
//     //     } catch (error) {
//     //         console.error('Error finding user by id:', error);
//     //         throw error;
//     //     }
//     // }

//     // Update user profile
//     static async update(id, updateData) {
//         const allowedFields = ['name', 'phone', 'college', 'branch', 'semester', 'avatar_url', 'bio'];
//         const fields = Object.keys(updateData).filter(field => allowedFields.includes(field));
        
//         if (fields.length === 0) {
//             throw new Error('No valid fields to update');
//         }

//         const setClause = fields.map(field => `${field} = ?`).join(', ');
//         const values = fields.map(field => updateData[field]);
//         values.push(id);

//         const sql = `UPDATE users SET ${setClause} WHERE id = ?`;
        
//         try {
//             const [result] = await promisePool.execute(sql, values);
//             return result.affectedRows > 0;
//         } catch (error) {
//             console.error('Error updating user:', error);
//             throw error;
//         }
//     }

//     // Verify password
//     static async verifyPassword(plainPassword, hashedPassword) {
//         return await bcrypt.compare(plainPassword, hashedPassword);
//     }
// }

// export default User;
import { promisePool } from '../config/database.js';
import bcrypt from 'bcryptjs';

class User {
    // Create users table (already exists, just for reference)
    static async createTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                phone VARCHAR(20),
                college VARCHAR(255),
                branch VARCHAR(255),
                semester VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        try {
            await promisePool.execute(sql);
            console.log('✅ Users table created/verified');
        } catch (error) {
            console.error('❌ Error creating users table:', error);
            throw error;
        }
    }

    // Create a new user
    static async create(userData) {
        const hashedPassword = await bcrypt.hash(userData.password, 12);
        const sql = `
            INSERT INTO users (name, email, password, phone, college, branch, semester) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        try {
            const [result] = await promisePool.execute(sql, [
                userData.name,
                userData.email,
                hashedPassword,
                userData.phone || null,
                userData.college || null,
                userData.branch || null,
                userData.semester || null
            ]);
            return { id: result.insertId, ...userData };
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    // Find user by email
    static async findByEmail(email) {
        const sql = `SELECT * FROM users WHERE email = ?`;
        try {
            const [rows] = await promisePool.execute(sql, [email]);
            return rows[0];
        } catch (error) {
            console.error('Error finding user by email:', error);
            throw error;
        }
    }

    // Find user by ID
    static async findById(id) {
        const sql = `SELECT id, name, email, phone, college, branch, semester, created_at FROM users WHERE id = ?`;
        try {
            const [rows] = await promisePool.execute(sql, [id]);
            return rows[0];
        } catch (error) {
            console.error('Error finding user by id:', error);
            throw error;
        }
    }

    // Update user profile
    static async update(id, updateData) {
        const allowedFields = ['name', 'phone', 'college', 'branch', 'semester'];
        const fields = Object.keys(updateData).filter(field => allowedFields.includes(field));
        
        if (fields.length === 0) {
            throw new Error('No valid fields to update');
        }

        const setClause = fields.map(field => `${field} = ?`).join(', ');
        const values = fields.map(field => updateData[field]);
        values.push(id);

        const sql = `UPDATE users SET ${setClause} WHERE id = ?`;
        
        try {
            const [result] = await promisePool.execute(sql, values);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }

    // Verify password
    static async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}

export default User;