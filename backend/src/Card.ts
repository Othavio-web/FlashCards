import { DataTypes, Model } from 'sequelize';
import { sequelize } from './banco';

// 📝 TIPOS E INTERFACE
export interface CardAttributes {
  id?: number;
  category: string;
  question: string;
  answer: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// 📝 CLASSE DO MODELO
export class Card extends Model<CardAttributes> implements CardAttributes {
  declare id: number;
  declare category: string;
  declare question: string;
  declare answer: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

// Inicializar modelo
Card.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: false
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
  },
  {
    sequelize,
    timestamps: true,
    underscored: true,
    modelName: 'Card'
  }
);

export default Card;
