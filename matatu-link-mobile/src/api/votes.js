// matatu-link-mobile/src/api/votes.js

import api from './config';

/**
 * Cast a vote on a contribution.
 * @param {Object} voteData - The data for the vote (contribution_id, vote_type).
 * @returns {Promise<Object>} The updated vote object.
 */
export const castVote = async (voteData) => {
    try {
        // Validate the vote data before sending
        if (!voteData.contribution_id || !voteData.vote_type) {
            throw new Error('Missing required vote data');
        }

        // Ensure proper data types
        const payload = {
            contribution_id: parseInt(voteData.contribution_id, 10),
            vote_type: voteData.vote_type
        };

        const response = await api.post('/votes', payload);
        return response.data;
    } catch (error) {
        console.error('Error casting vote:', error);
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