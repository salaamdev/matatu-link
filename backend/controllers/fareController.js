// controllers/fareController.js
const {Fare, User, Matatu, Route} = require('../models');
const {validationResult} = require('express-validator');

// Create a new fare
exports.createFare = async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {matatu_id, route_id, amount, payment_method, transaction_reference} = req.body;
    const user_id = req.user.userId;

    try {
        // Validate matatu_id and route_id
        if (matatu_id) {
            const matatu = await Matatu.findByPk(matatu_id);
            if (!matatu) {
                return res.status(400).json({error: 'Invalid matatu_id'});
            }
        }

        if (route_id) {
            const route = await Route.findByPk(route_id);
            if (!route) {
                return res.status(400).json({error: 'Invalid route_id'});
            }
        }

        const newFare = await Fare.create({
            user_id,
            matatu_id: matatu_id || null,
            route_id: route_id || null,
            amount,
            payment_method,
            transaction_reference: transaction_reference || null,
        });

        res.status(201).json(newFare);
    } catch (error) {
        console.error('Error creating fare:', error);
        res.status(500).json({error: 'Failed to create fare'});
    }
};

// Get fare transactions for a user
exports.getUserFares = async (req, res) => {
    const user_id = req.user.userId;

    try {
        const fares = await Fare.findAll({
            where: {user_id},
            include: [
                {model: Matatu, as: 'matatu', attributes: ['matatu_id', 'registration_number']},
                {model: Route, as: 'route', attributes: ['route_id', 'route_name']},
                {model: Payment, as: 'payments'},
            ],
            order: [['date_paid', 'DESC']],
        });

        res.status(200).json(fares);
    } catch (error) {
        console.error('Error fetching fares:', error);
        res.status(500).json({error: 'Failed to fetch fares'});
    }
};

// Get all fares (admin only)
exports.getAllFares = async (req, res) => {
    try {
        const fares = await Fare.findAll({
            include: [
                {model: User, as: 'user', attributes: ['user_id', 'username', 'email']},
                {model: Matatu, as: 'matatu', attributes: ['matatu_id', 'registration_number']},
                {model: Route, as: 'route', attributes: ['route_id', 'route_name']},
                {model: Payment, as: 'payments'},
            ],
            order: [['date_paid', 'DESC']],
        });

        res.status(200).json(fares);
    } catch (error) {
        console.error('Error fetching all fares:', error);
        res.status(500).json({error: 'Failed to fetch fares'});
    }
};
