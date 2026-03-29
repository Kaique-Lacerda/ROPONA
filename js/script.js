// pega o carrinho salvo ou cria um vazio
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || []

// adicionar produto
function addCarrinho(nome, preco) {
  carrinho.push({ nome, preco })

  // salva no navegador
  localStorage.setItem("carrinho", JSON.stringify(carrinho))

  alert("Produto adicionado ao carrinho 🛒")
}

// mostrar carrinho na tela
function renderCarrinho() {
  const lista = document.getElementById("lista-carrinho")
  const totalEl = document.getElementById("total")

  if (!lista) return

  lista.innerHTML = ""

  let total = 0

  carrinho.forEach((item, index) => {
    total += item.preco

    lista.innerHTML += `
      <li>
        ${item.nome} - R$ ${item.preco.toFixed(2)}
        <button onclick="removerItem(${index})">X</button>
      </li>
    `
  })

  totalEl.innerText = "Total: R$ " + total.toFixed(2)
}

// remover item
function removerItem(index) {
  carrinho.splice(index, 1)

  localStorage.setItem("carrinho", JSON.stringify(carrinho))

  renderCarrinho()
}

// limpa carrinho
function limparCarrinho() {
  carrinho = []
  localStorage.setItem("carrinho", JSON.stringify(carrinho))
  renderCarrinho()
}

// roda quando abrir a página
renderCarrinho()