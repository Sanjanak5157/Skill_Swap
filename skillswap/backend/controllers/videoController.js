import VideoSession from '../models/VideoSession.js';
import VideoMessage from '../models/VideoMessage.js';
import Notification from '../models/Notification.js';
import { v4 as uuidv4 } from 'uuid';

// For WebSocket notifications
let connectedUsers = new Map();

// Request video call
export const requestVideoCall = async (req, res) => {
    try {
        const { receiver_id, skill_id, skill_name, scheduled_time, message } = req.body;

        if (!receiver_id || !skill_id) {
            return res.status(400).json({
                success: false,
                message: 'Receiver ID and Skill ID are required'
            });
        }

        const sessionData = {
            session_id: uuidv4(),
            requester_id: req.user.userId,
            receiver_id,
            skill_id,
            skill_name: skill_name || 'Skill Sharing',
            scheduled_time: scheduled_time || null,
            status: 'pending'
        };

        const session = await VideoSession.create(sessionData);

        // Create notification for receiver
        await Notification.create({
            user_id: receiver_id,
            title: 'Video Call Request',
            message: `${req.user.name} has requested a video call for skill: ${skill_name || 'Skill Sharing'}`,
            type: 'video_request',
            related_id: session.session_id
        });

        // Send real-time WebSocket notification if receiver is online
        sendWebSocketNotification(receiver_id, {
            type: 'video_request',
            payload: {
                session_id: session.session_id,
                requester_id: req.user.userId,
                requester_name: req.user.name,
                skill_name: skill_name || 'Skill Sharing',
                message: message || 'I would like to learn this skill with you.',
                scheduled_time: scheduled_time || null
            }
        });

        res.status(201).json({
            success: true,
            message: 'Video call request sent successfully',
            data: { session }
        });

    } catch (error) {
        console.error('Request video call error:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending video call request',
            error: error.message
        });
    }
};

// Accept video call with scheduling
export const acceptVideoCall = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { scheduled_time, duration = 60 } = req.body;

        // Get session details
        const session = await VideoSession.findBySessionId(sessionId);
        
        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Video session not found'
            });
        }

        if (session.receiver_id !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: 'Only the receiver can accept this request'
            });
        }

        let updateData = {};
        
        if (scheduled_time) {
            // Schedule for future time
            await VideoSession.scheduleSession(sessionId, scheduled_time, duration);
            updateData = {
                status: 'scheduled',
                scheduled_time,
                scheduled_duration: duration
            };
        } else {
            // Start immediately
            await VideoSession.updateStatus(sessionId, 'accepted');
            updateData = {
                status: 'accepted'
            };
        }

        // Create notification for requester
        const notificationMessage = scheduled_time 
            ? `Your video call request has been accepted! Scheduled for ${new Date(scheduled_time).toLocaleString()}`
            : `Your video call request has been accepted! The user is ready to connect.`;

        await Notification.create({
            user_id: session.requester_id,
            title: 'Video Call Accepted',
            message: notificationMessage,
            type: 'video_accepted',
            related_id: sessionId
        });

        // Send real-time WebSocket notification
        sendWebSocketNotification(session.requester_id, {
            type: 'video_accepted',
            payload: {
                session_id: sessionId,
                receiver_name: req.user.name,
                scheduled_time: scheduled_time || null,
                message: scheduled_time ? `Call scheduled for ${new Date(scheduled_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` : 'Ready to connect now'
            }
        });

        res.json({
            success: true,
            message: scheduled_time ? 'Video call scheduled successfully' : 'Video call accepted',
            data: { 
                session_id: sessionId,
                status: scheduled_time ? 'scheduled' : 'accepted',
                scheduled_time,
                duration
            }
        });

    } catch (error) {
        console.error('Accept video call error:', error);
        res.status(500).json({
            success: false,
            message: 'Error accepting video call',
            error: error.message
        });
    }
};

// Reject video call
export const rejectVideoCall = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { reason } = req.body;

        const session = await VideoSession.findBySessionId(sessionId);
        
        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Video session not found'
            });
        }

        const updated = await VideoSession.updateStatus(sessionId, 'rejected');

        if (!updated) {
            return res.status(500).json({
                success: false,
                message: 'Failed to reject session'
            });
        }

        // Create notification for requester
        await Notification.create({
            user_id: session.requester_id,
            title: 'Video Call Rejected',
            message: `Your video call request has been rejected. ${reason ? 'Reason: ' + reason : ''}`,
            type: 'video_rejected',
            related_id: sessionId
        });

        // Send real-time WebSocket notification
        sendWebSocketNotification(session.requester_id, {
            type: 'video_rejected',
            payload: {
                session_id: sessionId,
                receiver_name: req.user.name,
                reason: reason || 'No reason provided'
            }
        });

        res.json({
            success: true,
            message: 'Video call rejected'
        });

    } catch (error) {
        console.error('Reject video call error:', error);
        res.status(500).json({
            success: false,
            message: 'Error rejecting video call',
            error: error.message
        });
    }
};

// Get all video sessions for user
export const getVideoSessions = async (req, res) => {
    try {
        const sessions = await VideoSession.findByUserId(req.user.userId);
        
        res.json({
            success: true,
            data: { sessions },
            count: sessions.length
        });

    } catch (error) {
        console.error('Get video sessions error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching video sessions',
            error: error.message
        });
    }
};

