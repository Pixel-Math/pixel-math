# ⚡ Guia Rápido - Início Rápido

## 🚀 Comandos para Iniciar o Sistema

### 1️⃣ Primeira vez? Siga estes passos:

```powershell
# 1. Criar banco de dados (no psql)
psql -U postgres
CREATE DATABASE calculo_digital;
\q

# 2. Configurar backend
cd backend
python -m venv venv
.\venv\Scripts\Activate
pip install -r requirements.txt

# 3. Configurar .env
copy .env.example .env
notepad .env
# Edite e coloque sua senha do PostgreSQL!

# 4. Inicializar banco
python init_db.py init

# 5. Rodar servidor (Terminal 1 - deixe aberto)
python app.py
```

```powershell
# 6. Abrir NOVO terminal e rodar front-end (Terminal 2 - deixe aberto)
cd ..
python -m http.server 8000
```

**Acesse:** http://localhost:8000/homePage/homeIndex.html

---

### 2️⃣ Já configurou? Use estes comandos:

#### Terminal 1 - Backend
```powershell
cd backend
.\venv\Scripts\Activate
python app.py
```

#### Terminal 2 - Frontend
```powershell
python -m http.server 8000
```

**Acesse:** http://localhost:8000/homePage/homeIndex.html

---

## 🔑 Credenciais de Teste

Após executar `init_db.py init`, use:

- **Username:** usuario_exemplo
- **Password:** senha123

---

## 🛑 Parar os Servidores

Em cada terminal, pressione: `Ctrl + C`

---

## 🔄 Resetar Banco de Dados

⚠️ **Apaga todos os dados!**

```powershell
cd backend
.\venv\Scripts\Activate
python init_db.py reset
python init_db.py init
```

---

## 📝 Arquivos Importantes

| Arquivo | Descrição | O que editar |
|---------|-----------|--------------|
| `backend/.env` | Credenciais do banco | Senha do PostgreSQL |
| `backend/app.py` | API Flask | Porta do servidor |
| `homePage/apiClient.js` | Cliente API | URL da API |

---

## ✅ Verificação Rápida

### Teste 1: API está rodando?
```powershell
curl http://localhost:5000/api/health
```
Deve retornar: `{"status":"healthy",...}`

### Teste 2: Banco tem dados?
```powershell
psql -U postgres -d calculo_digital
SELECT * FROM users;
\q
```

### Teste 3: Front-end carrega?
Acesse: http://localhost:8000/homePage/homeIndex.html

---

## 🐛 Problemas Comuns

| Problema | Solução |
|----------|---------|
| `psycopg2 not found` | `pip install psycopg2-binary` |
| Porta 5000 em uso | Edite `app.py`: `port=5001` |
| Porta 8000 em uso | `python -m http.server 8080` |
| Erro de login | Verifique se Flask está rodando |
| CORS error | API URL correta no `apiClient.js`? |

---

## 📞 Precisa de Ajuda?

1. Verifique o **Console do navegador** (F12)
2. Veja os **logs do Flask** (Terminal 1)
3. Teste a **conexão do banco**: `psql -U postgres -d calculo_digital`
4. Leia o `TUTORIAL_INSTALACAO.md` completo

---

## 🎯 Fluxo de Uso

1. Inicie Backend (Terminal 1)
2. Inicie Frontend (Terminal 2)
3. Abra http://localhost:8000/homePage/homeIndex.html
4. Faça Login ou Cadastre-se
5. Navegue pelos capítulos
6. Seu progresso é salvo automaticamente! ✨
