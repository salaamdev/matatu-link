// backend/routes/authRoutes.js
const express = require('express');
const { register, login, getProfile } = require('../controllers/authController');
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware'); // Import authMiddleware
const authController = require('../controllers/authController'); // Import authController
const router = express.Router();

// Registration Route with Validation
router.post('/register', [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role_id').optional().isInt().withMessage('Role ID must be an integer')
], register);

// Login Route with Validation
router.post('/login', [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
], login);

// Profile Route
router.get('/profile', authMiddleware, getProfile); // Use authController.getProfile
// Add this near other routes
router.put('/profile', authMiddleware, authController.updateProfile);

module.exports = router;