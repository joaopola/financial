const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('sist_financeiro', 'root', '', {
    host: 'localhost',
    dialect: 'mariadb'
});

sequelize.authenticate().then(function(){
    console.log("Conexão ao BD com Sucesso");
}).catch(function(err){
    console.log("Conexão ao BD Não realizada");
});

module.exports = sequelize; 
