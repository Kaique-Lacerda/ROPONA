let carrinho = JSON.parse(localStorage.getItem("carrinho")) || []

function addCarrinho(nome, preco) {
  carrinho.push({ nome, preco })
  localStorage.setItem("carrinho", JSON.stringify(carrinho))
  alert("Produto adicionado! 🛒")
}

/* =========================
   CARROSSEL INFINITO MANUAL
========================= */

function initInfiniteScroll() {
  const container = document.getElementById("produtos")
  if (!container) return

  const items = Array.from(container.children)
  const gap = 20
  const itemWidth = items[0].offsetWidth + gap

  // duplica itens
  items.forEach(item => {
    container.appendChild(item.cloneNode(true))
  })

  items.slice().reverse().forEach(item => {
    container.insertBefore(item.cloneNode(true), container.firstChild)
  })

  // começa no meio
  container.scrollLeft = container.scrollWidth / 3

  let isJumping = false

  container.addEventListener("scroll", () => {
    if (isJumping) return

    const maxScroll = container.scrollWidth

    if (container.scrollLeft < itemWidth) {
      isJumping = true
      container.scrollLeft += items.length * itemWidth
      requestAnimationFrame(() => isJumping = false)
    }

    if (container.scrollLeft > maxScroll - items.length * itemWidth) {
      isJumping = true
      container.scrollLeft -= items.length * itemWidth
      requestAnimationFrame(() => isJumping = false)
    }
  })
}

/* =========================
   DRAG COM MOUSE (EXTRA TOP)
========================= */

function enableDragScroll() {
  const container = document.getElementById("produtos")
  if (!container) return

  let isDown = false
  let startX
  let scrollLeft

  container.addEventListener("mousedown", (e) => {
    isDown = true
    startX = e.pageX - container.offsetLeft
    scrollLeft = container.scrollLeft
  })

  container.addEventListener("mouseleave", () => {
    isDown = false
  })

  container.addEventListener("mouseup", () => {
    isDown = false
  })

  container.addEventListener("mousemove", (e) => {
    if (!isDown) return
    e.preventDefault()

    const x = e.pageX - container.offsetLeft
    const walk = (x - startX) * 2
    container.scrollLeft = scrollLeft - walk
  })
}

function initScrollReveal() {
  const revealItems = document.querySelectorAll('.reveal')
  if (!revealItems.length) return

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
      }
    })
  }, {
    threshold: 0.25
  })

  revealItems.forEach(item => observer.observe(item))
}

/* =========================
   INIT
========================= */

window.addEventListener("load", () => {
  initInfiniteScroll()
  enableDragScroll()
  initScrollReveal()
})

gabriel rsrsrsrsrsrs
gabriel rsrsrsrsrsrs
gabriel rsrsrsrsrsrs
gabriel rsrsrsrsrsrs
gabriel rsrsrsrsrsrs
gabriel rsrsrsrsrsrs
gabriel rsrsrsrsrsrs
gabriel rsrsrsrsrsrs
gabriel rsrsrsrsrsrs
gabriel rsrsrsrsrsrs
gabriel rsrsrsrsrsrs
gabriel rsrsrsrsrsrs
gabriel rsrsrsrsrsrs
gabriel rsrsrsrsrsrs
gabriel rsrsrsrsrsrs
gabriel rsrsrsrsrsrs
gabriel rsrsrsrsrsrs

let carrinho = JSON.parse(localStorage.getItem("carrinho")) || []

function addCarrinho(nome, preco, img) {
  carrinho.push({ nome, preco, img })
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
        <input type="checkbox" class="item-checkbox" data-index="${index}" onchange="updateAcoes()">
        ${item.img ? `<img src="${item.img}" alt="${item.nome}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;">` : ''}
        <span>${item.nome} - R$ ${item.preco.toFixed(2)}</span>
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

// remover selecionados
function removerSelecionados() {
  const checkboxes = document.querySelectorAll('.item-checkbox:checked')
  const indices = Array.from(checkboxes).map(cb => parseInt(cb.dataset.index)).sort((a, b) => b - a)
  indices.forEach(index => carrinho.splice(index, 1))
  localStorage.setItem("carrinho", JSON.stringify(carrinho))
  renderCarrinho()
}

// limpar carrinho
function limparCarrinho() {
  carrinho = []
  localStorage.setItem("carrinho", JSON.stringify(carrinho))
  renderCarrinho()
}

// comprar todos
function comprarTodos() {
  if (carrinho.length === 0) {
    alert("Carrinho vazio!")
    return
  }
  alert("Compra de todos os itens realizada! Total: R$ " + carrinho.reduce((sum, item) => sum + item.preco, 0).toFixed(2))
  limparCarrinho()
}

// comprar selecionados
function comprarSelecionados() {
  const checkboxes = document.querySelectorAll('.item-checkbox:checked')
  if (checkboxes.length === 0) {
    alert("Nenhum item selecionado!")
    return
  }
  const selectedItems = Array.from(checkboxes).map(cb => carrinho[parseInt(cb.dataset.index)])
  const total = selectedItems.reduce((sum, item) => sum + item.preco, 0)
  alert("Compra dos itens selecionados realizada! Total: R$ " + total.toFixed(2))
  removerSelecionados()
}

// update acoes
function updateAcoes() {
  const checkedBoxes = document.querySelectorAll('.item-checkbox:checked')
  const selectedItems = Array.from(checkedBoxes).map(cb => carrinho[parseInt(cb.dataset.index)])
  const total = selectedItems.reduce((sum, item) => sum + item.preco, 0)
  document.getElementById('total-selecionados').innerText = `Total: R$ ${total.toFixed(2)}`
  document.getElementById('sidebar').style.display = checkedBoxes.length > 0 ? 'block' : 'none'
}

// executa ao abrir página
renderCarrinho()