# 📸 DEMONSTRAÇÃO DO SISTEMA

## 🎬 Fluxo Completo

### 1️⃣ Página Inicial (Home)

```
┌─────────────────────────────────────────┐
│  🏠 Cálculo Digital 2                   │
│  ┌─────────┐  ┌─────────┐              │
│  │  Login  │  │Cadastrar│              │
│  └─────────┘  └─────────┘              │
├─────────────────────────────────────────┤
│                                         │
│  📚 CAPÍTULOS DISPONÍVEIS               │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Capítulo 1                        │ │
│  │ Noções sobre conjuntos            │ │
│  │ ████████░░░░░░░░ 50%             │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Capítulo 2                        │ │
│  │ Funções de várias variáveis       │ │
│  │ ████░░░░░░░░░░░░ 30%             │ │
│  └───────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

**Funcionalidades:**
- ✅ Lista dinâmica de capítulos (carregada de `chapters.json`)
- ✅ Barra de progresso para cada capítulo
- ✅ Botões de Login/Cadastro (ou nome do usuário se logado)
- ✅ Click em capítulo → Abre visualizador

---

### 2️⃣ Página de Autenticação

```
┌─────────────────────────────────────────┐
│  🔐 Cálculo Digital 2                   │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────┐  ┌──────────┐            │
│  │ ENTRAR  │  │ CADASTRAR│            │
│  └─────────┘  └──────────┘            │
│  ════════════════════════              │
│                                         │
│  Bem-vindo de volta!                   │
│  Entre com suas credenciais            │
│                                         │
│  Usuário                               │
│  ┌───────────────────────────┐        │
│  │ Digite seu usuário        │        │
│  └───────────────────────────┘        │
│                                         │
│  Senha                                 │
│  ┌───────────────────────────┐        │
│  │ ••••••••                  │        │
│  └───────────────────────────┘        │
│                                         │
│  ┌───────────────────────────┐        │
│  │    🔓 ENTRAR              │        │
│  └───────────────────────────┘        │
│                                         │
│  Não tem conta? Cadastre-se aqui       │
│                                         │
└─────────────────────────────────────────┘
```

**Funcionalidades:**
- ✅ Alternância Login ↔ Cadastro
- ✅ Validação de campos
- ✅ Integração com backend
- ✅ Mensagens de erro/sucesso
- ✅ Redirecionamento após login

---

### 3️⃣ Visualizador de Capítulo

```
┌─────────────────────────────────────────┐
│  📖 Cálculo Digital 2      👤 joao123   │
├─────────────────────────────────────────┤
│  ← Voltar                               │
│                                         │
│  Capítulo 1                             │
│  Noções sobre conjuntos no espaço...   │
│  ██████████████████░░░░░░░░░ 75%       │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  📄 CONTEÚDO DO CAPÍTULO                │
│                                         │
│  1.1 Introdução                        │
│                                         │
│  Lorem ipsum dolor sit amet, consectetur│
│  adipiscing elit. Sejam x, y ∈ ℝ...   │
│                                         │
│  Definição 1.1 (Conjunto Aberto)       │
│  Um conjunto A ⊂ ℝⁿ é dito aberto se...│
│                                         │
│  Para todo ε > 0, existe δ > 0 tal que:│
│                                         │
│      d(x,y) < δ ⟹ |f(x)-f(y)| < ε    │
│                                         │
│  1.2 Propriedades                      │
│                                         │
│  • Propriedade 1                       │
│  • Propriedade 2                       │
│                                         │
│  ...mais conteúdo...                   │
│                                         │
└─────────────────────────────────────────┘
      ▲ Ao rolar, progresso é salvo
```

**Funcionalidades:**
- ✅ Carrega arquivo .tex do capítulo
- ✅ Processa LaTeX → HTML
- ✅ Renderiza fórmulas com MathJax
- ✅ Barra de progresso atualiza ao rolar
- ✅ Salvamento automático (900ms)
- ✅ Retoma de onde parou
- ✅ Formatação profissional

---

## 🔄 Fluxo de Dados

### Carregar Capítulos

```
Frontend                Backend              Arquivo
────────               ────────            ─────────

homeScript.js
    │
    ├─► fetch chapters.json ──────────► chapters.json
    │                                   (lista de caps)
    │◄────── JSON ─────────────────────┤
    │
    ├─► Renderiza cards
    │   de capítulos
    │
    └─► Ao clicar:
        Redireciona com params
        ?key=semana1&title=...&file=...
```

### Visualizar Capítulo

```
viewerScript.js         Backend              Arquivo
───────────            ────────            ─────────

Recebe URL params
    │
    ├─► fetch arquivo.tex ──────────► Semana1.tex
    │                                  (conteúdo LaTeX)
    │◄────── .tex content ────────────┤
    │
    ├─► processLatexToHtml()
    │   • Remove \newpage
    │   • \section → <h2>
    │   • \textbf → <strong>
    │   • ...
    │
    ├─► MathJax.typesetPromise()
    │   Renderiza fórmulas
    │
    └─► Exibe conteúdo formatado
