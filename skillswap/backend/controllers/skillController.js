// import Skill from '../models/Skill.js';

// // Get all public skills
// export const getSkills = async (req, res) => {
//     try {
//         const skills = await Skill.findAllPublic();
        
//         res.json({
//             success: true,
//             data: { skills },
//             count: skills.length
//         });

//     } catch (error) {
//         console.error('Get skills error:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error fetching skills',
//             error: error.message
//         });
//     }
// };

// // Get user's skills
// export const getUserSkills = async (req, res) => {
//     try {
//         const skills = await Skill.findByUserId(req.user.userId);
        
//         res.json({
//             success: true,
//             data: { skills },
//             count: skills.length
//         });

//     } catch (error) {
//         console.error('Get user skills error:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error fetching user skills',
//             error: error.message
//         });
//     }
// };

// // Create new skill
// export const createSkill = async (req, res) => {
//     try {
//         const { name, description, proficiency_level, category, image_url, is_public } = req.body;

//         if (!name) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Skill name is required'
//             });
//         }

//         const skillData = {
//             user_id: req.user.userId,
//             name,
//             description,
//             proficiency_level,
//             category,
//             image_url,
//             is_public: is_public !== undefined ? is_public : true
//         };

//         const skill = await Skill.create(skillData);

//         res.status(201).json({
//             success: true,
//             message: 'Skill created successfully',
//             data: { skill }
//         });

//     } catch (error) {
//         console.error('Create skill error:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error creating skill',
//             error: error.message
//         });
//     }
// };

// // Update skill
// export const updateSkill = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { name, description, proficiency_level, category, image_url, is_public } = req.body;

//         const updateData = {};
//         if (name) updateData.name = name;
//         if (description !== undefined) updateData.description = description;
//         if (proficiency_level) updateData.proficiency_level = proficiency_level;
//         if (category !== undefined) updateData.category = category;
//         if (image_url !== undefined) updateData.image_url = image_url;
//         if (is_public !== undefined) updateData.is_public = is_public;

//         const updated = await Skill.update(id, req.user.userId, updateData);

//         if (!updated) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Skill not found or you are not authorized to update it'
//             });
//         }

//         res.json({
//             success: true,
//             message: 'Skill updated successfully'
//         });

//     } catch (error) {
//         console.error('Update skill error:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error updating skill',
//             error: error.message
//         });
//     }
// };

// // Delete skill
// export const deleteSkill = async (req, res) => {
//     try {
//         const { id } = req.params;

//         const deleted = await Skill.delete(id, req.user.userId);

//         if (!deleted) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Skill not found or you are not authorized to delete it'
//             });
//         }

//         res.json({
//             success: true,
//             message: 'Skill deleted successfully'
//         });

//     } catch (error) {
//         console.error('Delete skill error:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error deleting skill',
//             error: error.message
//         });
//     }
// };

// // Search skills
// export const searchSkills = async (req, res) => {
//     try {
//         const { q } = req.query;

//         if (!q) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Search query is required'
//             });
//         }

//         const skills = await Skill.search(q);

//         res.json({
//             success: true,
//             data: { skills },
//             count: skills.length
//         });

//     } catch (error) {
//         console.error('Search skills error:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error searching skills',
//             error: error.message
//         });
//     }
// };
// import Skill from '../models/Skill.js';

// export const getSkills = async (req, res) => {
//     try {
//         const skills = await Skill.findAll();
        
//         res.json({
//             success: true,
//             data: { skills },
//             count: skills.length
//         });

//     } catch (error) {
//         console.error('Get skills error:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error fetching skills',
//             error: error.message
//         });
//     }
// };

// export const getUserSkills = async (req, res) => {
//     try {
//         const skills = await Skill.findByUserId(req.user.userId);
        
//         res.json({
//             success: true,
//             data: { skills },
//             count: skills.length
//         });

//     } catch (error) {
//         console.error('Get user skills error:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error fetching user skills',
//             error: error.message
//         });
//     }
// };

// export const createSkill = async (req, res) => {
//     try {
//         const { name, description, image } = req.body;

//         if (!name) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Skill name is required'
//             });
//         }

//         const skillData = {
//             user_id: req.user.userId,
//             name,
//             description,
//             image
//         };

//         const skill = await Skill.create(skillData);

//         res.status(201).json({
//             success: true,
//             message: 'Skill created successfully',
//             data: { skill }
//         });

//     } catch (error) {
//         console.error('Create skill error:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error creating skill',
//             error: error.message
//         });
//     }
// };

// export const searchSkills = async (req, res) => {
//     try {
//         const { q } = req.query;

//         if (!q) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Search query is required'
//             });
//         }

//         const skills = await Skill.search(q);

//         res.json({
//             success: true,
//             data: { skills },
//             count: skills.length
//         });

//     } catch (error) {
//         console.error('Search skills error:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error searching skills',
//             error: error.message
//         });
//     }
// };
import Skill from '../models/Skill.js';

export const getSkills = async (req, res) => {
    try {
        const skills = await Skill.findAll();
        
        res.json({
            success: true,
            data: { skills },
            count: skills.length
        });

    } catch (error) {
        console.error('Get skills error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching skills',
            error: error.message
        });
    }
};

export const getUserSkills = async (req, res) => {
    try {
        const skills = await Skill.findByUserId(req.user.userId);
        
        res.json({
            success: true,
            data: { skills },
            count: skills.length
        });

    } catch (error) {
        console.error('Get user skills error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user skills',
            error: error.message
        });
    }
};

export const createSkill = async (req, res) => {
    try {
        const { name, description, image } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Skill name is required'
            });
        }

        const skillData = {
            user_id: req.user.userId,
            name,
            description,
            image
        };

        const skill = await Skill.create(skillData);

        res.status(201).json({
            success: true,
            message: 'Skill created successfully',
            data: { skill }
        });

    } catch (error) {
        console.error('Create skill error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating skill',
            error: error.message
        });
    }
};

export const searchSkills = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const skills = await Skill.search(q);

        res.json({
            success: true,
            data: { skills },
            count: skills.length
        });

    } catch (error) {
        console.error('Search skills error:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching skills',
            error: error.message
        });
    }
};