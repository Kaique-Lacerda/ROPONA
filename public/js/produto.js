const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

const API_BASE_URL = 'https://ropona.vercel.app/api';

const container = document.getElementById('produto-detalhe');

function mostrarErro(msg) {
  container.innerHTML = `<p class="erro">${msg}</p>`;
}

function formatarPreco(valor) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

async function carregarProduto() {
  if (!id) {
    mostrarErro('ID do produto não fornecido.');
    return;
  }

  container.innerHTML = `<p class="loading">Carregando produto...</p>`;

  try {
    const response = await fetch(`${API_BASE_URL}/produtos/${id}`);

    if (!response.ok) {
      throw new Error();
    }

    const produto = await response.json();

    container.innerHTML = `
      <div class="produto-detalhe">
        <div class="produto-img-box">
          <img src="${produto.imagem}" alt="${produto.nome}">
        </div>

        <div class="produto-info">
          <span class="categoria">${produto.categoria}</span>
          <h1>${produto.nome}</h1>
          <p class="descricao">${produto.descricao}</p>

          <div class="preco-area">
            <p class="preco">${formatarPreco(produto.preco)}</p>
          </div>

          <button class="btn"
            onclick="addCarrinho('${produto.nome}', ${produto.preco}, '${produto.imagem}')">
            🛒 Adicionar ao Carrinho
          </button>
        </div>
      </div>
    `;

  } catch (error) {
    console.error(error);
    mostrarErro('Erro ao carregar produto.');
  }
}

carregarProduto();