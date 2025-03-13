const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Thread = sequelize.define('Thread', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likeCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});

module.exports = Thread;