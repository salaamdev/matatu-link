const {Stop} = require('../models');

exports.getAllStops = async (req, res) => {
    try {
        const stops = await Stop.findAll();
        res.status(200).json(stops);
    } catch (error) {
        console.error('Error fetching stops:', error);
        res.status(500).json({error: 'Failed to fetch stops'});
    }
};

exports.getStopById = async (req, res) => {
    const {id} = req.params;
    if (!id || isNaN(id)) {
        return res.status(400).json({error: 'Invalid or missing stop ID'});
    }

    try {
        const stop = await Stop.findByPk(id);
        if (stop) {
            res.status(200).json(stop);
        } else {
            res.status(404).json({error: 'Stop not found'});
        }
    } catch (error) {
        console.error(`Error fetching stop with ID ${ id }:`, error);
        res.status(500).json({error: 'Failed to fetch stop'});
    }
};

exports.createStop = async (req, res) => {
    const {stop_name, latitude, longitude, description} = req.body;

    if (!stop_name) {
        return res.status(400).json({error: 'Stop name is required'});
    }

    try {
        const newStop = await Stop.create({stop_name, latitude, longitude, description});
        res.status(201).json(newStop);
    } catch (error) {
        console.error('Error creating stop:', error);
        res.status(500).json({error: 'Failed to create stop'});
    }
};

exports.updateStop = async (req, res) => {
    const {id} = req.params;
    if (!id || isNaN(id)) {
        return res.status(400).json({error: 'Invalid or missing stop ID'});
    }

    try {
        const stop = await Stop.findByPk(id);
        if (stop) {
            await stop.update(req.body);
            res.status(200).json(stop);
        } else {
            res.status(404).json({error: 'Stop not found'});
        }
    } catch (error) {
        console.error(`Error updating stop with ID ${ id }:`, error);
        res.status(500).json({error: 'Failed to update stop'});
    }
};

exports.deleteStop = async (req, res) => {
    const {id} = req.params;
    if (!id || isNaN(id)) {
        return res.status(400).json({error: 'Invalid or missing stop ID'});
    }

    try {
        const stop = await Stop.findByPk(id);
        if (stop) {
            await stop.destroy();
            res.status(204).send();
        } else {
            res.status(404).json({error: 'Stop not found'});
        }
    } catch (error) {
        console.error(`Error deleting stop with ID ${ id }:`, error);
        res.status(500).json({error: 'Failed to delete stop'});
    }
};
