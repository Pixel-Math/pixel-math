# 🚀 Tutorial: Como Configurar e Usar o Sistema de Progresso de Leitura

Este tutorial irá guiá-lo passo a passo na configuração do sistema completo.

---

## 📋 Pré-requisitos

✅ PostgreSQL instalado  
✅ Python 3.8+ instalado  
✅ Navegador web moderno  

---

## 🗄️ PARTE 1: Configurar o Banco de Dados PostgreSQL

### Passo 1.1: Criar o Banco de Dados

Abra o **pgAdmin** ou o terminal **psql**:

#### Opção A: Usando pgAdmin (Interface Gráfica)
1. Abra o **pgAdmin**
2. Conecte-se ao seu servidor PostgreSQL
3. Clique com botão direito em **Databases** → **Create** → **Database**
4. Nome: `calculo_digital`
5. Clique em **Save**

#### Opção B: Usando Terminal psql (PowerShell)
```powershell
# Abrir psql (ajuste o caminho se necessário)
psql -U postgres

# Dentro do psql, digite:
CREATE DATABASE calculo_digital;

# Verificar se foi criado
\l

# Sair do psql
\q
```

### Passo 1.2: (Opcional) Criar Usuário Específico

Se quiser criar um usuário específico para o projeto:

```sql
-- Dentro do psql
CREATE USER calculo_user WITH PASSWORD 'senha123';
GRANT ALL PRIVILEGES ON DATABASE calculo_digital TO calculo_user;
```

**⚠️ Anote as credenciais:**
- **Usuário:** calculo_user (ou postgres se não criou usuário novo)
- **Senha:** senha123 (ou a senha do seu postgres)
- **Banco:** calculo_digital
- **Host:** localhost
- **Porta:** 5432

---

## 🐍 PARTE 2: Configurar o Back-end Flask

### Passo 2.1: Criar Ambiente Virtual Python

Abra o PowerShell na pasta do projeto e navegue até a pasta backend:

```powershell
cd "d:\oneDrive\OneDrive - teiacoltec.org\Projeto LaTeX\Site\Projeto_Certo\pixel-math\backend"

# Criar ambiente virtual
python -m venv venv

# Ativar ambiente virtual
.\venv\Scripts\Activate
```

Você verá `(venv)` no início da linha do terminal quando o ambiente estiver ativo.

### Passo 2.2: Instalar Dependências

Com o ambiente virtual ativado:

```powershell
pip install -r requirements.txt
```

⏱️ Aguarde a instalação (pode levar alguns minutos).

### Passo 2.3: Configurar Variáveis de Ambiente

1. **Copie o arquivo de exemplo:**

```powershell
copy .env.example .env
```

2. **Edite o arquivo `.env`** (use o VS Code ou Bloco de Notas):

```powershell
notepad .env
```

3. **Configure suas credenciais do PostgreSQL:**

```env
# Configurações do Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_NAME=calculo_digital
DB_USER=postgres
DB_PASSWORD=SUA_SENHA_AQUI

# Configurações Flask (pode manter como está)
FLASK_SECRET_KEY=minha-chave-super-secreta-12345
JWT_SECRET_KEY=minha-jwt-chave-secreta-67890
FLASK_ENV=development
```

**⚠️ IMPORTANTE:** Substitua `SUA_SENHA_AQUI` pela senha do seu PostgreSQL!

4. **Salve e feche** o arquivo `.env`

### Passo 2.4: Inicializar o Banco de Dados

Ainda na pasta `backend` com o ambiente virtual ativo:

```powershell
python init_db.py init
```

Você deverá ver:

```
Criando tabelas...
✓ Tabelas criadas com sucesso!

Criando usuário de exemplo...
✓ Usuário criado: usuario_exemplo

Criando progresso de exemplo...
✓ 3 progressos de leitura criados

✅ Banco de dados inicializado com sucesso!

📌 Credenciais de exemplo:
   Username: usuario_exemplo
   Password: senha123
   Email: exemplo@email.com
```

