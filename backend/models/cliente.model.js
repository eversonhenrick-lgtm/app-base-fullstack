const clientes = [
  {
    id: 1,
    nome: "Carlos",
    telefone: "81999999999",
    endereco: "Rua A"
  }
];

// Função para obter todos os clientes
function getClientes(req, res) {
    res.send(clientes);
}


// Função para obter um cliente por ID
function getClienteById(req, res) {

    console.log(req);
    const clienteId = parseInt(req.params.id);
    const cliente = clientes.find(
    cliente => cliente.id === clienteId
);

    if (!cliente) {
        return res.status(404).send({ error: 'Cliente não encontrado' });
    }
    res.send(cliente);
}
//Cadastrar clientes
function createCliente(req, res) {

    console.log(req.body);
    const newCliente = {
        id: clientes.length + 1,
        nome: req.body.nome,
        telefone: req.body.telefone,
        endereco: req.body.endereco
    };
    clientes.push(newCliente);
    res.status(201).send(newCliente);
}

//Atualizar Clientes
// Atualizar Clientes
function updateCliente(req, res) {
    const clienteId = parseInt(req.params.id);
    
    // CORREÇÃO: Alterado de 'id' para 'clienteId'
    const cliente = clientes.find(
        cliente => cliente.id === clienteId 
    );

    if (!cliente) {
        return res.status(404).send({
            error: "Cliente não encontrado"
        });
    }

    // Atualiza apenas se o campo for enviado, mantendo o anterior caso contrário
    cliente.nome = req.body.nome || cliente.nome;
    cliente.telefone = req.body.telefone || cliente.telefone;
    cliente.endereco = req.body.endereco || cliente.endereco;

    res.send(cliente);
}
// Excluir cliente
function deleteCliente(req, res) {

    const clienteId = parseInt(req.params.id);

    const index = clientes.findIndex(
        cliente => cliente.id === clienteId
    );

    if (index === -1) {
        return res.status(404).send({
            error: "Cliente não encontrado"
        });
    }

    clientes.splice(index, 1);

    res.send({
        mensagem: "Cliente removido"
    });
}

module.exports = { getClientes, getClienteById, createCliente, updateCliente, deleteCliente };