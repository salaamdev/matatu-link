// src/api/users.js
import api from './config';

export const getUserActivities = async () => {
    try {
        const response = await api.get('/users/activities');
        return response.data;
    } catch (error) {
        console.error('Error fetching user activities:', error);
        throw error;
    }
};