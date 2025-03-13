const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Like = sequelize.define('Like', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['thread', 'reply']]
    }
  },
  itemId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Like;