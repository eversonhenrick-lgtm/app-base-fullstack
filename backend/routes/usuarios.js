var express = require('express');
var router = express.Router();
var usuarioModel = require('../models/usuario.model');
const verificarToken = require('../middleware/auth');

/**
 * @openapi
 * /usuarios/login:
 *   post:
 *     summary: Realiza login de usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, senha]
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 * /usuarios:
 *   get:
 *     summary: Lista todos os usuários
 *     tags: [Usuários]
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, email, senha]
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário criado
 * /usuarios/{id}:
 *   get:
 *     summary: Busca um usuário pelo ID
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *   put:
 *     summary: Atualiza um usuário
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário atualizado
 *   delete:
 *     summary: Exclui um usuário
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário excluído
 */

/* POST login */
router.post('/login', function(req, res) {
  usuarioModel.login(req, res);
});

/* POST criar usuário */
router.post('/', function(req, res) {
  usuarioModel.createUsuario(req, res);
});

/* GET todos os usuários */
router.get('/', function(req, res) {
  usuarioModel.getUsuarios(req, res);
});

/* GET usuário por ID */
router.get('/:id', function(req, res) {
  usuarioModel.getUsuarioById(req, res);
});

/* PUT atualizar usuário */
router.put('/:id', verificarToken, function(req, res) {
  usuarioModel.updateUsuario(req, res);
});

/* DELETE excluir usuário */
router.delete('/:id', verificarToken, function(req, res) {
  usuarioModel.deleteUsuario(req, res);
});

module.exports = router;