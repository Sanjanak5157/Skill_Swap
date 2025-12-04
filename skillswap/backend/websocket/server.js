import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Store connected users and active sessions
const connectedUsers = new Map(); // userId -> { ws, userData }
const activeSessions = new Map(); // sessionId -> { participants: Set(userIds), status }

const wss = new WebSocketServer({ noServer: true });

wss.on('connection', (ws, request, user) => {
    console.log(`✅ WebSocket connection established for user: ${user.userId} (${user.name})`);
    
    // Store the connection
    connectedUsers.set(user.userId, { ws, userData: user });
    
    // Send connection confirmation
    ws.send(JSON.stringify({
        type: 'connected',
        payload: {
            userId: user.userId,
            name: user.name,
            message: 'Connected to real-time video service'
        }
    }));
    
    // Send pending notifications (if any)
    sendPendingNotifications(user.userId, ws);
    
    // Handle incoming messages
    ws.on('message', async (message) => {
        try {
            const data = JSON.parse(message);
            console.log(`📨 WebSocket message from ${user.userId}:`, data.type);
            
            switch (data.type) {
                case 'join-session':
                    await handleJoinSession(user.userId, data.payload, ws);
                    break;
                case 'offer':
                    await handleOffer(user.userId, data.payload);
                    break;
                case 'answer':
                    await handleAnswer(user.userId, data.payload);
                    break;
                case 'ice-candidate':
                    await handleIceCandidate(user.userId, data.payload);
                    break;
                case 'chat-message':
                    await handleChatMessage(user.userId, data.payload);
                    break;
                case 'leave-session':
                    await handleLeaveSession(user.userId, data.payload);
                    break;
                case 'control-message':
                    await handleControlMessage(user.userId, data.payload);
                    break;
                case 'notification-seen':
                    await handleNotificationSeen(user.userId, data.payload);
                    break;
                case 'typing':
                    await handleTyping(user.userId, data.payload);
                    break;
                default:
                    console.log('Unknown message type:', data.type);
            }
        } catch (error) {
            console.error('Error processing WebSocket message:', error);
        }
    });
    
    // Handle disconnection
    ws.on('close', () => {
        console.log(`❌ WebSocket disconnected for user: ${user.userId}`);
        connectedUsers.delete(user.userId);
        
        // Remove user from all sessions
        cleanupUserSessions(user.userId);
    });
    
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

// WebSocket authentication middleware
export function authenticateWebSocket(request, callback) {
    try {
        // Extract token from URL query parameters
        const url = new URL(request.url, `http://${request.headers.host}`);
        const token = url.searchParams.get('token');
        
        if (!token) {
            console.log('❌ No token provided for WebSocket connection');
            return callback(new Error('Authentication failed: No token provided'));
        }
        
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.log('❌ Invalid WebSocket token:', err.message);
                return callback(new Error('Authentication failed: Invalid token'));
            }
            
            // Token is valid
            console.log(`✅ WebSocket authenticated for user: ${decoded.userId}`);
            callback(null, decoded);
        });
    } catch (error) {
        console.error('WebSocket authentication error:', error);
        callback(new Error('Authentication failed'));
    }
}

// Send pending notifications when user connects
async function sendPendingNotifications(userId, ws) {
    try {
        // In a real app, you would fetch from database
        const pendingNotifications = [
            {
                id: 'temp-1',
                title: 'Welcome!',
                message: 'You are now connected to real-time notifications',
                type: 'system',
                timestamp: new Date().toISOString()
            }
        ];
        
        if (pendingNotifications.length > 0) {
            ws.send(JSON.stringify({
                type: 'notifications',
                payload: { notifications: pendingNotifications }
            }));
        }
    } catch (error) {
        console.error('Error sending pending notifications:', error);
    }
}

