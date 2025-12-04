import cron from 'node-cron';
import VideoSession from '../models/VideoSession.js';
import Notification from '../models/Notification.js';
import { sendNotificationToUser } from '../websocket/server.js';

class SchedulerService {
    constructor() {
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;
        
        console.log('⏰ Initializing scheduler service...');
        
        // Run every minute to check for upcoming sessions
        cron.schedule('* * * * *', async () => {
            try {
                await this.checkUpcomingSessions();
            } catch (error) {
                console.error('Error in scheduler:', error);
            }
        });
        
        // Run every hour to clean up old notifications
        cron.schedule('0 * * * *', async () => {
            try {
                await this.cleanupOldNotifications();
            } catch (error) {
                console.error('Error cleaning up notifications:', error);
            }
        });
        
        this.initialized = true;
        console.log('✅ Scheduler service initialized');
    }

    async checkUpcomingSessions() {
        try {
            // Get sessions that need reminders (15 minutes before)
            const sessions = await VideoSession.getSessionsForReminder(15);
            
            for (const session of sessions) {
                await this.sendReminder(session);
                await VideoSession.markReminderSent(session.session_id);
            }
            
            // Check for sessions that should start now
            const now = new Date();
            const startingSessions = await VideoSession.getStartingSessions();
            
            for (const session of startingSessions) {
                await this.notifySessionStart(session);
            }
            
        } catch (error) {
            console.error('Error checking upcoming sessions:', error);
        }
    }

    async sendReminder(session) {
        try {
            const { requester_id, receiver_id, session_id, skill_name, scheduled_time } = session;
            
            const reminderMessage = `Reminder: Video call for "${skill_name}" scheduled at ${new Date(scheduled_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
            
            // Send to both participants
            const participants = [requester_id, receiver_id];
            
            for (const userId of participants) {
                // Create database notification
                await Notification.create({
                    user_id: userId,
                    title: 'Video Call Reminder',
                    message: reminderMessage,
                    type: 'video_reminder',
                    related_id: session_id
                });
                
                // Send real-time notification via WebSocket
                sendNotificationToUser(userId, {
                    type: 'video_reminder',
                    payload: {
                        id: `reminder-${session_id}`,
                        title: 'Video Call Reminder',
                        message: reminderMessage,
                        session_id,
                        scheduled_time,
                        timestamp: new Date().toISOString()
                    }
                });
            }
            
            console.log(`✅ Sent reminders for session ${session_id}`);
            
        } catch (error) {
            console.error(`Error sending reminder for session ${session.session_id}:`, error);
        }
    }

    async notifySessionStart(session) {
        try {
            const { requester_id, receiver_id, session_id, skill_name } = session;
            
            const startMessage = `Your video call for "${skill_name}" is starting now!`;
            
            // Send to both participants
            const participants = [requester_id, receiver_id];
            
            for (const userId of participants) {
                // Send real-time notification
                sendNotificationToUser(userId, {
                    type: 'video_start',
                    payload: {
                        id: `start-${session_id}`,
                        title: 'Video Call Starting',
                        message: startMessage,
                        session_id,
                        action: 'join',
                        timestamp: new Date().toISOString()
                    }
                });
            }
            
            // Update session status to active
            await VideoSession.updateStatus(session_id, 'active');
            
            console.log(`✅ Notified participants for session ${session_id}`);
            
        } catch (error) {
            console.error(`Error notifying session start ${session.session_id}:`, error);
        }
    }

    async cleanupOldNotifications() {
        try {
            // In a real app, you would delete old notifications
            console.log('🧹 Cleaning up old notifications...');
        } catch (error) {
            console.error('Error cleaning up notifications:', error);
        }
    }
}

// Create singleton instance
const schedulerService = new SchedulerService();

export default schedulerService;