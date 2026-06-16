var express = require('express');
var router = express.Router();
var clienteModel = require('../models/cliente.model');
var verificarToken = require('../middleware/auth');
const db = require('../firebase');

// 🍕 CARDÁPIO (CLIENTE VÊ ISSO)
router.get('/cardapio', async (req, res) => {
    try {
        const snapshot = await db.collection('produtos').get();

        const produtos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.send(produtos);

    } catch (err) {
        res.status(500).send({
            error: "Erro ao buscar cardápio"
        });
    }
});

/**
 * @openapi
 * /clientes/login:
 *   post:
 *     summary: Realiza o login do cliente
 *     tags:
 *       - Clientes
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
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 *
 * /clientes:
 *   get:
 *     summary: Lista todos os clientes
 *     tags:
 *       - Clientes
 *     responses:
 *       200:
 *         description: Lista de clientes retornada com sucesso
 *
 *   post:
 *     summary: Cria um novo cliente
 *     tags:
 *       - Clientes
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
 *               - telefone
 *               - email
 *               - senha
 *             properties:
 *               nome:
 *                 type: string
 *               telefone:
 *                 type: string
 *               endereco:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cliente criado com sucesso
 *
 * /clientes/{id}:
 *   get:
 *     summary: Busca um cliente pelo ID
 *     tags:
 *       - Clientes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *       404:
 *         description: Cliente não encontrado
 *
 *   put:
 *     summary: Atualiza um cliente
 *     tags:
 *       - Clientes
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
 *               telefone:
 *                 type: string
 *               endereco:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cliente atualizado com sucesso
 *       404:
 *         description: Cliente não encontrado
 *
 *   delete:
 *     summary: Exclui um cliente
 *     tags:
 *       - Clientes
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
 *         description: Cliente excluído com sucesso
 *       404:
 *         description: Cliente não encontrado
 */

// Nova rota de login do cliente
router.post('/login', function(req, res) {
  clienteModel.loginCliente(req, res);
});

router.get('/', function(req, res) {
  clienteModel.getClientes(req, res);
});

router.get('/:id', function(req, res) {
  clienteModel.getClienteById(req, res);
});

router.post('/', verificarToken, function(req, res) {
  clienteModel.createCliente(req, res);
});

router.put('/:id', verificarToken, function(req, res) {
  clienteModel.updateCliente(req, res);
});

router.delete('/:id', verificarToken, function(req, res) {
  clienteModel.deleteCliente(req, res);
});

module.exports = router;