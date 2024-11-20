const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');
const authMiddleware = require('../middlewares/authMiddleware');
const rbacMiddleware = require('../middlewares/rbacMiddleware');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// GET /api/routes - Retrieve all routes
router.get('/', routeController.getAllRoutes);

// GET /api/routes/:id - Retrieve a specific route by ID
router.get('/:id', routeController.getRouteById);

// POST /api/routes - Create a new route (restricted to admins)
router.post('/', rbacMiddleware([1]), routeController.createRoute);

// PUT /api/routes/:id - Update an existing route (restricted to admins)
router.put('/:id', rbacMiddleware([1]), routeController.updateRoute);

// DELETE /api/routes/:id - Delete a route (restricted to admins)
router.delete('/:id', rbacMiddleware([1]), routeController.deleteRoute);

module.exports = router;
