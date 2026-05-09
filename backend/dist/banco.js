"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
exports.testarConexao = testarConexao;
exports.sincronizarBanco = sincronizarBanco;
const sequelize_1 = require("sequelize");
const path_1 = __importDefault(require("path"));
// 🗄️ INICIALIZAR SEQUELIZE COM SQLITE
exports.sequelize = new sequelize_1.Sequelize({
    dialect: 'sqlite',
    storage: path_1.default.join(__dirname, 'database.sqlite'),
    logging: false // Mudar para console.log para debug
});
// 🧪 TESTAR CONEXÃO
async function testarConexao() {
    try {
        await exports.sequelize.authenticate();
        console.log('✅ Conexão com SQLite estabelecida com sucesso!');
    }
    catch (error) {
        console.error('❌ Erro ao conectar no SQLite:', error);
    }
}
// 📋 SINCRONIZAR MODELOS COM BANCO
async function sincronizarBanco() {
    try {
        await exports.sequelize.sync({ alter: true });
        console.log('✅ Banco de dados sincronizado!');
    }
    catch (error) {
        console.error('❌ Erro ao sincronizar banco:', error);
    }
}
//# sourceMappingURL=banco.js.map