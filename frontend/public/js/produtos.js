document.getElementById('formProduto').addEventListener('submit', async function(e) {
    e.preventDefault();

    const formulario = document.getElementById('formProduto');

    const nome = formulario.querySelector('#nome').value;
    const categoria = formulario.querySelector('#categoria').value;
    const preco = formulario.querySelector('#preco').value;
    const imagem = formulario.querySelector('#imagem').value;
    const descricao = formulario.querySelector('#descricao').value;

    const produtoData = {
        nome,
        categoria,
        preco: parseFloat(preco),
        imagem,
        descricao
    };

    try {
        const token = localStorage.getItem('pizzaria_token');
        console.log("TOKEN:", token);
        console.log("DADOS:", produtoData);
        const response = await fetch('http://localhost:3000/produtos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(produtoData)
        });

        if (response.ok) {
            const produtoCriado = await response.json();

            alert(`🎉 Produto "${produtoCriado.nome}" adicionado com sucesso!`);

            formulario.reset();
        } else {
            const erro = await response.json();
            alert(`❌ Erro ao cadastrar: ${erro.error || 'Erro desconhecido'}`);
        }

    } catch (error) {
        console.error('Erro:', error);
        alert('❌ Erro ao conectar com o servidor.');
    }
});