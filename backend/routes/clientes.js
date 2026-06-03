var express = require('express');
var router = express.Router();
var clienteModel = require('../models/cliente.model');


/* GET todos os clientes */
router.get('/', function(req, res) {
  clienteModel.getClientes(req, res);
});

/* GET cliente por ID */
router.get('/:id', function(req, res) {
  clienteModel.getClienteById(req, res);
});

/* POST criar cliente */
router.post('/', function(req, res) {
  clienteModel.createCliente(req, res);
});

/* PUT atualizar cliente */
router.put('/:id', function(req, res) {
  clienteModel.updateCliente(req, res);
});

/* DELETE excluir cliente */
router.delete('/:id', function(req, res) {
  clienteModel.deleteCliente(req, res);
});

module.exports = router;