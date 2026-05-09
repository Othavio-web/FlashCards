import { Sequelize } from 'sequelize';
import path from 'path';

// 🗄️ INICIALIZAR SEQUELIZE COM SQLITE
export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'),
  logging: false // Mudar para console.log para debug
});

// 🧪 TESTAR CONEXÃO
export async function testarConexao(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com SQLite estabelecida com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao conectar no SQLite:', error);
  }
}

// 📋 SINCRONIZAR MODELOS COM BANCO
export async function sincronizarBanco(): Promise<void> {
  try {
    await sequelize.sync({ alter: true });
    console.log('✅ Banco de dados sincronizado!');
  } catch (error) {
    console.error('❌ Erro ao sincronizar banco:', error);
  }
}
