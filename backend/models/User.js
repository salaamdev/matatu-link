const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    username: {type: DataTypes.STRING, unique: true, allowNull: false},
    email: {type: DataTypes.STRING, unique: true, allowNull: false},
    passwordHash: {type: DataTypes.STRING, allowNull: false},
    roleId: {type: DataTypes.INTEGER},
    isActive: {type: DataTypes.BOOLEAN, defaultValue: true},
}, {timestamps: true});

module.exports = User;
