'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Status extends Model {
    static associate(models) {
      Status.hasMany(models.Student, { foreignKey: 'statusId' });
    }
  }
  Status.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'Status',
    tableName: 'Statuses'
  });
  return Status;
};