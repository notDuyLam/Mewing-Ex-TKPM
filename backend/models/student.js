const sequelize = require('../config/database');
const { DataTypes } = require("sequelize");

// Define Student model
const Student = sequelize.define("Student", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dob: DataTypes.DATE,
    gender: DataTypes.STRING,
    faculty: DataTypes.STRING,
    schoolYear: DataTypes.INTEGER,
    status: DataTypes.STRING,
    program: DataTypes.STRING,
    address: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING
});

module.exports = {
    sequelize,
    Student
};