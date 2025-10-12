# 📚 Sistema de Progresso de Leitura - Cálculo Digital 2

Sistema completo com back-end Flask e PostgreSQL para rastrear o progresso de leitura dos usuários.

---

## 🏗️ Arquitetura do Sistema

### Back-end (Flask + PostgreSQL)
- **API REST** para autenticação e gerenciamento de progresso
- **Banco de dados PostgreSQL** para armazenar usuários e progresso
- **JWT** para autenticação segura
- **CORS** habilitado para integração com front-end

### Front-end (Vanilla JavaScript)
- **apiClient.js** - Cliente para comunicação com a API
- **homeScript.js** - Lógica da página inicial com lista de capítulos
- **chapterScript.js** - Lógica da página de capítulo individual
- Rastreamento automático de progresso baseado em scroll

---

## 🚀 Instalação e Configuração

### Passo 1: Configurar o Back-end

#### 1.1. Instalar PostgreSQL
- Baixe em: https://www.postgresql.org/download/
- Instale e configure com usuário e senha

#### 1.2. Criar banco de dados
```sql
-- Abrir psql
psql -U postgres

-- Criar banco
CREATE DATABASE calculo_digital;

-- Criar usuário (opcional)
CREATE USER calculo_user WITH PASSWORD 'senha123';
GRANT ALL PRIVILEGES ON DATABASE calculo_digital TO calculo_user;
```

#### 1.3. Configurar ambiente Python
```bash
cd backend

# Criar ambiente virtual
python -m venv venv

# Ativar ambiente virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt
```

#### 1.4. Configurar variáveis de ambiente
Copie `.env.example` para `.env` e configure:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=calculo_digital
DB_USER=calculo_user
DB_PASSWORD=senha123

FLASK_SECRET_KEY=sua_chave_secreta_aqui
JWT_SECRET_KEY=sua_chave_jwt_aqui
FLASK_ENV=development
```

#### 1.5. Inicializar banco de dados
```bash
python init_db.py init
```

Isso criará as tabelas e um usuário de exemplo:
- **Username:** usuario_exemplo
- **Password:** senha123

#### 1.6. Executar o servidor
```bash
python app.py
```

A API estará em: **http://localhost:5000**

---

### Passo 2: Configurar o Front-end

#### 2.1. Atualizar URL da API (se necessário)
Em `homePage/apiClient.js`, linha 6:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

#### 2.2. Servir os arquivos HTML
Você pode usar qualquer servidor HTTP. Exemplos:

**Opção 1 - Python:**
```bash
# Na raiz do projeto
python -m http.server 8000
```

**Opção 2 - Node.js (npx):**
```bash
npx http-server -p 8000
```

**Opção 3 - VS Code Live Server:**
- Instale a extensão "Live Server"
- Clique com botão direito em `homeIndex.html`
- Selecione "Open with Live Server"

Acesse: **http://localhost:8000/homePage/homeIndex.html**

---

## 📖 Como Usar

### 1. Registro de Usuário

Na página inicial:
1. Clique em **"Cadastrar"**
2. Insira username, email e senha
3. Será feito login automaticamente

### 2. Login

1. Clique em **"Entrar"**
2. Insira username e senha
3. O sistema carregará seu progresso

### 3. Navegação nos Capítulos

1. Role até a seção "Capítulos"
2. Clique em um capítulo para começar a ler
3. O progresso é salvo automaticamente conforme você rola a página
4. O sistema salva sua última posição de leitura

### 4. Sincronização de Progresso

- O progresso é salvo **a cada 1 segundo** após parar de rolar
- Quando retornar, a página rola automaticamente para onde parou
- A barra de progresso é atualizada em tempo real

### 5. Logout

Clique em **"Sair"** no canto superior direito

---

## 🗄️ Estrutura de Dados

### Tabela: users
```sql
id              SERIAL PRIMARY KEY
username        VARCHAR(80) UNIQUE NOT NULL
email           VARCHAR(120) UNIQUE NOT NULL
password_hash   VARCHAR(255) NOT NULL
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### Tabela: reading_progress
```sql
id              SERIAL PRIMARY KEY
user_id         INTEGER REFERENCES users(id)
chapter_key     VARCHAR(50) NOT NULL
progress        FLOAT (0.0 a 1.0)
last_position   INTEGER
completed       BOOLEAN
created_at      TIMESTAMP
updated_at      TIMESTAMP

UNIQUE(user_id, chapter_key)
```

---

## 🔌 API Endpoints

### Autenticação

#### POST /api/auth/register
Registra novo usuário
```json
// Request
{
  "username": "joao",
  "email": "joao@email.com",
  "password": "senha123"
}

// Response
{
  "message": "Usuário registrado com sucesso",
  "user": {...},
  "access_token": "eyJ0eXAi..."
}
```