### Passo 2.5: Executar o Servidor Flask

```powershell
python app.py
```

Você verá:

```
 * Serving Flask app 'app'
 * Debug mode: on
WARNING: This is a development server.
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:5000
 * Running on http://192.168.x.x:5000
```

✅ **O back-end está rodando!** Deixe este terminal aberto.

---

## 🌐 PARTE 3: Executar o Front-end

### Passo 3.1: Abrir um NOVO Terminal

Abra um novo PowerShell (deixe o anterior rodando o servidor Flask).

### Passo 3.2: Navegar até a pasta do projeto

```powershell
cd "d:\oneDrive\OneDrive - teiacoltec.org\Projeto LaTeX\Site\Projeto_Certo\pixel-math"
```

### Passo 3.3: Iniciar um Servidor HTTP

#### Opção A: Usando Python (Recomendado)

```powershell
python -m http.server 8000
```

#### Opção B: Usando VS Code Live Server

1. Abra o projeto no VS Code
2. Clique com botão direito em `homePage/homeIndex.html`
3. Selecione **"Open with Live Server"**

### Passo 3.4: Abrir no Navegador

Abra seu navegador e acesse:

```
http://localhost:8000/homePage/homeIndex.html
```

✅ **O site está rodando!**

---

## 🎯 PARTE 4: Usar o Sistema

### 4.1: Testar com Usuário de Exemplo

1. Na página inicial, clique em **"Entrar"**
2. Digite:
   - **Username:** `usuario_exemplo`
   - **Password:** `senha123`
3. Clique OK

✅ Você verá seu nome de usuário no canto superior direito!

### 4.2: Visualizar Progresso

1. Role a página até a seção **"Capítulos"**
2. Você verá os 9 capítulos com suas barras de progresso
3. O progresso do usuário exemplo já aparecerá carregado:
   - Capítulo 1: 50%
   - Capítulo 2: 30%
   - Capítulo 3: 70%

### 4.3: Ler um Capítulo

1. Clique em qualquer capítulo
2. A página do capítulo será aberta
3. **Role a página para baixo**
4. Aguarde 1 segundo - o progresso será salvo automaticamente!
5. A barra de progresso será atualizada

### 4.4: Verificar Persistência

1. Feche o navegador
2. Abra novamente: `http://localhost:8000/homePage/homeIndex.html`
3. Faça login novamente
4. **Seu progresso estará salvo!** 🎉

### 4.5: Criar Sua Própria Conta

1. Na página inicial, clique em **"Cadastrar"**
2. Preencha:
   - **Username:** seu_usuario
   - **Email:** seu@email.com
   - **Password:** sua_senha
3. Você será logado automaticamente
4. Seu progresso será zero - comece a ler!

---

## 🔍 PARTE 5: Verificar se Está Funcionando

### Teste 1: Verificar API
Abra um novo PowerShell e teste:

```powershell
curl http://localhost:5000/api/health
```

Deve retornar:
```json
{
  "status": "healthy",
  "message": "API Cálculo Digital está rodando"
}
```

### Teste 2: Verificar Banco de Dados

```powershell
psql -U postgres -d calculo_digital

# Dentro do psql:
SELECT * FROM users;
SELECT * FROM reading_progress;

\q
```

Você verá os dados do usuário exemplo!

### Teste 3: Console do Navegador

1. No navegador, pressione **F12**
2. Vá na aba **Console**
3. Faça login
4. Você verá mensagens como:
   ```
   Progresso carregado da API: [{...}]
   ```

---

## 🛠️ Comandos Úteis

### Parar os Servidores
- **Flask:** Pressione `Ctrl + C` no terminal do Flask
- **HTTP Server:** Pressione `Ctrl + C` no terminal do servidor HTTP

### Reiniciar o Banco de Dados

⚠️ **CUIDADO: Isso apaga todos os dados!**

```powershell
cd backend
.\venv\Scripts\Activate
python init_db.py reset
```

### Ver Logs da API

