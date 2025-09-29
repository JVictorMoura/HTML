// ===== CATALOG PAGE SPECIFIC FUNCTIONALITY =====

document.addEventListener('DOMContentLoaded', function() {
  // Elementos específicos do catálogo
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const categoryFilter = document.getElementById('categoryFilter');
  const priceFilter = document.getElementById('priceFilter');
  const prescriptionFilter = document.getElementById('prescriptionFilter');
  const clearFiltersBtn = document.getElementById('clearFilters');
  const resultsInfo = document.getElementById('resultsInfo');
  const loading = document.getElementById('loading');
  
  // Estado dos filtros
  let filters = {
    search: '',
    category: '',
    priceRange: '',
    prescription: '',
    sort: 'name'
  };
  
  // Inicializar catálogo
  initCatalog();
  
  // Event Listeners
  if (searchInput) {
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        handleSearch();
      }
    });
  }
  
  if (searchBtn) {
    searchBtn.addEventListener('click', handleSearch);
  }
  
  if (categoryFilter) {
    categoryFilter.addEventListener('change', handleCategoryFilter);
  }
  
  if (priceFilter) {
    priceFilter.addEventListener('change', handlePriceFilter);
  }
  
  if (prescriptionFilter) {
    prescriptionFilter.addEventListener('change', handlePrescriptionFilter);
  }
  
  if (sortSelect) {
    sortSelect.addEventListener('change', handleSort);
  }
  
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', clearAllFilters);
  }
  
  // Funções
  function initCatalog() {
    currentProducts = [...productsData];
    applyAllFilters();
  }
  
  function handleSearch() {
    filters.search = searchInput.value.toLowerCase().trim();
    applyAllFilters();
  }
  
  function handleCategoryFilter(e) {
    filters.category = e.target.value;
    applyAllFilters();
  }
  
  function handlePriceFilter(e) {
    filters.priceRange = e.target.value;
    applyAllFilters();
  }
  
  function handlePrescriptionFilter(e) {
    filters.prescription = e.target.value;
    applyAllFilters();
  }
  
  function handleSort(e) {
    filters.sort = e.target.value;
    applyAllFilters();
  }
  
  function clearAllFilters() {
    // Limpar inputs
    if (searchInput) searchInput.value = '';
    if (categoryFilter) categoryFilter.value = '';
    if (priceFilter) priceFilter.value = '';
    if (prescriptionFilter) prescriptionFilter.value = '';
    if (sortSelect) sortSelect.value = 'name';
    
    // Limpar estado
    filters = {
      search: '',
      category: '',
      priceRange: '',
      prescription: '',
      sort: 'name'
    };
    
    applyAllFilters();
  }
  
  
  function applyAllFilters() {
    showLoading(true);

    setTimeout(() => {
      let filtered = [...productsData];

      // 🔎 Filtro de busca (nome)
      if (filters.search) {
        filtered = filtered.filter(prod =>
          prod.name.toLowerCase().includes(filters.search)
        );
      }

      // 📂 Filtro de categoria
      if (filters.category) {
        filtered = filtered.filter(prod => prod.category === filters.category);
      }

      // 💰 Filtro de preço
      if (filters.priceRange) {
        if (filters.priceRange === "low") {
          filtered = filtered.filter(prod => prod.price < 20);
        } else if (filters.priceRange === "mid") {
          filtered = filtered.filter(prod => prod.price >= 20 && prod.price <= 50);
        } else if (filters.priceRange === "high") {
          filtered = filtered.filter(prod => prod.price > 50);
        }
      }

      // 💊 Filtro de prescrição
      if (filters.prescription) {
        const needsPrescription = filters.prescription === "true";
        filtered = filtered.filter(prod => prod.prescriptionRequired === needsPrescription);
      }

      // ↕️ Ordenação
      if (filters.sort === "price") {
        filtered.sort((a, b) => a.price - b.price);
      } else {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
      }

      renderProducts(filtered);
      showLoading(false);
    }, 300);
  }

  
  function showLoading(show) {
    if (!loading) return;
    
    if (show) {
      loading.style.display = 'block';
      productGrid.style.opacity = '0.5';
    } else {
      loading.style.display = 'none';
      productGrid.style.opacity = '1';
    }
  }
  
  // Função auxiliar para debounce (evitar muitas chamadas)
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  // Adicionar funcionalidade de busca por voz (se suportado)
  if ('webkitSpeechRecognition' in window) {
    addVoiceSearch();
  }
  
  function addVoiceSearch() {
    const voiceBtn = document.createElement('button');
    voiceBtn.innerHTML = '🎤';
    voiceBtn.title = 'Busca por voz';
    voiceBtn.style.cssText = `
      position: absolute;
      right: 60px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      padding: 5px;
      border-radius: 4px;
    `;
    
    // Adicionar o botão ao container da busca
    const searchContainer = searchInput.parentElement;
    searchContainer.style.position = 'relative';
    searchContainer.appendChild(voiceBtn);
    
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    voiceBtn.addEventListener('click', () => {
      voiceBtn.style.color = 'var(--primary-color)';
      recognition.start();
    });
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      searchInput.value = transcript;
      handleSearch();
      voiceBtn.style.color = '';
    };
    
    recognition.onerror = () => {
      voiceBtn.style.color = '';
    };
    
    recognition.onend = () => {
      voiceBtn.style.color = '';
    };
  }
});

// Função para destacar texto da busca nos resultados
function highlightSearchText(text, search) {
  if (!search) return text;
  
  const regex = new RegExp(`(${search
  
  function renderProducts(products) {
    const catalogContainer = document.getElementById("catalogContainer");
    if (!catalogContainer) return;

    catalogContainer.innerHTML = "";

    if (products.length === 0) {
      catalogContainer.innerHTML = "<p>Nenhum produto encontrado.</p>";
      return;
    }

    products.forEach(prod => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <h3>${prod.name}</h3>
        <p>Categoria: ${prod.category}</p>
        <p><strong>R$ ${prod.price.toFixed(2)}</strong></p>
      `;
      catalogContainer.appendChild(card);
    });
  }


    products.forEach(prod => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <img src="${prod.imageUrl}" alt="${prod.name}" class="product-img">
        <h3>${prod.name}</h3>
        <p>${prod.description}</p>
        <p><strong>R$ ${prod.price.toFixed(2)}</strong></p>
      `;
      catalogContainer.appendChild(card);
    });
  }
})`, 'gi');
  return text.replace(regex, '<mark style="background: yellow; padding: 1px 3px; border-radius: 2px;">$1</mark>');
}

// Sobrescrever a função createProductCard para incluir highlight
const originalCreateProductCard = window.createProductCard;
window.createProductCard = function(product) {
  const card = originalCreateProductCard(product);
  
  // Se há busca ativa, destacar o texto
  if (filters && filters.search) {
    const nameElement = card.querySelector('.product-name');
    const descElement = card.querySelector('.product-description');
    
    if (nameElement) {
      nameElement.innerHTML = highlightSearchText(product.name, filters.search);
    }
    if (descElement) {
      descElement.innerHTML = highlightSearchText(product.description.substring(0, 80) + '...', filters.search);
    }
  }
  
  return card;
};