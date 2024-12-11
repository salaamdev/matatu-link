const { body } = require('express-validator');

exports.validatePayment = [
    body('phoneNumber').matches(/^(?:\+254|0)?[71]\d{8}$/).withMessage('Invalid phone number format'),
    body('amount').isNumeric().withMessage('Amount must be a number')
];