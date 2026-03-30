// Capturar ID do produto da URL
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

// Configuração da API
const API_BASE_URL = 'https://ropona.vercel.app/api';

if (id) {
  // Fazer fetch para obter detalhes do produto
  fetch(`${API_BASE_URL}/produtos/${id}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Produto não encontrado');
      }
      return response.json();
    })
    .then(produto => {
      const container = document.getElementById('produto-detalhe');
      container.innerHTML = `
        <div class="produto-detalhe">
          <img src="${produto.imagem}" alt="${produto.nome}" class="produto-imagem">
          <div class="produto-info">
            <h1>${produto.nome}</h1>
            <p class="categoria">Categoria: ${produto.categoria}</p>
            <p class="descricao">${produto.descricao}</p>
            <p class="preco">R$ ${produto.preco.toFixed(2)}</p>
            <button class="btn" onclick="addCarrinho('${produto.nome}', ${produto.preco}, '${produto.imagem}')">Adicionar ao Carrinho</button>
          </div>
        </div>
      `;
    })
    .catch(error => {
      console.error('Erro:', error);
      const container = document.getElementById('produto-detalhe');
      container.innerHTML = '<p>Erro ao carregar produto. Verifique se o servidor está rodando.</p>';
    });
} else {
  document.getElementById('produto-detalhe').innerHTML = '<p>ID do produto não fornecido.</p>';
}