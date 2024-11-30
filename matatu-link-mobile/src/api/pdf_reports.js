// src/api/reports.js

import api from './config';

/**
 * Fetch all data for generating reports.
 * This function fetches all relevant tables.
 */
export const getAllReportsData = async () => {
  try {
    const response = await api.get('/reports/all'); // Ensure this endpoint exists in the backend
    return response.data;
  } catch (error) {
    console.error('Error fetching all reports data:', error.message);
    throw error;
  }
};

/**
 * Fetch specific table data for report generation.
 * @param {string} tableName - Name of the table to fetch.
 * @returns {Promise<Array>} Data for the specified table.
 */
export const getTableData = async (tableName) => {
  try {
    const response = await api.get(`/reports/${tableName}`); // Ensure endpoints like /reports/routes exist
    return response.data;
  } catch (error) {
    console.error(`Error fetching data for table ${tableName}:`, error.message);
    throw error;
  }
};
