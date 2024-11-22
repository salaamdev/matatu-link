// routes/voteRoutes.js
const express = require('express');
const router = express.Router();
const voteController = require('../controllers/voteController');
const authMiddleware = require('../middlewares/authMiddleware');
const {body} = require('express-validator');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// POST /api/votes - Cast a vote
router.post('/', [
    body('contribution_id').isInt().withMessage('contribution_id must be an integer'),
    body('vote_type').isIn(['upvote', 'downvote']).withMessage('vote_type must be either upvote or downvote'),
], voteController.castVote);

// GET /api/votes/contribution/:contribution_id - Get votes for a contribution
router.get('/contribution/:contribution_id', voteController.getVotesForContribution);

module.exports = router;
