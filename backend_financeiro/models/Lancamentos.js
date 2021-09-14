const Sequelize = require('sequelize');
const db = require('./db');

const Lancamentos = db.define('lancamentos', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    valor: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },//Tipo 1: Pagamento / Tipo 2: Recebido
    tipo: {
        type: Sequelize.INTEGER,
        allowNull: false
    },//Situação 1: Pago / Situação 2: Pendente / Situação 3: Recebido
    situacao: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    dataPagamento: {
        type: Sequelize.DATE,
        allowNull: false
    }
});

//Verificar se existe a tabela, não existindo a tabela é criado a mesma

Lancamentos.sync();

//Verifica as alterações da tabela e realiza a mesma
//Lancamentos.sync({ alter: true });


module.exports = Lancamentos;