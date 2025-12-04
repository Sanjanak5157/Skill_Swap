import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
    getProjects,
    getUserProjects,
    createProject,
    searchProjects
} from '../controllers/projectController.js';

const router = express.Router();

// Public routes
router.get('/', getProjects);
router.get('/search', searchProjects);

// Protected routes
router.get('/my-projects', authMiddleware, getUserProjects);
router.post('/', authMiddleware, createProject);

export default router;