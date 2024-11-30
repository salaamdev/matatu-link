// src/api/payment.js

import api from './config';

/**
 * Fetch all payment methods for the user.
 * @returns {Promise<Array>} An array of payment method objects.
 */
export const getPaymentMethods = async () => {
  try {
    const response = await api.get('/payment/methods'); // Ensure this endpoint exists
    return response.data;
  } catch (error) {
    console.error('Error fetching payment methods:', error.message);
    throw error;
  }
};

/**
 * Add a new payment method.
 * @param {Object} paymentData - The data for the new payment method.
 * @returns {Promise<Object>} The created payment method object.
 */
export const addPaymentMethod = async (paymentData) => {
  try {
    const response = await api.post('/payment/methods', paymentData); // Ensure this endpoint exists
    return response.data;
  } catch (error) {
    console.error('Error adding payment method:', error.message);
    throw error;
  }
};

/**
 * Fetch payment history for the user.
 * @returns {Promise<Array>} An array of payment history objects.
 */
export const getPaymentHistory = async () => {
  try {
    const response = await api.get('/payment/history'); // Ensure this endpoint exists
    return response.data;
  } catch (error) {
    console.error('Error fetching payment history:', error.message);
    throw error;
  }
};

/**
 * Delete a payment method.
 * @param {number} methodId - The ID of the payment method to delete.
 * @returns {Promise<void>}
 */
export const deletePaymentMethod = async (methodId) => {
  try {
    await api.delete(`/payment/methods/${methodId}`); // Ensure this endpoint exists
  } catch (error) {
    console.error(`Error deleting payment method with ID ${methodId}:`, error.message);
    throw error;
  }
};
