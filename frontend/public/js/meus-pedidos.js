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

function getBadgeStatus(status) {

    switch (status) {

        case 'pendente':
            return 'bg-warning text-dark';

        case 'preparando':
            return 'bg-primary';

        case 'saiu para entrega':
            return 'bg-info';

        case 'entregue':
            return 'bg-success';

        case 'cancelado':
            return 'bg-danger';

        default:
            return 'bg-secondary';
    }
}

document.addEventListener('DOMContentLoaded', async () => {

    const listaPedidos =
        document.getElementById('listaPedidos');

    if (!listaPedidos) return;

    const token =
        localStorage.getItem('pizzaria_token');

    if (!token) {

        listaPedidos.innerHTML = `
            <div class="col-12">
                <div class="alert alert-warning">
                    Faça login para visualizar seus pedidos.
                </div>
            </div>
        `;

        return;
    }

    try {

        const payload = parseJwt(token);

        if (!payload || !payload.id) {

            listaPedidos.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger">
                        Sessão inválida.
                    </div>
                </div>
            `;

            return;
        }

        const response = await fetch(
            `http://localhost:3000/pedidos/cliente/${payload.id}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        const pedidos = await response.json();

        if (!response.ok) {

            throw new Error(
                pedidos.error ||
                'Erro ao buscar pedidos'
            );
        }

        if (pedidos.length === 0) {

            listaPedidos.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-info">
                        Você ainda não realizou nenhum pedido.
                    </div>
                </div>
            `;

            return;
        }

        listaPedidos.innerHTML = '';

        pedidos.forEach(pedido => {

            const badgeClass =
                getBadgeStatus(pedido.status);

            const dataPedido =
                pedido.criadoEm
                    ? new Date(
                        pedido.criadoEm._seconds
                            ? pedido.criadoEm._seconds * 1000
                            : pedido.criadoEm
                    ).toLocaleString('pt-BR')
                    : 'Data não disponível';

            let itensHtml = '';

            if (pedido.itens && pedido.itens.length > 0) {

                pedido.itens.forEach(item => {

                    itensHtml += `
                        <li>
                            ${item.nome}
                            x${item.quantidade}
                        </li>
                    `;
                });
            }

            listaPedidos.innerHTML += `
                <div class="col">

                    <div class="card shadow-sm h-100">

                        <div class="card-body">

                            <div class="d-flex justify-content-between align-items-center">

                                <h5 class="card-title mb-0">
                                    📦 Pedido
                                </h5>

                                <span class="badge ${badgeClass}">
                                    ${pedido.status}
                                </span>

                            </div>

                            <hr>

                            <p>
                                <strong>Total:</strong>
                                R$ ${Number(pedido.total).toFixed(2)}
                            </p>

                            <p>
                                <strong>Data:</strong>
                                ${dataPedido}
                            </p>

                            <strong>Itens:</strong>

                            <ul class="mt-2">
                                ${itensHtml}
                            </ul>

                        </div>

                    </div>

                </div>
            `;
        });

    } catch (erro) {

        console.error(erro);

        listaPedidos.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger">
                    Não foi possível carregar os pedidos.
                </div>
            </div>
        `;
    }
});