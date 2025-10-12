# 📚 Cálculo Digital 2: Do papel ao pixel

Este projeto tem como objetivo transformar um livro de Cálculo 2, originalmente escrito em LaTeX, em um eBook no formato .epub. Para isso, são utilizadas ferramentas como LaTeXML (para converter arquivos .tex em .xhtml) e Calibre (para gerar o arquivo .epub). Os arquivos XHTML também são reaproveitados para a criação de uma página web navegável.

## 🌐 Acesse o site
**URL Pública:** https://pixel-math.github.io/pixel-math/homePage/homeIndex.html

---

## ✨ Novo: Sistema de Progresso de Leitura

O projeto agora inclui um **back-end completo** com Flask e PostgreSQL para rastrear o progresso de leitura dos usuários!

### 🎯 Funcionalidades
- ✅ Autenticação de usuários (JWT)
- ✅ Salvamento automático de progresso por capítulo
- ✅ Sincronização em tempo real
- ✅ Retomada automática da última posição lida
- ✅ Barra de progresso visual

---

## 📖 Documentação

### 🎯 Para Iniciantes
- **[🎬 PASSO A PASSO VISUAL](PASSO_A_PASSO.md)** - Tutorial visual para iniciantes (COMECE AQUI!)
- **[⚡ INÍCIO RÁPIDO](INICIO_RAPIDO.md)** - Comandos essenciais resumidos

### 📚 Para Usuários
- **[� TUTORIAL COMPLETO](TUTORIAL_INSTALACAO.md)** - Guia detalhado de instalação
- **[📝 COMANDOS](COMANDOS.md)** - Referência de comandos úteis

### 🔧 Para Desenvolvedores
- **[🏗️ Sistema de Progresso](SISTEMA_PROGRESSO.md)** - Documentação técnica da API
- **[🐍 Back-end](backend/README.md)** - Documentação do Flask API

---

## 🚀 Início Rápido

### Pré-requisitos
- PostgreSQL instalado
- Python 3.8+
- Navegador moderno

### Instalação (Primeira vez)

```bash
# 1. Criar banco de dados
psql -U postgres
CREATE DATABASE calculo_digital;
\q

# 2. Configurar backend
cd backend
python -m venv venv
venv\Scripts\Activate  # Windows
pip install -r requirements.txt

# 3. Configurar variáveis de ambiente
copy .env.example .env
# Edite .env com suas credenciais do PostgreSQL

# 4. Inicializar banco
python init_db.py init

# 5. Rodar servidor (Terminal 1)
python app.py

# 6. Rodar frontend (Terminal 2 - novo terminal)
cd ..
python -m http.server 8000
```

**Acesse:** http://localhost:8000/homePage/homeIndex.html

**Login de teste:**
- Username: `usuario_exemplo`
- Password: `senha123`

---

## 🏗️ Estrutura do Projeto

```
pixel-math/
├── backend/                    # API Flask + PostgreSQL
│   ├── app.py                 # Servidor Flask
│   ├── models.py              # Modelos do banco
│   ├── config.py              # Configurações
│   ├── init_db.py             # Inicialização do banco
│   ├── requirements.txt       # Dependências Python
│   └── README.md              # Documentação do backend
│
├── homePage/                   # Página inicial
│   ├── homeIndex.html
│   ├── homeScript.js          # Lógica + integração API
│   ├── homeStyle.css
│   └── apiClient.js           # Cliente da API REST
│
├── chapterPage/                # Páginas de capítulos
│   ├── chapterIndex.html
│   ├── chapterScript.js       # Rastreamento de progresso
│   └── chapterStyle.css
│
├── generalUI/                  # Estilos globais
├── assets/                     # Imagens e arquivos
├── reportPage/                 # Página sobre o projeto
│
├── TUTORIAL_INSTALACAO.md      # Tutorial completo
├── INICIO_RAPIDO.md            # Guia rápido
├── SISTEMA_PROGRESSO.md        # Documentação técnica
└── README.md                   # Este arquivo
```

---

## 🛠️ Tecnologias Utilizadas

### Conversão LaTeX → ePub
- **LaTeXML** - Conversão .tex → .xhtml
- **Calibre** - Criação de .epub

### Web & Backend
- **HTML5/CSS3/JavaScript** - Front-end
- **Flask** - Framework web Python
- **PostgreSQL** - Banco de dados
- **SQLAlchemy** - ORM
- **JWT** - Autenticação
- **CORS** - Cross-Origin Resource Sharing

---

## 📄 Licença

© 2025 Cálculo Digital 2: Do papel ao pixel. Todos os direitos reservados.
