const {Route} = require('../models');

exports.getAllRoutes = async (req, res) => {
    try {
        const routes = await Route.findAll();
        res.status(200).json(routes);
    } catch (error) {
        console.error('Error fetching routes:', error);
        res.status(500).json({error: 'Failed to fetch routes'});
    }
};

exports.getRouteById = async (req, res) => {
    const {id} = req.params;
    if (!id || isNaN(id)) {
        return res.status(400).json({error: 'Invalid or missing route ID'});
    }

    try {
        const route = await Route.findByPk(id);
        if (route) {
            res.status(200).json(route);
        } else {
            res.status(404).json({error: 'Route not found'});
        }
    } catch (error) {
        console.error(`Error fetching route with ID ${ id }:`, error);
        res.status(500).json({error: 'Failed to fetch route'});
    }
};

exports.createRoute = async (req, res) => {
    const {route_name, description, fare, is_active} = req.body;

    if (!route_name) {
        return res.status(400).json({error: 'Route name is required'});
    }

    try {
        const newRoute = await Route.create({route_name, description, fare, is_active});
        res.status(201).json(newRoute);
    } catch (error) {
        console.error('Error creating route:', error);
        res.status(500).json({error: 'Failed to create route'});
    }
};

exports.updateRoute = async (req, res) => {
    const {id} = req.params;
    if (!id || isNaN(id)) {
        return res.status(400).json({error: 'Invalid or missing route ID'});
    }

    try {
        const route = await Route.findByPk(id);
        if (route) {
            await route.update(req.body);
            res.status(200).json(route);
        } else {
            res.status(404).json({error: 'Route not found'});
        }
    } catch (error) {
        console.error(`Error updating route with ID ${ id }:`, error);
        res.status(500).json({error: 'Failed to update route'});
    }
};

exports.deleteRoute = async (req, res) => {
    const {id} = req.params;
    if (!id || isNaN(id)) {
        return res.status(400).json({error: 'Invalid or missing route ID'});
    }

    try {
        const route = await Route.findByPk(id);
        if (route) {
            await route.destroy();
            res.status(204).send();
        } else {
            res.status(404).json({error: 'Route not found'});
        }
    } catch (error) {
        console.error(`Error deleting route with ID ${ id }:`, error);
        res.status(500).json({error: 'Failed to delete route'});
    }
};