// Update video session status
export const updateVideoSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { status } = req.body;

        const validStatuses = ['accepted', 'rejected', 'active', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const updated = await VideoSession.updateStatus(sessionId, status);

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Video session not found'
            });
        }

        res.json({
            success: true,
            message: `Video call ${status} successfully`
        });

    } catch (error) {
        console.error('Update video session error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating video session',
            error: error.message
        });
    }
};

// Start video session
export const startVideoSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        
        const session = await VideoSession.findBySessionId(sessionId);
        
        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Video session not found'
            });
        }

        // Check if user is part of the session
        if (session.requester_id !== req.user.userId && session.receiver_id !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to start this session'
            });
        }

        await VideoSession.startSession(sessionId);

        // Notify the other participant
        const otherUserId = session.requester_id === req.user.userId 
            ? session.receiver_id 
            : session.requester_id;

        sendWebSocketNotification(otherUserId, {
            type: 'video_started',
            payload: {
                session_id: sessionId,
                message: 'Video call has started. Join now!'
            }
        });

        res.json({
            success: true,
            message: 'Video session started'
        });

    } catch (error) {
        console.error('Start video session error:', error);
        res.status(500).json({
            success: false,
            message: 'Error starting video session',
            error: error.message
        });
    }
};

// End video session
export const endVideoSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { duration } = req.body;

        const session = await VideoSession.findBySessionId(sessionId);

        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Video session not found'
            });
        }

        // Check if the user is part of the session
        if (session.requester_id !== req.user.userId && session.receiver_id !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to end this session'
            });
        }

        await VideoSession.endSession(sessionId, duration || 0);

        // Notify the other participant
        const otherUserId = session.requester_id === req.user.userId 
            ? session.receiver_id 
            : session.requester_id;

        sendWebSocketNotification(otherUserId, {
            type: 'video_ended',
            payload: {
                session_id: sessionId,
                message: 'Video call has ended.',
                duration: duration || 0
            }
        });

        res.json({
            success: true,
            message: 'Video session ended successfully'
        });

    } catch (error) {
        console.error('End video session error:', error);
        res.status(500).json({
            success: false,
            message: 'Error ending video session',
            error: error.message
        });
    }
};

// Save WebRTC message
export const saveWebRTCMessage = async (req, res) => {
    try {
        const { session_id, message_type, message_content } = req.body;

        if (!session_id || !message_type || !message_content) {
            return res.status(400).json({
                success: false,
                message: 'Session ID, message type, and content are required'
            });
        }

        const messageData = {
            session_id,
            user_id: req.user.userId,
            message_type,
            message_content
        };

        await VideoMessage.create(messageData);

        res.json({
            success: true,
            message: 'WebRTC message saved successfully'
        });

    } catch (error) {
        console.error('Save WebRTC message error:', error);
        res.status(500).json({
            success: false,
            message: 'Error saving WebRTC message',
            error: error.message
        });
    }
};

// Get WebRTC messages for session
export const getWebRTCMessages = async (req, res) => {
    try {
        const { sessionId } = req.params;

        const messages = await VideoMessage.findBySessionId(sessionId);

        res.json({
            success: true,
            data: { messages }
        });

    } catch (error) {
        console.error('Get WebRTC messages error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching WebRTC messages',
            error: error.message
        });
    }
};

// Get upcoming scheduled sessions
export const getUpcomingSessions = async (req, res) => {
    try {
        const sessions = await VideoSession.getUpcomingSessions(req.user.userId);
        
        res.json({
            success: true,
            data: { sessions },
            count: sessions.length
        });

    } catch (error) {
        console.error('Get upcoming sessions error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching upcoming sessions',
            error: error.message
        });
    }
};

// Send reminder for scheduled session
export const sendReminder = async (req, res) => {
    try {
        const { sessionId } = req.params;
        
        const session = await VideoSession.findBySessionId(sessionId);
        
        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Session not found'
            });
        }

        // Check if user is part of session
        if (session.requester_id !== req.user.userId && session.receiver_id !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to send reminder'
            });
        }

        const otherUserId = session.requester_id === req.user.userId 
            ? session.receiver_id 
            : session.requester_id;

        // Create notification
        await Notification.create({
            user_id: otherUserId,
            title: 'Video Call Reminder',
            message: `Reminder: You have a video call scheduled for ${new Date(session.scheduled_time).toLocaleString()}`,
            type: 'video_reminder',
            related_id: sessionId
        });

        // Send WebSocket notification
        sendWebSocketNotification(otherUserId, {
            type: 'video_reminder',
            payload: {
                session_id: sessionId,
                scheduled_time: session.scheduled_time,
                message: `Reminder: Video call at ${new Date(session.scheduled_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`
            }
        });

        res.json({
            success: true,
            message: 'Reminder sent successfully'
        });

    } catch (error) {
        console.error('Send reminder error:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending reminder',
            error: error.message
        });
    }
};

// Helper function to send WebSocket notifications
function sendWebSocketNotification(userId, message) {
    try {
        const user = connectedUsers.get(userId);
        if (user && user.ws && user.ws.readyState === 1) { // WebSocket.OPEN
            user.ws.send(JSON.stringify(message));
            console.log(`✅ WebSocket notification sent to user ${userId}`);
            return true;
        }
        console.log(`⚠️ User ${userId} is not connected via WebSocket`);
        return false;
    } catch (error) {
        console.error('Error sending WebSocket notification:', error);
        return false;
    }
}

// Function to update connected users (called from WebSocket server)
export function updateConnectedUsers(users) {
    connectedUsers = users;
}