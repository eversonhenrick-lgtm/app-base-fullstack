const jwt = require('jsonwebtoken');

const SECRET = "minha_chave_secreta";

function verificarToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send({ error: "Token não enviado" });
    }

    const token = authHeader.replace("Bearer ", "");

    if (!token || token === "null" || token === "undefined") {
        return res.status(401).send({ error: "Token inválido" });
    }

    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).send({ error: "Token expirado ou inválido" });
    }
}
module.exports = verificarToken;