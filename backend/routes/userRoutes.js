// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const rbacMiddleware = require('../middlewares/rbacMiddleware');

// GET /api/users - Get all users (admin only)
router.get('/', authMiddleware, rbacMiddleware([1]), userController.getAllUsers);

// GET /api/users/activities/stats - Get user activity stats (admin only)
router.get('/activities/stats', authMiddleware, rbacMiddleware([1]), userController.getUserActivityStats);

module.exports = router;