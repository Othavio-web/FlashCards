const { DataTypes } = require('sequelize');
const { sequelize } = require('./banco');

// 📝 MODELO DE CARD
const Card = sequelize.define('Card', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    trim: true
  },
  front: {
    type: DataTypes.TEXT,
    allowNull: false,
    trim: true
  },
  back: {
    type: DataTypes.TEXT,
    allowNull: false,
    trim: true
  }
}, {
  timestamps: true,
  underscored: true
});

module.exports = Card;

