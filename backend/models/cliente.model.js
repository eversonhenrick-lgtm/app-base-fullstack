const jwt = require("jsonwebtoken");
const SECRET = "minha_chave_secreta";
const db = require('../firebase');

// Login do cliente
async function loginCliente(req, res) {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).send({
            error: "E-mail e senha são obrigatórios"
        });
    }

    try {
        const snapshot = await db
            .collection('clientes')
            .where('email', '==', email)
            .get();

        if (snapshot.empty) {
            return res.status(401).send({
                error: "Credenciais inválidas"
            });
        }

        const doc = snapshot.docs[0];
        const cliente = doc.data();

        if (cliente.senha !== senha) {
            return res.status(401).send({
                error: "Credenciais inválidas"
            });
        }

        const token = jwt.sign(
            {
                id: doc.id,
                nome: cliente.nome,
                email: cliente.email,
                role: "cliente"
            },
            SECRET,
            { expiresIn: "1h" }
        );

        res.send({
            message: "Login bem-sucedido",
            token,
            cliente: {
                id: doc.id,
                nome: cliente.nome,
                email: cliente.email
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).send({
            error: "Erro ao realizar login"
        });
    }
}

// Função para obter todos os clientes
async function getClientes(req, res) {
    try {
        const snapshot = await db.collection('clientes').get();

        const clientes = [];

        snapshot.forEach(doc => {
            clientes.push({
                id: doc.id,        // ✔️ ESSENCIAL
                ...doc.data()
            });
        });

        res.send(clientes);

    } catch (err) {
        res.status(500).send({
            error: "Erro ao buscar clientes"
        });
    }
}

// Função para obter um cliente por ID
async function getClienteById(req, res) {
    try {
        const clienteId = req.params.id;

        const doc = await db
            .collection('clientes')
            .doc(clienteId)
            .get();

        if (!doc.exists) {
            return res.status(404).send({
                error: "Cliente não encontrado"
            });
        }

        res.send({
            id: doc.id,
            ...doc.data()
        });

    } catch (err) {
        res.status(500).send({
            error: "Erro ao buscar cliente"
        });
    }
}

// Criar cliente 
async function createCliente(req, res) {
    try {
        const { nome, telefone, endereco, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).send({
                error: "Nome, email e senha são obrigatórios"
            });
        }

        const novoCliente = {
            nome,
            telefone: telefone || "",
            endereco: endereco || "",
            email,
            senha,
            ibge: req.body.ibge || ""
        };

        const docRef = await db.collection('clientes').add(novoCliente);

        res.status(201).send({
            id: docRef.id,
            ...novoCliente
        });

    } catch (err) {
        console.error(err);
        res.status(500).send({
            error: "Erro ao cadastrar cliente"
        });
    }
}

// Atualizar Cliente
async function updateCliente(req, res) {
    try {
        const clienteId = req.params.id;

        const dadosAtualizados = {};

        if (req.body.nome) dadosAtualizados.nome = req.body.nome;
        if (req.body.telefone) dadosAtualizados.telefone = req.body.telefone;
        if (req.body.endereco) dadosAtualizados.endereco = req.body.endereco;
        if (req.body.email) dadosAtualizados.email = req.body.email;
        if (req.body.senha) dadosAtualizados.senha = req.body.senha;

        await db
            .collection('clientes')
            .doc(clienteId)
            .update(dadosAtualizados);

        res.send({
            mensagem: "Cliente atualizado com sucesso",
            id: clienteId
        });

    } catch (err) {
        console.error(err);

        res.status(500).send({
            error: "Erro ao atualizar cliente"
        });
    }
}

// Excluir cliente
async function deleteCliente(req, res) {
    try {
        const clienteId = req.params.id;

        await db
            .collection('clientes')
            .doc(clienteId)
            .delete();

        res.send({
            mensagem: "Cliente removido com sucesso"
        });

    } catch (err) {
        console.error(err);

        res.status(500).send({
            error: "Erro ao excluir cliente"
        });
    }
}

module.exports = {
    getClientes,
    getClienteById,
    createCliente,
    updateCliente,
    deleteCliente,
    loginCliente
};