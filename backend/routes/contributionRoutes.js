// routes/contributionRoutes.js
const express = require('express');
const router = express.Router();
const contributionController = require('../controllers/contributionController');
const authMiddleware = require('../middlewares/authMiddleware');
const rbacMiddleware = require('../middlewares/rbacMiddleware');
const {body} = require('express-validator');
const {Contribution, Route, Stop, Matatu} = require('../models'); // Add this line

// Apply authentication middleware to all routes
router.use(authMiddleware);

// POST /api/contributions - Create a new contribution
router.post('/', [
    body('contribution_type')
        .isIn(['route', 'stop', 'matatu'])
        .withMessage('Invalid contribution type'),
    body('content')
        .notEmpty()
        .withMessage('Content is required'),
    body('route_id')
        .optional({nullable: true})
        .isInt()
        .withMessage('route_id must be an integer'),
    body('stop_id')
        .optional({nullable: true})
        .isInt()
        .withMessage('stop_id must be an integer'),
    body('matatu_id')
        .optional({nullable: true})
        .isInt()
        .withMessage('matatu_id must be an integer')
], contributionController.createContribution);

// GET /api/contributions - Retrieve all contributions
router.get('/', contributionController.getAllContributions);

// GET /api/contributions/:id - Retrieve a specific contribution by ID
router.get('/:id', contributionController.getContributionById);

// PUT /api/contributions/:id - Update a contribution (only if pending)
router.put('/:id', [
    body('contribution_type').optional().isIn(['route', 'stop', 'matatu']).withMessage('Invalid contribution type'),
    body('content').optional().notEmpty().withMessage('Content cannot be empty'),
    body('route_id').optional().isInt().withMessage('route_id must be an integer'),
    body('stop_id').optional().isInt().withMessage('stop_id must be an integer'),
    body('matatu_id').optional().isInt().withMessage('matatu_id must be an integer'),
], contributionController.updateContribution);

// DELETE /api/contributions/:id - Delete a contribution (only if pending or rejected)
router.delete('/:id', contributionController.deleteContribution);

// POST /api/contributions/:id/approve - Approve a contribution (admin only)
router.post('/:id/approve', rbacMiddleware([1]), async (req, res) => {
    const {id} = req.params;

    try {
        const contribution = await Contribution.findByPk(id);
        if (!contribution) {
            return res.status(404).json({error: 'Contribution not found'});
        }

        if (contribution.status !== 'pending') {
            return res.status(400).json({error: 'Only pending contributions can be approved'});
        }

        // Update contribution status
        contribution.status = 'approved';
        await contribution.save();

        // Apply contribution based on type
        if (contribution.contribution_type === 'route') {
            await Route.create({
                route_name: contribution.content,
                // Additional fields can be parsed from content if structured
            });
        } else if (contribution.contribution_type === 'stop') {
            await Stop.create({
                stop_name: contribution.content,
                // Additional fields can be parsed from content if structured
            });
        } else if (contribution.contribution_type === 'matatu') {
            await Matatu.create({
                registration_number: contribution.content,
                // Additional fields can be parsed from content if structured
            });
        }

        res.status(200).json({message: 'Contribution approved and applied'});
    } catch (error) {
        console.error('Error approving contribution:', error);
        res.status(500).json({error: 'Failed to approve contribution'});
    }
});

// POST /api/contributions/:id/reject - Reject a contribution (admin only)
router.post('/:id/reject', rbacMiddleware([1]), async (req, res) => {
    const {id} = req.params;

    try {
        const contribution = await Contribution.findByPk(id);
        if (!contribution) {
            return res.status(404).json({error: 'Contribution not found'});
        }

        if (contribution.status !== 'pending') {
            return res.status(400).json({error: 'Only pending contributions can be rejected'});
        }

        // Update contribution status
        contribution.status = 'rejected';
        await contribution.save();

        res.status(200).json({message: 'Contribution rejected'});
    } catch (error) {
        console.error('Error rejecting contribution:', error);
        res.status(500).json({error: 'Failed to reject contribution'});
    }
});

module.exports = router;
