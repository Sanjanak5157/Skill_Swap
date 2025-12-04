import { promisePool } from '../config/database.js';

class Notification {
    static async createTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS notifications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                type ENUM('video_request', 'video_accepted', 'video_rejected', 'video_reminder', 'general') DEFAULT 'general',
                related_id VARCHAR(255), -- session_id or other reference
                is_read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_user_id (user_id),
                INDEX idx_is_read (is_read),
                INDEX idx_created_at (created_at)
            )
        `;
        try {
            await promisePool.execute(sql);
            console.log('✅ Notifications table created/verified');
        } catch (error) {
            console.error('❌ Error creating notifications table:', error);
            throw error;
        }
    }

    static async create(notificationData) {
        const sql = `
            INSERT INTO notifications (user_id, title, message, type, related_id) 
            VALUES (?, ?, ?, ?, ?)
        `;
        try {
            const [result] = await promisePool.execute(sql, [
                notificationData.user_id,
                notificationData.title,
                notificationData.message,
                notificationData.type || 'general',
                notificationData.related_id || null
            ]);
            return { id: result.insertId, ...notificationData };
        } catch (error) {
            console.error('Error creating notification:', error);
            throw error;
        }
    }

    static async getUserNotifications(userId, limit = 50) {
        const sql = `
            SELECT * FROM notifications 
            WHERE user_id = ? 
            ORDER BY created_at DESC 
            LIMIT ?
        `;
        try {
            const [rows] = await promisePool.execute(sql, [userId, limit]);
            return rows;
        } catch (error) {
            console.error('Error fetching user notifications:', error);
            throw error;
        }
    }

    static async markAsRead(notificationId) {
        const sql = `UPDATE notifications SET is_read = TRUE WHERE id = ?`;
        try {
            await promisePool.execute(sql, [notificationId]);
        } catch (error) {
            console.error('Error marking notification as read:', error);
            throw error;
        }
    }

    static async markAllAsRead(userId) {
        const sql = `UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND is_read = FALSE`;
        try {
            await promisePool.execute(sql, [userId]);
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            throw error;
        }
    }

    static async getUnreadCount(userId) {
        const sql = `SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE`;
        try {
            const [rows] = await promisePool.execute(sql, [userId]);
            return rows[0].count;
        } catch (error) {
            console.error('Error getting unread count:', error);
            throw error;
        }
    }
}

export default Notification;