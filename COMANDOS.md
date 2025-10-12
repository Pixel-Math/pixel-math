# 📝 Comandos Úteis - Cálculo Digital 2

## 🚀 Iniciar o Sistema

### Windows PowerShell

#### Terminal 1: Backend (Flask)
```powershell
cd backend
.\venv\Scripts\Activate
python app.py
```

#### Terminal 2: Frontend (HTTP Server)
```powershell
# Na raiz do projeto
python -m http.server 8000
```

---

## 🔧 Primeira Configuração

### 1. Criar Banco de Dados
```powershell
psql -U postgres
```
```sql
CREATE DATABASE calculo_digital;
\l
\q
```

### 2. Configurar Backend
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate
pip install -r requirements.txt
copy .env.example .env
notepad .env  # Edite com suas credenciais
```

### 3. Inicializar Banco
```powershell
python init_db.py init
```

### 4. Testar Setup
```powershell
python test_setup.py
```

---

## 🗄️ Gerenciar Banco de Dados

### Verificar dados
```powershell
psql -U postgres -d calculo_digital
```
```sql
-- Ver usuários
SELECT * FROM users;

-- Ver progresso
SELECT * FROM reading_progress;

-- Ver progresso com nome de usuário
SELECT u.username, rp.chapter_key, rp.progress
FROM users u
JOIN reading_progress rp ON u.id = rp.user_id;

-- Sair
\q
```

### Resetar Banco (⚠️ Apaga tudo!)
```powershell
cd backend
.\venv\Scripts\Activate
python init_db.py reset
python init_db.py init
```

### Adicionar usuário manualmente
```sql
psql -U postgres -d calculo_digital
```
```sql
-- Ver usuários atuais
SELECT username, email FROM users;

-- O hash de senha deve ser gerado pelo Python
-- Use o endpoint /api/auth/register via API
```

---

## 🧪 Testar API

### Health Check
```powershell
curl http://localhost:5000/api/health
```

### Registrar Usuário
```powershell
curl -X POST http://localhost:5000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{\"username\":\"teste\",\"email\":\"teste@email.com\",\"password\":\"123456\"}'
```

### Login
```powershell
curl -X POST http://localhost:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"username\":\"teste\",\"password\":\"123456\"}'
```

### Ver Progresso (substitua SEU_TOKEN)
```powershell
curl http://localhost:5000/api/progress `
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## 🐍 Python - Ambiente Virtual

### Ativar
```powershell
# Windows PowerShell
.\venv\Scripts\Activate

# Você verá (venv) no início da linha
```

### Desativar
```powershell
deactivate
```

### Reinstalar Dependências
```powershell
pip install -r requirements.txt --upgrade
```

### Ver Pacotes Instalados
```powershell
pip list
```

---

## 🌐 Acessar o Sistema

### Localhost
```
http://localhost:8000/homePage/homeIndex.html
```

### Páginas
- **Home:** `/homePage/homeIndex.html`
- **Capítulos:** `/chapterPage/chapterIndex.html`
- **Sobre:** `/reportPage/reportIndex.html`

---

## 🔍 Debug e Logs

### Ver Logs do Flask
Os logs aparecem no terminal onde você executou `python app.py`

Procure por:
```
POST /api/auth/login 200
GET /api/progress 200
POST /api/progress/Capítulo%201 200
```

### Console do Navegador
1. Pressione **F12**
2. Vá em **Console**
3. Procure por mensagens de erro em vermelho

### Verificar Conexão PostgreSQL
```powershell
# Testar se conecta
psql -U postgres -d calculo_digital

# Dentro do psql
\conninfo
\dt
\q
```

---

## ⚙️ Configurações

### Mudar Porta do Flask
Edite `backend/app.py`, última linha:
```python
app.run(debug=True, host='0.0.0.0', port=5001)
```

Depois atualize `homePage/apiClient.js`:
```javascript
const API_BASE_URL = 'http://localhost:5001/api';
```

### Mudar Porta do HTTP Server
```powershell
python -m http.server 8080
```
Acesse: `http://localhost:8080/homePage/homeIndex.html`

---

## 🛑 Parar Servidores

Em cada terminal:
```
Ctrl + C
```

---

## 📂 Estrutura de Arquivos Importantes

```
backend/
├── .env                # ⚠️ Suas credenciais (NÃO commitar!)
├── app.py             # Servidor Flask
├── models.py          # Estrutura do banco
├── config.py          # Configurações
├── init_db.py         # Scripts do banco
└── test_setup.py      # Teste de configuração

homePage/
├── apiClient.js       # Cliente da API
└── homeScript.js      # Lógica + autenticação
```

---

## 🔐 Credenciais Padrão

Após `python init_db.py init`:

- **Username:** usuario_exemplo
- **Password:** senha123
- **Email:** exemplo@email.com

---

## 📊 Status dos Serviços

### Verificar se PostgreSQL está rodando
```powershell
# Abrir Serviços do Windows
services.msc

# Procurar por "postgresql"
# Status deve ser "Em execução"
```

### Verificar se Flask está rodando
```powershell
curl http://localhost:5000/api/health
```

### Verificar se HTTP Server está rodando
Acesse no navegador: `http://localhost:8000`

---

## 🆘 Comandos de Emergência

### PostgreSQL não inicia
```powershell
# Abrir como administrador
net start postgresql-x64-13
```

### Limpar Cache Python
```powershell
# Deletar arquivos .pyc
Get-ChildItem -Include __pycache__ -Recurse -Force | Remove-Item -Force -Recurse
```

### Reinstalar Tudo
```powershell
cd backend
Remove-Item -Recurse -Force venv
python -m venv venv
.\venv\Scripts\Activate
pip install -r requirements.txt
```

---

## 📚 Documentação Completa

- **[Tutorial Completo](../TUTORIAL_INSTALACAO.md)** - Guia passo a passo
- **[Início Rápido](../INICIO_RAPIDO.md)** - Comandos essenciais
- **[Sistema de Progresso](../SISTEMA_PROGRESSO.md)** - API e arquitetura

---

## ✅ Checklist de Verificação

Antes de usar, certifique-se:

- [ ] PostgreSQL instalado e rodando
- [ ] Banco `calculo_digital` criado
- [ ] Python 3.8+ instalado
- [ ] Ambiente virtual criado e ativado
- [ ] Dependências instaladas (`pip install -r requirements.txt`)
- [ ] Arquivo `.env` configurado com credenciais corretas
- [ ] Banco inicializado (`python init_db.py init`)
- [ ] Teste passou (`python test_setup.py`)
- [ ] Flask rodando (Terminal 1)
- [ ] HTTP Server rodando (Terminal 2)
- [ ] Navegador acessando http://localhost:8000/homePage/homeIndex.html

---

## 🎉 Está Tudo Funcionando Quando...

✅ `python test_setup.py` mostra todos os checks verdes  
✅ `curl http://localhost:5000/api/health` retorna JSON  
✅ Página abre sem erros no console (F12)  
✅ Login funciona  
✅ Progresso é salvo ao rolar a página  

Boa leitura! 📚✨
