Modulesrequire('dotenv').config();
const express = require('express');
const cors = require('cors');
const livros = require('./src/routes/livros');

const app = express();
app.use(cors());
app.use(express.json());


app.use('/livros', livros);


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
