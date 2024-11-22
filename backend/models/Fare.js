// models/Fare.js
const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Matatu = require('./Matatu');
const Route = require('./Route');

const Fare = sequelize.define('Fare', {
    fare_id: {
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
    matatu_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'matatus',
            key: 'matatu_id',
        },
    },
    route_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'routes',
            key: 'route_id',
        },
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            isDecimal: true,
            min: 0,
        },
    },
    payment_method: {
        type: DataTypes.ENUM('cash', 'M-Pesa', 'card'),
        allowNull: false,
    },
    date_paid: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    transaction_reference: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
}, {
    tableName: 'fares',
    timestamps: false,
});

Fare.belongsTo(User, {foreignKey: 'user_id', as: 'user'});
Fare.belongsTo(Matatu, {foreignKey: 'matatu_id', as: 'matatu'});
Fare.belongsTo(Route, {foreignKey: 'route_id', as: 'route'});

module.exports = Fare;
