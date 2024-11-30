// models/index.js
const Matatu = require('./Matatu');
const Route = require('./Route');
const Stop = require('./Stop');
const Operator = require('./Operator');
const UserRole = require('./UserRole');
const User = require('./User');
const MatatuLocation = require('./MatatuLocation');
const Contribution = require('./Contribution');
const Vote = require('./Vote');
const Report = require('./Report');
const Notification = require('./Notification');
const Fare = require('./Fare');
const Payment = require('./Payment');

// Matatu and Route Associations
Matatu.belongsTo(Route, {
    foreignKey: 'route_id',
    as: 'matatuRoute', // Unique alias
});

Route.hasMany(Matatu, {
    foreignKey: 'route_id',
    as: 'routeMatatus',
});

// Route and Stop (Many-to-Many) Associations
Route.belongsToMany(Stop, {
    through: 'RouteStops',
    foreignKey: 'route_id',
    otherKey: 'stop_id',
    as: 'connectedStops',
});

Stop.belongsToMany(Route, {
    through: 'RouteStops',
    foreignKey: 'stop_id',
    otherKey: 'route_id',
    as: 'stopRoutes',
});

// User and UserRole Associations
User.belongsTo(UserRole, {
    foreignKey: 'role_id',
    as: 'userRole',
});

UserRole.hasMany(User, {
    foreignKey: 'role_id',
    as: 'roleUsers',
});

// Matatu and MatatuLocation Associations
Matatu.hasMany(MatatuLocation, {
    foreignKey: 'matatu_id',
    as: 'matatuLocations',
});

MatatuLocation.belongsTo(Matatu, {
    foreignKey: 'matatu_id',
    as: 'locationMatatu',
});

// Contribution and User Associations
Contribution.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'contributorUser', // Unique alias
});
User.hasMany(Contribution, {
    foreignKey: 'user_id',
    as: 'userContributions',
});

// Vote and Contribution Associations
Vote.belongsTo(Contribution, {
    foreignKey: 'contribution_id',
    as: 'voteContribution',
});
Contribution.hasMany(Vote, {
    foreignKey: 'contribution_id',
    as: 'contributionVotes',
});

// Vote and User Associations
Vote.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'votingUser',
});
User.hasMany(Vote, {
    foreignKey: 'user_id',
    as: 'userVotes',
});

// Report Associations
Report.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'reportUser',
});
Report.belongsTo(Matatu, {
    foreignKey: 'matatu_id',
    as: 'reportMatatu',
});
Report.belongsTo(Route, {
    foreignKey: 'route_id',
    as: 'reportRoute',
});
User.hasMany(Report, {
    foreignKey: 'user_id',
    as: 'userReports',
});

// Notification Associations
Notification.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'notificationUser',
});
User.hasMany(Notification, {
    foreignKey: 'user_id',
    as: 'userNotifications',
});

// Fare and User Associations
Fare.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'fareUser',
});
User.hasMany(Fare, {
    foreignKey: 'user_id',
    as: 'userFares',
});

// Fare and Matatu Associations
Fare.belongsTo(Matatu, {
    foreignKey: 'matatu_id',
    as: 'fareMatatu',
});
Matatu.hasMany(Fare, {
    foreignKey: 'matatu_id',
    as: 'matatuFares',
});

// Fare and Route Associations
Fare.belongsTo(Route, {
    foreignKey: 'route_id',
    as: 'fareRoute',
});
Route.hasMany(Fare, {
    foreignKey: 'route_id',
    as: 'routeFares',
});

// Payment and Fare Associations
Payment.belongsTo(Fare, {
    foreignKey: 'fare_id',
    as: 'paymentFare',
});
Fare.hasMany(Payment, {
    foreignKey: 'fare_id',
    as: 'farePayments',
});

// Matatu and Operator Associations
Matatu.belongsTo(Operator, {
    foreignKey: 'operator_id',
    as: 'matatu_operator',
});

Operator.hasMany(Matatu, {
    foreignKey: 'operator_id',
    as: 'operatorMatatus',
});

module.exports = {
    Matatu,
    Route,
    Stop,
    Operator,
    UserRole,
    User,
    MatatuLocation,
    Contribution,
    Vote,
    Report,
    Notification,
    Fare,
    Payment,
};
