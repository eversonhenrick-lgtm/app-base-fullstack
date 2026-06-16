// frontend/routes/index.js
var express = require('express');
var router = express.Router();

/* 1. ROTA RAIZ (/) - Agora carrega direto a tela de Login */
router.get('/', function(req, res, next) {
  res.render('login'); // Abre o login.ejs assim que digita localhost:3001
});

/* 2. ROTA DO PAINEL (/painel) - O sistema principal (index.ejs) fica aqui */
router.get('/painel', function(req, res, next) {
  res.render('index'); // Abre o seu painel de clientes/pedidos após logar
});

router.get('/cardapio', function(req, res, next) {
  res.render('cardapio'); // Abre o cardápio para clientes
});

module.exports = router;