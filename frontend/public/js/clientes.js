// Array global que vai guardar as pizzas que o cliente escolher
let carrinho = [];

document.addEventListener("DOMContentLoaded", () => {
    carregarCardapio();
});

// 1️⃣ BUSCA AS PIZZAS E ADICIONA O BOTÃO "ADICIONAR" CORRETO
async function carregarCardapio() {
    const lista = document.getElementById("listaProdutos");
    if (!lista) return;

    try {
        const response = await fetch('http://localhost:3000/produtos');
        const produtos = await response.json();

        if (!Array.isArray(produtos) || produtos.length === 0) {
            lista.innerHTML = '<p class="text-center text-muted w-100">Nenhum item disponível no momento.</p>';
            return;
        }

        lista.innerHTML = "";

        produtos.forEach(pizza => {
            // Criamos uma string limpa para passar os dados no clique do botão
            const pizzaDados = JSON.stringify({
                id: pizza.id || pizza._id, // Garante compatibilidade com o ID do banco
                nome: pizza.nome,
                preco: parseFloat(pizza.preco)
            }).replace(/"/g, '&quot;');

            lista.innerHTML += `
                <div class="col">
                    <div class="card h-100 bg-secondary text-white border-dark">
                        <img src="${pizza.imagem || 'https://via.placeholder.com/300x200?text=Pizza'}" class="card-img-top" alt="${pizza.nome}" style="height: 180px; object-fit: cover;">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title text-warning fw-bold">${pizza.nome}</h5>
                            <p class="card-text text-muted flex-grow-1" style="font-size: 0.85rem;">${pizza.descricao || 'Sem descrição.'}</p>
                            <div class="d-flex justify-content-between align-items-center mt-3">
                                <span class="fs-5 fw-bold text-success">R$ ${Number(pizza.preco).toFixed(2)}</span>
                                <button class="btn btn-warning btn-sm fw-bold" onclick="adicionarAoCarrinho('${pizzaDados}')">
                                    + Adicionar 🛒
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error("Erro ao carregar cardápio:", error);
    }
}

// 2️⃣ ADICIONAR PRODUTOS (E TRATAR CASO JÁ EXISTA - ADICIONANDO MÚLTIPLOS)
function adicionarAoCarrinho(pizzaJson) {
    const itemDados = JSON.parse(pizzaJson);
    
    // Procura se esse item já está no carrinho
    const itemExistente = carrinho.find(item => item.id === itemDados.id);

    if (itemExistente) {
        itemExistente.quantidade += 1; // Se já existir, só aumenta a quantidade
    } else {
        carrinho.push({ ...itemDados, quantidade: 1 }); // Se for novo, adiciona com quantidade 1
    }

    atualizarInterfaceCarrinho();
}

// 3️⃣ ATUALIZA A TELA DO CARRINHO (QUANTIDADE, PREÇOS E BOTÕES DE DELETAR/EDITAR)
function atualizarInterfaceCarrinho() {
    const container = document.getElementById("itensCarrinho");
    const totalTela = document.getElementById("totalCarrinho");
    const contador = document.getElementById("contadorItens");
    const btnFinalizar = document.getElementById("btnFinalizar");

    if (carrinho.length === 0) {
        container.innerHTML = '<p class="text-center text-muted my-4">Seu carrinho está vazio.</p>';
        totalTela.innerText = "R$ 0,00";
        contador.innerText = "0 itens";
        btnFinalizar.disabled = true;
        return;
    }

    container.innerHTML = "";
    let totalGeral = 0;
    let totalItens = 0;

    carrinho.forEach((item, index) => {
        const subtotal = item.preco * item.quantidade;
        totalGeral += subtotal;
        totalItens += item.quantidade;

        container.innerHTML += `
            <div class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-dark">
                <div style="max-width: 55%;">
                    <h6 class="mb-0 fw-bold text-warning">${item.nome}</h6>
                    <small class="text-muted">R$ ${item.preco.toFixed(2)} un.</small>
                </div>
                
                <div class="d-flex align-items-center">
                    <button class="btn btn-dark btn-sm px-2 text-warning" onclick="mudarQuantidade(${index}, -1)">-</button>
                    <span class="mx-2 fw-bold" style="min-width: 15px; text-align: center;">${item.quantidade}</span>
                    <button class="btn btn-dark btn-sm px-2 text-warning" onclick="mudarQuantidade(${index}, 1)">+</button>
                    
                    <button class="btn btn-outline-danger btn-sm ms-3" onclick="removerDoCarrinho(${index})">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        `;
    });

    totalTela.innerText = `R$ ${totalGeral.toFixed(2)}`;
    contador.innerText = `${totalItens} ${totalItens === 1 ? 'item' : 'itens'}`;
    btnFinalizar.disabled = false;
}

// 4️⃣ FUNÇÃO PARA EDITAR QUANTIDADE (+ ou -)
function mudarQuantidade(index, valor) {
    carrinho[index].quantidade += valor;
    
    // Se a quantidade chegar a 0, removemos o item automaticamente
    if (carrinho[index].quantidade <= 0) {
        removerDoCarrinho(index);
    } else {
        atualizarInterfaceCarrinho();
    }
}

// 5️⃣ FUNÇÃO PARA EXCLUIR ITEM DO CARRINHO
function removerDoCarrinho(index) {
    carrinho.splice(index, 1); // Remove 1 item baseado na posição do array
    atualizarInterfaceCarrinho();
}

// 6️⃣ REGISTRAR PEDIDO (Envia a estrutura final para a sua API)
async function registrarPedido() {
    // Aqui você pode colher dados extras se quiser (como endereço/observação)
    const pedidoData = {
        itens: carrinho,
        data: new Date().toISOString(),
        status: "Pendente"
    };

    try {
        const response = await fetch('http://localhost:3000/pedidos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pedidoData)
        });

        if (response.ok) {
            alert("🎉 Pedido registrado com sucesso na Pizzaria! Agora é só aguardar.");
            carrinho = []; // Limpa o carrinho local
            atualizarInterfaceCarrinho();
        } else {
            alert("❌ Erro ao enviar o pedido para a cozinha.");
        }
    } catch (error) {
        console.error("Erro ao registrar pedido:", error);
        alert("Erro de conexão com a pizzaria.");
    }
}