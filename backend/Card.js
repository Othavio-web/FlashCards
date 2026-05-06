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
  question: {
    type: DataTypes.TEXT,
    allowNull: false,
    trim: true
  },
  answer: {
    type: DataTypes.TEXT,
    allowNull: false,
    trim: true
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'updated_at'
  }
}, {
  timestamps: true,
  underscored: true
});

module.exports = Card;

