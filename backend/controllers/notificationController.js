// controllers/notificationController.js
const {Notification} = require('../models');
const {validationResult} = require('express-validator');

// Create a new notification
exports.createNotification = async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {user_id, notification_type, content} = req.body;

    try {
        const newNotification = await Notification.create({
            user_id,
            notification_type,
            content,
        });

        res.status(201).json(newNotification);
    } catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).json({error: 'Failed to create notification'});
    }
};

// Get all notifications for a user
exports.getUserNotifications = async (req, res) => {
    const user_id = req.user.userId;

    try {
        const notifications = await Notification.findAll({
            where: {user_id},
            order: [['date_sent', 'DESC']],
        });
        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({error: 'Failed to fetch notifications'});
    }
};

// Mark a notification as read
exports.markAsRead = async (req, res) => {
    const {id} = req.params;
    const user_id = req.user.userId;

    try {
        const notification = await Notification.findOne({
            where: {notification_id: id, user_id},
        });

        if (!notification) {
            return res.status(404).json({error: 'Notification not found'});
        }

        notification.is_read = true;
        await notification.save();

        res.status(200).json({message: 'Notification marked as read', notification});
    } catch (error) {
        console.error(`Error marking notification ID ${ id } as read:`, error);
        res.status(500).json({error: 'Failed to mark notification as read'});
    }
};
