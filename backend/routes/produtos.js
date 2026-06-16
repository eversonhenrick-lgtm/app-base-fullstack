var express = require('express');
var router = express.Router();
var produtoModel = require('../models/produto.model');
var verificarToken = require('../middleware/auth');

/**
 * @openapi
 * /produtos:
 *   get:
 *     summary: Lista todos os produtos
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: Lista de produtos retornada com sucesso
 *
 *   post:
 *     summary: Cria um novo produto
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - preco
 *               - categoria
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
 *         description: Produto criado com sucesso
 *
 * /produtos/{id}:
 *   get:
 *     summary: Busca um produto pelo ID
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Produto encontrado
 *       404:
 *         description: Produto não encontrado
 *
 *   put:
 *     summary: Atualiza um produto
 *     tags:
 *       - Products
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
 *         description: Produto atualizado com sucesso
 *       404:
 *         description: Produto não encontrado
 *
 *   delete:
 *     summary: Exclui um produto
 *     tags:
 *       - Products
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
 *         description: Produto excluído com sucesso
 *       404:
 *         description: Produto não encontrado
 */

router.get('/', produtoModel.getProdutos);
router.get('/:id', produtoModel.getProdutoById);

router.post('/', verificarToken, produtoModel.createProduto);
router.put('/:id', verificarToken, produtoModel.updateProduto);
router.delete('/:id', verificarToken, produtoModel.deleteProduto);

module.exports = router;