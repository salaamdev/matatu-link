// src/api/reports.js

import api from './config';

/**
 * Fetch all reports.
 * @returns {Promise<Array>} An array of report objects.
 */
// src/api/reports.js
export const getReports = async () => {
    try {
        const response = await api.get('/reports');
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.message;
        console.error('Error fetching reports:', errorMessage);
        throw new Error(errorMessage);
    }
};

/**
 * Fetch a specific report by ID.
 * @param {number} reportId - The ID of the report.
 * @returns {Promise<Object>} The report object.
 */
export const getReportById = async (reportId) => {
    try {
        const response = await api.get(`/reports/${ reportId }`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching report with ID ${ reportId }:`, error.message);
        throw error;
    }
};

/**
 * Create a new report.
 * @param {Object} reportData - The data for the new report.
 * @returns {Promise<Object>} The created report object.
 */
export const createReport = async (reportData) => {
    try {
        const response = await api.post('/reports', reportData);
        return response.data;
    } catch (error) {
        console.error('Error creating report:', error.message);
        throw error;
    }
};

/**
 * Update the status of a report.
 * @param {number} reportId - The ID of the report to update.
 * @param {string} status - The new status ('pending', 'reviewed', 'resolved').
 * @returns {Promise<Object>} The updated report object.
 */
export const updateReportStatus = async (reportId, status) => {
    try {
        const response = await api.put(`/reports/${ reportId }/status`, {status});
        return response.data;
    } catch (error) {
        console.error(`Error updating report status for ID ${ reportId }:`, error.message);
        throw error;
    }
};
