# ❓ FAQ - Perguntas Frequentes

## 📋 Instalação e Configuração

### P: Preciso instalar o PostgreSQL mesmo tendo outro banco?
**R:** Sim, o sistema foi desenvolvido especificamente para PostgreSQL. Usar outro banco (MySQL, SQLite) requer modificações no código.

### P: Qual versão do Python devo usar?
**R:** Python 3.8 ou superior. Recomendamos Python 3.10 ou 3.11 para melhor compatibilidade.

### P: Posso usar SQLite em vez de PostgreSQL?
**R:** Não diretamente. O código usa recursos específicos do PostgreSQL. Para SQLite, seria necessário modificar `config.py` e testar.

### P: O que fazer se o PostgreSQL já estiver instalado mas não sei a senha?
**R:** 
1. Reinstale o PostgreSQL e defina uma nova senha, OU
2. Redefina a senha do usuário postgres seguindo [este guia](https://www.postgresql.org/docs/current/auth-password.html)

### P: Posso pular a criação do ambiente virtual?
**R:** Não é recomendado. O ambiente virtual isola as dependências e evita conflitos com outros projetos Python.

---

## 🔧 Uso do Sistema

### P: Como faço para criar minha própria conta?
**R:** 
1. Na página inicial, clique em "Cadastrar"
2. Preencha username, email e senha
3. Você será logado automaticamente

### P: Esqueci minha senha, como recupero?
**R:** Atualmente não há sistema de recuperação de senha. Você pode:
1. Criar uma nova conta, OU
2. Pedir ao administrador para resetar sua senha no banco de dados

### P: O progresso é salvo automaticamente?
**R:** Sim! O progresso é salvo automaticamente 1 segundo após você parar de rolar a página.

### P: Posso usar o sistema sem estar logado?
**R:** Você pode visualizar os capítulos, mas o progresso não será salvo sem login.

### P: O sistema funciona offline?
**R:** Não. É necessário conexão com o servidor Flask (back-end) para salvar/carregar progresso.

### P: Posso acessar de outro computador?
**R:** Sim, se você configurar o Flask para aceitar conexões externas e tiver a API acessível pela rede. Requer configuração adicional de rede/firewall.

---

## 🐛 Problemas Comuns

### P: "apiClient is not defined" no console
**R:** O arquivo `apiClient.js` não está sendo carregado. Verifique se está incluído no HTML antes de `homeScript.js`:
```html
<script src="./apiClient.js"></script>
<script src="./homeScript.js"></script>
```

### P: "CORS policy" error no navegador
**R:** 
1. Verifique se o Flask está rodando em `http://localhost:5000`
2. Confirme que o CORS está habilitado em `app.py`
3. Certifique-se que `API_BASE_URL` em `apiClient.js` está correto

### P: Erro "Module not found: psycopg2"
**R:** 
```powershell
cd backend
.\venv\Scripts\Activate
pip install psycopg2-binary
```

### P: Login não funciona / Token inválido
**R:** 
1. Verifique se o Flask está rodando
2. Abra o Console do navegador (F12) e procure erros
3. Teste a API diretamente: `curl http://localhost:5000/api/health`

### P: Progresso não salva
**R:** 
1. Certifique-se que está logado
2. Verifique o Console do navegador (F12)
3. Confirme que o Flask está rodando
4. Teste se a API responde: `curl http://localhost:5000/api/health`

### P: Porta 5000 já está em uso
**R:** 
1. Encontre e feche o programa usando a porta, OU
2. Mude a porta em `backend/app.py` linha final:
   ```python
   app.run(debug=True, host='0.0.0.0', port=5001)
   ```
3. Atualize `homePage/apiClient.js`:
   ```javascript
   const API_BASE_URL = 'http://localhost:5001/api';
   ```

### P: "relation 'users' does not exist"
**R:** As tabelas não foram criadas. Execute:
```powershell
cd backend
.\venv\Scripts\Activate
python init_db.py init
```

---

## 💾 Banco de Dados

### P: Como vejo os dados salvos?
**R:** Use o pgAdmin ou psql:
```sql
psql -U postgres -d calculo_digital
SELECT * FROM users;
SELECT * FROM reading_progress;
```

### P: Como apago todos os dados?
**R:** 
```powershell
cd backend
.\venv\Scripts\Activate
python init_db.py reset
python init_db.py init
```

### P: Como faço backup do banco?
**R:** 
```powershell
pg_dump -U postgres calculo_digital > backup.sql
```

Para restaurar:
```powershell
psql -U postgres calculo_digital < backup.sql
```

### P: O banco de dados fica muito grande?
**R:** Não. Cada usuário ocupa poucos KB. Com 1000 usuários, o banco terá menos de 1 MB.

---

## 🔐 Segurança

### P: As senhas são armazenadas com segurança?
**R:** Sim, as senhas são hasheadas usando `werkzeug.security` antes de serem salvas.

### P: O sistema é seguro para produção?
**R:** Para produção, você deve:
1. Usar HTTPS (não HTTP)
2. Configurar chaves secretas fortes no `.env`
3. Configurar CORS para aceitar apenas domínios específicos
4. Usar um servidor web profissional (Gunicorn, nginx)
5. Configurar rate limiting

### P: Posso mudar as chaves secretas depois?
**R:** Sim, mas todos os tokens JWT existentes serão invalidados (usuários terão que fazer login novamente).

---

## 🌐 Deploy e Produção

### P: Como coloco o sistema online (produção)?
**R:** 
1. **Backend:** Deploy em Heroku, Railway, DigitalOcean, AWS, etc.
2. **Frontend:** GitHub Pages, Netlify, Vercel, etc.
3. Atualize `API_BASE_URL` no `apiClient.js` com a URL de produção

### P: Posso hospedar gratuitamente?
**R:** 
- **Backend:** Railway (grátis com limitações), Render.com
- **Frontend:** GitHub Pages (grátis), Netlify (grátis)
- **Banco:** ElephantSQL (PostgreSQL grátis até 20 MB)

### P: O GitHub Pages suporta Flask?
**R:** Não. GitHub Pages só serve arquivos estáticos. Você precisa hospedar o Flask separadamente.

---

## 🔄 Atualizações e Manutenção

### P: Como atualizo o sistema?
**R:** 
```powershell
git pull origin main
cd backend
.\venv\Scripts\Activate
pip install -r requirements.txt --upgrade
```

### P: Como adiciono novos capítulos?
**R:** Edite o objeto `chapters` em `homePage/homeScript.js` e adicione os novos capítulos.

### P: Como altero o design?
**R:** Edite os arquivos CSS em cada pasta (`homeStyle.css`, `chapterStyle.css`, `generalUI/style.css`).

---

## 📱 Compatibilidade

### P: Funciona no celular?
**R:** Sim! O design é responsivo e se adapta a diferentes tamanhos de tela.

### P: Quais navegadores são suportados?
**R:** 
- ✅ Chrome/Edge (recomendado)
- ✅ Firefox
- ✅ Safari
- ⚠️ Internet Explorer (não suportado)

### P: Funciona no iPad/tablet?
**R:** Sim, funciona perfeitamente em tablets.

---

## 🎨 Personalização

### P: Como mudo as cores do site?
**R:** Edite as variáveis CSS em `generalUI/style.css`:
```css
:root {
  --color-primary: #2a5d84;
  --color-secondary: #ff7518;
  /* ... */
}
```

### P: Como adiciono mais funcionalidades?
**R:** 
1. **Backend:** Adicione novas rotas em `app.py`
2. **Frontend:** Adicione novos métodos em `apiClient.js`
3. **Banco:** Modifique `models.py` e recrie as tabelas

### P: Posso usar um modal bonito em vez de prompt()?
**R:** Sim! Substitua as funções `showLoginModal()` e `showRegisterModal()` em `homeScript.js` por modals personalizados usando HTML/CSS.

---

## 📊 Performance

### P: O sistema é rápido?
**R:** Sim. Com configuração adequada:
- Login: < 100ms
- Salvar progresso: < 50ms
- Carregar capítulos: < 100ms

### P: Quantos usuários simultâneos suporta?
**R:** Em desenvolvimento (Flask dev server): ~10-20  
Com Gunicorn + nginx: centenas a milhares (dependendo do servidor)

### P: O banco PostgreSQL é lento?
**R:** Não. PostgreSQL é extremamente eficiente. O sistema usa índices para consultas rápidas.

---

## 🛠️ Desenvolvimento

### P: Como contribuo para o projeto?
**R:** 
1. Faça um fork do repositório
2. Crie uma branch para sua feature
3. Faça commit das mudanças
4. Abra um Pull Request

### P: Onde reporto bugs?
**R:** Abra uma Issue no repositório GitHub do projeto.

### P: Posso usar este projeto como base para o meu?
**R:** Sim! O código está disponível para estudo e uso. Consulte a licença do projeto.

---

## 📚 Recursos Adicionais

### P: Onde aprendo mais sobre Flask?
**R:** 
- [Documentação oficial do Flask](https://flask.palletsprojects.com/)
- [Tutorial Flask (PT-BR)](https://flask-ptbr.readthedocs.io/)

### P: Onde aprendo mais sobre PostgreSQL?
**R:** 
- [Documentação oficial](https://www.postgresql.org/docs/)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)

### P: Onde aprendo mais sobre JWT?
**R:** 
- [JWT.io](https://jwt.io/)
- [Flask-JWT-Extended Docs](https://flask-jwt-extended.readthedocs.io/)

---

## 🆘 Ainda com Dúvidas?

1. Consulte os tutoriais:
   - [🎬 Passo a Passo Visual](PASSO_A_PASSO.md)
   - [📚 Tutorial Completo](TUTORIAL_INSTALACAO.md)
   - [📝 Comandos](COMANDOS.md)

2. Verifique os logs:
   - Console do navegador (F12)
   - Terminal do Flask
   - Logs do PostgreSQL

3. Execute o teste:
   ```powershell
   cd backend
   python test_setup.py
   ```

4. Abra uma Issue no GitHub com:
   - Descrição do problema
   - Mensagens de erro completas
   - Prints de tela
   - Versões (Python, PostgreSQL, SO)

---

**Atualizado em:** Outubro de 2025  
**Versão do Sistema:** 1.0.0
