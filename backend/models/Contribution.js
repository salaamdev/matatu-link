// models/Contribution.js
const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Route = require('./Route');
const Stop = require('./Stop');
const Matatu = require('./Matatu');

const Contribution = sequelize.define('Contribution', {
    contribution_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'user_id',
        },
        onDelete: 'CASCADE',
    },
    contribution_type: {
        type: DataTypes.ENUM('route', 'stop', 'matatu'),
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    date_submitted: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending',
    },
    route_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'routes',
            key: 'route_id',
        },
        allowNull: true,
    },
    stop_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'stops',
            key: 'stop_id',
        },
        allowNull: true,
    },
    matatu_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'matatus',
            key: 'matatu_id',
        },
        allowNull: true,
    },
}, {
    tableName: 'contributions',
    timestamps: false,
});

Contribution.belongsTo(User, {foreignKey: 'user_id', as: 'user'});

module.exports = Contribution;
