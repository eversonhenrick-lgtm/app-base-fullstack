const db = require("../firebase");

const pedidosRef = db.collection("pedidos");


// ➕ CRIAR PEDIDO
async function createPedido(req, res) {
    try {

        const itens = req.body.itens || [];

        // 🔥 cálculo no backend (FONTE OFICIAL)
        const total = itens.reduce((acc, item) => {
            return acc + (item.preco * item.quantidade);
        }, 0);

        const novoPedido = {
            clienteId: req.body.clienteId,
            clienteNome: req.body.clienteNome,
            itens: itens,
            total: total,
            status: "pendente",
            criadoEm: new Date()
        };

        const docRef = await pedidosRef.add(novoPedido);

        res.status(201).send({
            id: docRef.id,
            ...novoPedido
        });

    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Erro ao criar pedido" });
    }
}


// 📄 LISTAR PEDIDOS
async function getPedidos(req, res) {
    try {
        const snapshot = await pedidosRef.get();

        const pedidos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.send(pedidos);

    } catch (err) {
        res.status(500).send({ error: "Erro ao buscar pedidos" });
    }
}


// 🔎 BUSCAR POR ID
async function getPedidoById(req, res) {
    try {
        const doc = await pedidosRef.doc(req.params.id).get();

        if (!doc.exists) {
            return res.status(404).send({ error: "Pedido não encontrado" });
        }

        res.send({
            id: doc.id,
            ...doc.data()
        });

    } catch (err) {
        res.status(500).send({ error: "Erro ao buscar pedido" });
    }
}

// 📄 LISTAR PEDIDOS DE UM CLIENTE
async function getPedidosByCliente(req, res) {
    try {

        const clienteId = req.params.clienteId;

        const snapshot = await pedidosRef
            .where("clienteId", "==", clienteId)
            .get();

        const pedidos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.send(pedidos);

    } catch (err) {

        console.error(err);

        res.status(500).send({
            error: "Erro ao buscar pedidos do cliente"
        });
    }
}


// ✏️ ATUALIZAR STATUS DO PEDIDO
async function updatePedido(req, res) {
    try {
        const pedidoId = req.params.id;

        const updateData = {};

        if (req.body.status) updateData.status = req.body.status;

        await pedidosRef.doc(pedidoId).update(updateData);

        res.send({
            message: "Pedido atualizado",
            id: pedidoId
        });

    } catch (err) {
        res.status(500).send({ error: "Erro ao atualizar pedido" });
    }
}


// ❌ DELETAR PEDIDO
async function deletePedido(req, res) {
    try {
        await pedidosRef.doc(req.params.id).delete();

        res.send({ message: "Pedido removido com sucesso" });

    } catch (err) {
        res.status(500).send({ error: "Erro ao excluir pedido" });
    }
}


module.exports = {
    createPedido,
    getPedidos,
    getPedidoById,
    getPedidosByCliente,
    updatePedido,
    deletePedido
};