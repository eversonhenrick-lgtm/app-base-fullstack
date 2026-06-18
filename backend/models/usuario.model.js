const jwt = require("jsonwebtoken");
const db = require("../firebase");

const SECRET = "minha_chave_secreta";


// 🔐 LOGIN USUÁRIO (igual clientes)
async function login(req, res) {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).send({
            error: "E-mail e senha são obrigatórios"
        });
    }

    try {
        const snapshot = await db
            .collection("usuarios")
            .where("email", "==", email)
            .get();

        if (snapshot.empty) {
            return res.status(401).send({
                error: "Credenciais inválidas"
            });
        }

        const doc = snapshot.docs[0];
        const usuario = doc.data();

        // 🔥 AQUI está a correção principal
        if (usuario.senha !== senha) {
            return res.status(401).send({
                error: "Credenciais inválidas"
            });
        }

        const token = jwt.sign(
            {
                id: doc.id,
                nome: usuario.nome,
                email: usuario.email,
                role: usuario.role || "admin"
            },
            SECRET,
            { expiresIn: "1h" }
        );

        res.send({
            message: "Login bem-sucedido",
            token,
            usuario: {
                id: doc.id,
                nome: usuario.nome,
                email: usuario.email
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).send({
            error: "Erro ao realizar login"
        });
    }
}


// 📄 LISTAR USUÁRIOS
async function getUsuarios(req, res) {
    try {
        const snapshot = await db.collection("usuarios").get();

        const usuarios = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.send(usuarios);

    } catch (err) {
        res.status(500).send({
            error: "Erro ao buscar usuários"
        });
    }
}


// 🔎 USUÁRIO POR ID
async function getUsuarioById(req, res) {
    try {
        const doc = await db
            .collection("usuarios")
            .doc(req.params.id)
            .get();

        if (!doc.exists) {
            return res.status(404).send({
                error: "Usuário não encontrado"
            });
        }

        res.send({
            id: doc.id,
            ...doc.data()
        });

    } catch (err) {
        res.status(500).send({
            error: "Erro ao buscar usuário"
        });
    }
}


// ➕ CRIAR USUÁRIO
async function createUsuario(req, res) {
    try {

        const usuarioExistente = await db
            .collection("usuarios")
            .where("email", "==", req.body.email)
            .get();

        if (!usuarioExistente.empty) {
            return res.status(400).send({
                error: "Já existe um funcionário com este e-mail"
            });
        }

        const novoUsuario = {
            nome: req.body.nome,
            email: req.body.email,
            senha: req.body.senha
        };

        const docRef = await db
            .collection("usuarios")
            .add(novoUsuario);

        res.status(201).send({
            id: docRef.id,
            ...novoUsuario
        });

    } catch (err) {

        res.status(500).send({
            error: "Erro ao cadastrar usuário"
        });
    }
}


// ✏️ ATUALIZAR USUÁRIO
async function updateUsuario(req, res) {
    try {
        const usuarioId = req.params.id;

        const dadosAtualizados = {};

        if (req.body.nome) dadosAtualizados.nome = req.body.nome;
        if (req.body.email) dadosAtualizados.email = req.body.email;
        if (req.body.senha) dadosAtualizados.senha = req.body.senha;

        await db
            .collection("usuarios")
            .doc(usuarioId)
            .update(dadosAtualizados);

        res.send({
            mensagem: "Usuário atualizado com sucesso",
            id: usuarioId
        });

    } catch (err) {
        console.error(err);
        res.status(500).send({
            error: "Erro ao atualizar usuário"
        });
    }
}


// ❌ DELETAR USUÁRIO
async function deleteUsuario(req, res) {
    try {
        const usuarioId = req.params.id;

        await db
            .collection("usuarios")
            .doc(usuarioId)
            .delete();

        res.send({
            mensagem: "Usuário removido com sucesso"
        });

    } catch (err) {
        console.error(err);
        res.status(500).send({
            error: "Erro ao excluir usuário"
        });
    }
}


module.exports = {
    login,
    getUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario
};