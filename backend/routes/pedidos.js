var express = require('express');
var router = express.Router();
var pedidoModel = require('../models/pedido.model');

/**
 * @openapi
 * /pedidos:
 *   get:
 *     summary: Lista todos os pedidos
 *     tags: [Pedidos]
 *     responses:
 *       200:
 *         description: Lista de pedidos retornada com sucesso
 *   post:
 *     summary: Cria um novo pedido
 *     tags: [Pedidos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [cliente, itens]
 *             properties:
 *               cliente:
 *                 type: string
 *               itens:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     produto:
 *                       type: string
 *                     quantidade:
 *                       type: integer
 *                     preco:
 *                       type: number
 *     responses:
 *       201:
 *         description: Pedido criado
 * /pedidos/{id}:
 *   get:
 *     summary: Busca um pedido pelo ID
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *   put:
 *     summary: Atualiza o status de um pedido
 *     tags: [Pedidos]
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
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Pedido atualizado
 *   delete:
 *     summary: Remove um pedido
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pedido removido
 */

/* GET todos os pedidos */
router.get('/', function(req, res) {
  pedidoModel.getPedidos(req, res);
});

/* GET pedido por ID */
router.get('/:id', function(req, res) {
  pedidoModel.getPedidoById(req, res);
});

/* POST criar pedido */
router.post('/', function(req, res) {
  pedidoModel.criarPedido(req, res);
});

/* PUT atualizar pedido */
router.put('/:id', function(req, res) {
  pedidoModel.atualizarPedido(req, res);
});

/* DELETE excluir pedido */
router.delete('/:id', function(req, res) {
  pedidoModel.excluirPedido(req, res);
});

module.exports = router;