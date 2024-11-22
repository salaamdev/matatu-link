// controllers/reportController.js
const {Report} = require('../models');
const {validationResult} = require('express-validator');

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
exports.getAllReports = async (req, res) => {
    try {
        const reports = await Report.findAll({
            include: [
                {model: User, as: 'user', attributes: ['user_id', 'username', 'email']},
                {model: Matatu, as: 'matatu', attributes: ['matatu_id', 'registration_number']},
                {model: Route, as: 'route', attributes: ['route_id', 'route_name']},
            ],
            order: [['date_reported', 'DESC']],
        });
        res.status(200).json(reports);
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({error: 'Failed to fetch reports'});
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
