import Note from '../models/Note.js';

// Get all public notes
export const getNotes = async (req, res) => {
    try {
        const notes = await Note.findAllPublic();
        
        res.json({
            success: true,
            data: { notes },
            count: notes.length
        });

    } catch (error) {
        console.error('Get notes error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching notes',
            error: error.message
        });
    }
};

// Get user's notes
export const getUserNotes = async (req, res) => {
    try {
        const notes = await Note.findByUserId(req.user.userId);
        
        res.json({
            success: true,
            data: { notes },
            count: notes.length
        });

    } catch (error) {
        console.error('Get user notes error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user notes',
            error: error.message
        });
    }
};

// Create new note
export const createNote = async (req, res) => {
    try {
        const { title, description, category, file_url, file_size, file_type, is_public } = req.body;

        if (!title || !file_url) {
            return res.status(400).json({
                success: false,
                message: 'Title and file URL are required'
            });
        }

        const noteData = {
            user_id: req.user.userId,
            title,
            description,
            category,
            file_url,
            file_size,
            file_type,
            is_public: is_public !== undefined ? is_public : true
        };

        const note = await Note.create(noteData);

        res.status(201).json({
            success: true,
            message: 'Note created successfully',
            data: { note }
        });

    } catch (error) {
        console.error('Create note error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating note',
            error: error.message
        });
    }
};

// Search notes
export const searchNotes = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const notes = await Note.search(q);

        res.json({
            success: true,
            data: { notes },
            count: notes.length
        });

    } catch (error) {
        console.error('Search notes error:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching notes',
            error: error.message
        });
    }
};

// Download note
export const downloadNote = async (req, res) => {
    try {
        const { id } = req.params;

        // Increment download count
        await Note.incrementDownload(id);

        // In a real application, you would serve the file here
        // For now, we'll just return success
        res.json({
            success: true,
            message: 'Download recorded successfully'
        });

    } catch (error) {
        console.error('Download note error:', error);
        res.status(500).json({
            success: false,
            message: 'Error recording download',
            error: error.message
        });
    }
};