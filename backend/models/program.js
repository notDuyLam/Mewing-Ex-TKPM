'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Program extends Model {
    static associate(models) {
      Program.hasMany(models.Student, { foreignKey: 'programId' });
    }
  }
  Program.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'Program',
    tableName: 'Programs'
  });
  return Program;
};