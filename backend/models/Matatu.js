// models/Matatu.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Operator = require('./Operator');
const Route = require('./Route');

const Matatu = sequelize.define('Matatu', {
    matatu_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    operator_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    registration_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    capacity: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 1,
        },
    },
    route_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    current_status: {
        type: DataTypes.ENUM('active', 'inactive', 'maintenance'),
        defaultValue: 'active',
        allowNull: false,
    },
    model: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    make: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            isInt: true,
            min: 1900,
            max: new Date().getFullYear(),
        },
    },
}, {
    tableName: 'matatus',
    timestamps: false,
});

Matatu.belongsTo(Operator, {
    foreignKey: 'operator_id',
    as: 'operator'
});

module.exports = Matatu;
