import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
} from '../controllers/notificationController.js';

const router = express.Router();

// All routes require authentication
router.get('/', authMiddleware, getNotifications);
router.post('/:id/read', authMiddleware, markAsRead);
router.post('/read-all', authMiddleware, markAllAsRead);
router.delete('/:id', authMiddleware, deleteNotification);

export default router;