// backend/controllers/userController.js

const { User, UserRole, Contribution, Report } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database'); // Ensure sequelize is properly imported

/**
 * Get user activity statistics.
 * @param {Object} req 
 * @param {Object} res 
 */
exports.getUserActivityStats = async (req, res) => {
    try {
        const stats = await User.findAll({
            include: [
                {
                    model: UserRole,
                    as: 'userRole',
                    attributes: ['role_name']
                },
                {
                    model: Contribution,
                    as: 'userContributions'
                },
                {
                    model: Report,
                    as: 'userReports'
                }
            ]
        });

        res.status(200).json(stats);
    } catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({ error: 'Failed to fetch user statistics' });
    }
};
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['user_id', 'username', 'email', 'date_joined', 'is_active', 'role_id'],
            include: [
                {
                    model: UserRole,
                    as: 'userRole',
                    attributes: ['role_name']
                },
                {
                    model: Contribution,
                    as: 'userContributions',
                    attributes: ['contribution_id']
                },
                {
                    model: Report,
                    as: 'userReports',
                    attributes: ['report_id']
                }
            ]
        });

        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};