```

### Salvar Progresso

```
viewerScript.js         Backend              Database
───────────            ────────            ─────────

window.scroll event
    │
    ├─► Calcula progresso
    │   progress = scrollY / totalHeight
    │
    ├─► Delay 900ms
    │
    ├─► POST /api/progress/semana1 ──► app.py
    │   Body: {                         │
    │     progress: 0.75,               │
    │     last_position: 1500,          │
    │     completed: false              │
    │   }                                │
    │                                    │
    │                            Valida JWT
    │                                    │
    │                            Salva no banco ──► PostgreSQL
    │                                    │          (tabela
    │◄─────── Success ───────────────────┤         reading_progress)
    │
    └─► Atualiza barra visual
        ██████████████░░░░░░ 75%
```

---

## 🎨 Processamento de LaTeX

### Antes (arquivo .tex)

```latex
\section{Conjuntos Abertos}

Um conjunto $A \subset \mathbb{R}^n$ é \textbf{aberto} se:

\begin{itemize}
\item Para todo $x \in A$
\item Existe $\varepsilon > 0$
\end{itemize}

A distância é dada por:
\[d(x,y) = \sqrt{(x_1-y_1)^2 + (x_2-y_2)^2}\]
```

### Depois (HTML processado)

```html
<h2 class="section-title">Conjuntos Abertos</h2>

<p>
  Um conjunto $A \subset \mathbb{R}^n$ é <strong>aberto</strong> se:
</p>

<ul>
  <li>Para todo $x \in A$</li>
  <li>Existe $\varepsilon > 0$</li>
</ul>

<p>A distância é dada por:</p>

<p>\[d(x,y) = \sqrt{(x_1-y_1)^2 + (x_2-y_2)^2}\]</p>
```

### Renderizado (browser + MathJax)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Conjuntos Abertos
─────────────────────────────────

Um conjunto A ⊂ ℝⁿ é aberto se:

  • Para todo x ∈ A
  • Existe ε > 0

A distância é dada por:

     ________________
d(x,y) = √(x₁-y₁)² + (x₂-y₂)²

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 📊 Banco de Dados

### Tabela: users

| id | username | email | password_hash | created_at |
|----|----------|-------|---------------|------------|
| 1  | joao123  | joao@email.com | $2b$12$... | 2025-01-10 |
| 2  | maria456 | maria@email.com | $2b$12$... | 2025-01-11 |

### Tabela: reading_progress

| id | user_id | chapter_key | progress | last_position | completed | updated_at |
|----|---------|-------------|----------|---------------|-----------|------------|
| 1  | 1       | semana1     | 0.50     | 800           | false     | 2025-01-10 |
| 2  | 1       | semana2     | 0.30     | 450           | false     | 2025-01-11 |
| 3  | 1       | semana3     | 1.00     | 2500          | true      | 2025-01-11 |
| 4  | 2       | semana1     | 0.75     | 1200          | false     | 2025-01-11 |

---

## 🔐 Autenticação JWT

### Login Flow

```
1. Usuário envia credenciais
   POST /api/auth/login
   { username: "joao123", password: "senha123" }
   
2. Backend valida
   ✓ Usuário existe?
   ✓ Senha correta?
   
3. Backend gera JWT token
   Token = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   Contém: { user_id: 1, username: "joao123", exp: ... }
   
4. Frontend armazena
   localStorage.setItem('auth_token', token)
   
5. Requisições futuras incluem token
   Header: Authorization: Bearer eyJhbGciOiJ...
   
6. Backend valida token
   ✓ Token válido?
   ✓ Não expirou?
   → Permite acesso
```

---

## 🎯 Estados da Aplicação

### Não Autenticado

```
┌─────────────────────────────┐
│  Home Page                  │
│  [Login] [Cadastrar]        │
│                             │
│  📚 Capítulos (sem progresso)│
│  └─► Clique → Login necessário│
└─────────────────────────────┘
```

### Autenticado

```
┌─────────────────────────────┐
│  Home Page                  │
│  👤 joao123  [Sair]         │
│                             │
│  📚 Capítulos (com progresso)│
│  └─► Clique → Abre capítulo │
│      └─► Progresso sincroniza│
└─────────────────────────────┘
```

---

## ✨ Recursos Visuais

### Barra de Progresso Animada

```css
.current-progress {
  background: linear-gradient(90deg, #ff7518, #ff9248);
  transition: width 0.6s ease-in-out;
}

.current-progress::after {
  /* Bolinha no final */
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.7);
}
```

**Resultado:**
```
████████████████░░░░░░░░░░░░ 75% ●
```

---

## 🎉 Resultado Final

Um sistema completo e funcional para:

✅ Gerenciar usuários  
✅ Visualizar capítulos em LaTeX  
✅ Rastrear progresso de leitura  
✅ Sincronizar entre dispositivos  
✅ Experiência fluida e moderna  

**Tudo pronto para uso! 🚀**
