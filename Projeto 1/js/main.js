// -----------------------------
// PRODUTOS MOCKADOS
// -----------------------------
const products = Array.from({length:20}).map((_,i)=>({
  id: i+1,
  name:`Produto ${i+1}`,
  price: (Math.round((20 + Math.random()*180)*100)/100).toFixed(2),
  desc:`Descrição do produto ${i+1}`
}));

function formatBRL(v){ return 'R$ ' + Number(v).toLocaleString('pt-BR',{minimumFractionDigits:2}) }

// -----------------------------
// RENDER PRODUTOS (INDEX / CATALOG)
// -----------------------------
const grid = document.getElementById('grid');
if(grid){
  products.forEach(p=>{
    const card = document.createElement('article');
    card.className='card';
    card.innerHTML = `
      <div class="thumb"></div>
      <h4>${p.name}</h4>
      <div class="price">${formatBRL(p.price)}</div>
      <div class="actions">
        <button class="btn" data-id="${p.id}" data-action="view">Ver</button>
        <button class="btn primary" data-id="${p.id}" data-action="buy">Comprar</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// -----------------------------
// CAROUSEL
// -----------------------------
let slideIndex=0;
const slides = document.querySelectorAll('.slide');
function showSlide(n){ slides.forEach((s,i)=> s.classList.toggle('active', i===n)); }
function nextSlide(){ slideIndex = (slideIndex + 1) % slides.length; showSlide(slideIndex); }
if(slides.length>0) setInterval(nextSlide, 4500);

// -----------------------------
// MODAL DE PRODUTO
// -----------------------------
const modal = document.getElementById('productModal');
const modalBody = modal && document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');

document.addEventListener('click', e=>{
  const v = e.target.closest('[data-action]');
  if(v){
    const id = Number(v.dataset.id);
    const action = v.dataset.action;
    const p = products.find(x=>x.id===id);
    if(action==='view' && modal && modalBody){
      modalBody.innerHTML = `
        <div style="display:flex;gap:16px">
          <div style="width:260px;height:220px;background:#eee;border-radius:10px"></div>
          <div>
            <h3>${p.name}</h3>
            <p class="price">${formatBRL(p.price)}</p>
            <p>${p.desc}</p>
            <div style="margin-top:12px">
              <button class="btn primary" data-id="${p.id}" data-action="buy">Comprar</button>
            </div>
          </div>
        </div>
      `;
      modal.setAttribute('aria-hidden','false');
    }
    if(action==='buy'){ addToCart(p); openCart(); }
  }
});
if(modalClose) modalClose.addEventListener('click', ()=> modal.setAttribute('aria-hidden','true'));

// -----------------------------
// CARRINHO (localStorage)
// -----------------------------
let cart = JSON.parse(localStorage.getItem('cart_v1')||'[]');
const cartCountEl = document.getElementById('cartCount') || document.getElementById('cartCount2');
function saveCart(){ localStorage.setItem('cart_v1', JSON.stringify(cart)); updateCartUI(); }
function addToCart(product){
  const found = cart.find(i=>i.id===product.id);
  if(found) found.qty += 1;
  else cart.push({id:product.id,name:product.name,price:product.price,qty:1});
  saveCart();
}
function updateCartUI(){
  const count = cart.reduce((s,i)=>s+i.qty,0);
  if(cartCountEl) cartCountEl.textContent = count;
  const cartItems = document.getElementById('cartItems');
  if(cartItems){
    cartItems.innerHTML = '';
    cart.forEach(item=>{
      const node = document.createElement('div');
      node.className='cart-item';
      node.innerHTML = `
        <div class="ci-thumb"></div>
        <div style="flex:1">
          <div style="font-weight:600">${item.name}</div>
          <div style="color:var(--brand-1)">${formatBRL(item.price)}</div>
          <div class="qty-controls">
            <button class="btn" data-id="${item.id}" data-action="dec">-</button>
            <span>${item.qty}</span>
            <button class="btn" data-id="${item.id}" data-action="inc">+</button>
          </div>
        </div>
      `;
      cartItems.appendChild(node);
    });
    const totalEl = document.getElementById('cartTotal');
    if(totalEl) totalEl.textContent = formatBRL(cart.reduce((s,i)=>s + i.qty * Number(i.price),0));
  }
}
updateCartUI();

// abrir/fechar drawer
const cartDrawer = document.getElementById('cartDrawer');
const cartBtn = document.getElementById('cartBtn') || document.getElementById('cartBtn2');
const closeCart = document.getElementById('closeCart');
function openCart(){ if(cartDrawer) cartDrawer.setAttribute('aria-hidden','false'); }
function closeCartFn(){ if(cartDrawer) cartDrawer.setAttribute('aria-hidden','true'); }
if(cartBtn) cartBtn.addEventListener('click', openCart);
if(closeCart) closeCart.addEventListener('click', closeCartFn);

// mudar quantidade
document.addEventListener('click', e=>{
  const btn = e.target.closest('button[data-action]');
  if(!btn) return;
  const id = Number(btn.dataset.id);
  const action = btn.dataset.action;
  if(['inc','dec'].includes(action)){
    const it = cart.find(c=>c.id===id);
    if(!it) return;
    if(action==='inc') it.qty++;
    if(action==='dec') it.qty = Math.max(0,it.qty-1);
    cart = cart.filter(i=>i.qty>0);
    saveCart();
  }
});

// -----------------------------
// CHECKOUT (cart.html)
// -----------------------------
document.addEventListener('change', (e)=>{
  if(!e.target.name || e.target.name!=='pay') return;
  const val = e.target.value;
  document.getElementById('paymentCard')?.classList.toggle('hidden', val!=='card');
  document.getElementById('paymentPix')?.classList.toggle('hidden', val!=='pix');
  document.getElementById('paymentBoleto')?.classList.toggle('hidden', val!=='boleto');
});

const cartPageItems = document.getElementById('cartPageItems');
if(cartPageItems){
  function renderCartPage(){
    cartPageItems.innerHTML='';
    cart.forEach(item=>{
      const el = document.createElement('div');
      el.className='card';
      el.innerHTML = `
        <div style="display:flex;align-items:center;gap:12px">
          <div style="width:72px;height:72px;background:var(--muted);border-radius:8px"></div>
          <div style="flex:1">
            <div style="font-weight:700">${item.name}</div>
            <div style="color:var(--brand-1)">${formatBRL(item.price)}</div>
            <div style="display:flex;gap:8px;align-items:center;margin-top:8px">
              <button class="btn" data-id="${item.id}" data-action="dec">-</button>
              <span>${item.qty}</span>
              <button class="btn" data-id="${item.id}" data-action="inc">+</button>
            </div>
          </div>
        </div>
      `;
      cartPageItems.appendChild(el);
    });
    const checkoutTotal = document.getElementById('checkoutTotal');
    if(checkoutTotal) checkoutTotal.textContent = formatBRL(cart.reduce((s,i)=>s + i.qty * Number(i.price),0));
  }
  renderCartPage();
  document.addEventListener('click', ()=> renderCartPage());
}

// -----------------------------
// USUÁRIO (cadastro / login / perfil)
// -----------------------------
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", e => {
    e.preventDefault();
    const nome = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const senha = document.getElementById("pass1").value;
    const senha2 = document.getElementById("pass2").value;
    if (senha !== senha2) {
      alert("As senhas não conferem!");
      return;
    }
    const user = { nome, email, senha };
    localStorage.setItem("user_v1", JSON.stringify(user));
    alert("Cadastro realizado! Agora você pode acessar seu perfil.");
    window.location.href = "profile.html";
  });
}

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", e => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const senha = document.getElementById("loginPass").value;
    const user = JSON.parse(localStorage.getItem("user_v1") || "{}");
    if (user.email === email && user.senha === senha) {
      alert("Login realizado!");
      // atualizar menu após login
      updateProfileLink();
      window.location.href = "profile.html";
    } else {
      alert("Email ou senha inválidos!");
    }
  });
}

const profileForm = document.getElementById("profileForm");
if (profileForm) {
  const userData = JSON.parse(localStorage.getItem("user_v1") || "{}");
  document.getElementById("profileName").value = userData.nome || "";
  document.getElementById("profileEmail").value = userData.email || "";

  profileForm.addEventListener("submit", e => {
    e.preventDefault();
    userData.nome = document.getElementById("profileName").value;
    userData.email = document.getElementById("profileEmail").value;
    const newPass = document.getElementById("profilePass").value;
    if (newPass.trim()) userData.senha = newPass;
    localStorage.setItem("user_v1", JSON.stringify(userData));
    alert("Perfil atualizado com sucesso!");
    // atualizar menu após alteração
    updateProfileLink();
  });
}

// -----------------------------
// PERFIL NO MENU
// -----------------------------
function updateProfileLink(){
  const profileLink = document.getElementById("profileLink");
  if(profileLink){
    const user = JSON.parse(localStorage.getItem("user_v1") || "{}");
    if(user.email){
      profileLink.setAttribute("href","profile.html");
      profileLink.setAttribute("title","Meu Perfil");
      profileLink.textContent = "Meu Perfil";
    } else {
      profileLink.setAttribute("href","login.html");
      profileLink.setAttribute("title","Login / Cadastro");
      profileLink.textContent = "Login / Cadastro";
    }
  }
}
// inicializa no carregamento da página
updateProfileLink();
