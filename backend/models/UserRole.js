const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const UserRole = sequelize.define('UserRole', {
    role_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    role_name: {
        type: DataTypes.STRING(20),
        allowNull: false
    }
}, {
    tableName: 'user_roles',
    timestamps: false
});

module.exports = UserRole;