
const productsData = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    category: "Medicamentos",
    description: "Analgésico e antitérmico para dores leves a moderadas e febre.",
    price: 8.50,
    originalPrice: 12.00,
    prescriptionRequired: false,
    stockQuantity: 150,
    brand: "EMS",
    activeIngredient: "Paracetamol",
    dosage: "500mg",
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop",
    isPromoted: true,
    rating: 4.5,
    contraindications: "Não recomendado para pessoas com problemas hepáticos graves."
  },
  {
    id: 2,
    name: "Vitamina C 1g",
    category: "Vitaminas",
    description: "Suplemento vitamínico para fortalecimento do sistema imunológico.",
    price: 15.90,
    originalPrice: 22.00,
    prescriptionRequired: false,
    stockQuantity: 80,
    brand: "Vitamedic",
    activeIngredient: "Ácido Ascórbico",
    dosage: "1g",
    imageUrl: "assets/produtos/vitaminaC.webp",
    isPromoted: true,
    rating: 4.8,
    contraindications: "Consulte médico se tiver histórico de pedras nos rins."
  },
  {
    id: 3,
    name: "Shampoo Anticaspa",
    category: "Higiene",
    description: "Shampoo medicinal para tratamento e prevenção da caspa.",
    price: 24.90,
    originalPrice: 32.00,
    prescriptionRequired: false,
    stockQuantity: 45,
    brand: "Selsun",
    activeIngredient: "Sulfeto de Selênio",
    dosage: "2.5%",
    imageUrl: "assets/produtos/shampooAntiCaspa.png",
    isPromoted: true,
    rating: 4.2,
    contraindications: "Evitar contato com os olhos."
  },
  {
    id: 4,
    name: "Ibuprofeno 600mg",
    category: "Medicamentos",
    description: "Anti-inflamatório não esteroidal para dores e inflamações.",
    price: 18.50,
    originalPrice: null,
    prescriptionRequired: true,
    stockQuantity: 120,
    brand: "Medley",
    activeIngredient: "Ibuprofeno",
    dosage: "600mg",
    imageUrl: "assets/produtos/ibu.jpg",
    isPromoted: false,
    rating: 4.6,
    contraindications: "Contraindicado para pessoas com úlcera péptica."
  },
  {
    id: 5,
    name: "Protetor Solar FPS 70",
    category: "Beleza",
    description: "Protetor solar facial com alta proteção UVA e UVB.",
    price: 45.90,
    originalPrice: 58.00,
    prescriptionRequired: false,
    stockQuantity: 30,
    brand: "La Roche-Posay",
    activeIngredient: "Avobenzona + Octocrileno",
    dosage: "FPS 60",
    imageUrl: "assets/produtos/protetor70.webp",
    isPromoted: true,
    rating: 4.9,
    contraindications: "Teste em pequena área antes do uso extenso."
  },
  {
    id: 6,
    name: "Complexo B",
    category: "Vitaminas",
    description: "Suplemento com todas as vitaminas do complexo B.",
    price: 28.90,
    originalPrice: null,
    prescriptionRequired: false,
    stockQuantity: 60,
    brand: "Centrum",
    activeIngredient: "Vitaminas B1, B2, B3, B5, B6, B7, B9, B12",
    dosage: "1 cápsula/dia",
    imageUrl: "assets/produtos/complexo.webp",
    isPromoted: false,
    rating: 4.4,
    contraindications: "Não exceder a dose recomendada."
  },
  {
    id: 7,
    name: "Pomada para Assaduras",
    category: "Infantil",
    description: "Pomada protetora e regeneradora para assaduras de bebês.",
    price: 16.50,
    originalPrice: 21.00,
    prescriptionRequired: false,
    stockQuantity: 90,
    brand: "Bepantol",
    activeIngredient: "Dexpantenol",
    dosage: "5%",
    imageUrl: "assets/produtos/pomada.jpg",
    isPromoted: true,
    rating: 4.7,
    contraindications: "Uso externo. Evitar contato com os olhos."
  },
  {
    id: 8,
    name: "Antisséptico Bucal",
    category: "Higiene",
    description: "Enxaguante bucal com ação antibacteriana e refrescante.",
    price: 12.90,
    originalPrice: null,
    prescriptionRequired: false,
    stockQuantity: 75,
    brand: "Listerine",
    activeIngredient: "Cloreto de Cetilpiridínio",
    dosage: "0.05%",
    imageUrl: "assets/produtos/enxaguante.webp",
    isPromoted: false,
    rating: 4.3,
    contraindications: "Não engolir. Não recomendado para menores de 6 anos."
  }
];

