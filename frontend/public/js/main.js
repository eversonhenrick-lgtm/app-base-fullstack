function mostrarSecao(secaoId) {
    // 1. Lista com o ID de todas as seções do painel
    const secoes = ['clientes', 'produtos', 'pedidos', 'usuarios'];

    // 2. Passa de uma em uma: se for a clicada, mostra. Se não for, esconde.
    secoes.forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) {
            if (id === secaoId) {
                elemento.style.display = 'block'; // Mostra a seção atual
            } else {
                elemento.style.display = 'none';  // Esconde as outras
            }
        }
    });

    // 3. Atualiza o visual do botão (deixa o botão clicado com a classe active)
    const botoes = document.querySelectorAll('.nav-tabs .nav-link');
    botoes.forEach(botao => {
        if (botao.getAttribute('onclick') && botao.getAttribute('onclick').includes(secaoId)) {
            botao.classList.add('active');
        } else {
            botao.classList.remove('active');
        }
    });
}

// Função chamada ao clicar no botão "Autenticar"
function guardarToken() {
    const tokenInput = document.getElementById('tokenSwagger').value.trim();
    
    if (!tokenInput) {
        alert('❌ Por favor, cole um token válido.');
        return;
    }

    // Limpa a palavra "Bearer " caso você tenha copiado junto com o token
    const tokenLimpo = tokenInput.replace(/^Bearer\s+/i, '');

    // Salva permanentemente no navegador
    localStorage.setItem('pizzaria_token', tokenLimpo);
    
    // Altera o visual do cadeado para mostrar que deu certo
    document.getElementById('iconeCadeado').className = 'fas fa-lock-open text-success';
    alert('🔑 Token sincronizado com sucesso! Cadastro de produtos liberado.');
}

// Executa automaticamente ao carregar a página para recuperar o token salvo
window.addEventListener('DOMContentLoaded', () => {
    const tokenSalvo = localStorage.getItem('pizzaria_token');
    if (tokenSalvo) {
        document.getElementById('tokenSwagger').value = tokenSalvo;
        document.getElementById('iconeCadeado').className = 'fas fa-lock-open text-success';
    }
});