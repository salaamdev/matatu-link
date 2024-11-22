// models/index.js
const Matatu = require('./Matatu');
const Route = require('./Route');
const Stop = require('./Stop');
const Operator = require('./Operator');
const UserRole = require('./UserRole');
const User = require('./User');
const MatatuLocation = require('./MatatuLocation');

Matatu.belongsTo(Route, {
    foreignKey: 'route_id',
    as: 'route',
});

Route.hasMany(Matatu, {
    foreignKey: 'route_id',
    as: 'matatus',
});

// Define many-to-many between Route and Stop
Route.belongsToMany(Stop, {
    through: 'RouteStops',
    foreignKey: 'route_id',
    otherKey: 'stop_id',
    as: 'stops',
});

Stop.belongsToMany(Route, {
    through: 'RouteStops',
    foreignKey: 'stop_id',
    otherKey: 'route_id',
    as: 'routes',
});

// User and UserRole associations
User.belongsTo(UserRole, {
    foreignKey: 'role_id',
    as: 'role'
});

UserRole.hasMany(User, {
    foreignKey: 'role_id',
    as: 'users'
});

// Matatu and MatatuLocation associations
Matatu.hasMany(MatatuLocation, {
    foreignKey: 'matatu_id',
    as: 'locations'
});

MatatuLocation.belongsTo(Matatu, {
    foreignKey: 'matatu_id',
    as: 'matatu'
});

module.exports = {
    Matatu,
    Route,
    Stop,
    Operator,
    UserRole,
    MatatuLocation,
    User
};
