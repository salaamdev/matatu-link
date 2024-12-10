// backend/controllers/userController.js

const {User, Contribution, Report} = require('../models');
const {Op} = require('sequelize');

/**
 * Get user activity statistics.
 * @param {Object} req 
 * @param {Object} res 
 */
exports.getUserActivityStats = async (req, res) => {
    try {
        const totalUsers = await User.count();
        const activeUsers = await User.count({where: {isActive: true}});
        const newRegistrations = await User.count({
            where: {
                createdAt: {
                    [Op.gte]: new Date(new Date().setDate(new Date().getDate() - 30)) // Last 30 days
                }
            }
        });
        const totalContributions = await Contribution.count();
        const totalReports = await Report.count();

        // Example calculation for average daily activity
        const activityData = await Contribution.findAll({
            attributes: [
                [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['date']
        });
        const avgDailyActivity = activityData.length > 0
            ? Math.round(activityData.reduce((acc, curr) => acc + parseInt(curr.dataValues.count), 0) / activityData.length)
            : 0;

        res.status(200).json({
            totalUsers,
            activeUsers,
            newRegistrations,
            totalContributions,
            totalReports,
            avgDailyActivity
        });
    } catch (error) {
        console.error('Error fetching user activity stats:', error);
        res.status(500).json({error: 'Failed to fetch user activity stats'});
    }
};