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
    
    // Simular delay de busca (para UX realista)
    setTimeout(() => {
      let filtered = [...productsData];
      
      // Filtro de busca por texto
      if (filters.search) {
        filtered = filtered.filter(product => 
          product.name.toLowerCase().includes(filters.search) ||
          product.description.toLowerCase().includes(filters.search) ||
          product.brand.toLowerCase().includes(filters.search) ||
          product.activeIngredient.toLowerCase().includes(filters.search) ||
          product.category.toLowerCase().includes(filters.search)
        );
      }
      
      // Filtro por categoria
      if (filters.category) {
        filtered = filtered.filter(product => product.category === filters.category);
      }
      
      // Filtro por faixa de preço
      if (filters.priceRange) {
        filtered = filtered.filter(product => {
          const price = product.price;
          switch (filters.priceRange) {
            case '0-20':
              return price >= 0 && price <= 20;
            case '20-50':
              return price > 20 && price <= 50;
            case '50-100':
              return price > 50 && price <= 100;
            case '100+':
              return price > 100;
            default:
              return true;
          }
        });
      }
      
      // Filtro por receita
      if (filters.prescription !== '') {
        const needsPrescription = filters.prescription === 'true';
        filtered = filtered.filter(product => product.prescriptionRequired === needsPrescription);
      }
      
      // Ordenação
      filtered.sort((a, b) => {
        switch (filters.sort) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'rating':
            return b.rating - a.rating;
          default:
            return 0;
        }
      });
      
      currentProducts = filtered;
      updateResultsInfo();
      renderProducts();
      showLoading(false);
    }, 200);
  }
  
  function updateResultsInfo() {
    if (!resultsInfo) return;
    
    const total = currentProducts.length;
    const totalOriginal = productsData.length;
    
    let info = `${total} produto${total !== 1 ? 's' : ''} encontrado${total !== 1 ? 's' : ''}`;
    
    if (total !== totalOriginal) {
      info += ` de ${totalOriginal} total`;
    }
    
    // Adicionar informações sobre filtros ativos
    const activeFilters = [];
    if (filters.search) activeFilters.push(`"${filters.search}"`);
    if (filters.category) activeFilters.push(filters.category);
    if (filters.priceRange) {
      const priceLabels = {
        '0-20': 'R$ 0-20',
        '20-50': 'R$ 20-50', 
        '50-100': 'R$ 50-100',
        '100+': 'R$ 100+'
      };
      activeFilters.push(priceLabels[filters.priceRange]);
    }
    if (filters.prescription === 'true') activeFilters.push('Com receita');
    if (filters.prescription === 'false') activeFilters.push('Sem receita');
    
    if (activeFilters.length > 0) {
      info += ` • Filtros: ${activeFilters.join(', ')}`;
    }
    
    resultsInfo.textContent = info;
    
    // Adicionar cor baseada na quantidade de resultados
    if (total === 0) {
      resultsInfo.style.color = 'var(--danger-color)';
    } else if (total < totalOriginal * 0.3) {
      resultsInfo.style.color = 'var(--warning-color)';
    } else {
      resultsInfo.style.color = 'var(--text-dark)';
    }
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
  
  const regex = new RegExp(`(${search})`, 'gi');
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