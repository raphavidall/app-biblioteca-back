
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'biblioteca',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    pool: {
      max: 5,       // Máximo de conexões no pool
      min: 0,       // Mínimo de conexões no pool
      acquire: 30000, // Tempo máximo para adquirir uma conexão (ms)
      idle: 10000   // Tempo máximo que uma conexão pode ficar ociosa (ms)
    },
    logging: process.env.NODE_ENV === 'production' ? false : console.log
  }
);

module.exports = sequelizequelize;
