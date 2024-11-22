// models/Report.js
const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Matatu = require('./Matatu');
const Route = require('./Route');

const Report = sequelize.define('Report', {
    report_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'report_id'
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'user_id'
        }
    },
    matatu_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'matatus',
            key: 'matatu_id'
        }
    },
    route_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'routes',
            key: 'route_id'
        }
    },
    report_type: {
        type: DataTypes.ENUM('safety', 'security', 'other'),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    date_reported: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    status: {
        type: DataTypes.ENUM('pending', 'reviewed', 'resolved'),
        defaultValue: 'pending'
    }
}, {
    tableName: 'reports',
    timestamps: false
});

// Add associations
Report.belongsTo(User, {foreignKey: 'user_id', as: 'user'});
Report.belongsTo(Matatu, {foreignKey: 'matatu_id', as: 'matatu'});
Report.belongsTo(Route, {foreignKey: 'route_id', as: 'route'});

module.exports = Report;