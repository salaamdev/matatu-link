// controllers/voteController.js
const {Vote, Contribution} = require('../models');
const {validationResult} = require('express-validator');

// Cast a vote (upvote or downvote) on a contribution
exports.castVote = async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {contribution_id, vote_type} = req.body;
    const user_id = req.user.userId;

    try {
        // Check if contribution exists and is pending or approved
        const contribution = await Contribution.findByPk(contribution_id);
        if (!contribution) {
            return res.status(404).json({error: 'Contribution not found'});
        }

        // Prevent voting on rejected contributions
        if (contribution.status === 'rejected') {
            return res.status(400).json({error: 'Cannot vote on rejected contributions'});
        }

        // Check if user has already voted on this contribution
        const existingVote = await Vote.findOne({
            where: {user_id, contribution_id},
        });

        if (existingVote) {
            // If same vote type, remove the vote (toggle)
            if (existingVote.vote_type === vote_type) {
                await existingVote.destroy();
                return res.status(200).json({message: 'Vote removed'});
            } else {
                // Else, update the vote type
                existingVote.vote_type = vote_type;
                await existingVote.save();
                return res.status(200).json({message: 'Vote updated', vote: existingVote});
            }
        }

        // Create a new vote
        const newVote = await Vote.create({
            user_id,
            contribution_id,
            vote_type,
        });

        res.status(201).json(newVote);
    } catch (error) {
        console.error('Error casting vote:', error);
        res.status(500).json({error: 'Failed to cast vote'});
    }
};

// Get votes for a specific contribution
exports.getVotesForContribution = async (req, res) => {
    const {contribution_id} = req.params;

    if (!contribution_id || isNaN(contribution_id)) {
        return res.status(400).json({error: 'Invalid or missing contribution ID'});
    }

    try {
        const votes = await Vote.findAll({
            where: {contribution_id},
            include: [{model: User, as: 'votingUser', attributes: ['user_id', 'username']}],
        });

        res.status(200).json(votes);
    } catch (error) {
        console.error(`Error fetching votes for contribution ID ${ contribution_id }:`, error);
        res.status(500).json({error: 'Failed to fetch votes'});
    }
};
