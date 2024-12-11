const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const {validatePayment} = require('../middlewares/validators');
const authMiddleware = require('../middlewares/authMiddleware');

// Existing routes
router.post('/payments', authMiddleware, validatePayment, paymentController.initiatePayment);
router.post('/payments/callback', paymentController.handleCallback);

// Add new routes for payment methods
router.get('/methods', authMiddleware, paymentController.getPaymentMethods);
router.post('/methods', authMiddleware, paymentController.addPaymentMethod);
router.delete('/methods/:id', authMiddleware, paymentController.deletePaymentMethod);

module.exports = router;