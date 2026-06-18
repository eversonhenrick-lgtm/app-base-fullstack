document.addEventListener('DOMContentLoaded', function () {

    let ibgeGlobal = "";

    // ===============================
    // CEP → VIA CEP (AUTOMÁTICO)
    // ===============================
    const cepInput = document.getElementById('cepCadastro');

    if (cepInput) {
        cepInput.addEventListener('blur', async function () {
            const cep = this.value.replace(/\D/g, '');

            if (cep.length !== 8) return;

            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await response.json();

                if (data.erro) {
                    alert('CEP não encontrado!');
                    return;
                }

                document.getElementById('enderecoCadastro').value =
                    `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;

                // salva IBGE em variável segura
                ibgeGlobal = data.ibge;

            } catch (err) {
                console.error('Erro ViaCEP:', err);
            }
        });
    }

    // ===============================
    // SUBMIT CADASTRO
    // ===============================
    const form = document.getElementById('formCadastro');

    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            const cliente = {
                nome: document.getElementById('nomeCadastro').value,
                email: document.getElementById('emailCadastro').value,
                senha: document.getElementById('senhaCadastro').value,
                telefone: document.getElementById('telefoneCadastro').value,
                cep: document.getElementById('cepCadastro').value,
                endereco: document.getElementById('enderecoCadastro').value,
                ibge: ibgeGlobal || ""
            };

            try {
                const response = await fetch('http://localhost:3000/clientes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(cliente)
                });

                if (response.ok) {
                    alert('🎉 Conta criada com sucesso!');

                    form.reset();

                    const box = document.getElementById('cadastroBox');
                    if (box) box.style.display = 'none';

                    window.mostrarLogin();

                } else {
                    const erro = await response.json();
                    alert('❌ Erro: ' + (erro.message || 'Erro ao cadastrar'));
                }

            } catch (err) {
                console.error(err);
                alert('❌ Erro ao conectar com o servidor');
            }
        });
    }
});