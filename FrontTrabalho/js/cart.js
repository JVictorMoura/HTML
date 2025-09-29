// ===== CART PAGE SPECIFIC FUNCTIONALITY =====

document.addEventListener('DOMContentLoaded', function() {
  // Elementos específicos da página do carrinho
  const cartItemsList = document.getElementById('cartItemsList');
  const cartItemCount = document.getElementById('cartItemCount');
  const subtotalEl = document.getElementById('subtotal');
  const shippingEl = document.getElementById('shipping');
  const discountEl = document.getElementById('discount');
  const discountRow = document.getElementById('discountRow');
  const totalEl = document.getElementById('total');
  const couponInput = document.getElementById('couponInput');
  const applyCouponBtn = document.getElementById('applyCoupon');
  const couponMessage = document.getElementById('couponMessage');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const checkoutModal = document.getElementById('checkoutModal');
  const closeCheckoutModal = document.getElementById('closeCheckoutModal');
  
  // Estado da página
  let currentDiscount = 0;
  let appliedCoupon = null;
  
  // Cupons válidos (simulação)
  const validCoupons = {
    'FARMACIA10': { discount: 0.10, description: '10% de desconto' },
    'PRIMEIRA20': { discount: 0.20, description: '20% de desconto na primeira compra' },
    'SAUDE15': { discount: 0.15, description: '15% de desconto em medicamentos' },
    'FRETE5': { discount: 5, description: 'R$ 5 de desconto', type: 'fixed' }
  };
  
  // Inicializar página do carrinho
  initCartPage();
  
  // Event listeners
  if (applyCouponBtn) {
    applyCouponBtn.addEventListener('click', applyCoupon);
  }
  
  if (couponInput) {
    couponInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        applyCoupon();
      }
    });
  }
  
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', processCheckout);
  }
  
  if (closeCheckoutModal) {
    closeCheckoutModal.addEventListener('click', closeCheckout);
  }
  
  if (checkoutModal) {
    checkoutModal.addEventListener('click', function(e) {
      if (e.target === checkoutModal) {
        closeCheckout();
      }
    });
  }
  
  // Funções
  function initCartPage() {
    renderCartPage();
    updateCartSummary();
  }
  
  function renderCartPage() {
    if (!cartItemsList) return;
    
    if (cart.length === 0) {
      cartItemsList.innerHTML = `
        <div style="padding: 60px 30px; text-align: center;">
          <div style="font-size: 4rem; margin-bottom: 20px; opacity: 0.3;">🛒</div>
          <h3 style="margin-bottom: 15px; color: var(--text-dark);">Seu carrinho está vazio</h3>
          <p style="color: var(--text-light); margin-bottom: 30px;">Que tal adicionar alguns medicamentos?</p>
          <a href="catalog.html" class="btn primary">Ver Catálogo</a>
        </div>
      `;
      return;
    }
    
    cartItemsList.innerHTML = cart.map(item => `
      <div class="cart-item-row">
        <div class="cart-item-image" style="width: 80px; height: 80px; background-image: url('${item.image}'); background-size: cover; background-position: center; border-radius: 8px;"></div>
        <div>
          <h4 style="margin-bottom: 8px; color: var(--text-dark);">${item.name}</h4>
          <p style="color: var(--text-light); font-size: 0.9rem; margin-bottom: 5px;">${item.category}</p>
          ${item.prescriptionRequired ? '<span style="color: var(--warning-color); font-size: 0.8rem; font-weight: 600;">⚠️ Receita necessária</span>' : ''}
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <button onclick="updateCartQuantity(${item.id}, -1)" class="qty-btn" style="width: 32px; height: 32px; border: 2px solid var(--border-color); background: white; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-weight: 600;">-</button>
          <span style="min-width: 20px; text-align: center; font-weight: 600;">${item.quantity}</span>
          <button onclick="updateCartQuantity(${item.id}, 1)" class="qty-btn" style="width: 32px; height: 32px; border: 2px solid var(--border-color); background: white; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-weight: 600;">+</button>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 1.1rem; font-weight: 700; color: var(--primary-color); margin-bottom: 8px;">
            R$ ${(item.price * item.quantity).toFixed(2)}
          </div>
          <button onclick="removeFromCartPage(${item.id})" style="color: var(--danger-color); background: none; border: none; cursor: pointer; font-size: 0.9rem; text-decoration: underline;">
            Remover
          </button>
        </div>
      </div>
    `).join('');
  }
  
  function updateCartQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
      removeFromCartPage(productId);
    } else {
      saveCart();
      renderCartPage();
      updateCartSummary();
      updateCartDisplay(); // Atualizar header também
    }
  }
  
  function removeFromCartPage(productId) {
    if (confirm('Tem certeza que deseja remover este item do carrinho?')) {
      cart = cart.filter(item => item.id !== productId);
      saveCart();
      renderCartPage();
      updateCartSummary();
      updateCartDisplay(); // Atualizar header também
      
      showNotification('Item removido do carrinho');
    }
  }
  
  function updateCartSummary() {
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shippingCost = 0; // Frete grátis
    
    // Calcular desconto
    let discountAmount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.type === 'fixed') {
        discountAmount = appliedCoupon.discount;
      } else {
        discountAmount = subtotal * appliedCoupon.discount;
      }
    }
    
    const total = Math.max(0, subtotal + shippingCost - discountAmount);
    
    // Atualizar elementos
    if (cartItemCount) {
      cartItemCount.textContent = `${itemCount} ${itemCount === 1 ? 'item' : 'itens'}`;
    }
    
    if (subtotalEl) {
      subtotalEl.textContent = `R$ ${subtotal.toFixed(2)}`;
    }
    
    if (discountAmount > 0) {
      if (discountRow) discountRow.style.display = 'flex';
      if (discountEl) discountEl.textContent = `- R$ ${discountAmount.toFixed(2)}`;
    } else {
      if (discountRow) discountRow.style.display = 'none';
    }
    
    if (totalEl) {
      totalEl.textContent = `R$ ${total.toFixed(2)}`;
    }
    
    // Habilitar/desabilitar checkout
    if (checkoutBtn) {
      checkoutBtn.disabled = cart.length === 0;
      if (cart.length === 0) {
        checkoutBtn.textContent = 'Carrinho Vazio';
        checkoutBtn.style.opacity = '0.5';
      } else {
        checkoutBtn.textContent = 'Finalizar Pedido';
        checkoutBtn.style.opacity = '1';
      }
    }
  }
  
  function applyCoupon() {
    if (!couponInput || !couponMessage) return;
    
    const couponCode = couponInput.value.trim().toUpperCase();
    
    if (!couponCode) {
      showCouponMessage('Digite um código de cupom', 'error');
      return;
    }
    
    if (validCoupons[couponCode]) {
      if (appliedCoupon && appliedCoupon.code === couponCode) {
        showCouponMessage('Este cupom já foi aplicado', 'warning');
        return;
      }
      
      appliedCoupon = {
        code: couponCode,
        ...validCoupons[couponCode]
      };
      
      showCouponMessage(`Cupom aplicado: ${appliedCoupon.description}`, 'success');
      couponInput.value = '';
      updateCartSummary();
      
    } else {
      showCouponMessage('Cupom inválido ou expirado', 'error');
    }
  }
  
  function showCouponMessage(message, type) {
    if (!couponMessage) return;
    
    couponMessage.textContent = message;
    
    // Cores baseadas no tipo
    switch (type) {
      case 'success':
        couponMessage.style.color = 'var(--success-color)';
        break;
      case 'error':
        couponMessage.style.color = 'var(--danger-color)';
        break;
      case 'warning':
        couponMessage.style.color = 'var(--warning-color)';
        break;
      default:
        couponMessage.style.color = 'var(--text-light)';
    }
    
    // Limpar mensagem após 5 segundos
    setTimeout(() => {
      if (couponMessage) couponMessage.textContent = '';
    }, 5000);
  }
  
  function processCheckout() {
    if (cart.length === 0) return;
    
    // Verificar se há produtos que requerem receita
    const prescriptionRequired = cart.some(item => item.prescriptionRequired);
    
    if (prescriptionRequired) {
      if (!confirm('Alguns itens do seu pedido requerem receita médica. Você terá que enviá-la após a confirmação do pedido. Deseja continuar?')) {
        return;
      }
    }
    
    // Simular processamento
    showLoading('Processando seu pedido...');
    
    setTimeout(() => {
      // Gerar número do pedido
      const orderNumber = 'FM' + Date.now().toString().slice(-8);
      
      // Calcular previsão de entrega
      const deliveryType = document.querySelector('input[name="delivery"]:checked')?.value;
      let deliveryDate = new Date();
      
      if (deliveryType === 'express') {
        deliveryDate.setHours(deliveryDate.getHours() + 2);
      } else {
        deliveryDate.setDate(deliveryDate.getDate() + 2);
      }
      
      // Mostrar modal de sucesso
      document.getElementById('orderNumber').textContent = orderNumber;
      document.getElementById('deliveryEstimate').textContent = deliveryDate.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      // Salvar pedido no localStorage (para histórico)
      const order = {
        id: orderNumber,
        date: new Date().toISOString(),
        items: [...cart],
        total: totalEl.textContent,
        deliveryType: deliveryType,
        deliveryEstimate: deliveryDate.toISOString(),
        coupon: appliedCoupon
      };
      
      const orders = JSON.parse(localStorage.getItem('farmaOrders') || '[]');
      orders.push(order);
      localStorage.setItem('farmaOrders', JSON.stringify(orders));
      
      // Limpar carrinho
      cart = [];
      saveCart();
      updateCartDisplay();
      
      hideLoading();
      checkoutModal.classList.add('active');
      
    }, 3000);
  }
  
  function closeCheckout() {
    if (checkoutModal) {
      checkoutModal.classList.remove('active');
    }
  }
  
  function showLoading(message) {
    const overlay = document.createElement('div');
    overlay.id = 'checkoutLoading';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.7);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      color: white;
    `;
    
    overlay.innerHTML = `
      <div style="width: 50px; height: 50px; border: 4px solid rgba(255,255,255,0.3); border-top: 4px solid white; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 30px;"></div>
      <div style="font-size: 1.2rem; font-weight: 500; text-align: center; max-width: 300px;">${message}</div>
      <div style="font-size: 0.9rem; margin-top: 15px; opacity: 0.8;">Aguarde enquanto processamos seu pedido...</div>
    `;
    
    document.body.appendChild(overlay);
  }
  
  function hideLoading() {
    const overlay = document.getElementById('checkoutLoading');
    if (overlay) {
      overlay.remove();
    }
  }
  
  // Função para remover cupom
  window.removeCoupon = function() {
    appliedCoupon = null;
    updateCartSummary();
    showCouponMessage('Cupom removido', 'info');
  };
});

// Adicionar funcionalidade de salvar para depois
function addToWishlist(productId) {
  let wishlist = JSON.parse(localStorage.getItem('farmaWishlist') || '[]');
  
  if (!wishlist.includes(productId)) {
    wishlist.push(productId);
    localStorage.setItem('farmaWishlist', JSON.stringify(wishlist));
    showNotification('Item adicionado à lista de desejos');
  } else {
    showNotification('Item já está na lista de desejos');
  }
}

// Funcionalidade para calcular frete (simulação)
function calculateShipping(cep) {
  // Simular cálculo de frete
  return new Promise((resolve) => {
    setTimeout(() => {
      const shippingOptions = [
        { type: 'express', name: 'Entrega Express', time: '2 horas', price: 0 },
        { type: 'normal', name: 'Entrega Normal', time: '1-2 dias', price: 0 },
        { type: 'scheduled', name: 'Entrega Agendada', time: 'Data escolhida', price: 0 }
      ];
      resolve(shippingOptions);
    }, 1000);
  });
}