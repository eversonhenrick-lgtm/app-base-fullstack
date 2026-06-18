const API_PEDIDOS =
    'http://localhost:3000/pedidos';


// ============================
// CARREGAR PEDIDOS
// ============================
async function carregarPedidos() {

    const token =
        localStorage.getItem('pizzaria_token');

    if (!token) return;

    try {

        const response = await fetch(
            API_PEDIDOS,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const pedidos =
            await response.json();

        const lista =
            document.getElementById('listaPedidos');

        if (!lista) return;

        lista.innerHTML = '';

        pedidos.forEach(pedido => {

            lista.innerHTML += `

                <div class="col">

                    <div class="card h-100 shadow-sm">

                        <div class="card-body">

                            <h5 class="text-warning">
                                📦 Pedido
                            </h5>

                            <p>
                                <p>
                                    <strong>Cliente:</strong>
                                    ${pedido.clienteNome || pedido.clienteId}
                                </p>
                            </p>

                            <p>
                                <strong>Total:</strong>
                                R$ ${Number(
                                    pedido.total || 0
                                ).toFixed(2)}
                            </p>

                            <p>
                                <strong>Status:</strong>
                            </p>

                            <select
                                class="form-select"
                                onchange="alterarStatus('${pedido.id}', this.value)"
                            >

                                <option
                                    value="pendente"
                                    ${pedido.status === 'pendente' ? 'selected' : ''}
                                >
                                    Pendente
                                </option>

                                <option
                                    value="preparando"
                                    ${pedido.status === 'preparando' ? 'selected' : ''}
                                >
                                    Preparando
                                </option>

                                <option
                                    value="saiu para entrega"
                                    ${pedido.status === 'saiu para entrega' ? 'selected' : ''}
                                >
                                    Saiu para entrega
                                </option>

                                <option
                                    value="entregue"
                                    ${pedido.status === 'entregue' ? 'selected' : ''}
                                >
                                    Entregue
                                </option>

                            </select>

                        </div>

                    </div>

                </div>

            `;
        });

    } catch (erro) {

        console.error(erro);

        alert(
            'Erro ao carregar pedidos.'
        );
    }
}


// ============================
// ALTERAR STATUS
// ============================
async function alterarStatus(
    pedidoId,
    novoStatus
) {

    const token =
        localStorage.getItem('pizzaria_token');

    try {

        const response = await fetch(
            `${API_PEDIDOS}/${pedidoId}`,
            {
                method: 'PUT',

                headers: {
                    'Content-Type':
                        'application/json',

                    Authorization:
                        `Bearer ${token}`
                },

                body: JSON.stringify({
                    status: novoStatus
                })
            }
        );

        const dados =
            await response.json();

        if (!response.ok) {

            alert(
                dados.error ||
                'Erro ao atualizar pedido.'
            );

            return;
        }

        alert(
            '✅ Status atualizado!'
        );

    } catch (erro) {

        console.error(erro);

        alert(
            'Erro ao conectar ao servidor.'
        );
    }
}


// ============================
// INICIALIZAÇÃO
// ============================
document.addEventListener(
    'DOMContentLoaded',
    () => {

        carregarPedidos();

    }
);