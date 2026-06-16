var express = require('express');
var router = express.Router();
var usuarioModel = require('../models/usuario.model');
var verificarToken = require('../middleware/auth');

/**
 * @openapi
 * /usuarios/login:
 *   post:
 *     summary: Realiza o login do usuário administrativo
 *     tags:
 *       - Usuários
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login bem-sucedido e retorno do token JWT
 *       401:
 *         description: Credenciais inválidas
 *
 * /usuarios:
 *   get:
 *     summary: Lista todos os usuários cadastrados
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 *
 *   post:
 *     summary: Cadastra um novo usuário administrativo
 *     tags:
 *       - Usuários
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - senha
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *
 * /usuarios/{id}:
 *   get:
 *     summary: Busca usuário pelo ID
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *       404:
 *         description: Usuário não encontrado
 *
 *   put:
 *     summary: Atualiza usuário
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
 *         description: Usuário atualizado com sucesso
 *       404:
 *         description: Usuário não encontrado
 *
 *   delete:
 *     summary: Remove usuário
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário excluído com sucesso
 *       404:
 *         description: Usuário não encontrado
 */

router.post('/login', function(req, res) {
  usuarioModel.login(req, res);
});

router.get('/', verificarToken, function(req, res) {
  usuarioModel.getUsuarios(req, res);
});

router.get('/:id', verificarToken, function(req, res) {
  usuarioModel.getUsuarioById(req, res);
});

router.post('/', function(req, res) {
  usuarioModel.createUsuario(req, res);
});

router.put('/:id', verificarToken, function(req, res) {
  usuarioModel.updateUsuario(req, res);
});

router.delete('/:id', verificarToken, function(req, res) {
  usuarioModel.deleteUsuario(req, res);
});

module.exports = router;