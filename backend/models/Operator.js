// Operator.js
const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Operator = sequelize.define('Operator', {
    operator_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    contact_info: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    tableName: 'operators',
    timestamps: false,
});

module.exports = Operator;