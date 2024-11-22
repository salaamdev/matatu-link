// backend/models/index.js
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

// Route has many Matatus
Route.hasMany(Matatu, {
    foreignKey: 'route_id',
    as: 'matatus',
});

// Route belongs to many Stops through RouteStops
Route.belongsToMany(Stop, {
    through: 'RouteStops',
    foreignKey: 'route_id',
    otherKey: 'stop_id',
    as: 'stops',
});

// Stop belongs to many Routes through RouteStops
Stop.belongsToMany(Route, {
    through: 'RouteStops',
    foreignKey: 'stop_id',
    otherKey: 'route_id',
    as: 'routes',
});


// User Role relationships
User.belongsTo(UserRole, {
    foreignKey: 'role_id',
    as: 'role'
});

UserRole.hasMany(User, {
    foreignKey: 'role_id',
    as: 'users'
});

// Matatu Location relationships
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