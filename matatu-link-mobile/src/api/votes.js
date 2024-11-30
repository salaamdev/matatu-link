// src/api/votes.js

import api from './config';

/**
 * Cast a vote on a contribution.
 * @param {Object} voteData - The data for the vote (contribution_id, vote_type).
 * @returns {Promise<Object>} The updated vote object.
 */
export const castVote = async (voteData) => {
    try {
        const response = await api.post('/votes', voteData);
        return response.data;
    } catch (error) {
        console.error('Error casting vote:', error.message);
        throw error;
    }
};

/**
 * Get votes for a specific contribution.
 * @param {number} contributionId - The ID of the contribution.
 * @returns {Promise<Object>} An object containing vote counts.
 */
export const getVotesForContribution = async (contributionId) => {
    try {
        const response = await api.get(`/votes/contribution/${ contributionId }`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching votes for contribution ${ contributionId }:`, error.message);
        throw error;
    }
};
