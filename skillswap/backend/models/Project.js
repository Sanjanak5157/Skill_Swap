import { promisePool } from '../config/database.js';

class Project {
    // Create projects table
    static async createTable() {
        try {
            // First, drop table if it exists (for development)
            await promisePool.execute('DROP TABLE IF EXISTS projects');
            
            const sql = `
                CREATE TABLE IF NOT EXISTS projects (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT NOT NULL,
                    title VARCHAR(255) NOT NULL,
                    description TEXT,
                    technologies JSON,
                    project_url VARCHAR(500),
                    github_url VARCHAR(500),
                    image_url VARCHAR(500),
                    category VARCHAR(100),
                    is_public BOOLEAN DEFAULT TRUE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                    INDEX idx_user_id (user_id),
                    INDEX idx_category (category),
                    INDEX idx_public (is_public)
                )
            `;
            
            await promisePool.execute(sql);
            console.log('✅ Projects table created successfully');
        } catch (error) {
            console.error('❌ Error creating projects table:', error);
            throw error;
        }
    }

    // Alternative: Add missing column if table exists
    static async addMissingColumns() {
        try {
            // Check if is_public column exists
            const [columns] = await promisePool.execute(`
                SELECT COLUMN_NAME 
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_SCHEMA = DATABASE() 
                AND TABLE_NAME = 'projects' 
                AND COLUMN_NAME = 'is_public'
            `);
            
            if (columns.length === 0) {
                console.log('🔄 Adding missing column: is_public to projects table');
                await promisePool.execute(`
                    ALTER TABLE projects 
                    ADD COLUMN is_public BOOLEAN DEFAULT TRUE
                `);
                console.log('✅ Added is_public column to projects table');
            }
        } catch (error) {
            console.error('Error checking/adding columns:', error);
        }
    }

    // Create a new project
    static async create(projectData) {
        const sql = `
            INSERT INTO projects (user_id, title, description, technologies, project_url, github_url, image_url, category, is_public) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        try {
            const [result] = await promisePool.execute(sql, [
                projectData.user_id,
                projectData.title,
                projectData.description || null,
                JSON.stringify(projectData.technologies || []),
                projectData.project_url || null,
                projectData.github_url || null,
                projectData.image_url || null,
                projectData.category || null,
                projectData.is_public !== undefined ? projectData.is_public : true
            ]);
            return { id: result.insertId, ...projectData };
        } catch (error) {
            console.error('Error creating project:', error);
            throw error;
        }
    }

    // Get all public projects with user info
    static async findAllPublic() {
        const sql = `
            SELECT p.*, u.name as author_name
            FROM projects p 
            JOIN users u ON p.user_id = u.id 
            WHERE p.is_public = TRUE
            ORDER BY p.created_at DESC
        `;
        try {
            const [rows] = await promisePool.execute(sql);
            return rows;
        } catch (error) {
            console.error('Error fetching public projects:', error);
            
            // If column doesn't exist, fallback to all projects
            if (error.code === 'ER_BAD_FIELD_ERROR' && error.sqlMessage.includes('is_public')) {
                console.log('⚠️ is_public column not found, fetching all projects');
                const fallbackSql = `
                    SELECT p.*, u.name as author_name
                    FROM projects p 
                    JOIN users u ON p.user_id = u.id 
                    ORDER BY p.created_at DESC
                `;
                const [fallbackRows] = await promisePool.execute(fallbackSql);
                return fallbackRows;
            }
            throw error;
        }
    }

    // Get projects by user ID
    static async findByUserId(userId) {
        const sql = `SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC`;
        try {
            const [rows] = await promisePool.execute(sql, [userId]);
            return rows;
        } catch (error) {
            console.error('Error fetching user projects:', error);
            throw error;
        }
    }

    // Search projects
    static async search(query) {
        const searchQuery = `%${query}%`;
        const sql = `
            SELECT p.*, u.name as author_name
            FROM projects p 
            JOIN users u ON p.user_id = u.id 
            WHERE p.is_public = TRUE 
            AND (p.title LIKE ? OR p.description LIKE ? OR p.category LIKE ? OR p.technologies LIKE ?)
            ORDER BY p.created_at DESC
        `;
        try {
            const [rows] = await promisePool.execute(sql, [searchQuery, searchQuery, searchQuery, searchQuery]);
            return rows;
        } catch (error) {
            console.error('Error searching projects:', error);
            
            // Fallback if column doesn't exist
            if (error.code === 'ER_BAD_FIELD_ERROR' && error.sqlMessage.includes('is_public')) {
                const fallbackSql = `
                    SELECT p.*, u.name as author_name
                    FROM projects p 
                    JOIN users u ON p.user_id = u.id 
                    WHERE p.title LIKE ? OR p.description LIKE ? OR p.category LIKE ? OR p.technologies LIKE ?
                    ORDER BY p.created_at DESC
                `;
                const [fallbackRows] = await promisePool.execute(fallbackSql, [searchQuery, searchQuery, searchQuery, searchQuery]);
                return fallbackRows;
            }
            throw error;
        }
    }
}

export default Project;