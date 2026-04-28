const { Sequelize } = require('sequelize');
const path = require('path');

// 🗄️ INICIALIZAR SEQUELIZE COM SQLITE
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'),
  logging: false // Mudar para console.log para debug
});

// 🧪 TESTAR CONEXÃO
async function testarConexao() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com SQLite estabelecida com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao conectar no SQLite:', error);
  }
}

// 📋 SINCRONIZAR MODELOS COM BANCO
async function sincronizarBanco() {
  try {
    await sequelize.sync({ alter: true });
    console.log('✅ Banco de dados sincronizado!');
  } catch (error) {
    console.error('❌ Erro ao sincronizar banco:', error);
  }
}

module.exports = {
  sequelize,
  testarConexao,
  sincronizarBanco
};
