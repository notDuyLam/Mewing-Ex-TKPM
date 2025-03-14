const { Sequelize } = require("sequelize");
require("dotenv").config();
const sequelize = new Sequelize("TKPM", process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_URL,
    dialect: "postgres",
    logging: false
});

module.exports = sequelize;