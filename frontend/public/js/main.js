// ==============================
// 🔀 TROCA DE SEÇÕES DO PAINEL
// ==============================
function mostrarSecao(secaoId) {
    const secoes = ['clientes', 'produtos', 'pedidos', 'usuarios'];

    secoes.forEach(id => {
        const el = document.getElementById(id);

        if (!el) return;

        el.style.display = (id === secaoId) ? 'block' : 'none';
    });

    // ativa botão selecionado
    document.querySelectorAll('.nav-link').forEach(btn => {
        const ativo = btn.getAttribute('onclick')?.includes(secaoId);
        btn.classList.toggle('active', ativo);
    });
}

function parseJwt(token) {
    try {
        const base64Payload = token.split('.')[1];
        if (!base64Payload) return null;
        const payload = atob(base64Payload.replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(payload);
    } catch {
        return null;
    }
}

function getUserRole() {
    const token = localStorage.getItem('pizzaria_token');
    if (!token) return null;
    const payload = parseJwt(token);
    return payload?.role || null;
}

function mostrarPainelAdmin() {
    const painel = document.getElementById('painelAdminProduto');
    if (!painel) return;
    painel.style.display = getUserRole() === 'admin' ? 'block' : 'none';
}

function atualizarNavegacao() {
    const role = getUserRole();
    const usuariosBtn = document.querySelector("button[onclick=\"mostrarSecao('usuarios')\"]");

    if (usuariosBtn && usuariosBtn.closest('.nav-item')) {
        usuariosBtn.closest('.nav-item').style.display = role === 'admin' ? 'block' : 'none';
    }
}


// ==============================
// 🔐 TOKEN JWT (ADMIN)
// ==============================
function guardarToken() {
    const input = document.getElementById('tokenSwagger');
    const icon = document.getElementById('iconeCadeado');

    const token = input.value.trim();

    if (!token) {
        alert('❌ Insira um token válido');
        return;
    }

    const tokenLimpo = token.replace(/^Bearer\s+/i, '');

    localStorage.setItem('pizzaria_token', tokenLimpo);

    if (icon) {
        icon.className = 'fas fa-lock-open text-success';
    }

    alert('🔑 Token autenticado com sucesso');
}


// ==============================
// 🔄 RECUPERAR TOKEN AO ENTRAR
// ==============================
window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('pizzaria_token');

    if (token) {
        const input = document.getElementById('tokenSwagger');
        const icon = document.getElementById('iconeCadeado');

        if (input) input.value = token;
        if (icon) icon.className = 'fas fa-lock-open text-success';
    }

    mostrarPainelAdmin();
    atualizarNavegacao();
    mostrarSecao('clientes');
});
