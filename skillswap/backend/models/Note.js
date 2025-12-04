

// export default Note;
import { promisePool } from '../config/database.js';

class Note {
    // Create notes table
    static async createTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS notes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                category VARCHAR(100),
                file_url VARCHAR(500) NOT NULL,
                file_type VARCHAR(50),
                file_size INT,
                download_count INT DEFAULT 0,
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
            console.log('✅ Notes table created/verified');
        } catch (error) {
            console.error('❌ Error creating notes table:', error);
            throw error;
        }
    }

    // Create a new note
    static async create(noteData) {
        const sql = `
            INSERT INTO notes (user_id, title, description, category, file_url, file_type, file_size, is_public) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        try {
            const [result] = await promisePool.execute(sql, [
                noteData.user_id,
                noteData.title,
                noteData.description,
                noteData.category || null,
                noteData.file_url,
                noteData.file_type || null,
                noteData.file_size || 0,
                noteData.is_public !== undefined ? noteData.is_public : true
            ]);
            return { id: result.insertId, ...noteData };
        } catch (error) {
            console.error('Error creating note:', error);
            throw error;
        }
    }

    // Get all public notes with user info
    static async findAllPublic() {
        const sql = `
            SELECT n.*, u.name as author_name
            FROM notes n 
            JOIN users u ON n.user_id = u.id 
            WHERE n.is_public = TRUE
            ORDER BY n.created_at DESC
        `;
        try {
            const [rows] = await promisePool.execute(sql);
            return rows;
        } catch (error) {
            console.error('Error fetching public notes:', error);
            throw error;
        }
    }

    // Get notes by user ID
    static async findByUserId(userId) {
        const sql = `SELECT * FROM notes WHERE user_id = ? ORDER BY created_at DESC`;
        try {
            const [rows] = await promisePool.execute(sql, [userId]);
            return rows;
        } catch (error) {
            console.error('Error fetching user notes:', error);
            throw error;
        }
    }

    // Search notes
    static async search(query) {
        const searchQuery = `%${query}%`;
        const sql = `
            SELECT n.*, u.name as author_name
            FROM notes n 
            JOIN users u ON n.user_id = u.id 
            WHERE n.is_public = TRUE 
            AND (n.title LIKE ? OR n.description LIKE ? OR n.category LIKE ?)
            ORDER BY n.created_at DESC
        `;
        try {
            const [rows] = await promisePool.execute(sql, [searchQuery, searchQuery, searchQuery]);
            return rows;
        } catch (error) {
            console.error('Error searching notes:', error);
            throw error;
        }
    }

    // Increment download count
    static async incrementDownload(noteId) {
        const sql = `UPDATE notes SET download_count = download_count + 1 WHERE id = ?`;
        try {
            await promisePool.execute(sql, [noteId]);
        } catch (error) {
            console.error('Error incrementing note download count:', error);
            throw error;
        }
    }
}

export default Note;