async function handleJoinSession(userId, payload, ws) {
    const { sessionId } = payload;
    
    console.log(`👤 User ${userId} joining session: ${sessionId}`);
    
    // Initialize session if it doesn't exist
    if (!activeSessions.has(sessionId)) {
        activeSessions.set(sessionId, {
            participants: new Set(),
            status: 'active',
            createdAt: new Date()
        });
    }
    
    const session = activeSessions.get(sessionId);
    session.participants.add(userId);
    
    // Notify existing participants about new user
    const otherParticipants = Array.from(session.participants)
        .filter(id => id !== userId);
    
    // Send list of existing participants to new user
    ws.send(JSON.stringify({
        type: 'session-joined',
        payload: {
            sessionId,
            participants: otherParticipants.map(id => {
                const user = connectedUsers.get(id);
                return user ? { userId: id, userName: user.userData.name } : null;
            }).filter(Boolean),
            sessionStatus: session.status
        }
    }));
    
    // Notify other participants about new user
    otherParticipants.forEach(participantId => {
        const participant = connectedUsers.get(participantId);
        if (participant) {
            participant.ws.send(JSON.stringify({
                type: 'user-joined',
                payload: {
                    sessionId,
                    userId,
                    userName: connectedUsers.get(userId)?.userData.name
                }
            }));
        }
    });
    
    console.log(`✅ User ${userId} joined session ${sessionId}. Total participants: ${session.participants.size}`);
}

async function handleOffer(userId, payload) {
    const { sessionId, offer, targetUserId } = payload;
    
    const targetUser = connectedUsers.get(targetUserId);
    if (targetUser) {
        targetUser.ws.send(JSON.stringify({
            type: 'offer',
            payload: {
                sessionId,
                offer,
                fromUserId: userId,
                fromUserName: connectedUsers.get(userId)?.userData.name
            }
        }));
        console.log(`📤 Offer sent from ${userId} to ${targetUserId}`);
    }
}

async function handleAnswer(userId, payload) {
    const { sessionId, answer, targetUserId } = payload;
    
    const targetUser = connectedUsers.get(targetUserId);
    if (targetUser) {
        targetUser.ws.send(JSON.stringify({
            type: 'answer',
            payload: {
                sessionId,
                answer,
                fromUserId: userId,
                fromUserName: connectedUsers.get(userId)?.userData.name
            }
        }));
        console.log(`📤 Answer sent from ${userId} to ${targetUserId}`);
    }
}

async function handleIceCandidate(userId, payload) {
    const { sessionId, candidate, targetUserId } = payload;
    
    const targetUser = connectedUsers.get(targetUserId);
    if (targetUser) {
        targetUser.ws.send(JSON.stringify({
            type: 'ice-candidate',
            payload: {
                sessionId,
                candidate,
                fromUserId: userId,
                fromUserName: connectedUsers.get(userId)?.userData.name
            }
        }));
    }
}

async function handleChatMessage(userId, payload) {
    const { sessionId, message } = payload;
    
    const session = activeSessions.get(sessionId);
    if (session) {
        session.participants.forEach(participantId => {
            if (participantId !== userId) {
                const participant = connectedUsers.get(participantId);
                if (participant) {
                    participant.ws.send(JSON.stringify({
                        type: 'chat-message',
                        payload: {
                            sessionId,
                            message,
                            fromUserId: userId,
                            fromUserName: connectedUsers.get(userId)?.userData.name,
                            timestamp: new Date().toISOString()
                        }
                    }));
                }
            }
        });
    }
}

async function handleLeaveSession(userId, payload) {
    const { sessionId } = payload;
    
    const session = activeSessions.get(sessionId);
    if (session) {
        session.participants.delete(userId);
        
        // Notify other participants
        session.participants.forEach(participantId => {
            const participant = connectedUsers.get(participantId);
            if (participant) {
                participant.ws.send(JSON.stringify({
                    type: 'user-left',
                    payload: {
                        sessionId,
                        userId,
                        userName: connectedUsers.get(userId)?.userData.name
                    }
                }));
            }
        });
        
        // Clean up empty sessions
        if (session.participants.size === 0) {
            activeSessions.delete(sessionId);
        }
        
        console.log(`👋 User ${userId} left session ${sessionId}`);
    }
}

