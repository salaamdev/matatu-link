// src/api/routes.js

import api from './config';

/**
 * Fetch all routes from the backend.
 * @returns {Promise<Array>} An array of route objects.
 */
export const getRoutes = async () => {
    try {
        const response = await api.get('/routes');
        return response.data;
    } catch (error) {
        console.error('Error fetching routes:', error.message);
        throw error;
    }
};

/**
 * Fetch a specific route by ID.
 * @param {number} routeId - The ID of the route to fetch.
 * @returns {Promise<Object>} The route object.
 */
export const getRouteById = async (routeId) => {
    try {
        const response = await api.get(`/routes/${ routeId }`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching route with ID ${ routeId }:`, error.message);
        throw error;
    }
};

/**
 * Create a new route.
 * @param {Object} routeData - The data of the route to create.
 * @returns {Promise<Object>} The created route object.
 */
export const createRoute = async (routeData) => {
    try {
        const response = await api.post('/routes', routeData);
        return response.data;
    } catch (error) {
        console.error('Error creating route:', error.message);
        throw error;
    }
};

/**
 * Update an existing route.
 * @param {number} routeId - The ID of the route to update.
 * @param {Object} routeData - The updated data of the route.
 * @returns {Promise<Object>} The updated route object.
 */
export const updateRoute = async (routeId, routeData) => {
    try {
        const response = await api.put(`/routes/${ routeId }`, routeData);
        return response.data;
    } catch (error) {
        console.error(`Error updating route with ID ${ routeId }:`, error.message);
        throw error;
    }
};

/**
 * Delete a route.
 * @param {number} routeId - The ID of the route to delete.
 * @returns {Promise<void>}
 */
export const deleteRoute = async (routeId) => {
    try {
        await api.delete(`/routes/${ routeId }`);
    } catch (error) {
        console.error(`Error deleting route with ID ${ routeId }:`, error.message);
        throw error;
    }
};
