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
  let isPaused = false;

  let autoScroll = setInterval(() => {
    if (!isPaused && !isJumping) {
      container.scrollLeft += 1;
    }
  }, 50);

  container.addEventListener("mousedown", () => {
    isPaused = true;
  })

  container.addEventListener("mouseup", () => {
    isPaused = false;
  })

  container.addEventListener("mouseleave", () => {
    isPaused = false;
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
        entry.target.classList.remove("hidden")
      } else {
        entry.target.classList.remove("visible")
        entry.target.classList.add("hidden")
      }
    })
  }, { threshold: 0.1 })

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

/* =========================
   INICIALIZAÇÃO
========================= */
document.addEventListener("DOMContentLoaded", () => {
  initInfiniteScroll()
  enableDragScroll()
  initScrollReveal()
})

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
   CONFIGURAÇÃO API
========================= */
const API_BASE_URL = 'https://ropona.vercel.app/api';

/* =========================
   CARREGAR PRODUTOS DA API
========================= */
function loadProdutos() {
  fetch(`${API_BASE_URL}/produtos`)
    .then(response => response.json())
    .then(produtos => {
      const container = document.getElementById('produtos');
      container.innerHTML = ''; // Limpar conteúdo estático

      produtos.forEach(produto => {
        const produtoDiv = document.createElement('div');
        produtoDiv.className = 'produto';
        produtoDiv.innerHTML = `
          <h3>${produto.nome}</h3>
          <p>R$ ${produto.preco.toFixed(2)}</p>
          <button onclick="addCarrinho('${produto.nome}', ${produto.preco}, '${produto.imagem}')">Adicionar</button>
        `;
        produtoDiv.style.cursor = 'pointer';
        produtoDiv.onclick = (e) => {
          if (e.target.tagName !== 'BUTTON') {
            window.location.href = `produto.html?id=${produto._id}`;
          }
        };
        container.appendChild(produtoDiv);
      });

      // Inicializar funcionalidades após carregar produtos
      initInfiniteScroll();
      enableDragScroll();
    })
    .catch(error => {
      console.error('Erro ao carregar produtos:', error);
      // Fallback para produtos estáticos se API falhar
      initInfiniteScroll();
      enableDragScroll();
    });
}

/* =========================
   INIT GERAL
========================= */
window.addEventListener("load", () => {
  loadProdutos();
  initScrollReveal();
  renderCarrinho();
});