// Lógica de autenticação usando apiClient

const tabs = document.querySelectorAll('.tab');
const forms = {
  login: document.getElementById('loginForm'),
  register: document.getElementById('registerForm')
};

document.addEventListener('DOMContentLoaded', () => {
  // Alternância de abas
  tabs.forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });
  document.querySelectorAll('[data-tab-switch]')
    .forEach(a => a.addEventListener('click', (e) => { e.preventDefault(); switchTab(a.dataset.tabSwitch); }));

  // Login
  forms.login.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;

    try{
      await apiClient.login(username, password);
      alert('Login realizado com sucesso!');
      window.location.href = '../homePage/homeIndex.html#Chapter';
    }catch(err){
      alert('Falha no login: ' + (err.message || 'Tente novamente.'));
    }
  });

  // Registro
  forms.register.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;

    try{
      await apiClient.register(username, email, password);
      alert('Cadastro realizado! Você já pode entrar.');
      switchTab('login');
    }catch(err){
      alert('Falha no cadastro: ' + (err.message || 'Tente novamente.'));
    }
  });
});

function switchTab(name){
  tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === name));
  forms.login.classList.toggle('active', name === 'login');
  forms.register.classList.toggle('active', name === 'register');
}
