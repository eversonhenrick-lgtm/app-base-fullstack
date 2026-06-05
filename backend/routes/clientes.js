var express = require('express');
var router = express.Router();
var clienteModel = require('../models/cliente.model');
var verificarToken = require('../middleware/auth');

/**
 * @openapi
 * /clientes:
 *   get:
 *     summary: Lista todos os clientes
 *     tags: [Clientes]
 *     responses:
 *       200:
 *         description: Lista de clientes retornada com sucesso
 *   post:
 *     summary: Cria um novo cliente
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, telefone, endereco]
 *             properties:
 *               nome:
 *                 type: string
 *               telefone:
 *                 type: string
 *               endereco:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cliente criado
 *       401:
 *         description: Token inválido ou ausente
 * /clientes/{id}:
 *   get:
 *     summary: Busca um cliente pelo ID
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *       404:
 *         description: Cliente não encontrado
 *   put:
 *     summary: Atualiza um cliente
 *     tags: [Clientes]
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
 *               telefone:
 *                 type: string
 *               endereco:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cliente atualizado
 *       401:
 *         description: Token inválido ou ausente
 *   delete:
 *     summary: Exclui um cliente
 *     tags: [Clientes]
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
 *         description: Cliente excluído
 *       401:
 *         description: Token inválido ou ausente
 */

/* GET todos os clientes */
router.get('/', function(req, res) {
  clienteModel.getClientes(req, res);
});

/* GET cliente por ID */
router.get('/:id', function(req, res) {
  clienteModel.getClienteById(req, res);
});

/* POST criar cliente */
router.post('/', verificarToken, function(req, res) {
  clienteModel.createCliente(req, res);
});

/* PUT atualizar cliente */
router.put('/:id', verificarToken, function(req, res) {
  clienteModel.updateCliente(req, res);
});

/* DELETE excluir cliente */
router.delete('/:id', verificarToken, function(req, res) {
  clienteModel.deleteCliente(req, res);
});

module.exports = router;