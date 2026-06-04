const produtos = [
    {
        id: 1,
        nome: "Pizza Calabresa",
        descricao: "Calabresa com cebola",
        preco: 45.90,
        categoria: "Pizza"
    }
];

//Listar Produtos
function getProdutos(req, res) {
    res.send(produtos);
}

//Buscar produtos por id
function getProdutoById(req, res) {
    const produtoId = parseInt(req.params.id);

    const produto = produtos.find(
        produto => produto.id === produtoId
    );

    if(!produto) {
        return res.status(404).send({
        error: "Produto não encontrado"
        });
    }

    res.send(produto)
}

//Criar produto
function createProduto(req, res) {
    const newProduto = {
        id: produtos.length + 1,
        nome: req.body.nome,
        descricao: req.body.descricao,
        preco: req.body.preco,
        categoria: req.body.categoria
    };

    produtos.push(newProduto);
    res.status(201).send(newProduto);
}

//Atualizar Produtos
function updateProduto(req, res) {
    
    const produtoId = parseInt(req.params.id);
    const produto = produtos.find(
        produto => produto.id === produtoId
    );

    if(!produto) {
        return res.status(404).send({
            error: "Produto não encontrado"
        });
    }

    produto.nome = req.body.nome;
    produto.descricao = req.body.descricao;
    produto.preco = req.body.preco;
    produto.categoria = req.body.categoria;

  res.send(produto);
}
//Deletar Produto
function deleteProduto(req, res) {

    const produtoId = parseInt(req.params.id);

    const index = produtos.findIndex(
        produto => produto.id === produtoId
    );

    if (index === -1) {
        return res.status(404).send({
            error: "Produto não encontrado"
        });
    }

    produtos.splice(index, 1);

    res.send({
        mensagem: "Produto removido"
    });
}

module.exports = {getProdutos, getProdutoById, createProduto, updateProduto, deleteProduto}