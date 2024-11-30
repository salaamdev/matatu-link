// src/api/profile.js

import api from './config';

/**
 * Update user profile information.
 * @param {Object} profileData - The updated profile data.
 * @returns {Promise<Object>} The updated user object.
 */
export const updateUserProfile = async (profileData) => {
  try {
    const response = await api.put('/profile', profileData); // Ensure this endpoint exists
    return response.data; // Assuming the backend returns the updated user object
  } catch (error) {
    console.error('Error updating user profile:', error.message);
    throw error;
  }
};
