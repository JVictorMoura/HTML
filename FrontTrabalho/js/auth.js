// ===== AUTHENTICATION PAGE FUNCTIONALITY =====

document.addEventListener('DOMContentLoaded', function() {
  // Elementos do DOM
  const loginTab = document.getElementById('loginTab');
  const registerTab = document.getElementById('registerTab');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const loginFormElement = document.getElementById('loginFormElement');
  const registerFormElement = document.getElementById('registerFormElement');
  const toggleLoginPassword = document.getElementById('toggleLoginPassword');
  const toggleRegisterPassword = document.getElementById('toggleRegisterPassword');
  const loginPassword = document.getElementById('loginPassword');
  const registerPassword = document.getElementById('registerPassword');
  const registerCPF = document.getElementById('registerCPF');
  const passwordStrength = document.getElementById('passwordStrength');

  // Event Listeners
  if (loginTab) {
    loginTab.addEventListener('click', () => switchTab('login'));
  }
  
  if (registerTab) {
    registerTab.addEventListener('click', () => switchTab('register'));
  }
  
  if (loginFormElement) {
    loginFormElement.addEventListener('submit', handleLogin);
  }
  
  if (registerFormElement) {
    registerFormElement.addEventListener('submit', handleRegister);
  }
  
  if (toggleLoginPassword) {
    toggleLoginPassword.addEventListener('click', () => togglePassword('loginPassword'));
  }
  
  if (toggleRegisterPassword) {
    toggleRegisterPassword.addEventListener('click', () => togglePassword('registerPassword'));
  }
  
  if (registerPassword) {
    registerPassword.addEventListener('input', checkPasswordStrength);
  }
  
  if (registerCPF) {
    registerCPF.addEventListener('input', formatCPF);
  }

  // Funções
  function switchTab(tab) {
    // Remover classe active de ambos os tabs
    loginTab?.classList.remove('active');
    registerTab?.classList.remove('active');
    
    // Esconder ambos os forms
    if (loginForm) loginForm.style.display = 'none';
    if (registerForm) registerForm.style.display = 'none';
    
    if (tab === 'login') {
      loginTab?.classList.add('active');
      if (loginForm) loginForm.style.display = 'block';
    } else {
      registerTab?.classList.add('active');
      if (registerForm) registerForm.style.display = 'block';
    }
  }

  function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail')?.value;
    const password = document.getElementById('loginPassword')?.value;
    const rememberMe = document.getElementById('rememberMe')?.checked;
    
    // Validação simples
    if (!email || !password) {
      showNotification('Por favor, preencha todos os campos.', 'error');
      return;
    }
    
    // Simular login
    showLoading('Entrando...');
    
    setTimeout(() => {
      // Simular sucesso do login
      const userData = {
        name: 'João Silva',
        email: email,
        id: Date.now(),
        loginTime: new Date().toISOString()
      };
      
      // Salvar dados do usuário
      if (rememberMe) {
        localStorage.setItem('farmaUser', JSON.stringify(userData));
      } else {
        sessionStorage.setItem('farmaUser', JSON.stringify(userData));
      }
      
      hideLoading();
      showNotification('Login realizado com sucesso!', 'success');
      
      // Redirecionar após 1.5 segundos
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
      
    }, 2000);
  }

  function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName')?.value;
    const email = document.getElementById('registerEmail')?.value;
    const cpf = document.getElementById('registerCPF')?.value;
    const password = document.getElementById('registerPassword')?.value;
    const acceptTerms = document.getElementById('acceptTerms')?.checked;
    
    // Validações
    if (!name || !email || !cpf || !password) {
      showNotification('Por favor, preencha todos os campos.', 'error');
      return;
    }
    
    if (!acceptTerms) {
      showNotification('Você deve aceitar os termos de uso.', 'error');
      return;
    }
    
    if (!isValidCPF(cpf)) {
      showNotification('CPF inválido.', 'error');
      return;
    }
    
    if (!isValidEmail(email)) {
      showNotification('E-mail inválido.', 'error');
      return;
    }
    
    if (password.length < 8) {
      showNotification('A senha deve ter pelo menos 8 caracteres.', 'error');
      return;
    }
    
    // Simular cadastro
    showLoading('Criando sua conta...');
    
    setTimeout(() => {
      const userData = {
        name: name,
        email: email,
        cpf: cpf,
        id: Date.now(),
        registrationDate: new Date().toISOString()
      };
      
      // Salvar dados do usuário
      sessionStorage.setItem('farmaUser', JSON.stringify(userData));
      
      hideLoading();
      showNotification('Conta criada com sucesso!', 'success');
      
      // Redirecionar após 1.5 segundos
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
      
    }, 2000);
  }

  function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const isPassword = input.type === 'password';
    
    input.type = isPassword ? 'text' : 'password';
    
    // Atualizar ícone
    const button = inputId === 'loginPassword' ? toggleLoginPassword : toggleRegisterPassword;
    button.textContent = isPassword ? '🙈' : '👁️';
  }

  function checkPasswordStrength() {
    if (!registerPassword || !passwordStrength) return;
    
    const password = registerPassword.value;
    const strength = calculatePasswordStrength(password);
    
    // Limpar conteúdo anterior
    passwordStrength.innerHTML = '';
    
    if (password.length === 0) return;
    
    // Criar barra de força
    const strengthBar = document.createElement('div');
    strengthBar.className = 'password-strength';
    
    const bar = document.createElement('div');
    bar.className = 'strength-bar';
    
    let color, width, text;
    
    if (strength.score === 0) {
      color = '#dc3545';
      width = '25%';
      text = 'Muito fraca';
    } else if (strength.score === 1) {
      color = '#fd7e14';
      width = '50%';
      text = 'Fraca';
    } else if (strength.score === 2) {
      color = '#ffc107';
      width = '75%';
      text = 'Média';
    } else {
      color = '#28a745';
      width = '100%';
      text = 'Forte';
    }
    
    bar.style.width = width;
    bar.style.backgroundColor = color;
    strengthBar.appendChild(bar);
    
    const strengthText = document.createElement('div');
    strengthText.textContent = `Força: ${text}`;
    strengthText.style.color = color;
    strengthText.style.fontSize = '0.8rem';
    strengthText.style.marginTop = '5px';
    
    passwordStrength.appendChild(strengthBar);
    passwordStrength.appendChild(strengthText);
    
    // Mostrar sugestões
    if (strength.suggestions.length > 0) {
      const suggestions = document.createElement('div');
      suggestions.style.fontSize = '0.75rem';
      suggestions.style.color = 'var(--text-light)';
      suggestions.style.marginTop = '5px';
      suggestions.innerHTML = '• ' + strength.suggestions.join('<br>• ');
      passwordStrength.appendChild(suggestions);
    }
  }

  function calculatePasswordStrength(password) {
    let score = 0;
    const suggestions = [];
    
    if (password.length >= 8) score++;
    else suggestions.push('Use pelo menos 8 caracteres');
    
    if (/[a-z]/.test(password)) score++;
    else suggestions.push('Adicione letras minúsculas');
    
    if (/[A-Z]/.test(password)) score++;
    else suggestions.push('Adicione letras maiúsculas');
    
    if (/[0-9]/.test(password)) score++;
    else suggestions.push('Adicione números');
    
    if (/[^A-Za-z0-9]/.test(password)) score++;
    else suggestions.push('Adicione símbolos especiais');
    
    // Penalizar padrões comuns
    if (/123|abc|qwe|password/i.test(password)) {
      score = Math.max(0, score - 1);
      suggestions.push('Evite sequências comuns');
    }
    
    return {
      score: Math.min(4, score),
      suggestions: suggestions
    };
  }

  function formatCPF() {
    if (!registerCPF) return;
    
    let value = registerCPF.value.replace(/\D/g, '');
    
    if (value.length > 11) {
      value = value.slice(0, 11);
    }
    
    if (value.length > 9) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (value.length > 6) {
      value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else if (value.length > 3) {
      value = value.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    }
    
    registerCPF.value = value;
  }

  function isValidCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
      return false;
    }
    
    let sum = 0;
    let remainder;
    
    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    
    remainder = (sum * 10) % 11;
    
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;
    
    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    
    remainder = (sum * 10) % 11;
    
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;
    
    return true;
  }

  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function showLoading(message) {
    // Criar overlay de loading
    const overlay = document.createElement('div');
    overlay.id = 'authLoading';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      color: white;
    `;
    
    overlay.innerHTML = `
      <div style="width: 40px; height: 40px; border: 3px solid rgba(255,255,255,0.3); border-top: 3px solid white; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 20px;"></div>
      <div style="font-size: 1.1rem; font-weight: 500;">${message}</div>
    `;
    
    document.body.appendChild(overlay);
  }

  function hideLoading() {
    const overlay = document.getElementById('authLoading');
    if (overlay) {
      overlay.remove();
    }
  }
});

// Função para mostrar notificações com diferentes tipos
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 8px;
    z-index: 1001;
    box-shadow: var(--shadow-hover);
    animation: slideInRight 0.3s ease;
    max-width: 300px;
    font-weight: 500;
  `;
  
  // Cores baseadas no tipo
  switch (type) {
    case 'success':
      notification.style.background = 'var(--success-color)';
      notification.style.color = 'white';
      break;
    case 'error':
      notification.style.background = 'var(--danger-color)';
      notification.style.color = 'white';
      break;
    case 'warning':
      notification.style.background = 'var(--warning-color)';
      notification.style.color = 'var(--text-dark)';
      break;
    default:
      notification.style.background = 'var(--primary-color)';
      notification.style.color = 'white';
  }
  
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 4000);
}