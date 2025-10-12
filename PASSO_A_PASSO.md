# 🎯 Passo a Passo Visual - Para Iniciantes

## 📺 Vídeo Tutorial (se disponível)
[Link para vídeo tutorial aqui]

---

## 🎬 PARTE 1: Preparar o PostgreSQL

### Passo 1: Abrir o pgAdmin
1. Procure "pgAdmin" no menu Iniciar do Windows
2. Abra o programa
3. Digite a senha do PostgreSQL quando solicitado

### Passo 2: Criar o Banco de Dados
```
📂 Servers
  └─ 📂 PostgreSQL 13 (ou sua versão)
      └─ 📂 Databases
          └─ 🖱️ Clique com botão direito
              └─ Create > Database...
```

Na janela que abrir:
- **Database:** `calculo_digital`
- **Owner:** postgres
- Clique em **Save**

✅ **Pronto!** Você verá `calculo_digital` na lista de bancos.

---

## 🎬 PARTE 2: Preparar o Python

### Passo 3: Abrir PowerShell
1. Pressione **Windows + X**
2. Escolha **Windows PowerShell** (ou Terminal)

### Passo 4: Navegar até a pasta do projeto
```powershell
cd "d:\oneDrive\OneDrive - teiacoltec.org\Projeto LaTeX\Site\Projeto_Certo\pixel-math"
```

**Dica:** Use **Tab** para autocompletar o caminho!

### Passo 5: Entrar na pasta backend
```powershell
cd backend
```

### Passo 6: Criar ambiente virtual
```powershell
python -m venv venv
```

⏱️ Aguarde... isso pode levar 30 segundos.

Você verá uma pasta `venv` ser criada.

### Passo 7: Ativar o ambiente virtual
```powershell
.\venv\Scripts\Activate
```

✅ Você verá `(venv)` aparecer no início da linha!

**Exemplo:**
```
C:\Users\Você\projeto> .\venv\Scripts\Activate
(venv) C:\Users\Você\projeto>
          ↑↑↑↑↑
        Isso apareceu!
```

### Passo 8: Instalar as bibliotecas
```powershell
pip install -r requirements.txt
```

⏱️ Aguarde 1-2 minutos enquanto baixa tudo.

Você verá várias linhas passando... é normal!

---

## 🎬 PARTE 3: Configurar as Senhas

### Passo 9: Copiar o arquivo de exemplo
```powershell
copy .env.example .env
```

✅ Um arquivo `.env` foi criado!

### Passo 10: Editar o arquivo .env
```powershell
notepad .env
```

O Bloco de Notas abrirá com algo assim:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=calculo_digital
DB_USER=seu_usuario
DB_PASSWORD=sua_senha          ← MUDAR AQUI!

FLASK_SECRET_KEY=sua_chave_secreta_muito_segura_aqui
JWT_SECRET_KEY=sua_chave_jwt_secreta_aqui

FLASK_ENV=development
```

**O QUE FAZER:**

1. Encontre a linha `DB_PASSWORD=sua_senha`
2. Substitua `sua_senha` pela senha do seu PostgreSQL
3. Pode deixar `DB_USER=postgres` se você usa o usuário padrão
4. Pode deixar o resto como está (ou trocar as chaves secretas)

**Exemplo após editar:**
```env
DB_USER=postgres
DB_PASSWORD=minhasenha123
```

5. Clique em **Arquivo** > **Salvar**
6. Feche o Bloco de Notas

---

## 🎬 PARTE 4: Criar as Tabelas

### Passo 11: Inicializar o banco de dados
```powershell
python init_db.py init
```

Você verá:

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

✅ **Ótimo!** O banco está pronto!

### Passo 12: (Opcional) Testar se está tudo OK
```powershell
python test_setup.py
```

Você verá vários ✅ verdes se tudo estiver certo!

---

## 🎬 PARTE 5: Rodar o Sistema

### Passo 13: Iniciar o servidor Flask
```powershell
python app.py
```

Você verá:

```
 * Serving Flask app 'app'
 * Debug mode: on
 * Running on http://127.0.0.1:5000
