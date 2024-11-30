const {Matatu, Route, Operator} = require('../models');

exports.getAllMatatus = async (req, res) => {
    try {
        // backend/controllers/matatuController.js
        const matatus = await Matatu.findAll({
            include: [
                {
                    model: Route,
                    as: 'matatuRoute', // Updated alias
                    attributes: ['route_id', 'route_name', 'description'],
                },
                {
                    model: Operator,
                    as: 'matatu_operator',
                    attributes: ['operator_id', 'name']
                }
            ]
        });
        res.status(200).json(matatus);
    } catch (error) {
        console.error('Error fetching matatus:', error);
        res.status(500).json({error: 'Failed to fetch matatus'});
    }
};

// backend/controllers/matatuController.js

exports.getMatatuById = async (req, res) => {
    const {id} = req.params;
    if (!id || isNaN(id)) {
        return res.status(400).json({error: 'Invalid or missing matatu ID'});
    }

    try {
        const matatu = await Matatu.findByPk(id, {
            include: [
                {
                    model: Route,
                    as: 'matatuRoute',
                    attributes: ['route_id', 'route_name', 'description', 'fare', 'is_active']
                },
                {
                    model: Operator,
                    as: 'matatu_operator',
                    attributes: ['operator_id', 'name', 'contact_info', 'address'] // Removed license_number
                }
            ]
        });
        if (matatu) {
            res.status(200).json(matatu);
        } else {
            res.status(404).json({error: 'Matatu not found'});
        }
    } catch (error) {
        console.error(`Error fetching matatu with ID ${ id }:`, error);
        res.status(500).json({error: 'Failed to fetch matatu'});
    }
};

exports.createMatatu = async (req, res) => {
    const {registration_number, route_id, capacity, model, make, year} = req.body;

    if (!registration_number) {
        return res.status(400).json({error: 'Registration number is required'});
    }

    try {
        // Check if route exists
        if (route_id) {
            const route = await Route.findByPk(route_id);
            if (!route) {
                return res.status(400).json({error: 'Invalid route_id - route does not exist'});
            }
        }

        const newMatatu = await Matatu.create({
            registration_number,
            route_id,
            capacity,
            model,
            make,
            year,
        });
        res.status(201).json(newMatatu);
    } catch (error) {
        console.error('Error creating matatu:', error);
        res.status(500).json({error: 'Failed to create matatu'});
    }
};

exports.updateMatatu = async (req, res) => {
    const {id} = req.params;
    if (!id || isNaN(id)) {
        return res.status(400).json({error: 'Invalid or missing matatu ID'});
    }

    try {
        const matatu = await Matatu.findByPk(id);
        if (matatu) {
            await matatu.update(req.body);
            res.status(200).json(matatu);
        } else {
            res.status(404).json({error: 'Matatu not found'});
        }
    } catch (error) {
        console.error(`Error updating matatu with ID ${ id }:`, error);
        res.status(500).json({error: 'Failed to update matatu'});
    }
};

exports.deleteMatatu = async (req, res) => {
    const {id} = req.params;
    if (!id || isNaN(id)) {
        return res.status(400).json({error: 'Invalid or missing matatu ID'});
    }

    try {
        const matatu = await Matatu.findByPk(id);
        if (matatu) {
            await matatu.destroy();
            res.status(204).send();
        } else {
            res.status(404).json({error: 'Matatu not found'});
        }
    } catch (error) {
        console.error(`Error deleting matatu with ID ${ id }:`, error);
        res.status(500).json({error: 'Failed to delete matatu'});
    }
};
