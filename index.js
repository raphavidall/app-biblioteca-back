require('dotenv').config();
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const livros = require('./src/routes/livros');
const auth = require('./src/routes/auth');

const app = express();
app.use(cors());
app.use(compression()); // Comprimir todas as respostas
app.use(express.json());


app.use('/livros', livros);
app.use('/auth', auth); // Adiciona as rotas de autenticação

const PORT = process.env.PORT || 8080;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});