import Dataset from '../models/Dataset.js';

// Get all public datasets
export const getDatasets = async (req, res) => {
    try {
        const datasets = await Dataset.findAllPublic();
        
        res.json({
            success: true,
            data: { datasets },
            count: datasets.length
        });

    } catch (error) {
        console.error('Get datasets error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching datasets',
            error: error.message
        });
    }
};

// Get user's datasets
export const getUserDatasets = async (req, res) => {
    try {
        const datasets = await Dataset.findByUserId(req.user.userId);
        
        res.json({
            success: true,
            data: { datasets },
            count: datasets.length
        });

    } catch (error) {
        console.error('Get user datasets error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user datasets',
            error: error.message
        });
    }
};

// Create new dataset
export const createDataset = async (req, res) => {
    try {
        const { title, description, category, file_url, file_size, file_format, tags, is_public } = req.body;

        if (!title || !file_url) {
            return res.status(400).json({
                success: false,
                message: 'Title and file URL are required'
            });
        }

        const datasetData = {
            user_id: req.user.userId,
            title,
            description,
            category,
            file_url,
            file_size,
            file_format,
            tags: Array.isArray(tags) ? tags : tags ? tags.split(',') : null,
            is_public: is_public !== undefined ? is_public : true
        };

        const dataset = await Dataset.create(datasetData);

        res.status(201).json({
            success: true,
            message: 'Dataset created successfully',
            data: { dataset }
        });

    } catch (error) {
        console.error('Create dataset error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating dataset',
            error: error.message
        });
    }
};

// Search datasets
export const searchDatasets = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const datasets = await Dataset.search(q);

        res.json({
            success: true,
            data: { datasets },
            count: datasets.length
        });

    } catch (error) {
        console.error('Search datasets error:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching datasets',
            error: error.message
        });
    }
};

// Download dataset
export const downloadDataset = async (req, res) => {
    try {
        const { id } = req.params;

        // Increment download count
        await Dataset.incrementDownload(id);

        res.json({
            success: true,
            message: 'Download recorded successfully'
        });

    } catch (error) {
        console.error('Download dataset error:', error);
        res.status(500).json({
            success: false,
            message: 'Error recording download',
            error: error.message
        });
    }
};