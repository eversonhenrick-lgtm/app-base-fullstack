document.getElementById('formProduto').addEventListener('submit', async function(e) {
    e.preventDefault(); // Impede a página de recarregar

    // Isolamos o formulário de produtos para evitar conflitos com a aba de clientes
    const formulario = document.getElementById('formProduto');

    // Captura os valores dos inputs de forma segura usando querySelector
    const nome = formulario.querySelector('#nome').value;
    const categoria = formulario.querySelector('#categoria').value;
    const preco = formulario.querySelector('#preco').value;
    const imagem = formulario.querySelector('#imagem').value; // Captura a URL da foto que você adicionou
    const descricao = formulario.querySelector('#descricao').value;

    // Monta o objeto com todos os campos atuais
    const produtoData = {
        nome: nome,
        categoria: categoria,
        preco: parseFloat(preco), 
        imagem: imagem, // Enviando a URL da imagem para o seu banco de dados
        descricao: descricao
    };

    try {
        // Busca o token salvando no localStorage pelo painel principal
        const token = localStorage.getItem('pizzaria_token');

        // Envia os dados via POST para a API do seu Backend
        const response = await fetch('http://localhost:3000/produtos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Envia o token de autenticação que o backend precisa para liberar o preço e o cadastro
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(produtoData)
        });

        if (response.ok) {
            const produtoCriado = await response.json();
            alert(`🎉 Produto "${produtoCriado.nome}" adicionado com sucesso!`);
            
            // Limpa o formulário após o sucesso
            formulario.reset();
            
            // 🔥 ADICIONADO: Atualiza o cardápio na tela na mesma hora!
            carregarProdutos();
        } else {
            const erro = await response.json();
            alert(`❌ Erro ao cadastrar: ${erro.error || 'Erro desconhecido'}`);
        }

    } catch (error) {
        console.error('Erro na comunicação com o servidor:', error);
        alert('❌ Não foi possível conectar ao servidor do backend. Verifique se ele está rodando na porta 3000.');
    }
});

// =========================================================================
// 🔥 NOVO: FUNÇÃO PARA BUSCAR AS PIZZAS DO FIREBASE E CRIAR OS CARDS NA TELA
// =========================================================================
async function carregarProdutos() {
    const lista = document.getElementById("listaProdutos");
    if (!lista) return; // Garante que o elemento existe na tela antes de rodar

    lista.innerHTML = '<p class="text-center text-white w-100">Carregando cardápio...</p>';

    try {
        const response = await fetch('http://localhost:3000/produtos');
        const produtos = await response.json();

        if (!Array.isArray(produtos) || produtos.length === 0) {
            lista.innerHTML = '<p class="text-center text-muted w-100">Nenhum produto cadastrado no cardápio.</p>';
            return;
        }

        lista.innerHTML = ""; // Limpa o texto de "Carregando..."

        produtos.forEach(pizza => {
            const cardHTML = `
                <div class="col">
                    <div class="card h-100 bg-dark text-white border-secondary" style="box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                        <img src="${pizza.imagem || 'https://via.placeholder.com/300x200?text=Pizza'}" 
                             class="card-img-top" 
                             alt="${pizza.nome}" 
                             style="height: 200px; object-fit: cover;">
                        <div class="card-body d-flex flex-column">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h5 class="card-title text-warning fw-bold mb-0">${pizza.nome}</h5>
                                <span class="badge bg-secondary text-uppercase" style="font-size: 0.75rem;">${pizza.categoria}</span>
                            </div>
                            <p class="card-text text-secondary flex-grow-1" style="font-size: 0.9rem;">
                                ${pizza.descricao || 'Sem descrição ou ingredientes informados.'}
                            </p>
                            <div class="d-flex justify-content-between align-items-center mt-3 pt-2 border-top border-secondary">
                                <span class="fs-4 fw-bold text-success">R$ ${Number(pizza.preco).toFixed(2)}</span>
                                <button class="btn btn-warning btn-sm fw-bold px-3">Adicionar 🛒</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            lista.innerHTML += cardHTML;
        });
    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        lista.innerHTML = '<p class="text-center text-danger w-100">Erro ao carregar o cardápio. Verifique a conexão.</p>';
    }
}

// 🔥 NOVO: Faz o cardápio carregar automaticamente assim que o site abrir
document.addEventListener("DOMContentLoaded", carregarProdutos);