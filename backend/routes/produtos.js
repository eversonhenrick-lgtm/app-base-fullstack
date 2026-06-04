var express = require('express');
var router = express.Router();
var produtoModel = require('../models/produto.model');

router.get('/', function(req, res) {
  produtoModel.getProdutos(req, res);
});

router.get('/:id', function(req, res) {
  produtoModel.getProdutoById(req, res);
});

router.post('/', function(req, res) {
  produtoModel.createProduto(req, res);
});

router.put('/:id', function(req, res) {
  produtoModel.updateProduto(req, res);
});

router.delete('/:id', function(req, res) {
  produtoModel.deleteProduto(req, res);
});

module.exports = router;