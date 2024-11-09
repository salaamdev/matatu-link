const {Sequelize} = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: console.log, // Turn off logging in production
});

module.exports = sequelize;
