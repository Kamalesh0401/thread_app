const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Reply = sequelize.define('Reply', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

module.exports = Reply;