```

✅ **Perfeito!** O servidor está rodando!

**⚠️ NÃO FECHE ESTE TERMINAL!** Deixe ele aberto.

### Passo 14: Abrir um NOVO terminal
1. Pressione **Windows + X** novamente
2. Escolha **Windows PowerShell** (abrirá uma nova janela)

### Passo 15: Navegar até a pasta do projeto (no novo terminal)
```powershell
cd "d:\oneDrive\OneDrive - teiacoltec.org\Projeto LaTeX\Site\Projeto_Certo\pixel-math"
```

### Passo 16: Iniciar o servidor web
```powershell
python -m http.server 8000
```

Você verá:

```
Serving HTTP on :: port 8000 (http://[::]:8000/) ...
```

✅ **Excelente!** O site está no ar!

**⚠️ NÃO FECHE ESTE TERMINAL TAMBÉM!** Deixe os 2 abertos.

---

## 🎬 PARTE 6: Usar o Sistema

### Passo 17: Abrir o navegador

Abra seu navegador favorito (Chrome, Firefox, Edge...) e digite:

```
http://localhost:8000/homePage/homeIndex.html
```

✅ **A página deve carregar!**

### Passo 18: Fazer login

1. Clique no botão **"Entrar"** (canto superior direito)
2. Digite:
   - **Username:** `usuario_exemplo`
   - **Password:** `senha123`
3. Clique em **OK**

✅ Você verá seu nome aparecer no canto superior!

### Passo 19: Ver os capítulos

1. Role a página para baixo
2. Você verá 9 capítulos com barras de progresso
3. Alguns já terão progresso (do usuário exemplo)

### Passo 20: Ler um capítulo

1. Clique em qualquer capítulo
2. A página do capítulo abrirá
3. **Role a página para baixo**
4. Aguarde 1 segundo
5. A barra de progresso será atualizada! 🎉

### Passo 21: Verificar se salvou

1. Feche o navegador completamente
2. Abra novamente: `http://localhost:8000/homePage/homeIndex.html`
3. Faça login
4. Veja os capítulos

✅ **Seu progresso estará lá!** 🎊

---

## 🎬 RESUMO VISUAL

```
┌─────────────────────────────────────────┐
│  TERMINAL 1: Backend (Flask)            │
│                                         │
│  cd backend                             │
│  .\venv\Scripts\Activate                │
│  python app.py                          │
│                                         │
│  ✅ Rodando em http://localhost:5000   │
│  ⚠️  DEIXE ABERTO!                      │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  TERMINAL 2: Frontend                   │
│                                         │
│  cd [pasta do projeto]                  │
│  python -m http.server 8000             │
│                                         │
│  ✅ Rodando em http://localhost:8000   │
│  ⚠️  DEIXE ABERTO!                      │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  NAVEGADOR                              │
│                                         │
│  http://localhost:8000/homePage/        │
│         homeIndex.html                  │
│                                         │
│  👤 Login: usuario_exemplo / senha123   │
└─────────────────────────────────────────┘
```

---

## 🎯 Checklist Final

Marque conforme for fazendo:

- [ ] PostgreSQL instalado
- [ ] Banco `calculo_digital` criado no pgAdmin
- [ ] Ambiente virtual criado (`python -m venv venv`)
- [ ] Ambiente virtual ativado (vejo `(venv)` no terminal)
- [ ] Bibliotecas instaladas (`pip install -r requirements.txt`)
- [ ] Arquivo `.env` editado com minha senha
- [ ] Banco inicializado (`python init_db.py init`)
- [ ] Terminal 1 rodando Flask (`python app.py`)
- [ ] Terminal 2 rodando HTTP Server (`python -m http.server 8000`)
- [ ] Navegador aberto em `localhost:8000/homePage/homeIndex.html`
- [ ] Login funcionou
- [ ] Progresso salvou ao rolar a página

---

## 🆘 Algo deu errado?

### "python não é reconhecido"
Python não está instalado ou não está no PATH.
**Solução:** Instale Python 3.8+ de python.org

### "psql não é reconhecido"
PostgreSQL não está no PATH, mas está instalado.
**Solução:** Use o pgAdmin (interface gráfica) em vez do terminal

### "Senha incorreta para o banco"
A senha no arquivo `.env` está errada.
**Solução:** Edite `.env` e coloque a senha certa do PostgreSQL

### "Porta 5000 já em uso"
Outro programa está usando a porta 5000.
**Solução:** Mude a porta em `backend/app.py` para 5001

### "Não consigo fazer login"
Verifique se o Flask está rodando (Terminal 1).
**Solução:** Se não estiver, execute `python app.py`

### Página não carrega
Servidor HTTP não está rodando.
**Solução:** Execute `python -m http.server 8000`

---

## 📞 Precisa de Ajuda Detalhada?

Consulte os outros tutoriais:

- **[📚 Tutorial Completo](TUTORIAL_INSTALACAO.md)** - Explicações detalhadas
- **[⚡ Início Rápido](INICIO_RAPIDO.md)** - Comandos direto ao ponto
- **[📝 Comandos](COMANDOS.md)** - Referência de comandos

---

## 🎉 Parabéns!

Se você chegou até aqui e tudo funcionou, você tem:

✅ Um sistema completo de eBook  
✅ Autenticação de usuários  
✅ Salvamento automático de progresso  
✅ Banco de dados funcionando  
✅ API REST completa  

**Aproveite a leitura!** 📚✨
