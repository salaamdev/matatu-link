// controllers/paymentController.js
const {Payment, Fare} = require('../models');
const {validationResult} = require('express-validator');
const axios = require('axios'); // For making HTTP requests to M-Pesa API
const qs = require('qs');

// Assuming M-Pesa API credentials are stored in environment variables
const MPESA_API_BASE_URL = process.env.MPESA_API_BASE_URL;
const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE;
const MPESA_PASSKEY = process.env.MPESA_PASSKEY;
const MPESA_CALLBACK_URL = process.env.MPESA_CALLBACK_URL;

// Function to get access token from M-Pesa API
const getMpesaAccessToken = async () => {
    const response = await axios.get(`${ MPESA_API_BASE_URL }/oauth/v1/generate?grant_type=client_credentials`, {
        auth: {
            username: MPESA_CONSUMER_KEY,
            password: MPESA_CONSUMER_SECRET,
        },
    });

    return response.data.access_token;
};

// Initiate a payment
exports.initiatePayment = async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {fare_id, phone_number} = req.body;
    const user_id = req.user.userId;

    try {
        const fare = await Fare.findByPk(fare_id);
        if (!fare) {
            return res.status(404).json({error: 'Fare not found'});
        }

        // Create a payment record with status 'pending'
        const newPayment = await Payment.create({
            fare_id,
            payment_status: 'pending',
        });

        // Prepare M-Pesa payment request
        const accessToken = await getMpesaAccessToken();
        const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
        const password = Buffer.from(`${ MPESA_SHORTCODE }${ MPESA_PASSKEY }${ timestamp }`).toString('base64');

        const payload = {
            BusinessShortCode: MPESA_SHORTCODE,
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: fare.amount,
            PartyA: phone_number, // Sender's phone number
            PartyB: MPESA_SHORTCODE,
            PhoneNumber: phone_number,
            CallBackURL: MPESA_CALLBACK_URL,
            AccountReference: `Fare-${ fare_id }`,
            TransactionDesc: 'Payment for Matatu-Link Fare',
        };

        // Make request to M-Pesa API
        const mpesaResponse = await axios.post(`${ MPESA_API_BASE_URL }/mpesa/stkpush/v1/processrequest`, payload, {
            headers: {
                'Authorization': `Bearer ${ accessToken }`,
                'Content-Type': 'application/json',
            },
        });

        // Update payment record with transaction reference
        newPayment.transaction_reference = mpesaResponse.data.ResponseDescription; // Adjust based on actual response
        await newPayment.save();

        res.status(200).json({message: 'Payment initiated', payment: newPayment});
    } catch (error) {
        console.error('Error initiating payment:', error.response ? error.response.data : error.message);
        res.status(500).json({error: 'Failed to initiate payment'});
    }
};

// Handle M-Pesa callback
exports.handleMpesaCallback = async (req, res) => {
    const callbackData = req.body;

    // Process the callback data
    try {
        // Extract relevant data from callback
        const {Body} = callbackData;
        const {stkCallback} = Body;
        const {CallbackMetadata} = stkCallback;
        const {MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc} = stkCallback;

        if (ResultCode === 0) { // Success
            const amount = CallbackMetadata.Item.find(item => item.Name === 'Amount').Value;
            const phoneNumber = CallbackMetadata.Item.find(item => item.Name === 'PhoneNumber').Value;
            const transactionReference = stkCallback.MerchantRequestID; // Adjust based on actual data

            // Find the payment record by transaction reference
            const payment = await Payment.findOne({where: {transaction_reference: transactionReference}});
            if (payment) {
                payment.payment_status = 'completed';
                payment.date_completed = new Date();
                await payment.save();

                // Optionally, update fare records or notify users
            }
        } else {
            // Handle failed transactions
            const transactionReference = stkCallback.MerchantRequestID;
            const payment = await Payment.findOne({where: {transaction_reference: transactionReference}});
            if (payment) {
                payment.payment_status = 'failed';
                payment.error_message = ResultDesc;
                payment.date_completed = new Date();
                await payment.save();
            }
        }

        res.status(200).json({message: 'Callback received'});
    } catch (error) {
        console.error('Error handling M-Pesa callback:', error);
        res.status(500).json({error: 'Failed to handle callback'});
    }
};
