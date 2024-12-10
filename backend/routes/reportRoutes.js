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
router.put('/:id', [
    body('report_type').optional().isIn(['safety', 'security', 'other']).withMessage('Invalid report type'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty'),
    body('matatu_id').optional().isInt().withMessage('matatu_id must be an integer'),
    body('route_id').optional().isInt().withMessage('route_id must be an integer'),
], reportController.updateReport);

// GET /api/reports - Retrieve all reports (admin only)
router.get('/', rbacMiddleware([1]), reportController.getAllReports);

// PUT /api/reports/:id/status - Update report status (admin only)
router.put('/:id/status', [
    body('status').isIn(['pending', 'reviewed', 'resolved']).withMessage('Invalid status value'),
], rbacMiddleware([1]), reportController.updateReportStatus);
router.get('/:id', reportController.getReportById);

// Your existing routes...
router.get('/', reportController.getAllReports);
router.post('/', reportController.submitReport);
router.put('/:id/status', reportController.updateReportStatus);

module.exports = router;
