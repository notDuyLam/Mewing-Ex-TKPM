const { Sequelize } = require("sequelize");
require("dotenv").config();
const sequelize = new Sequelize("postgres", process.env.DB_USER, process.env.DB_PASSWORD, {
    host: "localhost",
    dialect: "postgres",
    logging: false
});

module.exports = sequelize;