import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
    createVideoRequest,
    updateVideoRequest,
    getUserVideoRequests
} from '../controllers/videoRequestController.js';

const router = express.Router();

// Protected routes
router.post('/', authMiddleware, createVideoRequest);
router.put('/:id', authMiddleware, updateVideoRequest);
router.get('/my-requests', authMiddleware, getUserVideoRequests);

export default router;