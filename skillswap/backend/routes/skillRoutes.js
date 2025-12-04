// import express from 'express';
// import authMiddleware from '../middleware/authMiddleware.js';
// import Skill from '../models/Skill.js';

// const router = express.Router();

// // Get all skills
// router.get('/', async (req, res) => {
//     try {
//         const [skills] = await Skill.findAll();
//         res.json(skills);
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// });

// // Search skills
// router.get('/search', async (req, res) => {
//     try {
//         const { q } = req.query;
//         if (!q) {
//             return res.status(400).json({ message: 'Query parameter is required' });
//         }
//         const [skills] = await Skill.search(q);
//         res.json(skills);
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// });

// // Add new skill (protected)
// router.post('/', authMiddleware, async (req, res) => {
//     try {
//         const { name, description, image } = req.body;
//         const skillData = {
//             user_id: req.user.userId,
//             name,
//             description,
//             image
//         };
//         await Skill.create(skillData);
//         res.status(201).json({ message: 'Skill added successfully' });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// });

// // Get user's skills
// router.get('/my-skills', authMiddleware, async (req, res) => {
//     try {
//         const [skills] = await Skill.findByUserId(req.user.userId);
//         res.json(skills);
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// });

// export default router;
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import Skill from '../models/Skill.js';

const router = express.Router();

// Get all skills - FIXED: Remove array destructuring since findAll returns rows directly
router.get('/', async (req, res) => {
    try {
        const skills = await Skill.findAll();
        res.json({
            success: true,
            data: { skills },
            count: skills.length
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server error', 
            error: error.message 
        });
    }
});

// Search skills - FIXED: Remove array destructuring
router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ 
                success: false,
                message: 'Query parameter is required' 
            });
        }
        const skills = await Skill.search(q);
        res.json({
            success: true,
            data: { skills },
            count: skills.length
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server error', 
            error: error.message 
        });
    }
});

// Add new skill (protected) - FIXED: Use proper response format
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { name, description, image } = req.body;
        const skillData = {
            user_id: req.user.userId,
            name,
            description,
            image
        };
        const skill = await Skill.create(skillData);
        res.status(201).json({
            success: true,
            message: 'Skill added successfully',
            data: { skill }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server error', 
            error: error.message 
        });
    }
});

// Get user's skills - FIXED: Remove array destructuring
router.get('/my-skills', authMiddleware, async (req, res) => {
    try {
        const skills = await Skill.findByUserId(req.user.userId);
        res.json({
            success: true,
            data: { skills },
            count: skills.length
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server error', 
            error: error.message 
        });
    }
});

export default router;