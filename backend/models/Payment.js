// models/Payment.js
const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');
const Fare = require('./Fare');

const Payment = sequelize.define('Payment', {
    payment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    fare_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'fares',
            key: 'fare_id',
        },
        onDelete: 'CASCADE',
    },
    payment_status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed'),
        defaultValue: 'pending',
    },
    date_initiated: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    date_completed: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    error_message: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
}, {
    tableName: 'payments',
    timestamps: false,
});

Payment.belongsTo(Fare, {foreignKey: 'fare_id', as: 'fare'});

module.exports = Payment;
