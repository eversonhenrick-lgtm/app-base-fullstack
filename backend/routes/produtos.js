var express = require('express');
var router = express.Router();
var produtoModel = require('../models/produto.model');
const verificarToken = require('../middleware/auth');

/**
 * @openapi
 * /produtos:
 *   get:
 *     summary: Lista todos os produtos
 *     tags: [Produtos]
 *     responses:
 *       200:
 *         description: Lista de produtos retornada com sucesso
 *   post:
 *     summary: Cria um novo produto
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, descricao, preco, categoria]
 *             properties:
 *               nome:
 *                 type: string
 *               descricao:
 *                 type: string
 *               preco:
 *                 type: number
 *               categoria:
 *                 type: string
 *     responses:
 *       201:
 *         description: Produto criado
 * /produtos/{id}:
 *   get:
 *     summary: Busca um produto pelo ID
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Produto encontrado
 *   put:
 *     summary: Atualiza um produto
 *     tags: [Produtos]
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
 *               descricao:
 *                 type: string
 *               preco:
 *                 type: number
 *               categoria:
 *                 type: string
 *     responses:
 *       200:
 *         description: Produto atualizado
 *   delete:
 *     summary: Exclui um produto
 *     tags: [Produtos]
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
 *         description: Produto excluído
 */

router.get('/', function(req, res) {
  produtoModel.getProdutos(req, res);
});

router.get('/:id', function(req, res) {
  produtoModel.getProdutoById(req, res);
});

router.post('/', verificarToken, function(req, res) {
  produtoModel.createProduto(req, res);
});

router.put('/:id', verificarToken, function(req, res) {
  produtoModel.updateProduto(req, res);
});

router.delete('/:id', verificarToken, function(req, res) {
  produtoModel.deleteProduto(req, res);
});

module.exports = router;