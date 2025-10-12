/**
 * Script para página de capítulos
 * Carrega lista de capítulos e mostra progresso geral
 */

let chapters = [];

/**
 * Carrega lista de capítulos do arquivo JSON
 */
async function loadChapters() {
  try {
    const response = await fetch('../assets/files/livro_epub/chapters.json');
    const data = await response.json();
    chapters = data;
    console.log('Capítulos carregados:', chapters);
    return chapters;
  } catch (error) {
    console.error('Erro ao carregar capítulos:', error);
    return [];
  }
}

/**
 * Carrega progresso do usuário da API
 */
async function loadUserProgress() {
  if (!apiClient.isAuthenticated()) {
    console.log('Usuário não autenticado. Usando progresso local.');
    return {};
  }

  try {
    const progressList = await apiClient.getAllProgress();
    
    // Criar mapa de progresso por chapter_key
    const progressMap = {};
    progressList.forEach(progress => {
      progressMap[progress.chapter_key] = progress.progress;
    });
    
    console.log('Progresso carregado da API:', progressMap);
    return progressMap;
  } catch (error) {
    console.error('Erro ao carregar progresso:', error);
    return {};
  }
}

/**
 * Renderiza os capítulos na página
 */
async function renderChapters(progressMap = {}) {
  const container = document.querySelector(".chapters-container");
  if (!container) return;
  
  container.innerHTML = ''; // Limpar container

  chapters.forEach((chapter, index) => {
    const capDiv = document.createElement("div");
    capDiv.classList.add("chapter");

    const header = document.createElement("div");
    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.style.color = "#ff7518";

    const titleP = document.createElement("p");
    titleP.textContent = chapter.title.split('—')[0].trim(); // Pegar só "Capítulo X"
    const icon = document.createElement("i");
    icon.classList.add("bi", "bi-chevron-right");

    header.appendChild(titleP);
    header.appendChild(icon);

    const h4 = document.createElement("h4");
    h4.textContent = chapter.title.split('—')[1]?.trim() || chapter.title;

    const descP = document.createElement("p");
    descP.textContent = `Explore os conceitos e aplicações deste capítulo.`;

    const progressBar = document.createElement("div");
    progressBar.classList.add("progress-bar");
    const current = document.createElement("div");
    current.classList.add("current-progress");
    
    // Usar progresso da API ou 0
    const progress = progressMap[chapter.key] || 0;
    current.style.width = `${progress * 100}%`;

    progressBar.appendChild(current);

    capDiv.appendChild(header);
    capDiv.appendChild(h4);
    capDiv.appendChild(descP);
    capDiv.appendChild(progressBar);

    container.appendChild(capDiv);

    capDiv.addEventListener("click", () => {
      // Redirecionar para a página do capítulo com parâmetros
      const params = new URLSearchParams({
        key: chapter.key,
        title: chapter.title,
        file: chapter.file
      });
      window.location.href = `../chapterPage/chapterIndex.html?${params.toString()}`;
    });
  });
}

/**
 * Renderiza barra de progresso geral
 */
function renderOverallProgress(progressMap = {}){
  const bar = document.getElementById('overall-progress-bar');
  const text = document.getElementById('overall-progress-text');
  if(!bar || !text || !chapters || chapters.length === 0) return;
  
  // Média simples dos progressos conhecidos, 0 quando ausente
  const values = chapters.map(c => progressMap[c.key] || 0);
  const avg = values.length ? values.reduce((a,b)=>a+b,0) / values.length : 0;
  
  bar.style.width = `${(avg*100).toFixed(2)}%`;
  text.textContent = `${(avg*100).toFixed(0)}%`;
}

/**
 * Atualiza UI com informações do usuário
 */
function updateUserUI() {
  const navMenu = document.querySelector('.nav-menu');
  if (!navMenu) return;
  
  // Limpar conteúdo anterior
  const existingUserInfo = navMenu.querySelector('.user-info');
  const existingAuthButtons = navMenu.querySelector('.auth-buttons');
  if (existingUserInfo) existingUserInfo.remove();
  if (existingAuthButtons) existingAuthButtons.remove();
  
  if (apiClient.isAuthenticated() && apiClient.user) {
    // Usuário logado
    const userInfo = document.createElement('div');
    userInfo.className = 'user-info';
    userInfo.style.cssText = `
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 8px 15px;
      background: rgba(255, 117, 24, 0.1);
      border-radius: 10px;
      border: 1px solid rgba(255, 117, 24, 0.3);
    `;
    
    userInfo.innerHTML = `
      <span style="color: var(--color-secondary, #ff7518); font-weight: 600; display: flex; align-items: center; gap: 8px;">
        <i class="bi bi-person-circle" style="font-size: 1.3rem;"></i> 
        ${apiClient.user.username}
      </span>
      <button onclick="handleLogout()" class="logout-btn" style="
        padding: 6px 12px;
        font-size: 0.85rem;
        background: transparent;
        border: 1px solid var(--color-secondary, #ff7518);
        color: var(--color-secondary, #ff7518);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 600;
      ">
        <i class="bi bi-box-arrow-right"></i> Sair
      </button>
    `;
    
    navMenu.appendChild(userInfo);
  }
}

/**
 * Logout do usuário
 */
function handleLogout() {
  apiClient.logout();
  alert('Logout realizado com sucesso!');
  window.location.reload();
}

/**
 * Inicialização
 */
document.addEventListener('DOMContentLoaded', async function() {
  // Carregar capítulos e progresso
  await loadChapters();
  const progressMap = await loadUserProgress();
  await renderChapters(progressMap);
  renderOverallProgress(progressMap);
  updateUserUI();
});

// Atualizar progresso quando a página fica visível (usuário volta de outro capítulo)
document.addEventListener('visibilitychange', async () => {
  if (!document.hidden && apiClient.isAuthenticated()) {
    console.log('Página visível - atualizando progresso...');
    const progressMap = await loadUserProgress();
    await renderChapters(progressMap);
    renderOverallProgress(progressMap);
  }
});

// Também atualizar quando a janela recebe foco
window.addEventListener('focus', async () => {
  if (apiClient.isAuthenticated()) {
    console.log('Janela em foco - atualizando progresso...');
    const progressMap = await loadUserProgress();
    await renderChapters(progressMap);
    renderOverallProgress(progressMap);
  }
});
