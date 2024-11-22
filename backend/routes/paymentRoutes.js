// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middlewares/authMiddleware');
const {body} = require('express-validator');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// POST /api/payments - Initiate a payment
router.post('/', [
    body('fare_id').isInt().withMessage('fare_id must be an integer'),
    body('phone_number').isMobilePhone('any').withMessage('Valid phone number is required'),
], paymentController.initiatePayment);

// POST /api/payments/callback - Handle M-Pesa callback
router.post('/callback', paymentController.handleMpesaCallback);

module.exports = router;