Os logs aparecem no terminal onde o Flask está rodando. Procure por:
- `POST /api/auth/login` - Login realizado
- `GET /api/progress` - Progresso carregado
- `POST /api/progress/Capítulo 1` - Progresso salvo

---

## ❌ Resolução de Problemas

### Problema 1: "psycopg2 não encontrado"

```powershell
pip install psycopg2-binary
```

### Problema 2: "Não foi possível conectar ao PostgreSQL"

1. Verifique se o PostgreSQL está rodando:
   - Abra **Serviços** do Windows
   - Procure por "postgresql"
   - Status deve ser "Em execução"

2. Verifique as credenciais no arquivo `.env`

3. Teste a conexão:
```powershell
psql -U postgres -d calculo_digital
```

### Problema 3: "CORS Error" no navegador

1. Verifique se o Flask está rodando
2. Certifique-se que a API está em `http://localhost:5000`
3. Verifique o arquivo `apiClient.js` linha 6:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

### Problema 4: "apiClient is not defined"

Certifique-se que `apiClient.js` está sendo carregado ANTES de `homeScript.js`:

```html
<script src="./apiClient.js"></script>
<script src="./homeScript.js"></script>
```

### Problema 5: Progresso não salva

1. Faça login primeiro
2. Abra o Console do navegador (F12)
3. Procure por erros em vermelho
4. Verifique se o Flask está rodando

### Problema 6: Porta 5000 ou 8000 já em uso

**Para Flask (porta 5000):**
Edite `backend/app.py`, última linha:
```python
app.run(debug=True, host='0.0.0.0', port=5001)
```

E atualize `homePage/apiClient.js`:
```javascript
const API_BASE_URL = 'http://localhost:5001/api';
```

**Para HTTP Server (porta 8000):**
```powershell
python -m http.server 8080
```
E acesse: `http://localhost:8080/homePage/homeIndex.html`

---

## 📊 Estrutura dos Terminais

Você precisa de **2 terminais abertos:**

### Terminal 1: Back-end (Flask)
```powershell
cd backend
.\venv\Scripts\Activate
python app.py
```
**Status:** Deixe rodando

### Terminal 2: Front-end (HTTP Server)
```powershell
cd "d:\oneDrive\OneDrive - teiacoltec.org\Projeto LaTeX\Site\Projeto_Certo\pixel-math"
python -m http.server 8000
```
**Status:** Deixe rodando

---

## 🎓 Próximos Passos

Agora que tudo está funcionando:

1. ✅ Explore os capítulos
2. ✅ Veja seu progresso sendo salvo automaticamente
3. ✅ Teste criar novos usuários
4. ✅ Verifique o banco de dados no pgAdmin

### Melhorias Futuras

- [ ] Criar modals bonitos para login/registro (em vez de `prompt()`)
- [ ] Adicionar reset de senha
- [ ] Dashboard com estatísticas
- [ ] Sistema de bookmarks
- [ ] Modo offline

---

## 📞 Suporte

Se tiver problemas:

1. Verifique os logs nos terminais
2. Abra o Console do navegador (F12)
3. Teste a conexão com o banco de dados
4. Verifique se ambos servidores estão rodando

---

## ✅ Checklist Final

Antes de usar, certifique-se que:

- [ ] PostgreSQL está instalado e rodando
- [ ] Banco de dados `calculo_digital` foi criado
- [ ] Arquivo `.env` foi configurado com suas credenciais
- [ ] Dependências Python foram instaladas
- [ ] Banco foi inicializado com `python init_db.py init`
- [ ] Flask está rodando em `http://localhost:5000`
- [ ] HTTP Server está rodando em `http://localhost:8000`
- [ ] Console do navegador não mostra erros

---

## 🎉 Pronto!

Seu sistema de progresso de leitura está funcionando!

**Acesse:** http://localhost:8000/homePage/homeIndex.html

**Login de teste:**
- Username: `usuario_exemplo`
- Password: `senha123`

Boa leitura! 📚✨
