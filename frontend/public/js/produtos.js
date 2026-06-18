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

        // verifica se é edição ou criação
        const editId = formulario.getAttribute('data-edit-id');

        const url = editId
            ? `http://localhost:3000/produtos/${editId}`
            : `http://localhost:3000/produtos`;

        const method = editId ? "PUT" : "POST";

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(produtoData)
        });

        if (response.ok) {
            const produtoCriado = await response.json();

            alert(`🎉 Produto "${produtoCriado.nome}" salvo com sucesso!`);

            formulario.reset();
            formulario.removeAttribute('data-edit-id');

            // recarrega lista corretamente
            if (typeof carregarCardapio === "function") {
                carregarCardapio();
            }

        } else {
            const erro = await response.json();
            alert(`❌ Erro ao salvar: ${erro.error || 'Erro desconhecido'}`);
        }

    } catch (error) {
        console.error('Erro:', error);
        alert('❌ Erro ao conectar com o servidor.');
    }
});


// ================= DELETE PRODUTO =================
window.deletarProduto = async function(id) {
    try {
        const token = localStorage.getItem('pizzaria_token');

        const response = await fetch(`http://localhost:3000/produtos/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Erro ao deletar produto");
        }

        // recarrega lista correta
        if (typeof carregarCardapio === "function") {
            carregarCardapio();
        }

    } catch (err) {
        console.error("Erro ao deletar:", err);
    }
}


// ================= EDIT PRODUTO =================
window.editarProduto = async function(id) {
    try {
        const response = await fetch('http://localhost:3000/produtos');
        const produtos = await response.json();

        const produto = produtos.find(p => (p.id || p._id) === id);

        if (!produto) {
            alert("Produto não encontrado");
            return;
        }

        document.getElementById('nome').value = produto.nome;
        document.getElementById('categoria').value = produto.categoria;
        document.getElementById('preco').value = produto.preco;
        document.getElementById('imagem').value = produto.imagem;
        document.getElementById('descricao').value = produto.descricao;

        // marca como edição
        document.getElementById('formProduto').setAttribute('data-edit-id', id);

    } catch (err) {
        console.error("Erro ao editar:", err);
    }
}