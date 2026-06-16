const db = require('../firebase');

//Listar Produtos
async function getProdutos(req, res) {
    try {
        const snapshot = await db.collection('produtos').get();

        const produtos = [];

        snapshot.forEach(doc => {
            produtos.push({
                id: doc.id,
                ...doc.data()
            });
        });

        res.send(produtos);

    } catch (err) {
        console.error(err);

        res.status(500).send({
            error: "Erro ao buscar produtos"
        });
    }
}

//Buscar produtos por id
async function getProdutoById(req, res) {
    try {
        const produtoId = req.params.id;

        const doc = await db.collection('produtos').doc(produtoId).get();

        if (!doc.exists) {
            return res.status(404).send({
                error: "Produto não encontrado"
            });
        }

        res.send({
            id: doc.id,
            ...doc.data()
        });

    } catch (err) {
        console.error(err);

        res.status(500).send({
            error: "Erro ao buscar produto"
        });
    }
}

//Criar produto
async function createProduto(req, res) {
    try {
        const novoProduto = {
            nome: req.body.nome,
            descricao: req.body.descricao,
            preco: req.body.preco,
            categoria: req.body.categoria,
            imagem: req.body.imagem
        };

        const docRef = await db.collection('produtos').add(novoProduto);

        res.status(201).send({
            id: docRef.id,
            ...novoProduto
        });

    } catch (err) {
        console.error(err);

        res.status(500).send({
            error: "Erro ao cadastrar produto"
        });
    }
}

//Atualizar Produtos
async function updateProduto(req, res) {
    try {
        const produtoId = req.params.id;

        const dadosAtualizados = {};

        if (req.body.nome) dadosAtualizados.nome = req.body.nome;
        if (req.body.descricao) dadosAtualizados.descricao = req.body.descricao;
        if (req.body.preco) dadosAtualizados.preco = req.body.preco;
        if (req.body.categoria) dadosAtualizados.categoria = req.body.categoria;
        if (req.body.imagem) dadosAtualizados.imagem = req.body.imagem;

        await db.collection('produtos')
            .doc(produtoId)
            .update(dadosAtualizados);

        res.send({
            mensagem: "Produto atualizado com sucesso",
            id: produtoId
        });

    } catch (err) {
        console.error(err);

        res.status(500).send({
            error: "Erro ao atualizar produto"
        });
    }
}
//Deletar Produto
async function deleteProduto(req, res) {
    try {
        const produtoId = req.params.id;

        await db.collection('produtos')
            .doc(produtoId)
            .delete();

        res.send({
            mensagem: "Produto removido com sucesso"
        });

    } catch (err) {
        console.error(err);

        res.status(500).send({
            error: "Erro ao excluir produto"
        });
    }
}

module.exports = {getProdutos, getProdutoById, createProduto, updateProduto, deleteProduto}