// Estado da aplicação
let currentProducts = productsData;
let cart = JSON.parse(localStorage.getItem('farmaCart')) || [];
let currentCategory = 'Todos';
let currentSort = 'popular';

// Elementos DOM
const productGrid = document.getElementById('grid');
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
const cartDrawer = document.getElementById('cartDrawer');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const closeCartBtn = document.getElementById('closeCart');
const productModal = document.getElementById('productModal');
const modalBody = document.getElementById('modalBody');
const modalCloseBtn = document.getElementById('modalClose');
const categoryChips = document.querySelectorAll('.chip');
const sortSelect = document.getElementById('sortSelect');

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
  renderProducts();
  updateCartDisplay();
  setupEventListeners();
  
  // Carousel automático
  startCarousel();
});

// ===== FUNÇÕES DE RENDERIZAÇÃO =====
function renderProducts() {
  if (!productGrid) return;
  
  productGrid.innerHTML = '';
  
  if (currentProducts.length === 0) {
    productGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; color: var(--text-light); padding: 40px;">Nenhum produto encontrado.</p>';
    return;
  }
  
  currentProducts.forEach(product => {
    const productCard = createProductCard(product);
    productGrid.appendChild(productCard);
  });
}

function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.onclick = () => openProductModal(product);
  
  const discount = product.originalPrice ? 
    Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
  
  card.innerHTML = `
    <div class="product-image" style="background-image: url('${product.imageUrl}')">
      ${product.isPromoted ? '<span class="product-badge">Oferta</span>' : ''}
      ${product.prescriptionRequired ? '<span class="product-badge" style="background: var(--warning-color); top: 10px; right: 10px;">Receita</span>' : ''}
    </div>
    <div class="product-info">
      <div class="product-category">${product.category}</div>
      <h3 class="product-name">${product.name}</h3>
      <p class="product-description">${product.description.substring(0, 80)}...</p>
      <div class="product-price">
        <span class="price-current">R$ ${product.price.toFixed(2)}</span>
        ${product.originalPrice ? `<span class="price-original">R$ ${product.originalPrice.toFixed(2)}</span>` : ''}
      </div>
      <div class="product-actions">
        <button class="btn-add" onclick="event.stopPropagation(); addToCart(${product.id})">
          ${product.prescriptionRequired ? 'Ver Detalhes' : 'Adicionar ao Carrinho'}
        </button>
      </div>
    </div>
  `;
  
  return card;
}

