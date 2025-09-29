#  DrogaFast - Marketplace de Farmácia Online

Um marketplace moderno e completo para farmácia online, desenvolvido com HTML, CSS e JavaScript puro. O projeto oferece uma experiência completa de compras de medicamentos e produtos farmacêuticos.

## 🚀 Funcionalidades Principais

### ✅ Atualmente Implementadas

#### 🏠 **Página Principal (index.html)**
- **Hero Section** com carousel automático destacando ofertas especiais
- **Catálogo de promoções** com produtos farmacêuticos
- **Filtros por categoria**: Medicamentos, Vitaminas, Higiene, Beleza, Infantil
- **Sistema de ordenação**: Por popularidade, preço (menor/maior)
- **Modal de produto** com informações detalhadas e avisos de receita médica

#### 🛍️ **Catálogo Completo (catalog.html)**
- **Busca avançada** com filtros múltiplos
- **Filtros por**: Categoria, faixa de preço, necessidade de receita
- **Busca por texto** em nome, descrição, marca e princípio ativo
- **Busca por voz** (quando suportado pelo navegador)
- **Highlight de termos** pesquisados nos resultados
- **Paginação** e loading states para melhor UX

#### 🔐 **Sistema de Autenticação (login.html)**
- **Login e cadastro** com validações completas
- **Validação de CPF** com formatação automática
- **Verificador de força de senha** em tempo real
- **Integração social** (Google, Facebook) preparada
- **Persistência de sessão** com localStorage/sessionStorage

#### 🛒 **Carrinho de Compras (cart.html)**
- **Gerenciamento completo** de itens no carrinho
- **Sistema de cupons** de desconto funcionais
- **Cálculo automático** de subtotal, desconto e total
- **Opções de entrega** (Express 2h, Normal 1-2 dias)
- **Checkout completo** com confirmação de pedido
- **Histórico de pedidos** salvo localmente

#### 🎨 **Design e UX**
- **Design responsivo** otimizado para mobile, tablet e desktop
- **Tema farmacêutico** com cores e elementos apropriados
- **Animações suaves** e micro-interactions
- **Notificações toast** para feedback do usuário
- **Estados de loading** e feedback visual

## 🌐 URIs e Navegação

### 📋 Páginas Disponíveis

| Página | URI | Descrição |
|--------|-----|-----------|
| **Principal** | `/index.html` | Landing page com promoções em destaque |
| **Catálogo** | `/catalog.html` | Catálogo completo com busca avançada |
| **Login/Cadastro** | `/login.html` | Autenticação de usuários |
| **Carrinho** | `/cart.html` | Finalização de compras |

### 🔗 Funcionalidades JavaScript

#### **Carrinho de Compras**
- `addToCart(productId)` - Adicionar produto ao carrinho
- `removeFromCart(productId)` - Remover produto do carrinho
- `updateQuantity(productId, change)` - Alterar quantidade

#### **Busca e Filtros**
- `filterByCategory(category)` - Filtrar por categoria
- `sortProducts(sortBy)` - Ordenar produtos
- `applyAllFilters()` - Aplicar todos os filtros ativos

#### **Autenticação**
- `handleLogin(formData)` - Processar login
- `handleRegister(formData)` - Processar cadastro
- `validateCPF(cpf)` - Validar documento

## 📊 Estrutura de Dados

### 🏷️ **Produtos**
```javascript
{
  id: number,
  name: string,
  category: "Medicamentos" | "Vitaminas" | "Higiene" | "Beleza" | "Infantil",
  description: string,
  price: number,
  originalPrice: number | null,
  prescriptionRequired: boolean,
  stockQuantity: number,
  brand: string,
  activeIngredient: string,
  dosage: string,
  imageUrl: string,
  isPromoted: boolean,
  rating: number,
  contraindications: string
}
```

### 🛒 **Carrinho**
```javascript
{
  id: number,
  name: string,
  price: number,
  image: string,
  category: string,
  prescriptionRequired: boolean,
  quantity: number
}
```

