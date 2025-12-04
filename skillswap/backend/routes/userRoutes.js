// import express from 'express';
// import authMiddleware from '../middleware/authMiddleware.js';
// import User from '../models/User.js';

// const router = express.Router();

// // Get user profile
// router.get('/profile', authMiddleware, async (req, res) => {
//     try {
//         const [users] = await User.findById(req.user.userId);
//         if (users.length === 0) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         res.json(users[0]);
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// });

// // Update user profile
// router.put('/profile', authMiddleware, async (req, res) => {
//     try {
//         const { name, phone, college, branch, semester } = req.body;
//         await User.updateProfile(req.user.userId, { name, phone, college, branch, semester });
//         res.json({ message: 'Profile updated successfully' });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// });

// export default router;
import express from 'express';
import { updateProfile, getUserById, searchUsers } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes
router.put('/profile', authMiddleware, updateProfile);

// Public routes
router.get('/:id', getUserById);
router.get('/search/users', searchUsers);

export default router;