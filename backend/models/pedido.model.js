const pedidos = [
    {
    id: 1,
    cliente: "João Silva",
    itens: [
        { produto: "Pizza Margherita", quantidade: 2, preco: 25.00 },
        { produto: "Coca-Cola", quantidade: 1, preco: 5.00 }
    ],
    status: "Recebido",
    data: "2024-06-01T12:30:00Z",
    total: 55.00
    }
];

//listar pedidos 
function getPedidos(req, res) {
    res.send(pedidos);
}

//listar pedido por id
function getPedidoById(req, res) {
    const pedidoId = parseInt(req.params.id);

    const pedido = pedidos.find(
        pedido => pedido.id === pedidoId
    );

    if (!pedido) {
        return res.status(404).send({ error: "Pedido não encontrado" });
    }
    res.send(pedido);
}

//Criar pedido 
function criarPedido(req, res) {
    const newPedido = {
    id: pedidos.length + 1,
    cliente: req.body.cliente,
    itens: req.body.itens,
    status: "Recebido",
    data: new Date().toISOString(),
    total: 0
};

// Calcular total do pedido
    let total = 0;
    newPedido.itens.forEach(item => {
    total += item.preco * item.quantidade;

});

    newPedido.total = total;
    pedidos.push(newPedido);
    res.status(201).send(newPedido);
}

//Atualizar pedido
function atualizarPedido(req, res) {
    const pedidoId = parseInt(req.params.id);

    const pedido = pedidos.find(
        pedido => pedido.id === pedidoId
    );

    if(!pedido) {
        return res.status(404).send({ error: "Pedido não encontrado" });
    }
    pedido.status = req.body.status;
    res.send(pedido);
    }

//Excluir pedido
function excluirPedido(req, res) {
    const pedidoId = parseInt(req.params.id);

    const index = pedidos.findIndex(
        pedido => pedido.id === pedidoId
    );

   
    if (index === -1) {
        return res.status(404).send({
            error: "Pedido não encontrado"
        });
    }

    pedidos.splice(index, 1);

    res.send({
        mensagem: "Pedido removido"
    });
}

module.exports = {getPedidos, getPedidoById, criarPedido, atualizarPedido, excluirPedido}