import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
    requestVideoCall,
    acceptVideoCall,
    rejectVideoCall,
    getVideoSessions,
    updateVideoSession,
    startVideoSession,
    endVideoSession,
    saveWebRTCMessage,
    getWebRTCMessages,
    getUpcomingSessions,
    sendReminder
} from '../controllers/videoController.js';

const router = express.Router();

// Video call request and management
router.post('/request', authMiddleware, requestVideoCall);
router.post('/:sessionId/accept', authMiddleware, acceptVideoCall);
router.post('/:sessionId/reject', authMiddleware, rejectVideoCall);

// Video session management
router.get('/sessions', authMiddleware, getVideoSessions);
router.put('/sessions/:sessionId', authMiddleware, updateVideoSession);
router.post('/sessions/:sessionId/start', authMiddleware, startVideoSession);
router.post('/sessions/:sessionId/end', authMiddleware, endVideoSession);

// WebRTC signaling
router.post('/webrtc-message', authMiddleware, saveWebRTCMessage);
router.get('/webrtc-messages/:sessionId', authMiddleware, getWebRTCMessages);

// Scheduling
router.get('/upcoming', authMiddleware, getUpcomingSessions);
router.post('/:sessionId/reminder', authMiddleware, sendReminder);

export default router;