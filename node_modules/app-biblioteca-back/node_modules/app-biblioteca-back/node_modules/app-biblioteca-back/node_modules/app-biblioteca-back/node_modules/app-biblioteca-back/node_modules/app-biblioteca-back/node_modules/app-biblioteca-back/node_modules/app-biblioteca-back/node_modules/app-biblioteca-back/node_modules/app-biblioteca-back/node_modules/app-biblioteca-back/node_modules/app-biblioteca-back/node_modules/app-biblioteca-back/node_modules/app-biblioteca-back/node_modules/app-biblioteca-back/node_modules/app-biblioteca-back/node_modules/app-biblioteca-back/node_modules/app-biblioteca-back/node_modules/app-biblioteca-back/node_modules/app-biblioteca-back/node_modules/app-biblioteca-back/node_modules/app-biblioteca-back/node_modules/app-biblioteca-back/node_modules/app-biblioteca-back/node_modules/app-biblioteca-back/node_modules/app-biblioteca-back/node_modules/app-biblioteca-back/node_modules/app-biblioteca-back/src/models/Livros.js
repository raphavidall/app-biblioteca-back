const Sequelize = require('sequelize');
const db = require('../config/db'); 

const Livros = db.define('livros', {
    id: {
        type: Sequelize.INTEGER, 
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }, 
    nome_livro: {
        type: Sequelize.STRING,
    },
    sinopse: {
        type: Sequelize.STRING,
    },
    autor: {
        type: Sequelize.STRING,
    },
    preco: {
        type: Sequelize.DOUBLE,
    }
});

Livros.sync({ alter: true })
    .then(() => {
        console.log("A tabela 'livros' foi criada/alterada com sucesso.");
    })
    .catch(error => {
        console.error("Houve um erro ao criar/alterar a tabela:", error);
    });

module.exports = Livros;