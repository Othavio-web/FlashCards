"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = void 0;
const sequelize_1 = require("sequelize");
const banco_1 = require("./banco");
// 📝 CLASSE DO MODELO
class Card extends sequelize_1.Model {
}
exports.Card = Card;
// Inicializar modelo
Card.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    category: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    question: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    answer: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
        field: 'created_at'
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
        field: 'updated_at'
    }
}, {
    sequelize: banco_1.sequelize,
    timestamps: true,
    underscored: true,
    modelName: 'Card'
});
exports.default = Card;
//# sourceMappingURL=Card.js.map