const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const MatatuLocation = sequelize.define('MatatuLocation', {
    location_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    matatu_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'matatus',
            key: 'matatu_id'
        }
    },
    latitude: {
        type: DataTypes.DECIMAL(10, 8),
        validate: {min: -90, max: 90}
    },
    longitude: {
        type: DataTypes.DECIMAL(11, 8),
        validate: {min: -180, max: 180}
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'matatu_locations',
    timestamps: false
});

module.exports = MatatuLocation;