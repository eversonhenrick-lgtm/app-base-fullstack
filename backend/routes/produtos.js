var express = require('express');
var router = express.Router();
const verificarToken = require('../middleware/auth');

// 🔥 CONEXÃO COM O FIREBASE (FORMATO MODERNO MODULAR)
const { getFirestore } = require('firebase-admin/firestore');
const db = getFirestore();

/**
 * @openapi
 * /produtos:
 * get:
 * summary: Lista todos os produtos
 * tags: [Produtos]
 * responses:
 * 200:
 * description: Lista de produtos retornada com sucesso
 * post:
 * summary: Cria um novo produto
 * tags: [Produtos]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required: [nome, descricao, preco, categoria]
 * properties:
 * nome:
 * type: string
 * descricao:
 * type: string
 * preco:
 * type: number
 * categoria:
 * type: string
 * responses:
 * 201:
 * description: Produto criado
 * /produtos/{id}:
 * get:
 * summary: Busca um produto pelo ID
 * tags: [Produtos]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * responses:
 * 200:
 * description: Produto encontrado
 * put:
 * summary: Atualiza um produto
 * tags: [Produtos]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * nome:
 * type: string
 * descricao:
 * type: string
 * preco:
 * type: number
 * categoria:
 * type: string
 * responses:
 * 200:
 * description: Produto atualizado
 * delete:
 * summary: Exclui um produto
 * tags: [Produtos]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * responses:
 * 200:
 * description: Produto excluído
 */

// 1️⃣ LISTAR TODOS OS PRODUTOS
router.get('/', async function(req, res) {
  try {
    const snapshot = await db.collection('produtos').get();
    const produtos = [];
    
    snapshot.forEach(doc => {
      produtos.push({ id: doc.id, ...doc.data() });
    });

    res.json(produtos);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos no banco de dados.' });
  }
});

// 2️⃣ BUSCAR PRODUTO POR ID
router.get('/:id', async function(req, res) {
  try {
    const doc = await db.collection('produtos').doc(req.params.id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Erro ao buscar produto por ID:', error);
    res.status(500).json({ error: 'Erro ao buscar produto.' });
  }
});

// 3️⃣ CADASTRAR NOVO PRODUTO (Protegido por Token)
router.post('/', verificarToken, async function(req, res) {
  try {
    const { nome, descricao, preco, categoria, imagem } = req.body;

    if (!nome || !preco || !categoria) {
      return res.status(400).json({ error: 'Campos obrigatórios estão faltando.' });
    }

    const novoProduto = {
      nome,
      descricao: descricao || '',
      preco: parseFloat(preco),
      categoria,
      imagem: imagem || '',
      criadoEm: new Date()
    };

    const docRef = await db.collection('produtos').add(novoProduto);
    res.status(201).json({ id: docRef.id, ...novoProduto });
  } catch (error) {
    console.error('Erro ao cadastrar produto:', error);
    res.status(500).json({ error: 'Erro ao salvar o produto no banco de dados.' });
  }
});

// 4️⃣ ATUALIZAR PRODUTO EXISTENTE (Protegido por Token)
router.put('/:id', verificarToken, async function(req, res) {
  try {
    const { nome, descricao, preco, categoria, imagem } = req.body;
    const dadosAtualizados = {};

    if (nome !== undefined) dadosAtualizados.nome = nome;
    if (descricao !== undefined) dadosAtualizados.descricao = descricao;
    if (preco !== undefined) dadosAtualizados.preco = parseFloat(preco);
    if (categoria !== undefined) dadosAtualizados.categoria = categoria;
    if (imagem !== undefined) dadosAtualizados.imagem = imagem;

    await db.collection('produtos').doc(req.params.id).update(dadosAtualizados);
    res.json({ id: req.params.id, ...dadosAtualizados });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ error: 'Erro ao atualizar o produto.' });
  }
});

// 5️⃣ EXCLUIR PRODUTO (Protegido por Token)
router.delete('/:id', verificarToken, async function(req, res) {
  try {
    await db.collection('produtos').doc(req.params.id).delete();
    res.json({ message: 'Produto excluído com sucesso!' });
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
    res.status(500).json({ error: 'Erro ao excluir o produto.' });
  }
});

module.exports = router;