### 📦 **Pedidos**
```javascript
{
  id: string,
  date: string,
  items: CartItem[],
  total: string,
  deliveryType: "express" | "normal",
  deliveryEstimate: string,
  coupon: CouponData | null
}
```

## 🛡️ Recursos de Segurança

- **Validação de CPF** com algoritmo oficial
- **Verificação de força de senha** com critérios robustos
- **Sanitização de inputs** para prevenir XSS
- **Persistência segura** de dados sensíveis
- **Avisos de receita médica** para produtos controlados

## 🎯 Cupons de Desconto Disponíveis

| Código | Desconto | Descrição |
|--------|----------|-----------|
| `FARMACIA10` | 10% | Desconto geral |
| `PRIMEIRA20` | 20% | Primeira compra |
| `SAUDE15` | 15% | Medicamentos |
| `FRETE5` | R$ 5,00 | Desconto fixo |

## 📱 Recursos Mobile

- **Design responsivo** com breakpoints otimizados
- **Touch-friendly** com botões e áreas de toque adequadas
- **Drawer de carrinho** otimizado para mobile
- **Formulários adaptados** para teclados móveis
- **Imagens otimizadas** para diferentes densidades de tela

## 🔮 Próximas Implementações

### 🎯 **Funcionalidades Planejadas**
- **Lista de favoritos** persistente
- **Comparação de produtos** lado a lado
- **Avaliações e comentários** de usuários
- **Programa de fidelidade** com pontos
- **Receituário digital** para produtos controlados
- **Integração com APIs** de pagamento
- **Sistema de notificações** push
- **Chat de suporte** em tempo real

### 📋 **Páginas Adicionais**
- **Perfil do usuário** com histórico e dados
- **Página de produto individual** expandida
- **Categorias específicas** (ex: categories.html)
- **Sobre nós e contato** institucionais
- **FAQ e suporte** com busca
- **Política de privacidade** e termos

### 🚀 **Melhorias Técnicas**
- **Service Worker** para cache offline
- **Lazy loading** de imagens
- **Compression** de assets
- **Analytics** de comportamento
- **SEO** otimizado
- **Acessibilidade** WCAG 2.1
- **PWA** (Progressive Web App)

## 🏗️ Estrutura do Projeto

```
drogafast/
├── index.html              # Página principal
├── catalog.html            # Catálogo completo
├── login.html              # Autenticação
├── cart.html               # Carrinho de compras
├── css/
│   └── style.css          # Estilos principais
├── js/
│   ├── main.js            # Funcionalidades principais
│   ├── catalog.js         # Específico do catálogo
│   ├── auth.js           # Autenticação
│   └── cart.js           # Carrinho de compras
└── README.md             # Documentação
```

## 🎨 Design System

### 🎨 **Paleta de Cores**
- **Primária**: #00a86b (Verde farmácia)
- **Secundária**: #f8f9fa (Cinza claro)
- **Accent**: #e74c3c (Vermelho para alertas)
- **Sucesso**: #28a745
- **Aviso**: #ffc107
- **Perigo**: #dc3545

### 📝 **Tipografia**
- **Família**: Roboto (Google Fonts)
- **Pesos**: 300, 400, 500, 700, 900

## 💡 Como Usar

1. **Navegue** pela página principal para ver promoções
2. **Explore** o catálogo completo com filtros avançados
3. **Adicione** produtos ao carrinho
4. **Cadastre-se** ou faça login
5. **Finalize** sua compra no carrinho
6. **Acompanhe** seu pedido no histórico

## 🌟 Destaques Técnicos

- **JavaScript Vanilla** sem dependências externas
- **Armazenamento local** com localStorage e sessionStorage
- **Código modular** e bem organizado
- **Performance otimizada** com debouncing e lazy loading
- **Acessibilidade** com ARIA labels e navegação por teclado
- **Cross-browser** compatível com navegadores modernos

---

**DrogaFast** - Sua farmácia online de confiança  
*Desenvolvido com ❤️ para oferecer a melhor experiência em compras farmacêuticas*