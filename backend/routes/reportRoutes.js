// routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middlewares/authMiddleware');
const rbacMiddleware = require('../middlewares/rbacMiddleware');
const {body} = require('express-validator');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// POST /api/reports - Submit a new report
router.post('/', [
    body('report_type').isIn(['safety', 'security', 'other']).withMessage('Invalid report type'),
    body('description').notEmpty().withMessage('Description is required'),
    body('matatu_id').optional().isInt().withMessage('matatu_id must be an integer'),
    body('route_id').optional().isInt().withMessage('route_id must be an integer'),
], reportController.submitReport);

// GET /api/reports - Retrieve all reports (admin only)
router.get('/', rbacMiddleware([1]), reportController.getAllReports);

// PUT /api/reports/:id/status - Update report status (admin only)
router.put('/:id/status', [
    body('status').isIn(['pending', 'reviewed', 'resolved']).withMessage('Invalid status value'),
], rbacMiddleware([1]), reportController.updateReportStatus);

module.exports = router;
