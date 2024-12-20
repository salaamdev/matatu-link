// controllers/reportController.js
const {validationResult} = require('express-validator');
// backend/controllers/reportController.js
const {Report, User, Matatu, Route} = require('../models');

// backend/controllers/reportController.js
// backend/controllers/reportController.js
exports.getAllReports = async (req, res) => {
    try {
        const reports = await Report.findAll({
            include: [
                {
                    model: User,
                    as: 'reportUser', // Changed from 'user' to match model
                    attributes: ['user_id', 'username', 'email']
                },
                {
                    model: Matatu,
                    as: 'reportMatatu',
                    attributes: ['matatu_id', 'registration_number']
                },
                {
                    model: Route,
                    as: 'reportRoute',
                    attributes: ['route_id', 'route_name']
                }
            ],
            order: [['date_reported', 'DESC']]
        });
        return res.status(200).json(reports);
    } catch (error) {
        console.error('Error in getAllReports:', error);
        return res.status(500).json({error: error.message || 'Failed to fetch reports'});
    }
};
// Submit a new report
exports.submitReport = async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {matatu_id, route_id, report_type, description} = req.body;
    const user_id = req.user.userId;

    try {
        const newReport = await Report.create({
            user_id,
            matatu_id: matatu_id || null,
            route_id: route_id || null,
            report_type,
            description,
        });

        res.status(201).json(newReport);
    } catch (error) {
        console.error('Error submitting report:', error);
        res.status(500).json({error: 'Failed to submit report'});
    }
};

// Get all reports (admin only)
// backend/controllers/reportController.js
exports.getAllReports = async (req, res) => {
    try {
        const reports = await Report.findAll({
            include: [
                {
                    model: User,
                    as: 'reportUser', // Changed from 'user' to match model
                    attributes: ['user_id', 'username', 'email']
                },
                {
                    model: Matatu,
                    as: 'reportMatatu',
                    attributes: ['matatu_id', 'registration_number']
                },
                {
                    model: Route,
                    as: 'reportRoute',
                    attributes: ['route_id', 'route_name']
                }
            ],
            order: [['date_reported', 'DESC']]
        });
        return res.status(200).json(reports);
    } catch (error) {
        console.error('Error in getAllReports:', error);
        return res.status(500).json({error: error.message || 'Failed to fetch reports'});
    }
};

// Update report status (admin only)
exports.updateReportStatus = async (req, res) => {
    const {id} = req.params;
    const {status} = req.body;

    const validStatuses = ['pending', 'reviewed', 'resolved'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({error: 'Invalid status value'});
    }

    try {
        const report = await Report.findByPk(id);
        if (!report) {
            return res.status(404).json({error: 'Report not found'});
        }

        report.status = status;
        await report.save();

        res.status(200).json({message: 'Report status updated', report});
    } catch (error) {
        console.error(`Error updating report with ID ${ id }:`, error);
        res.status(500).json({error: 'Failed to update report status'});
    }
};

// backend/controllers/reportController.js

exports.getReportById = async (req, res) => {
    const { id } = req.params;
    
    try {
        const report = await Report.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'reportUser',
                    attributes: ['user_id', 'username', 'email']
                },
                {
                    model: Matatu,
                    as: 'reportMatatu',
                    attributes: ['matatu_id', 'registration_number']
                },
                {
                    model: Route,
                    as: 'reportRoute',
                    attributes: ['route_id', 'route_name']
                }
            ]
        });

        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }

        res.status(200).json(report);
    } catch (error) {
        console.error('Error fetching report:', error);
        res.status(500).json({ error: 'Failed to fetch report details' });
    }
};

// Add this method to handle report updates
exports.updateReport = async (req, res) => {
    const {id} = req.params;
    const {report_type, description, matatu_id, route_id} = req.body;

    if (!id || isNaN(id)) {
        return res.status(400).json({error: 'Invalid or missing report ID'});
    }

    try {
        const report = await Report.findByPk(id);
        if (!report) {
            return res.status(404).json({error: 'Report not found'});
        }

        await report.update({
            report_type: report_type || report.report_type,
            description: description || report.description,
            matatu_id: matatu_id || report.matatu_id,
            route_id: route_id || report.route_id
        });

        // Fetch updated report with associations
        const updatedReport = await Report.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'reportUser',
                    attributes: ['user_id', 'username', 'email']
                },
                {
                    model: Matatu,
                    as: 'reportMatatu',
                    attributes: ['matatu_id', 'registration_number']
                },
                {
                    model: Route,
                    as: 'reportRoute',
                    attributes: ['route_id', 'route_name']
                }
            ]
        });

        res.status(200).json(updatedReport);
    } catch (error) {
        console.error(`Error updating report with ID ${ id }:`, error);
        res.status(500).json({error: 'Failed to update report'});
    }
};