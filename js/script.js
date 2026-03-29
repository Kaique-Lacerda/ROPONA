let carrinho = JSON.parse(localStorage.getItem("carrinho")) || []

function addCarrinho(nome, preco) {
  carrinho.push({ nome, preco })
  localStorage.setItem("carrinho", JSON.stringify(carrinho))

  alert("Produto adicionado! 🛒")
}

// renderiza carrinho
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
        <button onclick="removerItem(${index})">Remover</button>
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

// limpar carrinho
function limparCarrinho() {
  carrinho = []
  localStorage.setItem("carrinho", JSON.stringify(carrinho))
  renderCarrinho()
}

// executa ao abrir página
renderCarrinho()