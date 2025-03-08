const express = require("express");
const { postLivros, getLivros, getDetalhesLivros, putLivro, deleteLivro} = require('../controllers/livros');
const router = express.Router();

router.get("/listaLivros", getLivros);
router.get("/detalhesLivro/:id_livro", getDetalhesLivros);
router.post("/cadastraLivro", postLivros);
router.put("/updateLivro/:id", putLivro);
router.delete("/deleteLivro/:id", deleteLivro);

module.exports = router;

