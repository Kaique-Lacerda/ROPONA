/* =========================
   STORAGE / ESTADO GLOBAL
========================= */
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || []

function salvarCarrinho() {
  localStorage.setItem("carrinho", JSON.stringify(carrinho))
}

/* =========================
   ADICIONAR AO CARRINHO
========================= */
function addCarrinho(nome, preco, img = null) {
  carrinho.push({ nome, preco, img })
  salvarCarrinho()

  // feedback melhor que alert (mais moderno)
  console.log("Produto adicionado:", nome)
  alert("Produto adicionado ao carrinho! 🛒")
}

/* =========================
   CARROSSEL INFINITO
========================= */
function initInfiniteScroll() {
  const container = document.getElementById("produtos")
  if (!container) return

  const items = Array.from(container.children)
  if (items.length === 0) return

  // duplicar itens 3 vezes (total 4 conjuntos)
  for (let i = 0; i < 3; i++) {
    items.forEach(item => {
      container.appendChild(item.cloneNode(true))
    })
  }

  container.scrollLeft = container.scrollWidth / 4

  let isJumping = false
  let autoScroll = setInterval(() => {
    if (!isJumping) {
      container.scrollLeft += 1;
    }
  }, 50);

  container.addEventListener("scroll", () => {
    if (isJumping) return

    const maxScroll = container.scrollWidth

    if (container.scrollLeft > maxScroll * 0.75) {
      isJumping = true
      container.scrollLeft = maxScroll * 0.25
      requestAnimationFrame(() => isJumping = false)
    }

    if (container.scrollLeft < maxScroll * 0.25) {
      isJumping = true
      container.scrollLeft = maxScroll * 0.75 - container.clientWidth
      requestAnimationFrame(() => isJumping = false)
    }
  })

  // pausar auto-scroll durante drag
  container.addEventListener("mousedown", () => {
    clearInterval(autoScroll)
    autoScroll = null
  })

  container.addEventListener("mouseup", () => {
    if (!autoScroll) {
      autoScroll = setInterval(() => {
        if (!isJumping) {
          container.scrollLeft += 1;
        }
      }, 50);
    }
  })

  container.addEventListener("mouseleave", () => {
    if (!autoScroll) {
      autoScroll = setInterval(() => {
        if (!isJumping) {
          container.scrollLeft += 1;
        }
      }, 50);
    }
  })
}

/* =========================
   DRAG SCROLL (MOUSE)
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

  container.addEventListener("mouseleave", () => isDown = false)
  container.addEventListener("mouseup", () => isDown = false)

  container.addEventListener("mousemove", (e) => {
    if (!isDown) return
    e.preventDefault()

    const x = e.pageX - container.offsetLeft
    const walk = (x - startX) * 2
    container.scrollLeft = scrollLeft - walk
  })
}

/* =========================
   SCROLL REVEAL
========================= */
function initScrollReveal() {
  const revealItems = document.querySelectorAll(".reveal")
  if (!revealItems.length) return

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")
      }
    })
  }, { threshold: 0.25 })

  revealItems.forEach(item => observer.observe(item))
}

/* =========================
   RENDER DO CARRINHO
========================= */
function renderCarrinho() {
  const lista = document.getElementById("lista-carrinho")
  const totalEl = document.getElementById("total")

  if (!lista || !totalEl) return

  lista.innerHTML = ""
  let total = 0

  carrinho.forEach((item, index) => {
    total += item.preco

    lista.innerHTML += `
      <li>
        <input type="checkbox" class="item-checkbox" data-index="${index}" onchange="updateAcoes()">

        ${item.img ? `
          <img src="${item.img}" 
          style="width:50px;height:50px;object-fit:cover;border-radius:5px;">
        ` : ""}

        <span>${item.nome} - R$ ${item.preco.toFixed(2)}</span>

        <button onclick="removerItem(${index})">Remover</button>
      </li>
    `
  })

  totalEl.innerText = "Total: R$ " + total.toFixed(2)
}

/* =========================
   AÇÕES DO CARRINHO
========================= */
function removerItem(index) {
  carrinho.splice(index, 1)
  salvarCarrinho()
  renderCarrinho()
}

function removerSelecionados() {
  const checkboxes = document.querySelectorAll(".item-checkbox:checked")

  const indices = Array.from(checkboxes)
    .map(cb => parseInt(cb.dataset.index))
    .sort((a, b) => b - a)

  indices.forEach(index => carrinho.splice(index, 1))

  salvarCarrinho()
  renderCarrinho()
}

function limparCarrinho() {
  carrinho = []
  salvarCarrinho()
  renderCarrinho()
}

function comprarTodos() {
  if (carrinho.length === 0) {
    alert("Carrinho vazio!")
    return
  }

  const total = carrinho.reduce((sum, item) => sum + item.preco, 0)

  alert("Compra realizada! Total: R$ " + total.toFixed(2))

  limparCarrinho()
}

function comprarSelecionados() {
  const checkboxes = document.querySelectorAll(".item-checkbox:checked")

  if (checkboxes.length === 0) {
    alert("Nenhum item selecionado!")
    return
  }

  const total = Array.from(checkboxes)
    .map(cb => carrinho[parseInt(cb.dataset.index)])
    .reduce((sum, item) => sum + item.preco, 0)

  alert("Compra realizada! Total: R$ " + total.toFixed(2))

  removerSelecionados()
}

function updateAcoes() {
  const checked = document.querySelectorAll(".item-checkbox:checked")
  const sidebar = document.getElementById("sidebar")
  const totalEl = document.getElementById("total-selecionados")

  if (!sidebar || !totalEl) return

  const total = Array.from(checked)
    .map(cb => carrinho[parseInt(cb.dataset.index)])
    .reduce((sum, item) => sum + item.preco, 0)

  totalEl.innerText = `Total: R$ ${total.toFixed(2)}`
  sidebar.style.display = checked.length ? "block" : "none"
}

/* =========================
   INIT GERAL
========================= */
window.addEventListener("load", () => {
  initInfiniteScroll()
  enableDragScroll()
  initScrollReveal()
  renderCarrinho()
})