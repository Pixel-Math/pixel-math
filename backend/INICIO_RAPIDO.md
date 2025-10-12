# 🚀 INÍCIO RÁPIDO - Backend

## ⚡ Comandos Essenciais

### 1️⃣ Primeira vez (configuração inicial)

```powershell
# 1. Entrar na pasta backend
cd backend

# 2. Criar ambiente virtual
python -m venv venv

# 3. Ativar ambiente virtual
venv\Scripts\Activate.ps1

# 4. Instalar dependências
pip install -r requirements.txt

# 5. Copiar arquivo de configuração
copy .env.example .env
# Edite o .env com suas credenciais do PostgreSQL

# 6. Inicializar banco de dados
python init_db.py

# 7. Testar configuração
python test_sistema.py

# 8. Iniciar servidor
python app.py
```

### 2️⃣ Uso diário

```powershell
# 1. Entrar na pasta backend
cd backend

# 2. Ativar ambiente virtual
venv\Scripts\Activate.ps1

# 3. Iniciar servidor
python app.py
```

---

## 🔧 Pré-requisitos

- ✅ Python 3.8+ instalado
- ✅ PostgreSQL 12+ instalado e rodando
- ✅ Banco `calculo_digital` criado

### Criar banco PostgreSQL:

```sql
-- Abra psql ou pgAdmin e execute:
CREATE DATABASE calculo_digital;
```

---

## 📝 Arquivo .env (configuração)

Crie o arquivo `backend/.env`:

```env
# Chaves secretas (mude em produção!)
FLASK_SECRET_KEY=minha-chave-secreta-123
JWT_SECRET_KEY=minha-chave-jwt-456
FLASK_ENV=development

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=calculo_digital
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui
```

---

## 🧪 Testar se está funcionando

```powershell
# 1. Teste de configuração
python test_sistema.py

# 2. Health check da API
# Abra: http://localhost:5000/api/health
```

---

## 👤 Usuário de exemplo

Após `python init_db.py`:

- **Usuário:** usuario_exemplo
- **Senha:** senha123
- **Email:** exemplo@email.com

---

## 🐛 Problemas comuns

### ❌ ModuleNotFoundError

```powershell
# Solução: Ativar ambiente virtual
venv\Scripts\Activate.ps1
```

### ❌ Erro ao conectar PostgreSQL

```powershell
# Verifique se está rodando:
# Services → PostgreSQL → Start

# Teste conexão:
psql -U postgres -d calculo_digital
```

### ❌ Porta 5000 em uso

```python
# Em app.py, mude a porta:
app.run(debug=True, port=5001)
```

---

## 📡 Endpoints principais

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/register` | Cadastrar usuário |
| POST | `/api/auth/login` | Fazer login |
| GET | `/api/auth/me` | Dados do usuário (requer token) |
| GET | `/api/chapters` | Lista de capítulos |
| GET | `/api/chapters/{key}/content` | Conteúdo do capítulo |
| GET | `/api/progress` | Progresso de leitura (requer token) |
| POST | `/api/progress/{key}` | Salvar progresso (requer token) |

---

## ✅ Tudo funcionando?

Se tudo estiver OK, você verá:

```
 * Running on http://127.0.0.1:5000
 * Restarting with stat
 * Debugger is active!
```

✨ **Pronto! Backend funcionando!**

Agora abra o frontend em: `homePage/homeIndex.html`
