/**
 * Script para página de capítulo individual
 * Carrega e salva progresso de leitura
 */

const chapterKey = localStorage.getItem('currentChapter') || 'Capítulo 1';

document.addEventListener('DOMContentLoaded', async function() {
  // Atualizar título da página com o capítulo
  updateChapterInfo();
  
  // Carregar progresso do capítulo
  await loadChapterProgress();
  
  // Rastrear scroll para salvar progresso
  trackReadingProgress();
  
  // Atualizar UI do usuário
  updateUserUI();
});

/**
 * Atualiza informações do capítulo na página
 */
function updateChapterInfo() {
  const chapterTitle = document.querySelector('.chapter');
  const titulo = document.querySelector('.titulo');
  
  if (chapterTitle) {
    chapterTitle.textContent = chapterKey;
  }
  
  // Aqui você pode buscar o título real do objeto chapters
  // Por enquanto mantemos genérico
}

/**
 * Carrega progresso do capítulo atual
 */
async function loadChapterProgress() {
  if (!apiClient.isAuthenticated()) {
    console.log('Usuário não autenticado');
    return;
  }
  
  try {
    const progress = await apiClient.getChapterProgress(chapterKey);
    
    // Atualizar barra de progresso
    const progressBar = document.querySelector('.current-progress');
    if (progressBar) {
      progressBar.style.width = `${progress.progress * 100}%`;
    }
    
    // Scroll para última posição lida
    if (progress.last_position > 0) {
      window.scrollTo(0, progress.last_position);
    }
    
    console.log('Progresso carregado:', progress);
  } catch (error) {
    console.error('Erro ao carregar progresso:', error);
  }
}

/**
 * Rastreia progresso de leitura baseado em scroll
 */
function trackReadingProgress() {
  let saveTimeout;
  
  window.addEventListener('scroll', () => {
    // Cancelar timeout anterior
    clearTimeout(saveTimeout);
    
    // Aguardar 1 segundo sem scroll para salvar
    saveTimeout = setTimeout(async () => {
      if (!apiClient.isAuthenticated()) return;
      
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollProgress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
      
      try {
        await apiClient.saveProgress(
          chapterKey,
          scrollProgress,
          scrollTop,
          scrollProgress >= 0.95
        );
        
        // Atualizar barra de progresso
        const progressBar = document.querySelector('.current-progress');
        if (progressBar) {
          progressBar.style.width = `${scrollProgress * 100}%`;
        }
        
        console.log(`Progresso salvo: ${(scrollProgress * 100).toFixed(1)}%`);
      } catch (error) {
        console.error('Erro ao salvar progresso:', error);
      }
    }, 1000);
  });
}

/**
 * Atualiza UI com informações do usuário
 */
function updateUserUI() {
  const navMenu = document.querySelector('.nav-menu');
  
  if (!navMenu) return;
  
  // Limpar conteúdo existente de autenticação
  const existingAuth = navMenu.querySelector('.user-info, .auth-buttons');
  if (existingAuth) {
    existingAuth.remove();
  }
  
  if (apiClient.isAuthenticated() && apiClient.user) {
    // Adicionar informações do usuário
    const userInfo = document.createElement('div');
    userInfo.className = 'user-info';
    userInfo.style.display = 'flex';
    userInfo.style.alignItems = 'center';
    userInfo.style.gap = '15px';
    
    userInfo.innerHTML = `
      <span style="color: var(--color-neutral-40);">
        <i class="bi bi-person-circle"></i> ${apiClient.user.username}
      </span>
      <button onclick="handleLogout()" class="button" style="padding: 8px 15px; font-size: 0.9rem;">
        Sair
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
  window.location.href = '../homePage/homeIndex.html';
}
