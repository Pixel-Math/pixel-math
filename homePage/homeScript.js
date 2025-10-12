// Capítulos serão carregados do chapters.json
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

// ==================== INTEGRAÇÃO COM API ====================

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
 * Salva progresso de um capítulo
 */
async function saveChapterProgress(chapterKey, progress) {
  if (!apiClient.isAuthenticated()) {
    console.log('Usuário não autenticado. Progresso não será salvo.');
    return;
  }

  try {
    const completed = progress >= 1.0;
    await apiClient.saveProgress(chapterKey, progress, 0, completed);
    console.log(`Progresso salvo para ${chapterKey}: ${progress * 100}%`);
  } catch (error) {
    console.error('Erro ao salvar progresso:', error);
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  // Carregar capítulos e progresso
  await loadChapters();
  const progressMap = await loadUserProgress();
  await renderChapters(progressMap);
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".slide-in, .fade-in").forEach((el) => {
    observer.observe(el);
  });

  const header = document.querySelector("header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      header.classList.add("visible");
    } else {
      header.classList.remove("visible");
    }
  });
  
  // Mostrar informações do usuário se autenticado
  updateUserUI();
});

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
    // Descrição genérica ou pode ser adicionada ao JSON
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

// ==================== UI DE AUTENTICAÇÃO ====================

/**
 * Atualiza UI com informações do usuário
 */
function updateUserUI() {
  const navMenu = document.querySelector('.nav-menu');
  if (!navMenu) return;
  // Remover link "Entrar" estático se existir
  [...navMenu.querySelectorAll('a.nav-link')]
    .filter(a => a.textContent.trim().toLowerCase() === 'entrar')
    .forEach(a => a.remove());
  
  // Limpar conteúdo anterior
  const existingUserInfo = navMenu.querySelector('.user-info');
  const existingAuthButtons = navMenu.querySelector('.auth-buttons');
  if (existingUserInfo) existingUserInfo.remove();
  if (existingAuthButtons) existingAuthButtons.remove();
  
  if (apiClient.isAuthenticated() && apiClient.user) {
    // Usuário logado - mostrar info e esconder botão "Entrar"
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
      <span style="color: var(--color-secondary); font-weight: 600; display: flex; align-items: center; gap: 8px;">
        <i class="bi bi-person-circle" style="font-size: 1.3rem;"></i> 
        ${apiClient.user.username}
      </span>
      <button onclick="handleLogout()" class="logout-btn" style="
        padding: 6px 12px;
        font-size: 0.85rem;
        background: transparent;
        border: 1px solid var(--color-secondary);
        color: var(--color-secondary);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 600;
      " onmouseover="this.style.background='var(--color-secondary)'; this.style.color='#000';" 
         onmouseout="this.style.background='transparent'; this.style.color='var(--color-secondary)';">
        <i class="bi bi-box-arrow-right"></i> Sair
      </button>
    `;
    
    navMenu.appendChild(userInfo);
  } else {
    // Usuário NÃO logado - mostrar botões de autenticação
    const authButtons = document.createElement('div');
    authButtons.className = 'auth-buttons';
    authButtons.style.cssText = 'display: flex; gap: 10px; align-items: center;';
    
    authButtons.innerHTML = `
      <button onclick="showLoginModal()" class="auth-btn login-btn" style="
        padding: 10px 20px;
        font-size: 0.9rem;
        background: var(--color-secondary);
        border: none;
        color: #000;
        border-radius: 10px;
        cursor: pointer;
        font-weight: 700;
        transition: all 0.3s ease;
        box-shadow: 0 4px 8px rgba(255, 117, 24, 0.3);
      " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 12px rgba(255, 117, 24, 0.5)';" 
         onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 8px rgba(255, 117, 24, 0.3)';">
        <i class="bi bi-box-arrow-in-right"></i> Entrar
      </button>
      <button onclick="showRegisterModal()" class="auth-btn register-btn" style="
        padding: 10px 20px;
        font-size: 0.9rem;
        background: transparent;
        border: 2px solid var(--color-secondary);
        color: var(--color-secondary);
        border-radius: 10px;
        cursor: pointer;
        font-weight: 700;
        transition: all 0.3s ease;
      " onmouseover="this.style.background='rgba(255, 117, 24, 0.1)';" 
         onmouseout="this.style.background='transparent';">
        <i class="bi bi-person-plus"></i> Cadastrar
      </button>
    `;
    
    navMenu.appendChild(authButtons);
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
 * Mostra modal de login - redireciona para página de autenticação
 */
function showLoginModal() {
  window.location.href = '../authPage/authIndex.html';
}

/**
 * Mostra modal de registro - redireciona para página de autenticação
 */
function showRegisterModal() {
  window.location.href = '../authPage/authIndex.html';
}
