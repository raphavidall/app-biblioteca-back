const express = require("express");
const cors = require("cors");

const livros = require("./livros");
const auth = require("./auth");

const rotas = (app) => {
    app.use(express.json(), cors(), livros, auth);
    app.get("/", (req, res) =>
        res.status(200).json({ message: "Bem-vindo a Biblioteca Online!" }),
    );
};

module.exports = rotas;
