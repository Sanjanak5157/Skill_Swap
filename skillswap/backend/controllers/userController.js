import User from '../models/User.js';

// Update user profile
export const updateProfile = async (req, res) => {
    try {
        const { name, phone, college, branch, semester, bio } = req.body;
        const userId = req.user.userId;

        const updateData = {};
        if (name) updateData.name = name;
        if (phone) updateData.phone = phone;
        if (college) updateData.college = college;
        if (branch) updateData.branch = branch;
        if (semester) updateData.semester = semester;
        if (bio) updateData.bio = bio;

        const updated = await User.update(userId, updateData);

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'User not found or no changes made'
            });
        }

        // Get updated user data
        const user = await User.findById(userId);

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: { user }
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
};

// Get user by ID (public profile)
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Remove sensitive information
        const { password, ...publicProfile } = user;

        res.json({
            success: true,
            data: { user: publicProfile }
        });

    } catch (error) {
        console.error('Get user by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user',
            error: error.message
        });
    }
};

// Search users
// export const searchUsers = async (req, res) => {
//     try {
//         const { q } = req.query;

//         if (!q) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Search query is required'
//             });
//         }

//         // This is a simplified search - you might want to implement more advanced search
//         const sql = `
//             SELECT id, name, email, college, branch, semester, avatar_url, bio
//             FROM users 
//             WHERE name LIKE ? OR email LIKE ? OR college LIKE ? OR branch LIKE ?
//             LIMIT 50
//         `;
//         const searchQuery = `%${q}%`;

//         const [users] = await db.promise().execute(sql, [searchQuery, searchQuery, searchQuery, searchQuery]);

//         res.json({
//             success: true,
//             data: { users }
//         });

//     } catch (error) {
//         console.error('Search users error:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error searching users',
//             error: error.message
//         });
//     }
// };
import { promisePool } from '../config/database.js';

// ... other code ...

// Search users
export const searchUsers = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const sql = `
            SELECT id, name, email, college, branch, semester, avatar_url, bio
            FROM users 
            WHERE name LIKE ? OR email LIKE ? OR college LIKE ? OR branch LIKE ?
            LIMIT 50
        `;
        const searchQuery = `%${q}%`;

        const [users] = await promisePool.execute(sql, [searchQuery, searchQuery, searchQuery, searchQuery]);

        res.json({
            success: true,
            data: { users }
        });

    } catch (error) {
        console.error('Search users error:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching users',
            error: error.message
        });
    }
};