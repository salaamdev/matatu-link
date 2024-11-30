// src/api/contributions.js

import api from './config';

/**
 * Fetch all contributions.
 * @returns {Promise<Array>} An array of contribution objects.
 */
// src/api/contributions.js
export const getContributions = async () => {
    try {
        const response = await api.get('/contributions');
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.message;
        console.error('Error fetching contributions:', errorMessage);
        throw new Error(errorMessage);
    }
};
/**
 * Fetch a specific contribution by ID.
 * @param {number} contributionId - The ID of the contribution.
 * @returns {Promise<Object>} The contribution object.
 */
export const getContributionById = async (contributionId) => {
    try {
        const response = await api.get(`/contributions/${ contributionId }`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching contribution with ID ${ contributionId }:`, error.message);
        throw error;
    }
};

/**
 * Create a new contribution.
 * @param {Object} contributionData - The data for the new contribution.
 * @returns {Promise<Object>} The created contribution object.
 */
export const createContribution = async (contributionData) => {
    try {
        const response = await api.post('/contributions', contributionData);
        return response.data;
    } catch (error) {
        console.error('Error creating contribution:', error.response?.data || error.message);
        throw error;
    }
};

/**
 * Update an existing contribution.
 * @param {number} contributionId - The ID of the contribution to update.
 * @param {Object} contributionData - The updated data for the contribution.
 * @returns {Promise<Object>} The updated contribution object.
 */
export const updateContribution = async (contributionId, contributionData) => {
    try {
        const response = await api.put(`/contributions/${ contributionId }`, contributionData);
        return response.data;
    } catch (error) {
        console.error(`Error updating contribution with ID ${ contributionId }:`, error.message);
        throw error;
    }
};

/**
 * Delete a contribution.
 * @param {number} contributionId - The ID of the contribution to delete.
 * @returns {Promise<void>}
 */
export const deleteContribution = async (contributionId) => {
    try {
        await api.delete(`/contributions/${ contributionId }`);
    } catch (error) {
        console.error(`Error deleting contribution with ID ${ contributionId }:`, error.message);
        throw error;
    }
};
