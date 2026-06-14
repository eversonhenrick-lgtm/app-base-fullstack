document.getElementById('formLogin').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
        // Aponta para a porta 3000 onde o seu BACKEND está rodando a rota de usuários
        const response = await fetch('http://localhost:3000/usuarios/login', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json' // <-- ISSO AQUI É OBRIGATÓRIO
        },
             body: JSON.stringify({ email: email, senha: senha }) // <-- Transforma em texto JSON
    });

        const dados = await response.json();

      if (response.ok) {
            // 1º Passo: Salva o token para ter permissão de acessar o sistema
            localStorage.setItem('token', dados.token);
            
            // 2º Passo: Redireciona o usuário para o painel
            window.location.href = '/painel'; 
        } else {
            // Exibe o erro caso a senha ou email estejam errados
            alert(dados.error || 'Erro ao fazer login.');
        }
    } catch (erro) {
        console.error('Erro na comunicação com a API:', erro);
        alert('Não foi possível conectar ao servidor principal.');
    }
});