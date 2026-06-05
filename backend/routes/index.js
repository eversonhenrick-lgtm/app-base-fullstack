var express = require('express');
var router = express.Router();

/**
 * @openapi
 * /:
 *   get:
 *     summary: Página inicial da API
 *     tags: [Base]
 *     responses:
 *       200:
 *         description: Mensagem de boas-vindas
 */

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({ api: 'Bem-vindo(a) a minha API com Node e Express' });
});

module.exports = router;
