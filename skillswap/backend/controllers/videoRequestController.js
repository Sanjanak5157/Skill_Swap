import VideoRequest from '../models/VideoRequest.js';

export const createVideoRequest = async (req, res) => {
    try {
        const { receiver_id, skill_id, message } = req.body;

        if (!receiver_id || !skill_id) {
            return res.status(400).json({
                success: false,
                message: 'Receiver ID and Skill ID are required'
            });
        }

        const requestData = {
            requester_id: req.user.userId,
            receiver_id,
            skill_id,
            message: message || 'I would like to learn this skill with you via video call.',
            status: 'pending'
        };

        const videoRequest = await VideoRequest.create(requestData);

        res.status(201).json({
            success: true,
            message: 'Video call request sent successfully',
            data: { videoRequest }
        });

    } catch (error) {
        console.error('Create video request error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating video request',
            error: error.message
        });
    }
};

export const updateVideoRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['accepted', 'rejected', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const updated = await VideoRequest.updateStatus(id, status);

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Video request not found'
            });
        }

        res.json({
            success: true,
            message: `Video request ${status} successfully`
        });

    } catch (error) {
        console.error('Update video request error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating video request',
            error: error.message
        });
    }
};

export const getUserVideoRequests = async (req, res) => {
    try {
        const videoRequests = await VideoRequest.findByUserId(req.user.userId);
        
        res.json({
            success: true,
            data: { videoRequests },
            count: videoRequests.length
        });

    } catch (error) {
        console.error('Get user video requests error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching video requests',
            error: error.message
        });
    }
};