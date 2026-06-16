async function carregarCardapio() {
    const lista = document.getElementById("listaProdutos");

    if (!lista) return;

    lista.innerHTML = "<p class='text-center text-white'>Carregando cardápio...</p>";

    try {
        const response = await fetch("http://localhost:3000/produtos");
        const produtos = await response.json();

        if (!Array.isArray(produtos) || produtos.length === 0) {
            lista.innerHTML = "<p class='text-center text-muted'>Nenhum produto encontrado</p>";
            return;
        }

        lista.innerHTML = "";

        produtos.forEach(produto => {
            const card = `
                <div class="col">
                    <div class="card bg-dark text-white h-100 border-secondary">

                        <img src="${produto.imagem || 'https://via.placeholder.com/300'}"
                             class="card-img-top"
                             style="height:200px; object-fit:cover;">

                        <div class="card-body d-flex flex-column">

                            <div class="d-flex justify-content-between">
                                <h5 class="text-warning">${produto.nome}</h5>
                                <span class="badge bg-secondary">${produto.categoria}</span>
                            </div>

                            <p class="text-muted small flex-grow-1">
                                ${produto.descricao || "Sem descrição"}
                            </p>

                            <div class="d-flex justify-content-between align-items-center">
                                <strong class="text-success">
                                    R$ ${Number(produto.preco).toFixed(2)}
                                </strong>

                                <button class="btn btn-warning btn-sm">
                                    Adicionar 🛒
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            `;

            lista.innerHTML += card;
        });

    } catch (error) {
        console.error(error);
        lista.innerHTML = "<p class='text-danger text-center'>Erro ao carregar cardápio</p>";
    }
}

document.addEventListener("DOMContentLoaded", carregarCardapio);