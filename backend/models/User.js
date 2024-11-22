// backend/models/User.js
const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false
    },
    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    phone_number: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    date_joined: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    role_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'user_roles',
            key: 'role_id'
        }
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'users',
    timestamps: false,
    underscored: true // This will make Sequelize use snake_case for column names
});

module.exports = User;