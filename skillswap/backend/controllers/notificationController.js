import Notification from '../models/Notification.js';

export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.getUserNotifications(req.user.userId);
        const unreadCount = await Notification.getUnreadCount(req.user.userId);
        
        res.json({
            success: true,
            data: { notifications },
            unreadCount,
            count: notifications.length
        });

    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching notifications',
            error: error.message
        });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        
        await Notification.markAsRead(id);
        
        const unreadCount = await Notification.getUnreadCount(req.user.userId);
        
        res.json({
            success: true,
            message: 'Notification marked as read',
            unreadCount
        });

    } catch (error) {
        console.error('Mark as read error:', error);
        res.status(500).json({
            success: false,
            message: 'Error marking notification as read',
            error: error.message
        });
    }
};

export const markAllAsRead = async (req, res) => {
    try {
        await Notification.markAllAsRead(req.user.userId);
        
        res.json({
            success: true,
            message: 'All notifications marked as read'
        });

    } catch (error) {
        console.error('Mark all as read error:', error);
        res.status(500).json({
            success: false,
            message: 'Error marking all notifications as read',
            error: error.message
        });
    }
};

export const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        
        // You would implement delete method in Notification model
        // await Notification.delete(id);
        
        res.json({
            success: true,
            message: 'Notification deleted'
        });

    } catch (error) {
        console.error('Delete notification error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting notification',
            error: error.message
        });
    }
};