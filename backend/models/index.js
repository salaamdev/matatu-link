// backend/models/index.js
const Matatu = require('./Matatu');
const Route = require('./Route');
const Stop = require('./Stop');
const Operator = require('./Operator');

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

module.exports = {
    Matatu,
    Route,
    Stop,
    Operator,
};
