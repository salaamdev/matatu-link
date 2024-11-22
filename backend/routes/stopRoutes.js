const express = require('express');
const router = express.Router();
const stopController = require('../controllers/stopController');
const authMiddleware = require('../middlewares/authMiddleware');
const rbacMiddleware = require('../middlewares/rbacMiddleware');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// GET /api/stops - Retrieve all stops
router.get('/', stopController.getAllStops);

// GET /api/stops/:id - Retrieve a specific stop by ID
router.get('/:id', stopController.getStopById);

// POST /api/stops - Create a new stop (restricted to admins)
router.post('/', rbacMiddleware([1]), stopController.createStop);

// PUT /api/stops/:id - Update an existing stop (restricted to admins)
router.put('/:id', rbacMiddleware([1]), stopController.updateStop);

// DELETE /api/stops/:id - Delete a stop (restricted to admins)
router.delete('/:id', rbacMiddleware([1]), stopController.deleteStop);

module.exports = router;
