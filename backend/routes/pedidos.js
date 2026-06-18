var express = require('express');
var router = express.Router();
var pedidoModel = require('../models/pedido.model');
var verificarToken = require('../middleware/auth');

/**
 * @openapi
 * /pedidos:
 *   get:
 *     summary: Lista todos os pedidos
 *     tags:
 *       - Pedidos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos retornada com sucesso
 *
 *   post:
 *     summary: Cria um novo pedido
 *     tags:
 *       - Pedidos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clienteId
 *               - itens
 *             properties:
 *               clienteId:
 *                 type: string
 *               clienteNome:
 *                 type: string
 *               itens:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     produtoId:
 *                       type: string
 *                     quantidade:
 *                       type: integer
 *                     preco:
 *                       type: number
 *
 * /pedidos/{id}:
 *   get:
 *     summary: Busca pedido por ID
 *     tags:
 *       - Pedidos
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
 *         description: Pedido encontrado
 *       404:
 *         description: Pedido não encontrado
 *
 *   put:
 *     summary: Atualiza status do pedido
 *     tags:
 *       - Pedidos
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
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Pedido atualizado com sucesso
 *       404:
 *         description: Pedido não encontrado
 *
 *   delete:
 *     summary: Exclui pedido
 *     tags:
 *       - Pedidos
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
 *         description: Pedido removido com sucesso
 *       404:
 *         description: Pedido não encontrado
 */

router.get('/cliente/:clienteId', verificarToken, (req, res) => {
  pedidoModel.getPedidosByCliente(req, res);
});

router.get('/', verificarToken, (req, res) => {
  pedidoModel.getPedidos(req, res);
});

router.get('/:id', verificarToken, (req, res) => {
  pedidoModel.getPedidoById(req, res);
});

router.post('/', verificarToken, (req, res) => {
  pedidoModel.createPedido(req, res);
});

router.put('/:id', verificarToken, (req, res) => {
  pedidoModel.updatePedido(req, res);
});

router.delete('/:id', verificarToken, (req, res) => {
  pedidoModel.deletePedido(req, res);
});

module.exports = router;