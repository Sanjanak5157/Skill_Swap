import express from 'express';
import { 
    getColleges, 
    createCollege, 
    searchColleges,
    getCollegeStudents 
} from '../controllers/collegeController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getColleges);
router.get('/search', searchColleges);
router.get('/:collegeName/students', getCollegeStudents);

// Protected routes
router.post('/', authMiddleware, createCollege);

export default router;