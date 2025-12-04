import Project from '../models/Project.js';

export const getProjects = async (req, res) => {
    try {
        const projects = await Project.findAllPublic();
        
        res.json({
            success: true,
            data: { projects },
            count: projects.length
        });

    } catch (error) {
        console.error('Get projects error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching projects',
            error: error.message
        });
    }
};

export const getUserProjects = async (req, res) => {
    try {
        const projects = await Project.findByUserId(req.user.userId);
        
        res.json({
            success: true,
            data: { projects },
            count: projects.length
        });

    } catch (error) {
        console.error('Get user projects error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user projects',
            error: error.message
        });
    }
};

export const createProject = async (req, res) => {
    try {
        const { title, description, technologies, project_url, github_url, image_url, category } = req.body;

        if (!title) {
            return res.status(400).json({
                success: false,
                message: 'Project title is required'
            });
        }

        const projectData = {
            user_id: req.user.userId,
            title,
            description,
            technologies,
            project_url,
            github_url,
            image_url,
            category
        };

        const project = await Project.create(projectData);

        res.status(201).json({
            success: true,
            message: 'Project created successfully',
            data: { project }
        });

    } catch (error) {
        console.error('Create project error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating project',
            error: error.message
        });
    }
};

export const searchProjects = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const projects = await Project.search(q);

        res.json({
            success: true,
            data: { projects },
            count: projects.length
        });

    } catch (error) {
        console.error('Search projects error:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching projects',
            error: error.message
        });
    }
};