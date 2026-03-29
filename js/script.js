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