async function handleControlMessage(userId, payload) {
    const { sessionId, controlType, data, targetUserId } = payload;
    
    // Control messages: mute, video-toggle, screen-share, raise-hand, etc.
    if (targetUserId) {
        // Send to specific user
        const targetUser = connectedUsers.get(targetUserId);
        if (targetUser) {
            targetUser.ws.send(JSON.stringify({
                type: 'control-message',
                payload: {
                    sessionId,
                    controlType,
                    data,
                    fromUserId: userId
                }
            }));
        }
    } else {
        // Broadcast to all participants in session
        const session = activeSessions.get(sessionId);
        if (session) {
            session.participants.forEach(participantId => {
                if (participantId !== userId) {
                    const participant = connectedUsers.get(participantId);
                    if (participant) {
                        participant.ws.send(JSON.stringify({
                            type: 'control-message',
                            payload: {
                                sessionId,
                                controlType,
                                data,
                                fromUserId: userId
                            }
                        }));
                    }
                }
            });
        }
    }
}

async function handleNotificationSeen(userId, payload) {
    const { notificationId } = payload;
    console.log(`User ${userId} marked notification ${notificationId} as seen`);
    
    // In a real app, update database
    // await Notification.markAsRead(notificationId);
}

async function handleTyping(userId, payload) {
    const { sessionId, isTyping } = payload;
    
    const session = activeSessions.get(sessionId);
    if (session) {
        session.participants.forEach(participantId => {
            if (participantId !== userId) {
                const participant = connectedUsers.get(participantId);
                if (participant) {
                    participant.ws.send(JSON.stringify({
                        type: 'typing',
                        payload: {
                            sessionId,
                            userId,
                            isTyping,
                            userName: connectedUsers.get(userId)?.userData.name
                        }
                    }));
                }
            }
        });
    }
}

function cleanupUserSessions(userId) {
    for (const [sessionId, session] of activeSessions.entries()) {
        if (session.participants.has(userId)) {
            session.participants.delete(userId);
            
            // Notify other participants
            session.participants.forEach(participantId => {
                const participant = connectedUsers.get(participantId);
                if (participant) {
                    participant.ws.send(JSON.stringify({
                        type: 'user-left',
                        payload: {
                            sessionId,
                            userId,
                            userName: connectedUsers.get(userId)?.userData.name
                        }
                    }));
                }
            });
            
            // Clean up empty sessions
            if (session.participants.size === 0) {
                activeSessions.delete(sessionId);
            }
        }
    }
}

// Export function to send notification to user
export function sendNotificationToUser(userId, notification) {
    const user = connectedUsers.get(userId);
    if (user && user.ws && user.ws.readyState === 1) { // WebSocket.OPEN
        user.ws.send(JSON.stringify({
            type: 'notification',
            payload: notification
        }));
        return true;
    }
    return false;
}

// Send video call request notification
export function sendVideoRequestNotification(receiverId, requestData) {
    const notification = {
        type: 'video_request',
        payload: {
            id: `video-request-${Date.now()}`,
            title: 'New Video Call Request',
            message: `${requestData.requester_name} wants to video call about ${requestData.skill_name}`,
            data: requestData,
            timestamp: new Date().toISOString()
        }
    };
    
    return sendNotificationToUser(receiverId, notification);
}

// Send video call accepted notification
export function sendVideoAcceptedNotification(requesterId, acceptanceData) {
    const notification = {
        type: 'video_accepted',
        payload: {
            id: `video-accepted-${Date.now()}`,
            title: 'Video Call Accepted!',
            message: acceptanceData.scheduled_time 
                ? `Call scheduled for ${new Date(acceptanceData.scheduled_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`
                : 'Ready to connect now',
            data: acceptanceData,
            timestamp: new Date().toISOString()
        }
    };
    
    return sendNotificationToUser(requesterId, notification);
}

// Get connected users (for videoController.js)
export function getConnectedUsers() {
    return connectedUsers;
}

// Export the WebSocket server
export { wss };