const API_URL = "http://localhost:3000/clientes";

// =======================
// TOKEN
// =======================
function getToken() {
  return localStorage.getItem("token");
}

// =======================
// LISTAR CLIENTES
// =======================
async function listarClientes() {
  try {
    const res = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
      }
    });

    if (!res.ok) throw new Error("Erro ao listar clientes");

    const clientes = await res.json();

    const tabela = document.getElementById("tabelaClientes");
    tabela.innerHTML = "";

    clientes.forEach(c => {
      tabela.innerHTML += `
        <tr>
          <td>${c.nome}</td>
          <td>${c.telefone}</td>
          <td>${c.endereco}</td>
          <td>
            <button onclick="editarCliente('${c._id}')" class="btn btn-warning btn-sm">Editar</button>
            <button onclick="deletarCliente('${c._id}')" class="btn btn-danger btn-sm">Excluir</button>
          </td>
        </tr>
      `;
    });

  } catch (error) {
    console.error(error);
  }
}

// =======================
// CRIAR CLIENTE
// =======================
async function criarCliente() {
  try {
    const cliente = {
      nome: document.getElementById("nome").value,
      telefone: document.getElementById("telefone").value,
      endereco: document.getElementById("endereco").value
    };

    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
      },
      body: JSON.stringify(cliente)
    });

    if (!res.ok) throw new Error("Erro ao criar cliente");

    limparFormulario();
    listarClientes();

  } catch (error) {
    console.error(error);
  }
}

// =======================
// DELETAR CLIENTE
// =======================
async function deletarCliente(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${getToken()}`
      }
    });

    if (!res.ok) throw new Error("Erro ao deletar cliente");

    listarClientes();

  } catch (error) {
    console.error(error);
  }
}

// =======================
// EDITAR CLIENTE (CARREGA NO FORM)
// =======================
async function editarCliente(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      headers: {
        "Authorization": `Bearer ${getToken()}`
      }
    });

    const cliente = await res.json();

    document.getElementById("clienteId").value = cliente._id;
    document.getElementById("nome").value = cliente.nome;
    document.getElementById("telefone").value = cliente.telefone;
    document.getElementById("endereco").value = cliente.endereco;

    document.getElementById("btnSalvar").style.display = "none";
    document.getElementById("btnAtualizar").style.display = "inline-block";

  } catch (error) {
    console.error(error);
  }
}

// =======================
// ATUALIZAR CLIENTE
// =======================
async function atualizarCliente() {
  try {
    const id = document.getElementById("clienteId").value;

    const cliente = {
      nome: document.getElementById("nome").value,
      telefone: document.getElementById("telefone").value,
      endereco: document.getElementById("endereco").value
    };

    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
      },
      body: JSON.stringify(cliente)
    });

    if (!res.ok) throw new Error("Erro ao atualizar cliente");

    limparFormulario();
    listarClientes();

    document.getElementById("btnSalvar").style.display = "inline-block";
    document.getElementById("btnAtualizar").style.display = "none";

  } catch (error) {
    console.error(error);
  }
}

// =======================
// LIMPAR FORM
// =======================
function limparFormulario() {
  document.getElementById("clienteId").value = "";
  document.getElementById("nome").value = "";
  document.getElementById("telefone").value = "";
  document.getElementById("endereco").value = "";
}