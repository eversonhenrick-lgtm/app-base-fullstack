const jwt = require("jsonwebtoken");

const SECRET = "minha_chave_secreta";

function verificarToken(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send({
            error: "Token não fornecido"
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, SECRET);

        req.usuario = decoded;

        next();
    } catch (error) {
        return res.status(401).send({
            error: "Token inválido"
        });
    }
}

module.exports = verificarToken;