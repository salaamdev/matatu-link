// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middlewares/authMiddleware');
const {body} = require('express-validator');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// POST /api/notifications - Create a new notification (admin only)
router.post('/', [
    body('user_id').isInt().withMessage('user_id must be an integer'),
    body('notification_type').notEmpty().withMessage('notification_type is required'),
    body('content').notEmpty().withMessage('content is required'),
], notificationController.createNotification);

// GET /api/notifications - Get all notifications for the logged-in user
router.get('/', notificationController.getUserNotifications);

// PUT /api/notifications/:id/read - Mark a notification as read
router.put('/:id/read', notificationController.markAsRead);

module.exports = router;
