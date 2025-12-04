import { promisePool } from '../config/database.js';

class VideoMessage {
    static async createTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS video_messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                session_id VARCHAR(255) NOT NULL,
                user_id INT NOT NULL,
                message_type ENUM('offer', 'answer', 'candidate', 'chat', 'control') NOT NULL,
                message_content JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_session_id (session_id),
                INDEX idx_user_id (user_id),
                INDEX idx_message_type (message_type),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `;
        try {
            await promisePool.execute(sql);
            console.log('✅ Video messages table created/verified');
        } catch (error) {
            console.error('❌ Error creating video messages table:', error);
            throw error;
        }
    }

    static async create(messageData) {
        const sql = `
            INSERT INTO video_messages (session_id, user_id, message_type, message_content) 
            VALUES (?, ?, ?, ?)
        `;
        try {
            const [result] = await promisePool.execute(sql, [
                messageData.session_id,
                messageData.user_id,
                messageData.message_type,
                JSON.stringify(messageData.message_content)
            ]);
            return { id: result.insertId, ...messageData };
        } catch (error) {
            console.error('Error creating video message:', error);
            throw error;
        }
    }

    static async findBySessionId(sessionId) {
        const sql = `SELECT * FROM video_messages WHERE session_id = ? ORDER BY created_at ASC`;
        try {
            const [rows] = await promisePool.execute(sql, [sessionId]);
            return rows.map(row => ({
                ...row,
                message_content: JSON.parse(row.message_content)
            }));
        } catch (error) {
            console.error('Error fetching video messages:', error);
            throw error;
        }
    }
}

export default VideoMessage;