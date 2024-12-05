const express = require('express');
const router = express.Router();
const matatuController = require('../controllers/matatuController');
const authMiddleware = require('../middlewares/authMiddleware');
const rbacMiddleware = require('../middlewares/rbacMiddleware');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// GET /api/matatus - Retrieve all matatus
router.get('/', matatuController.getAllMatatus);

// GET /api/matatus/:id - Retrieve a specific matatu by ID
router.get('/:id', matatuController.getMatatuById);

// POST /api/matatus - Create a new matatu (restricted to operators and admins)
router.post('/', rbacMiddleware([1]), matatuController.createMatatu);

// PUT /api/matatus/:id - Update an existing matatu (restricted to operators and admins)
router.put('/:id', rbacMiddleware([1]), matatuController.updateMatatu);

// DELETE /api/matatus/:id - Delete a matatu (restricted to admins)
router.delete('/:id', rbacMiddleware([1]), matatuController.deleteMatatu);

module.exports = router;
