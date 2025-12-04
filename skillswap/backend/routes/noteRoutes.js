import express from 'express';
import { 
    getNotes, 
    getUserNotes, 
    createNote, 
    searchNotes,
    downloadNote 
} from '../controllers/noteController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getNotes);
router.get('/search', searchNotes);
router.post('/:id/download', downloadNote);

// Protected routes
router.get('/my-notes', authMiddleware, getUserNotes);
router.post('/', authMiddleware, createNote);

export default router;