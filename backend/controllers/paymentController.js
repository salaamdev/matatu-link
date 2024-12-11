const {Payment} = require('../models');
const axios = require('axios');

// Sandbox credentials
const SANDBOX_URL = 'https://sandbox.safaricom.co.ke';
const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
const BUSINESS_SHORT_CODE = '174379'; // Lipa Na M-Pesa Shortcode
const PASSKEY = process.env.MPESA_PASSKEY;
const CALLBACK_URL = process.env.MPESA_CALLBACK_URL;


// Get OAuth token
const getAccessToken = async () => {
  try {
    const auth = Buffer.from(`${ CONSUMER_KEY }:${ CONSUMER_SECRET }`).toString('base64');
    const response = await axios.get(
      `${ SANDBOX_URL }/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: {
          Authorization: `Basic ${ auth }`,
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('Access token error:', error);
    throw error;
  }
};

// Initiate STK Push
exports.initiatePayment = async (req, res) => {
  try {
    const {phone_number, amount} = req.body;
    const timestamp = new Date().toISOString().replace(/[-.]/g, '').slice(0, 14);
    const password = Buffer.from(
      `${ BUSINESS_SHORT_CODE }${ PASSKEY }${ timestamp }`
    ).toString('base64');

    const token = await getAccessToken();

    const stkPushResponse = await axios.post(
      `${ SANDBOX_URL }/mpesa/stkpush/v1/processrequest`,
      {
        BusinessShortCode: BUSINESS_SHORT_CODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.ceil(amount),
        PartyA: phone_number,
        PartyB: BUSINESS_SHORT_CODE,
        PhoneNumber: phone_number,
        CallBackURL: CALLBACK_URL,
        AccountReference: 'Matatu-Link',
        TransactionDesc: 'Fare Payment'
      },
      {
        headers: {
          'Authorization': `Bearer ${ token }`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Save payment record
    const payment = await Payment.create({
      user_id: req.user.userId,
      amount,
      phone_number,
      transaction_reference: stkPushResponse.data.CheckoutRequestID,
      payment_status: 'pending'
    });

    res.status(200).json({
      message: 'Payment initiated successfully',
      checkoutRequestId: stkPushResponse.data.CheckoutRequestID
    });

  } catch (error) {
    console.error('Payment initiation error:', error.response?.data || error);
    res.status(500).json({
      error: 'Failed to initiate payment',
      details: error.response?.data || error.message
    });
  }
};

exports.handleCallback = async (req, res) => {
  try {
    const { Body } = req.body;
    const { stkCallback } = Body;
    
    const payment = await Payment.findOne({
      where: { transaction_reference: stkCallback.CheckoutRequestID }
    });

    if (payment) {
      payment.payment_status = stkCallback.ResultCode === 0 ? 'completed' : 'failed';
      payment.result_description = stkCallback.ResultDesc;
      await payment.save();
    }

    res.status(200).json({ message: 'Callback processed' });
  } catch (error) {
    console.error('Callback processing error:', error);
    res.status(500).json({ error: 'Failed to process callback' });
  }
};

// Add these methods to the existing paymentController

exports.getPaymentMethods = async (req, res) => {
  try {
    const userId = req.user.userId;
    const paymentMethods = await Payment.findAll({
      where: {user_id: userId},
      attributes: ['payment_id', 'method_type', 'details', 'is_default']
    });

    // Return empty array if no methods found
    res.status(200).json(paymentMethods || []);
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    res.status(500).json({error: 'Failed to fetch payment methods'});
  }
};

exports.addPaymentMethod = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {method_type, details} = req.body;

    const paymentMethod = await Payment.create({
      user_id: userId,
      method_type,
      details,
      is_default: false
    });

    res.status(201).json(paymentMethod);
  } catch (error) {
    console.error('Error adding payment method:', error);
    res.status(500).json({error: 'Failed to add payment method'});
  }
};

exports.deletePaymentMethod = async (req, res) => {
  try {
    const {id} = req.params;
    const userId = req.user.userId;

    const result = await Payment.destroy({
      where: {
        payment_id: id,
        user_id: userId
      }
    });

    if (!result) {
      return res.status(404).json({error: 'Payment method not found'});
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting payment method:', error);
    res.status(500).json({error: 'Failed to delete payment method'});
  }
};