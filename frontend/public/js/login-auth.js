document.getElementById('formLogin').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    async function tentarLogin(url) {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });

        const dados = await response.json();
        return { response, dados, url };
    }

    try {
        let resultado = await tentarLogin('http://localhost:3000/usuarios/login');

        if (!resultado.response.ok) {
            resultado = await tentarLogin('http://localhost:3000/clientes/login');
        }

        if (resultado.response.ok) {
            localStorage.setItem('pizzaria_token', resultado.dados.token);
            const ehAdmin = resultado.url.includes('/usuarios/login');
            window.location.href = ehAdmin ? '/painel' : '/cardapio';
        } else {
            alert(resultado.dados.error || 'Erro ao fazer login.');
        }
    } catch (erro) {
        console.error('Erro na comunicação com a API:', erro);
        alert('Não foi possível conectar ao servidor principal.');
    }

    
});

window.mostrarCadastro = function () {
    const login = document.getElementById('loginBox');
    const cadastro = document.getElementById('cadastroBox');

    if (!login || !cadastro) return;

    // esconde login
    login.style.display = 'none';

    // mostra cadastro
    cadastro.style.display = 'block';
};

window.mostrarLogin = function () {
    const login = document.getElementById('loginBox');
    const cadastro = document.getElementById('cadastroBox');

    if (!login || !cadastro) return;

    cadastro.style.display = 'none';
    login.style.display = 'block';
};