// ===== MODAL DO PRODUTO =====
function openProductModal(product) {
  if (!modalBody || !productModal) return;
  
  const discount = product.originalPrice ? 
    Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
  
  modalBody.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; padding: 30px;">
      <div>
        <img src="${product.imageUrl}" alt="${product.name}" style="width: 100%; border-radius: 8px;">
      </div>
      <div>
        <span style="color: var(--text-light); font-size: 0.9rem; text-transform: uppercase;">${product.category}</span>
        <h2 style="margin: 10px 0; color: var(--text-dark);">${product.name}</h2>
        <p style="color: var(--text-light); margin-bottom: 20px;">${product.description}</p>
        
        <div style="background: var(--secondary-color); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h4>Informações do Produto</h4>
          <p><strong>Marca:</strong> ${product.brand}</p>
          <p><strong>Princípio Ativo:</strong> ${product.activeIngredient}</p>
          <p><strong>Dosagem:</strong> ${product.dosage}</p>
          <p><strong>Estoque:</strong> ${product.stockQuantity} unidades</p>
          ${product.prescriptionRequired ? '<p style="color: var(--warning-color);"><strong>⚠️ Requer receita médica</strong></p>' : ''}
        </div>
        
        <div style="margin-bottom: 20px;">
          <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 10px;">
            <span style="font-size: 1.5rem; font-weight: 700; color: var(--primary-color);">R$ ${product.price.toFixed(2)}</span>
            ${product.originalPrice ? `<span style="text-decoration: line-through; color: var(--text-light);">R$ ${product.originalPrice.toFixed(2)}</span>` : ''}
            ${discount > 0 ? `<span style="background: var(--success-color); color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem;">${discount}% OFF</span>` : ''}
          </div>
          <div style="display: flex; align-items: center; gap: 5px;">
            <span style="color: var(--text-light);">Avaliação:</span>
            <span style="color: #ffc107;">★★★★★</span>
            <span style="color: var(--text-light);">(${product.rating})</span>
          </div>
        </div>
        
        <button class="btn primary block" onclick="addToCart(${product.id}); closeModal();">
          ${product.prescriptionRequired ? 'Solicitar Orçamento' : 'Adicionar ao Carrinho'}
        </button>
        
        ${product.contraindications ? `
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin-top: 20px;">
            <h5 style="color: #856404; margin-bottom: 10px;">⚠️ Contraindicações</h5>
            <p style="color: #856404; margin: 0; font-size: 0.9rem;">${product.contraindications}</p>
          </div>
        ` : ''}
      </div>
    </div>
  `;
  
  productModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  if (productModal) {
    productModal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// ===== FUNCIONALIDADES DO CARRINHO =====
function addToCart(productId) {
  const product = productsData.find(p => p.id === productId);
  if (!product) return;
  
  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrl,
      category: product.category,
      prescriptionRequired: product.prescriptionRequired,
      quantity: 1
    });
  }
  
  updateCartDisplay();
  saveCart();
  showNotification(product.prescriptionRequired ? 'Produto adicionado! Receita necessária.' : 'Produto adicionado ao carrinho!');
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartDisplay();
  saveCart();
}

function updateQuantity(productId, change) {
  const item = cart.find(item => item.id === productId);
  if (!item) return;
  
  item.quantity += change;
  
  if (item.quantity <= 0) {
    removeFromCart(productId);
  } else {
    updateCartDisplay();
    saveCart();
  }
}

function updateCartDisplay() {
  if (!cartCount) return;
  
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = totalItems;
  
  if (cartItems) {
    renderCartItems();
  }
  
  if (cartTotal) {
    const total = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    cartTotal.textContent = `R$ ${total.toFixed(2)}`;
  }
}

function renderCartItems() {
  if (!cartItems) return;
  
  if (cart.length === 0) {
    cartItems.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 40px 0;">Seu carrinho está vazio</p>';
    return;
  }
  
  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-image" style="background-image: url('${item.image}'); background-size: cover; background-position: center;"></div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">R$ ${item.price.toFixed(2)}</div>
        ${item.prescriptionRequired ? '<small style="color: var(--warning-color);">⚠️ Receita necessária</small>' : ''}
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
          <span>${item.quantity}</span>
          <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
          <button onclick="removeFromCart(${item.id})" style="margin-left: 10px; background: var(--danger-color); color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">🗑️</button>
        </div>
      </div>
    </div>
  `).join('');
}

function saveCart() {
  localStorage.setItem('farmaCart', JSON.stringify(cart));
}

// ===== FILTROS E BUSCA =====
function filterByCategory(category) {
  currentCategory = category;
  
  // Atualizar chips visuais
  categoryChips.forEach(chip => {
    chip.classList.remove('active');
    if (chip.textContent === category) {
      chip.classList.add('active');
    }
  });
  
  applyFilters();
}

function sortProducts(sortBy) {
  currentSort = sortBy;
  applyFilters();
}

function applyFilters() {
  let filtered = productsData;
  
  // Filtrar por categoria
  if (currentCategory !== 'Todos') {
    filtered = filtered.filter(product => product.category === currentCategory);
  }
  
  // Ordenar
  switch (currentSort) {
    case 'price-asc':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'popular':
    default:
      filtered.sort((a, b) => b.rating - a.rating);
      break;
  }
  
  currentProducts = filtered;
  renderProducts();
}

// ===== CAROUSEL =====
function startCarousel() {
  const slides = document.querySelectorAll('.slide');
  let currentSlide = 0;
  
  setInterval(() => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }, 5000);
}

// ===== NOTIFICAÇÕES =====
function showNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--primary-color);
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    z-index: 1001;
    box-shadow: var(--shadow-hover);
    animation: slideInRight 0.3s ease;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
  // Carrinho
  if (cartBtn) {
    cartBtn.addEventListener('click', () => {
      cartDrawer?.classList.add('active');
    });
  }
  
  if (closeCartBtn) {
    closeCartBtn.addEventListener('click', () => {
      cartDrawer?.classList.remove('active');
    });
  }
  
  // Modal
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }
  
  if (productModal) {
    productModal.addEventListener('click', (e) => {
      if (e.target === productModal) {
        closeModal();
      }
    });
  }
  
  // Filtros
  categoryChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterByCategory(chip.textContent);
    });
  });
  
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      sortProducts(e.target.value);
    });
  }
  
  // Fechar drawer clicando fora
  document.addEventListener('click', (e) => {
    if (cartDrawer && cartDrawer.classList.contains('active') && 
        !cartDrawer.contains(e.target) && !cartBtn.contains(e.target)) {
      cartDrawer.classList.remove('active');
    }
  });
}

// ===== CSS ANIMATIONS =====
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);