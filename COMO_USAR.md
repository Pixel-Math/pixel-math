# 🎯 Como Usar o Sistema - Cálculo Digital 2

Este guia mostra como configurar e usar todo o sistema, incluindo backend e frontend.

## 📚 Visão Geral

O sistema possui:
- ✅ **Backend Flask**: API REST com autenticação JWT e banco PostgreSQL
- ✅ **Frontend Web**: Interface para visualizar capítulos com progresso sincronizado
- ✅ **Autenticação**: Sistema de login/cadastro de usuários
- ✅ **Visualizador de Capítulos**: Renderiza arquivos .tex com MathJax

---

## 🚀 Passo 1: Configurar o Backend

### 1.1. Instalar PostgreSQL

Baixe e instale: https://www.postgresql.org/download/

### 1.2. Criar banco de dados

Abra o terminal PostgreSQL (psql):

```sql
CREATE DATABASE calculo_digital;
```

### 1.3. Configurar ambiente Python

```bash
cd backend

# Criar ambiente virtual
python -m venv venv

# Ativar (Windows PowerShell)
venv\Scripts\Activate.ps1

# Instalar dependências
pip install -r requirements.txt
```

### 1.4. Configurar variáveis de ambiente

Crie o arquivo `backend/.env`:

```env
FLASK_SECRET_KEY=sua-chave-secreta-123
JWT_SECRET_KEY=sua-chave-jwt-456
FLASK_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=calculo_digital
DB_USER=postgres
DB_PASSWORD=postgres
```

### 1.5. Inicializar banco de dados

```bash
python init_db.py
```

Isso criará um usuário de exemplo:
- **Usuário:** usuario_exemplo
- **Senha:** senha123

### 1.6. Iniciar o servidor

```bash
python app.py
```

✅ Backend rodando em: `http://localhost:5000`

---

## 🌐 Passo 2: Usar o Frontend

### 2.1. Abrir a página inicial

Abra no navegador:
```
homePage/homeIndex.html
```

Ou use um servidor local (recomendado):

```bash
# Python 3
python -m http.server 8080

# Acesse: http://localhost:8080/homePage/homeIndex.html
```

### 2.2. Fazer login ou cadastro

1. Clique em **"Cadastrar"** no menu superior
2. Preencha seus dados:
   - Usuário
   - E-mail
   - Senha (mínimo 6 caracteres)
3. Clique em **"Cadastrar"**
4. Você será redirecionado para fazer login

**OU** use o usuário de exemplo:
- **Usuário:** usuario_exemplo
- **Senha:** senha123

### 2.3. Navegar pelos capítulos

1. Após login, você verá a lista de capítulos
2. Clique em qualquer capítulo para começar a ler
3. Seu progresso será salvo automaticamente enquanto você rola a página

---

## 📖 Passo 3: Ler um Capítulo

### Como funciona:

1. **Selecione um capítulo** na página inicial
2. O sistema carrega o arquivo `.tex` correspondente
3. O conteúdo é processado e renderizado com **MathJax**
4. Enquanto você lê e rola a página:
   - ✅ Progresso é salvo automaticamente
   - ✅ Barra de progresso é atualizada
   - ✅ Posição de leitura é memorizada

### Recursos disponíveis:

- 📊 **Barra de progresso** visual
- 💾 **Salvamento automático** do progresso
- 🔖 **Retomar de onde parou** (scroll automático)
- 📐 **Renderização matemática** com MathJax
- 📱 **Responsivo** (funciona em mobile)

---

## 🎨 Estrutura dos Capítulos

Os capítulos são definidos em: `assets/files/livro_epub/chapters.json`

```json
[
  {
    "key": "semana1",
    "title": "Capítulo 1 — Noções sobre conjuntos no espaço euclidiano",
    "file": "assets/files/livro_epub/Semana1.tex"
  }
]
```

Para adicionar novos capítulos:
1. Adicione o arquivo `.tex` em `assets/files/livro_epub/`
2. Adicione uma entrada no `chapters.json`
3. Recarregue a página

---

## 🔐 Sistema de Autenticação

### Endpoints disponíveis:

**Cadastro:**
```
POST http://localhost:5000/api/auth/register
Body: { "username": "...", "email": "...", "password": "..." }
```

**Login:**
```
POST http://localhost:5000/api/auth/login
Body: { "username": "...", "password": "..." }
```

**Obter usuário atual:**
```
GET http://localhost:5000/api/auth/me
Header: Authorization: Bearer {token}
```

---

## 💾 Sistema de Progresso

### Como funciona:

1. **Ao rolar a página**: Script calcula % de progresso
2. **A cada 900ms**: Salva no backend via API
3. **Ao abrir capítulo**: Carrega progresso salvo
4. **Scroll automático**: Volta para última posição

### Endpoints disponíveis:

**Obter todo progresso:**
```
GET http://localhost:5000/api/progress
```

**Salvar progresso:**
```
POST http://localhost:5000/api/progress/{chapter_key}
Body: { "progress": 0.75, "last_position": 1500, "completed": false }
```

---

## 🐛 Solução de Problemas

### Backend não inicia

**Erro:** `sqlalchemy.exc.OperationalError`
- ✅ Verifique se PostgreSQL está rodando
- ✅ Confirme credenciais no `.env`
- ✅ Teste: `psql -U postgres -d calculo_digital`

**Erro:** `ModuleNotFoundError`
- ✅ Ative o ambiente virtual
- ✅ Reinstale: `pip install -r requirements.txt`

### Frontend não conecta ao backend

**Erro:** `Failed to fetch`
- ✅ Backend deve estar rodando em `http://localhost:5000`
- ✅ Verifique CORS no `app.py`
- ✅ Abra Console do navegador (F12) para ver erros

### Capítulo não carrega

**Erro:** `404 Not Found`
- ✅ Verifique se arquivo `.tex` existe
- ✅ Confirme caminho no `chapters.json`
- ✅ Use caminho relativo correto

### Progresso não salva

- ✅ Faça login primeiro
- ✅ Verifique token no localStorage
- ✅ Abra DevTools > Network para ver requisições

---

## 📊 Arquitetura do Sistema

```
┌─────────────────┐
│   Frontend      │
│  (HTML/JS/CSS)  │
└────────┬────────┘
         │
         │ HTTP/REST
         │ (JWT Auth)
         │
┌────────▼────────┐      ┌──────────────┐
│   Backend       │──────│  PostgreSQL  │
│    (Flask)      │      │   Database   │
└─────────────────┘      └──────────────┘
         │
         │
    ┌────▼────┐
    │  .tex   │
    │  Files  │
    └─────────┘
```

---

## 🎓 Para Desenvolvedores

### Adicionar novo endpoint:

1. Edite `backend/app.py`
2. Adicione rota com decorador `@app.route()`
3. Use `@jwt_required()` se precisar autenticação
4. Retorne JSON com `jsonify()`

### Modificar visualizador:

1. Edite `chapterPage/viewerScript.js`
2. Função `processLatexToHtml()` processa LaTeX
3. MathJax renderiza fórmulas matemáticas

### Estilizar interface:

- **Global:** `generalUI/style.css`
- **Home:** `homePage/homeStyle.css`
- **Capítulo:** `chapterPage/chapterStyle.css`
- **Auth:** `authPage/authStyle.css`

---

## ✅ Checklist de Configuração

- [ ] PostgreSQL instalado e rodando
- [ ] Banco `calculo_digital` criado
- [ ] Ambiente virtual Python criado
- [ ] Dependências instaladas (`pip install -r requirements.txt`)
- [ ] Arquivo `.env` configurado
- [ ] Banco de dados inicializado (`python init_db.py`)
- [ ] Backend rodando (`python app.py`)
- [ ] Frontend aberto no navegador
- [ ] Login realizado com sucesso
- [ ] Capítulo abre corretamente
- [ ] Progresso está sendo salvo

---

## 🎉 Pronto!

Agora você pode:
- ✅ Criar sua conta
- ✅ Navegar pelos capítulos
- ✅ Ler conteúdo em LaTeX renderizado
- ✅ Acompanhar seu progresso
- ✅ Retomar de onde parou

**Bons estudos! 📚✨**
