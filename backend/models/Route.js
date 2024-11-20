// models/Route.js
const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');
const Matatu = require('./Matatu');

const Route = sequelize.define('Route', {
    route_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    route_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    fare: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: {
            isDecimal: true,
            min: 0,
        },
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    tableName: 'routes',
    timestamps: false,
});

module.exports = Route;