#### POST /api/auth/login
Faz login
```json
// Request
{
  "username": "joao",
  "password": "senha123"
}

// Response
{
  "message": "Login realizado com sucesso",
  "user": {...},
  "access_token": "eyJ0eXAi..."
}
```

#### GET /api/auth/me
Retorna usuário atual (requer autenticação)
```
Headers: Authorization: Bearer {token}
```

### Progresso

#### GET /api/progress
Retorna todo o progresso do usuário
```
Headers: Authorization: Bearer {token}
```

#### GET /api/progress/{chapter_key}
Retorna progresso de um capítulo específico
```
Headers: Authorization: Bearer {token}
```

#### POST /api/progress/{chapter_key}
Salva progresso
```json
// Request
Headers: Authorization: Bearer {token}
{
  "progress": 0.5,
  "last_position": 1200,
  "completed": false
}
```

#### DELETE /api/progress/{chapter_key}
Remove progresso de um capítulo
```
Headers: Authorization: Bearer {token}
```

---

## 🔧 Comandos Úteis

### Back-end

```bash
# Inicializar banco
python init_db.py init

# Resetar banco (CUIDADO!)
python init_db.py reset

# Remover todas as tabelas
python init_db.py drop

# Executar servidor
python app.py

# Executar com debug
FLASK_ENV=development python app.py
```

### Testar API com cURL

```bash
# Health check
curl http://localhost:5000/api/health

# Registrar usuário
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"teste","email":"teste@email.com","password":"123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"teste","password":"123"}'

# Salvar progresso
curl -X POST http://localhost:5000/api/progress/Capítulo%201 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{"progress":0.5,"last_position":100}'
```

---

## 🐛 Troubleshooting

### Problema: Erro de CORS
**Solução:** Verifique se o Flask está rodando e se CORS está habilitado em `app.py`

### Problema: Erro de autenticação
**Solução:** Verifique se o token JWT está sendo enviado corretamente nos headers

### Problema: Progresso não salva
**Solução:** 
1. Verifique se está autenticado
2. Verifique o console do navegador para erros
3. Verifique se a API está rodando

### Problema: Banco de dados não conecta
**Solução:**
1. Verifique se PostgreSQL está rodando
2. Confirme credenciais no arquivo `.env`
3. Teste conexão: `psql -U calculo_user -d calculo_digital`

---

## 📦 Estrutura de Arquivos

```
pixel-math/
├── backend/
│   ├── app.py              # Aplicação Flask principal
│   ├── models.py           # Modelos do banco de dados
│   ├── config.py           # Configurações
│   ├── init_db.py          # Script de inicialização
│   ├── requirements.txt    # Dependências Python
│   ├── .env.example        # Exemplo de variáveis de ambiente
│   ├── .gitignore
│   └── README.md
│
├── homePage/
│   ├── homeIndex.html      # Página inicial
│   ├── homeScript.js       # Lógica da home + integração API
│   ├── homeStyle.css
│   └── apiClient.js        # Cliente da API
│
├── chapterPage/
│   ├── chapterIndex.html   # Página de capítulo
│   ├── chapterScript.js    # Lógica do capítulo + tracking
│   └── chapterStyle.css
│
└── README.md
```

---

## 🔒 Segurança

- ✅ Senhas armazenadas com hash (werkzeug)
- ✅ Autenticação via JWT
- ✅ CORS configurado
- ✅ Validação de dados de entrada
- ⚠️ **IMPORTANTE:** Em produção:
  - Use HTTPS
  - Configure CORS apenas para domínios específicos
  - Use chaves secretas fortes
  - Configure rate limiting
  - Use variáveis de ambiente seguras

---

## 🚀 Deploy em Produção

### Back-end (Heroku/Railway/etc)

1. Configure as variáveis de ambiente
2. Configure PostgreSQL em produção
3. Desabilite debug: `FLASK_ENV=production`
4. Use Gunicorn: `gunicorn app:app`

### Front-end (GitHub Pages/Netlify/Vercel)

1. Atualize `API_BASE_URL` para URL de produção
2. Faça deploy dos arquivos estáticos

---

## 📝 Próximos Passos

- [ ] Criar modals bonitos para login/registro
- [ ] Adicionar reset de senha
- [ ] Implementar sistema de bookmarks
- [ ] Adicionar notas por capítulo
- [ ] Dashboard com estatísticas de leitura
- [ ] Modo offline com sync posterior
- [ ] Gamificação (badges, streaks)

---

## 📄 Licença

© 2025 Cálculo Digital 2: Do papel ao pixel
