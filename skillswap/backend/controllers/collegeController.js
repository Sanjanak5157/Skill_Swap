import College from '../models/College.js';

// Get all colleges
export const getColleges = async (req, res) => {
    try {
        const colleges = await College.findAll();
        
        res.json({
            success: true,
            data: { colleges },
            count: colleges.length
        });

    } catch (error) {
        console.error('Get colleges error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching colleges',
            error: error.message
        });
    }
};

// Create new college
export const createCollege = async (req, res) => {
    try {
        const { name, description, location, website_url, logo_url, established_year, type } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'College name is required'
            });
        }

        const collegeData = {
            name,
            description,
            location,
            website_url,
            logo_url,
            established_year,
            type
        };

        const college = await College.create(collegeData);

        res.status(201).json({
            success: true,
            message: 'College created successfully',
            data: { college }
        });

    } catch (error) {
        console.error('Create college error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating college',
            error: error.message
        });
    }
};

// Search colleges
export const searchColleges = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const colleges = await College.search(q);

        res.json({
            success: true,
            data: { colleges },
            count: colleges.length
        });

    } catch (error) {
        console.error('Search colleges error:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching colleges',
            error: error.message
        });
    }
};

// Get college students
export const getCollegeStudents = async (req, res) => {
    try {
        const { collegeName } = req.params;

        const students = await College.getStudents(collegeName);

        res.json({
            success: true,
            data: { students },
            count: students.length
        });

    } catch (error) {
        console.error('Get college students error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching college students',
            error: error.message
        });
    }
};