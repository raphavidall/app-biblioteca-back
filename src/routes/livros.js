const express = require("express");
const { postLivros, getLivros, getDetalhesLivros, putLivro, deleteLivro} = require('../controllers/livros');
const { auth, checkRole } = require('../middlewares/auth');
const router = express.Router();

// Rotas públicas
router.get("/listaLivros", getLivros);
router.get("/detalhesLivro/:id_livro", getDetalhesLivros);

// Rotas protegidas
router.post("/cadastraLivro", auth, checkRole(['admin']), postLivros);
router.put("/updateLivro/:id", auth, checkRole(['admin']), putLivro);
router.delete("/deleteLivro/:id", auth, checkRole(['admin']), deleteLivro);

module.exports = router;