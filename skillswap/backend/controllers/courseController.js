import Course from '../models/Course.js';

// Get all public courses
export const getCourses = async (req, res) => {
    try {
        const courses = await Course.findAllPublic();
        
        res.json({
            success: true,
            data: { courses },
            count: courses.length
        });

    } catch (error) {
        console.error('Get courses error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching courses',
            error: error.message
        });
    }
};

// Get user's courses
export const getUserCourses = async (req, res) => {
    try {
        const courses = await Course.findByUserId(req.user.userId);
        
        res.json({
            success: true,
            data: { courses },
            count: courses.length
        });

    } catch (error) {
        console.error('Get user courses error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user courses',
            error: error.message
        });
    }
};

// Create new course
export const createCourse = async (req, res) => {
    try {
        const { title, description, category, video_url, thumbnail_url, duration_minutes, difficulty_level, price, is_public } = req.body;

        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: 'Title and description are required'
            });
        }

        const courseData = {
            user_id: req.user.userId,
            title,
            description,
            category,
            video_url,
            thumbnail_url,
            duration_minutes,
            difficulty_level,
            price: price || 0,
            is_public: is_public !== undefined ? is_public : true
        };

        const course = await Course.create(courseData);

        res.status(201).json({
            success: true,
            message: 'Course created successfully',
            data: { course }
        });

    } catch (error) {
        console.error('Create course error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating course',
            error: error.message
        });
    }
};

// Search courses
export const searchCourses = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const courses = await Course.search(q);

        res.json({
            success: true,
            data: { courses },
            count: courses.length
        });

    } catch (error) {
        console.error('Search courses error:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching courses',
            error: error.message
        });
    }
};