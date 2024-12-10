// backend/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const {getUserActivityStats} = require('../controllers/userController');
const {authenticate} = require('../middlewares/authMiddleware');
const rbacMiddleware = require('../middlewares/rbacMiddleware');

// GET /api/users/activities/stats - Admin only
router.get('/activities/stats', authenticate, rbacMiddleware([1]), getUserActivityStats);

module.exports = router;