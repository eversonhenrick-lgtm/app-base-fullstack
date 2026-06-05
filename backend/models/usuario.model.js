const jwt = require("jsonwebtoken");
const SECRET = "minha_chave_secreta";

function login(req, res) {
    const { email, senha } = req.body;

    const usuario = usuarios.find(
        usuario => usuario.email === email &&
                   usuario.senha === senha
    );

    if (!usuario) {
        return res.status(401).send({
            error: "Credenciais inválidas"
        });
    }

    const token = jwt.sign(
        {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email
        },
        SECRET,
        {
            expiresIn: "1h"
        }
    );

    res.send({
        message: "Login bem-sucedido",
        token
    });
}

const usuarios = [
    {
        id: 1,
        nome: "João Silva",
        email: "joao.silva@example.com",
        senha: "123456"
    }
];
//Buscar usuários
function getUsuarios(req, res) {
    res.send(usuarios);
}
//Buscar usuário por id
function getUsuarioById(req, res) {
    const usuarioId = parseInt(req.params.id);

    const usuario = usuarios.find(
        usuario => usuario.id === usuarioId
    );

    if(!usuario) {
        return res.status(404).send({ error: "Usuário não encontrado"});

        }

        res.send(usuario);
}

//Criar usuário
function createUsuario(req, res) {
    const newUsuario = {
        id: usuarios.length + 1,
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha
    };

    usuarios.push(newUsuario);
    res.status(201).send(newUsuario);
}

//Atualizar usuário
function updateUsuario(req, res) {
    const usuarioId = parseInt(req.params.id);

    const usuario = usuarios.find(
        usuario => usuario.id === usuarioId
    );

    if(!usuario) {
        return res.status(404).send({ error: "Usuário não encontrado"});
    }

    usuario.nome = req.body.nome;
    usuario.email = req.body.email;
    usuario.senha = req.body.senha;

    res.send(usuario);
}

//Excluir usuário
function deleteUsuario(req, res) {
    const usuarioId = parseInt(req.params.id);

    const usuarioIndex = usuarios.findIndex(
        usuario => usuario.id === usuarioId
    );

    if(usuarioIndex === -1) {
        return res.status(404).send({ error: "Usuário não encontrado"});
    }

    usuarios.splice(usuarioIndex, 1);
    res.send({ message: "Usuário excluído com sucesso" });
}

module.exports = {getUsuarios, getUsuarioById, createUsuario, updateUsuario, deleteUsuario, login};