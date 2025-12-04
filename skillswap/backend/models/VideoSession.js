import { promisePool } from '../config/database.js';

class VideoSession {
    static async createTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS video_sessions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                session_id VARCHAR(255) NOT NULL UNIQUE,
                requester_id INT NOT NULL,
                receiver_id INT NOT NULL,
                skill_id INT,
                skill_name VARCHAR(255),
                status ENUM('pending', 'accepted', 'rejected', 'scheduled', 'active', 'completed', 'cancelled') DEFAULT 'pending',
                scheduled_time DATETIME NULL,
                scheduled_duration INT DEFAULT 60, -- in minutes
                reminder_sent BOOLEAN DEFAULT FALSE,
                started_at DATETIME NULL,
                ended_at DATETIME NULL,
                duration_seconds INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE SET NULL,
                INDEX idx_session_id (session_id),
                INDEX idx_requester_id (requester_id),
                INDEX idx_receiver_id (receiver_id),
                INDEX idx_status (status),
                INDEX idx_scheduled_time (scheduled_time)
            )
        `;
        try {
            await promisePool.execute(sql);
            console.log('✅ Video sessions table created/verified');
        } catch (error) {
            console.error('❌ Error creating video sessions table:', error);
            throw error;
        }
    }

    // Get sessions with scheduling info
    static async findByUserId(userId) {
        const sql = `
            SELECT vs.*, 
                   u1.name as requester_name,
                   u2.name as receiver_name,
                   s.name as skill_name
            FROM video_sessions vs
            LEFT JOIN users u1 ON vs.requester_id = u1.id
            LEFT JOIN users u2 ON vs.receiver_id = u2.id
            LEFT JOIN skills s ON vs.skill_id = s.id
            WHERE vs.requester_id = ? OR vs.receiver_id = ?
            ORDER BY 
                CASE 
                    WHEN vs.status = 'pending' THEN 1
                    WHEN vs.status = 'scheduled' THEN 2
                    WHEN vs.status = 'active' THEN 3
                    ELSE 4
                END,
                vs.scheduled_time ASC,
                vs.created_at DESC
        `;
        try {
            const [rows] = await promisePool.execute(sql, [userId, userId]);
            return rows;
        } catch (error) {
            console.error('Error fetching video sessions:', error);
            throw error;
        }
    }

    // Get upcoming scheduled sessions
    static async getUpcomingSessions(userId, limit = 10) {
        const sql = `
            SELECT vs.*, 
                   u1.name as requester_name,
                   u2.name as receiver_name,
                   s.name as skill_name
            FROM video_sessions vs
            LEFT JOIN users u1 ON vs.requester_id = u1.id
            LEFT JOIN users u2 ON vs.receiver_id = u2.id
            LEFT JOIN skills s ON vs.skill_id = s.id
            WHERE (vs.requester_id = ? OR vs.receiver_id = ?)
            AND vs.status = 'scheduled'
            AND vs.scheduled_time > NOW()
            ORDER BY vs.scheduled_time ASC
            LIMIT ?
        `;
        try {
            const [rows] = await promisePool.execute(sql, [userId, userId, limit]);
            return rows;
        } catch (error) {
            console.error('Error fetching upcoming sessions:', error);
            throw error;
        }
    }

    // Get sessions requiring reminder
    static async getSessionsForReminder(minutesBefore = 15) {
        const sql = `
            SELECT vs.*, 
                   u1.name as requester_name,
                   u2.name as receiver_name,
                   s.name as skill_name
            FROM video_sessions vs
            LEFT JOIN users u1 ON vs.requester_id = u1.id
            LEFT JOIN users u2 ON vs.receiver_id = u2.id
            LEFT JOIN skills s ON vs.skill_id = s.id
            WHERE vs.status = 'scheduled'
            AND vs.reminder_sent = FALSE
            AND vs.scheduled_time BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL ? MINUTE)
        `;
        try {
            const [rows] = await promisePool.execute(sql, [minutesBefore]);
            return rows;
        } catch (error) {
            console.error('Error fetching sessions for reminder:', error);
            throw error;
        }
    }

    // Mark reminder as sent
    static async markReminderSent(sessionId) {
        const sql = `UPDATE video_sessions SET reminder_sent = TRUE WHERE session_id = ?`;
        try {
            await promisePool.execute(sql, [sessionId]);
        } catch (error) {
            console.error('Error marking reminder sent:', error);
            throw error;
        }
    }

    // Schedule a session
    static async scheduleSession(sessionId, scheduledTime, duration = 60) {
        const sql = `
            UPDATE video_sessions 
            SET status = 'scheduled', 
                scheduled_time = ?, 
                scheduled_duration = ? 
            WHERE session_id = ?
        `;
        try {
            const [result] = await promisePool.execute(sql, [scheduledTime, duration, sessionId]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error scheduling session:', error);
            throw error;
        }
    }
    // Add this method to your VideoSession.js model
static async update(sessionId, updateData) {
    try {
        const setClause = Object.keys(updateData)
            .map(key => `${key} = ?`)
            .join(', ');
        
        const values = [...Object.values(updateData), sessionId];
        
        const sql = `UPDATE video_sessions SET ${setClause} WHERE session_id = ?`;
        const [result] = await promisePool.execute(sql, values);
        
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error updating video session:', error);
        throw error;
    }
}

// Also add this method for getting sessions that are starting
static async getStartingSessions() {
    const sql = `
        SELECT * FROM video_sessions 
        WHERE status = 'scheduled' 
        AND scheduled_time <= NOW()
        AND started_at IS NULL
    `;
    try {
        const [rows] = await promisePool.execute(sql);
        return rows;
    } catch (error) {
        console.error('Error getting starting sessions:', error);
        throw error;
    }
}

    // ... other methods (create, updateStatus, startSession, endSession) remain same
}

export default VideoSession;