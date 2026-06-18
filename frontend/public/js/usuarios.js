const API_URL = 'http://localhost:3000/usuarios';

// ============================
// LISTAR USUÁRIOS
// ============================
async function carregarUsuarios() {

    const token = localStorage.getItem('pizzaria_token');

    if (!token) return;

    try {

        const response = await fetch(API_URL, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const usuarios = await response.json();

        const lista =
            document.getElementById('listaUsuarios');

        if (!lista) return;

        lista.innerHTML = '';

        usuarios.forEach(usuario => {

            lista.innerHTML += `
                <tr>

                    <td>${usuario.nome}</td>

                    <td>${usuario.email}</td>

                    <td>

                        <button
                            class="btn btn-danger btn-sm"
                            onclick="deletarUsuario('${usuario.id}')"
                        >
                            🗑 Excluir
                        </button>

                    </td>

                </tr>
            `;
        });

    } catch (erro) {

        console.error(erro);

        alert('Erro ao carregar usuários.');
    }
}


// ============================
// CADASTRAR USUÁRIO
// ============================
async function criarUsuario(event) {

    event.preventDefault();

    const nome =
        document.getElementById('usuarioNome').value;

    const email =
        document.getElementById('usuarioEmail').value;

    const senha =
        document.getElementById('usuarioSenha').value;

    const token =
        localStorage.getItem('pizzaria_token');

    try {

        const response = await fetch(API_URL, {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },

            body: JSON.stringify({
                nome,
                email,
                senha
            })
        });

        const dados = await response.json();

        if (!response.ok) {

            alert(
                dados.error ||
                'Erro ao cadastrar usuário'
            );

            return;
        }

        alert('✅ Funcionário cadastrado!');

        document
            .getElementById('formUsuario')
            .reset();

        carregarUsuarios();

    } catch (erro) {

        console.error(erro);

        alert('Erro ao conectar com servidor.');
    }
}


// ============================
// DELETAR USUÁRIO
// ============================
async function deletarUsuario(id) {

    if (
        !confirm(
            'Deseja realmente excluir este funcionário?'
        )
    ) {
        return;
    }

    const token =
        localStorage.getItem('pizzaria_token');

    try {

        const response = await fetch(
            `${API_URL}/${id}`,
            {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const dados = await response.json();

        if (!response.ok) {

            alert(
                dados.error ||
                'Erro ao excluir usuário.'
            );

            return;
        }

        alert('🗑 Funcionário removido.');

        carregarUsuarios();

    } catch (erro) {

        console.error(erro);

        alert('Erro ao conectar com servidor.');
    }
}


// ============================
// EVENTOS
// ============================
document.addEventListener(
    'DOMContentLoaded',
    () => {

        carregarUsuarios();

        const form =
            document.getElementById('formUsuario');

        if (form) {

            form.addEventListener(
                'submit',
                criarUsuario
            );
        }
    }
);