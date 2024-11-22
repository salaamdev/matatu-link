// models/Vote.js
const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Contribution = require('./Contribution');

const Vote = sequelize.define('Vote', {
    vote_id: {
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
    contribution_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'contributions',
            key: 'contribution_id',
        },
        onDelete: 'CASCADE',
    },
    vote_type: {
        type: DataTypes.ENUM('upvote', 'downvote'),
        allowNull: false,
    },
    date_voted: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'votes',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['user_id', 'contribution_id'],
        },
    ],
});

Vote.belongsTo(User, {foreignKey: 'user_id', as: 'user'});
Vote.belongsTo(Contribution, {foreignKey: 'contribution_id', as: 'contribution'});

module.exports = Vote;
