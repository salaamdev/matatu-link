// controllers/contributionController.js
const {Contribution, Vote, Route, Stop, Matatu, User} = require('../models');
const {validationResult} = require('express-validator');

// Create a new contribution
exports.createContribution = async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {contribution_type, content, route_id, stop_id, matatu_id} = req.body;
    const user_id = req.user.userId;

    try {
        // Validate foreign keys based on contribution_type
        if (contribution_type === 'route' && route_id) {
            const route = await Route.findByPk(route_id);
            if (!route) {
                return res.status(400).json({error: 'Invalid route_id'});
            }
        }
        if (contribution_type === 'stop' && stop_id) {
            const stop = await Stop.findByPk(stop_id);
            if (!stop) {
                return res.status(400).json({error: 'Invalid stop_id'});
            }
        }
        if (contribution_type === 'matatu' && matatu_id) {
            const matatu = await Matatu.findByPk(matatu_id);
            if (!matatu) {
                return res.status(400).json({error: 'Invalid matatu_id'});
            }
        }

        const newContribution = await Contribution.create({
            user_id,
            contribution_type,
            content,
            route_id: contribution_type === 'route' ? route_id : null,
            stop_id: contribution_type === 'stop' ? stop_id : null,
            matatu_id: contribution_type === 'matatu' ? matatu_id : null,
        });

        res.status(201).json(newContribution);
    } catch (error) {
        console.error('Error creating contribution:', error);
        res.status(500).json({error: 'Failed to create contribution'});
    }
};

// Get all contributions
exports.getAllContributions = async (req, res) => {
    try {
        const contributions = await Contribution.findAll({
            include: [
                {model: User, as: 'contributingUser', attributes: ['user_id', 'username', 'email']},
                {model: Vote, as: 'votes', include: [{model: User, as: 'votingUser', attributes: ['user_id', 'username']}]},
            ],
            order: [['date_submitted', 'DESC']],
        });
        res.status(200).json(contributions);
    } catch (error) {
        console.error('Error fetching contributions:', error);
        res.status(500).json({error: 'Failed to fetch contributions'});
    }
};

// Get a single contribution by ID
exports.getContributionById = async (req, res) => {
    const {id} = req.params;

    if (!id || isNaN(id)) {
        return res.status(400).json({error: 'Invalid or missing contribution ID'});
    }

    try {
        const contribution = await Contribution.findByPk(id, {
            include: [
                {model: User, as: 'contributingUser', attributes: ['user_id', 'username', 'email']},
                {model: Vote, as: 'votes', include: [{model: User, as: 'votingUser', attributes: ['user_id', 'username']}]},
            ],
        });

        if (!contribution) {
            return res.status(404).json({error: 'Contribution not found'});
        }

        res.status(200).json(contribution);
    } catch (error) {
        console.error(`Error fetching contribution with ID ${ id }:`, error);
        res.status(500).json({error: 'Failed to fetch contribution'});
    }
};

// Update a contribution (only if pending)
exports.updateContribution = async (req, res) => {
    const {id} = req.params;
    const {contribution_type, content, route_id, stop_id, matatu_id} = req.body;

    if (!id || isNaN(id)) {
        return res.status(400).json({error: 'Invalid or missing contribution ID'});
    }

    try {
        const contribution = await Contribution.findByPk(id);
        if (!contribution) {
            return res.status(404).json({error: 'Contribution not found'});
        }

        if (contribution.status !== 'pending') {
            return res.status(400).json({error: 'Only pending contributions can be updated'});
        }

        // Validate foreign keys based on contribution_type
        if (contribution_type === 'route' && route_id) {
            const route = await Route.findByPk(route_id);
            if (!route) {
                return res.status(400).json({error: 'Invalid route_id'});
            }
        }
        if (contribution_type === 'stop' && stop_id) {
            const stop = await Stop.findByPk(stop_id);
            if (!stop) {
                return res.status(400).json({error: 'Invalid stop_id'});
            }
        }
        if (contribution_type === 'matatu' && matatu_id) {
            const matatu = await Matatu.findByPk(matatu_id);
            if (!matatu) {
                return res.status(400).json({error: 'Invalid matatu_id'});
            }
        }

        await contribution.update({
            contribution_type: contribution_type || contribution.contribution_type,
            content: content || contribution.content,
            route_id: contribution_type === 'route' ? route_id : null,
            stop_id: contribution_type === 'stop' ? stop_id : null,
            matatu_id: contribution_type === 'matatu' ? matatu_id : null,
        });

        res.status(200).json(contribution);
    } catch (error) {
        console.error(`Error updating contribution with ID ${ id }:`, error);
        res.status(500).json({error: 'Failed to update contribution'});
    }
};

// Delete a contribution (only if pending or rejected)
exports.deleteContribution = async (req, res) => {
    const {id} = req.params;

    if (!id || isNaN(id)) {
        return res.status(400).json({error: 'Invalid or missing contribution ID'});
    }

    try {
        const contribution = await Contribution.findByPk(id);
        if (!contribution) {
            return res.status(404).json({error: 'Contribution not found'});
        }

        if (contribution.status === 'approved') {
            return res.status(400).json({error: 'Approved contributions cannot be deleted'});
        }

        await contribution.destroy();
        res.status(204).send();
    } catch (error) {
        console.error(`Error deleting contribution with ID ${ id }:`, error);
        res.status(500).json({error: 'Failed to delete contribution'});
    }
};
