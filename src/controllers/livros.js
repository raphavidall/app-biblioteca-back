const Livros = require('../models/Livros');


// LISTAR TODOS OS LIVROS
const getLivros = async (req, res) => {
    try {
        const livros = await Livros.findAll();

        const formattedLivros = livros.map((livro) => ({
            id: livro.id,
            nome_livro: livro.nome_livro,
            sinopse: livro.sinopse,
            autor: livro.autor,
            preco: livro.preco
        }));

        res.status(200).json({ result: formattedLivros });
    } catch (error) {
        console.error('Erro ao buscar livros: ', error);
        res.status(500).json({ mes: "Erro ao buscar livros: ", error });
    }
}

//GET DETALHE LIVROS
const getDetalhesLivros = async (req, res) => {
    const { id_livro } = req.params;

    if (!id_livro) {
        return res.status(400).json({ msg: "ID não fornecido." });
    }

    try {
        const livros = await Livros.findAll({
            where: {
                id: id_livro
            }
        });

        const formattedLivros = livros.map((livro) => ({
            id: livro.id,
            nome_livro: livro.nome_livro,
            sinopse: livro.sinopse,
            autor: livro.auto,
            preco: livro.preco,
        }));
        res.status(200).json({ result: formattedLivros });

    } catch (error) {
        console.error('Erro ao buscar livros: ', error);
        res.status(500).json({ msg: "Erro ao buscar livros: ", error });
    }
};

//CADASTRO DOS LIVROS
const postLivros = async (req, res) => {
    const { nome_livro, sinopse, autor, preco } = req.body;

    if (!nome_livro || !preco) {
        return res.status(400).json({ msg: "Nome e Preço é obrigatório." });
    }

    try {
        const newLivro = await Livros.create(
            {
                nome_livro,
                sinopse,
                autor,
                preco
            });
        res.status(201).json({ msg: "Livro registrado com sucesso.", livros: newLivro });
    } catch (error) {
        console.log("Ocorreu um erro ao registrar o livro.", error);
        res.status(500).json({ msg: "Ocorreu um erro ao registrar o livro.", error });
    }
};

//EDITA LIVRO
const putLivro = async (req, res) => {
    const { id } = req.params;
    const { nome_livro, sinopse, autor, preco } = req.body;

    try {
        const livro = await Livros.findOne({ where: { id } });

        if (!livro) {
            return res.status(404).json({ msg: "Livro não encontrado." });
        }

        const updates = {};

        if (nome_livro) {
            updates.nome_livro = nome_livro;
        }
        if (sinopse) {
            updates.sinopse = sinopse;
        }
        if (autor) {
            updates.autor = autor;
        }
        if (preco) {
            updates.preco = preco;
        }

        await livro.update(updates);

        res.status(200).json({ msg: "Livro atualizado com sucesso.", livro });
    } catch (error) {
        console.log("Erro ao atualizar o livro:", error);
        res.status(500).json({ msg: "Erro ao atualizar o livro.", error });
    }
};

//DELETA LIVRO
const deleteLivro = async (req, res) => {
    const id = req.params.id;

    try {
        const livro = await Livros.findByPk(id);
        if (!livro) {
            return res.status(404).json({ msg: "Livro não existe no banco de dados." })
        }

        await livro.destroy();
        res.status(200).json({ msg: "Livro foi removido com sucesso." })
    } catch (error) {
        console.error('Erro ao excluir o registro:', error);
        res.status(500).json({ msg: "Erro ao excluir o registro:", error });
    }
};


module.exports = {
    getLivros,
    getDetalhesLivros,
    postLivros,
    putLivro,
    deleteLivro

}