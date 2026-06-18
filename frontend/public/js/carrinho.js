function parseJwt(token) {
    try {
        const base64Payload = token.split('.')[1];

        if (!base64Payload) return null;

        const payload = atob(
            base64Payload
                .replace(/-/g, '+')
                .replace(/_/g, '/')
        );

        return JSON.parse(payload);

    } catch {
        return null;
    }
}

// Carrinho salvo no navegador
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

// Atualiza o contador vermelho
function atualizarContadorCarrinho() {
    const contador = document.getElementById('contadorCarrinho');

    if (contador) {
        contador.textContent = carrinho.length;
    }

    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

function adicionarCarrinho(produto) {

    const itemExistente = carrinho.find(
        item => item.id === produto.id
    );

    if (itemExistente) {

        itemExistente.quantidade += 1;

    } else {

        carrinho.push({
            ...produto,
            preco: Number(produto.preco), // 🔥 FIX IMPORTANTE
            quantidade: 1
        });
    }

    atualizarContadorCarrinho();

    alert(`🛒 ${produto.nome} adicionado ao carrinho!`);
}

// Remove produto
function removerCarrinho(index) {

    carrinho.splice(index, 1);

    atualizarContadorCarrinho();

    renderizarCarrinho();
}

// Renderiza os itens no modal
function renderizarCarrinho() {

    const itensCarrinho =
        document.getElementById('itensCarrinho');

    const totalCarrinho =
        document.getElementById('totalCarrinho');

    if (!itensCarrinho || !totalCarrinho) return;

    if (carrinho.length === 0) {

        itensCarrinho.innerHTML = `
            <p class="text-muted">
                Seu carrinho está vazio.
            </p>
        `;

        totalCarrinho.textContent =
            'Total: R$ 0,00';

        return;
    }

    let total = 0;

    itensCarrinho.innerHTML = '';

    carrinho.forEach((produto, index) => {

        total +=
            Number(produto.preco) *
            Number(produto.quantidade); // 🔥 FIX GARANTIDO

        itensCarrinho.innerHTML += `
            <div class="d-flex justify-content-between align-items-center border-bottom py-2">

                <div>

                    <strong>
                        ${produto.nome}
                    </strong>

                    <br>

                    <small>
                        Quantidade: ${produto.quantidade}
                    </small>

                </div>

                <button
                    class="btn btn-sm btn-danger"
                    onclick="removerCarrinho(${index})"
                >
                    ❌
                </button>

            </div>
        `;
    });

    totalCarrinho.textContent =
        `Total: R$ ${total.toFixed(2)}`;
}

// Abrir modal
function abrirCarrinho() {

    renderizarCarrinho();

    const modal = new bootstrap.Modal(
        document.getElementById('modalCarrinho')
    );

    modal.show();
}

// Eventos ao carregar página
document.addEventListener('DOMContentLoaded', () => {

    atualizarContadorCarrinho();

    const btnCarrinho =
        document.getElementById('btnCarrinho');

    if (btnCarrinho) {
        btnCarrinho.addEventListener(
            'click',
            abrirCarrinho
        );
    }

    const btnFinalizar =
        document.getElementById('btnFinalizarPedido');

    if (btnFinalizar) {

        btnFinalizar.addEventListener('click', async () => {

            if (carrinho.length === 0) {

                alert('Seu carrinho está vazio.');

                return;
            }

            const token = localStorage.getItem('pizzaria_token');

            if (!token) {

                alert('Faça login para finalizar o pedido.');

                return;
            }

            try {

                const payload = parseJwt(token);

                if (!payload || !payload.id) {
                    alert('Sessão inválida. Faça login novamente.');
                    return;
                }

                const total = carrinho.reduce(
                    (soma, item) =>
                        soma + (Number(item.preco) * Number(item.quantidade)),
                    0
                );

                const itensFormatados = carrinho.map(item => ({
                    produtoId: item.id,
                    nome: item.nome,
                    preco: Number(item.preco), // 🔥 FIX
                    quantidade: Number(item.quantidade) // 🔥 FIX
                }));

                const pedido = {
                    clienteId: payload.id,

                    itens: itensFormatados,

                    total: Number(total), // 🔥 FIX

                    status: "pendente",

                    createdAt: new Date().toISOString()
                };

                const response = await fetch(
                    'http://localhost:3000/pedidos',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(pedido)
                    }
                );

                const dados = await response.json();

                if (!response.ok) {

                    alert(
                        dados.error ||
                        'Erro ao finalizar pedido.'
                    );

                    return;
                }

                alert('🎉 Pedido realizado com sucesso!');

                carrinho = [];

                atualizarContadorCarrinho();

                renderizarCarrinho();

                setTimeout(() => {
                    window.location.href = '/meus-pedidos';
                }, 500);

            } catch (erro) {

                console.error(erro);

                alert('Erro ao conectar com o servidor.');
            }
        });
    }

});