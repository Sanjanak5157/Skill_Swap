import { promisePool } from '../config/database.js';

class VideoRequest {
    static async createTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS video_requests (
                id INT AUTO_INCREMENT PRIMARY KEY,
                requester_id INT NOT NULL,
                receiver_id INT NOT NULL,
                skill_id INT,
                message TEXT,
                status ENUM('pending', 'accepted', 'rejected', 'cancelled') DEFAULT 'pending',
                requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                responded_at TIMESTAMP NULL,
                FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE SET NULL,
                INDEX idx_requester_id (requester_id),
                INDEX idx_receiver_id (receiver_id),
                INDEX idx_status (status)
            )
        `;
        try {
            await promisePool.execute(sql);
            console.log('✅ Video requests table created/verified');
        } catch (error) {
            console.error('❌ Error creating video requests table:', error);
            throw error;
        }
    }

    static async create(requestData) {
        const sql = `
            INSERT INTO video_requests (requester_id, receiver_id, skill_id, message, status) 
            VALUES (?, ?, ?, ?, ?)
        `;
        try {
            const [result] = await promisePool.execute(sql, [
                requestData.requester_id,
                requestData.receiver_id,
                requestData.skill_id || null,
                requestData.message || '',
                requestData.status || 'pending'
            ]);
            return { id: result.insertId, ...requestData };
        } catch (error) {
            console.error('Error creating video request:', error);
            throw error;
        }
    }

    static async findByUserId(userId) {
        const sql = `
            SELECT vr.*, 
                   u1.name as requester_name,
                   u2.name as receiver_name,
                   s.name as skill_name
            FROM video_requests vr
            LEFT JOIN users u1 ON vr.requester_id = u1.id
            LEFT JOIN users u2 ON vr.receiver_id = u2.id
            LEFT JOIN skills s ON vr.skill_id = s.id
            WHERE vr.requester_id = ? OR vr.receiver_id = ?
            ORDER BY vr.requested_at DESC
        `;
        try {
            const [rows] = await promisePool.execute(sql, [userId, userId]);
            return rows;
        } catch (error) {
            console.error('Error fetching video requests:', error);
            throw error;
        }
    }

    static async updateStatus(requestId, status) {
        const sql = `UPDATE video_requests SET status = ?, responded_at = CURRENT_TIMESTAMP WHERE id = ?`;
        try {
            const [result] = await promisePool.execute(sql, [status, requestId]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error updating video request status:', error);
            throw error;
        }
    }
}

export default VideoRequest;