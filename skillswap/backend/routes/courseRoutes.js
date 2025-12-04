// import express from 'express';
// import authMiddleware from '../middleware/authMiddleware.js';
// import Course from '../models/Course.js';

// const router = express.Router();

// // Get all courses
// router.get('/', async (req, res) => {
//     try {
//         const [courses] = await Course.findAll();
//         res.json(courses);
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// });

// // Search courses
// router.get('/search', async (req, res) => {
//     try {
//         const { q } = req.query;
//         if (!q) {
//             return res.status(400).json({ message: 'Query parameter is required' });
//         }
//         const [courses] = await Course.search(q);
//         res.json(courses);
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// });

// // Add new course (protected)
// router.post('/', authMiddleware, async (req, res) => {
//     try {
//         const { name, description, video_url, modules } = req.body;
//         const courseData = {
//             user_id: req.user.userId,
//             name,
//             description,
//             video_url,
//             modules: JSON.stringify(modules)
//         };
//         await Course.create(courseData);
//         res.status(201).json({ message: 'Course added successfully' });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// });

// export default router;
import express from 'express';
import { 
    getCourses, 
    getUserCourses, 
    createCourse, 
    searchCourses 
} from '../controllers/courseController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getCourses);
router.get('/search', searchCourses);

// Protected routes
router.get('/my-courses', authMiddleware, getUserCourses);
router.post('/', authMiddleware, createCourse);

export default router;