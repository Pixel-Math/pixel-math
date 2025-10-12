# Backend - API Cálculo Digital 2

Backend em Flask com PostgreSQL para gerenciar progresso de leitura dos usuários.

## 📋 Pré-requisitos

- Python 3.8 ou superior
- PostgreSQL 12 ou superior
- pip (gerenciador de pacotes Python)

## 🚀 Instalação

### 1. Instalar PostgreSQL

Baixe e instale o PostgreSQL: https://www.postgresql.org/download/

### 2. Criar banco de dados

```bash
# Acessar PostgreSQL
psql -U postgres

# Criar banco de dados
CREATE DATABASE calculo_digital;

# Criar usuário (opcional)
CREATE USER seu_usuario WITH PASSWORD 'sua_senha';
GRANT ALL PRIVILEGES ON DATABASE calculo_digital TO seu_usuario;

# Sair
\q
```

### 3. Configurar ambiente virtual Python

```bash
# Navegar até a pasta backend
cd backend

# Criar ambiente virtual
python -m venv venv

# Ativar ambiente virtual
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate
```

### 4. Instalar dependências

```bash
pip install -r requirements.txt
```

### 5. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e preencha com suas credenciais:

```bash
cp .env.example .env
```

Edite o arquivo `.env`:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=calculo_digital
DB_USER=seu_usuario
DB_PASSWORD=sua_senha

FLASK_SECRET_KEY=sua_chave_secreta_muito_segura_aqui
JWT_SECRET_KEY=sua_chave_jwt_secreta_aqui

FLASK_ENV=development
```

### 6. Inicializar banco de dados

```bash
python init_db.py init
```

## 🏃 Executar a aplicação

```bash
python app.py
```

A API estará rodando em: `http://localhost:5000`

## 📡 Endpoints da API

### Autenticação

#### Registrar usuário
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "usuario",
  "email": "email@exemplo.com",
  "password": "senha123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "usuario",
  "password": "senha123"
}
```

#### Obter usuário atual
```http
GET /api/auth/me
Authorization: Bearer {token}
```

### Progresso de Leitura

#### Obter todo progresso
```http
GET /api/progress
Authorization: Bearer {token}
```

#### Obter progresso de um capítulo
```http
GET /api/progress/Capítulo 1
Authorization: Bearer {token}
```

#### Salvar progresso
```http
POST /api/progress/Capítulo 1
Authorization: Bearer {token}
Content-Type: application/json

{
  "progress": 0.5,
  "last_position": 100,
  "completed": false
}
```

#### Deletar progresso
```http
DELETE /api/progress/Capítulo 1
Authorization: Bearer {token}
```

### Utilidades

#### Health Check
```http
GET /api/health
```

## 🗄️ Estrutura do Banco de Dados

### Tabela `users`
- `id` (Integer, PK)
- `username` (String, Unique)
- `email` (String, Unique)
- `password_hash` (String)
- `created_at` (DateTime)
- `updated_at` (DateTime)

### Tabela `reading_progress`
- `id` (Integer, PK)
- `user_id` (Integer, FK -> users.id)
- `chapter_key` (String)
- `progress` (Float, 0.0 a 1.0)
- `last_position` (Integer)
- `completed` (Boolean)
- `created_at` (DateTime)
- `updated_at` (DateTime)

## 🔧 Comandos úteis

```bash
# Inicializar banco
python init_db.py init

# Resetar banco
python init_db.py reset

# Remover todas as tabelas
python init_db.py drop
```

## 🔐 Segurança

- Senhas são armazenadas com hash usando `werkzeug.security`
- Autenticação via JWT (JSON Web Tokens)
- CORS habilitado para integração com frontend
- Validação de dados em todas as rotas

## 📝 Credenciais de exemplo

Após executar `init_db.py`, um usuário de exemplo é criado:

- **Username:** usuario_exemplo
- **Password:** senha123
- **Email:** exemplo@email.com

## 🐛 Troubleshooting

### Erro de conexão com PostgreSQL
- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no arquivo `.env`
- Teste a conexão: `psql -U seu_usuario -d calculo_digital`

### Erro de importação de módulos
- Certifique-se que o ambiente virtual está ativado
- Reinstale as dependências: `pip install -r requirements.txt`

### Porta 5000 já em uso
- Altere a porta no arquivo `app.py`: `app.run(port=5001)`
