// routes/fareRoutes.js
const express = require('express');
const router = express.Router();
const fareController = require('../controllers/fareController');
const authMiddleware = require('../middlewares/authMiddleware');
const rbacMiddleware = require('../middlewares/rbacMiddleware');
const {body} = require('express-validator');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// POST /api/fares - Create a new fare
router.post('/', [
    body('matatu_id').optional().isInt().withMessage('matatu_id must be an integer'),
    body('route_id').optional().isInt().withMessage('route_id must be an integer'),
    body('amount').isDecimal({min: 0}).withMessage('Amount must be a positive number'),
    body('payment_method').isIn(['cash', 'M-Pesa', 'card']).withMessage('Invalid payment method'),
    body('transaction_reference').optional().isString(),
], fareController.createFare);

// GET /api/fares - Get all fares (admin only)
router.get('/', rbacMiddleware([1]), fareController.getAllFares);

// GET /api/fares/user - Get fares for the logged-in user
router.get('/user', fareController.getUserFares);

module.exports = router;
