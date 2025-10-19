/**
 * Script para página de capítulo individual (refatorado)
 * - Lê parâmetros (?key, ?title, ?file)
 * - Carrega arquivo .tex e renderiza com MathJax
 * - Carrega e SALVA sempre o MAIOR progresso atingido
 * - Restaura melhor posição de leitura
 */

// Parâmetros da URL e fallback
const urlParams = new URLSearchParams(window.location.search);
const chapterKey = urlParams.get('key') || localStorage.getItem('currentChapter') || 'Capítulo 1';
const chapterTitleParam = urlParams.get('title') || chapterKey;
const chapterFile = urlParams.get('file');

document.addEventListener('DOMContentLoaded', async function() {
  updateChapterInfo();

  // Carregar progresso salvo e iniciar tracking com o valor inicial máximo
  const savedProgress = await loadChapterProgress();
  trackReadingProgress(savedProgress || 0);

  // Carregar conteúdo .tex, se houver
  await loadTexContent();

  // Atualizar UI do usuário
  updateUserUI();
});

/** Atualiza informações do capítulo na página */
function updateChapterInfo() {
  const chapterTitleEl = document.querySelector('.chapter');
  const tituloEl = document.querySelector('.titulo');

  if (chapterTitleEl) {
    chapterTitleEl.textContent = (chapterTitleParam.split('—')[0] || chapterTitleParam).trim();
  }
  if (tituloEl) {
    const maybeSubtitle = chapterTitleParam.split('—')[1];
    tituloEl.textContent = (maybeSubtitle ? maybeSubtitle : chapterTitleParam).trim();
  }
}

/** Carrega conteúdo TeX e renderiza com MathJax */
async function loadTexContent(){
  if(!chapterFile){
    return; // Nada a carregar
  }
  try{
    const normalized = chapterFile.replace(/^\.\/?/, '');
    const res = await fetch(`../${normalized}`);
    if(!res.ok) throw new Error(`Falha ao buscar arquivo TeX (${res.status})`);
    const tex = await res.text();
    const viewer = document.getElementById('tex-viewer');
    if(viewer){
      // Exibe conteúdo TeX bruto e deixa o MathJax cuidar da matemática
      viewer.textContent = tex;
      if(window.MathJax?.typesetPromise){
        await window.MathJax.typesetPromise([viewer]);
      }
    }
  }catch(err){
    console.error('Erro ao carregar capítulo:', err);
    const viewer = document.getElementById('tex-viewer');
    if(viewer){
      viewer.innerHTML = '<p style="color:#f88">Não foi possível carregar este capítulo.</p>';
    }
  }
}

/** Carrega progresso do capítulo atual e restaura posição */
async function loadChapterProgress() {
  if (!apiClient.isAuthenticated()) {
    console.log('Usuário não autenticado');
    return 0;
  }
  try {
    const progress = await apiClient.getChapterProgress(chapterKey);
    const value = Math.max(0, Math.min(1, progress?.progress || 0));

    // Atualizar barra de progresso para refletir valor salvo
    const progressBar = document.querySelector('.current-progress');
    if (progressBar) progressBar.style.width = `${value * 100}%`;

    // Restaurar posição somente se houver e o usuário ainda não tiver rolado
    if (progress?.last_position > 0 && (window.pageYOffset || document.documentElement.scrollTop) === 0) {
      window.scrollTo(0, progress.last_position);
    }
    return value;
  } catch (error) {
    console.error('Erro ao carregar progresso:', error);
    return 0;
  }
}

/** Rastreia progresso de leitura baseado em scroll, salvando apenas o MÁXIMO */
function trackReadingProgress(initialProgress = 0) {
  let maxProgress = initialProgress;
  let saveTimeout;

  const computeProgress = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    return scrollHeight > 0 ? Math.min(scrollTop / scrollHeight, 1) : 0;
  };

  const applyProgressToBar = (progress) => {
    const progressBar = document.querySelector('.current-progress');
    if (progressBar) progressBar.style.width = `${progress * 100}%`;
  };

  const saveMaxProgress = async () => {
    if (!apiClient.isAuthenticated()) return;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const current = computeProgress();
    if (current > maxProgress) maxProgress = current;

    // Apenas salva quando passar de 1% para reduzir ruído
    if (maxProgress > 0.01) {
      try {
        const completed = maxProgress >= 0.95;
        await apiClient.saveProgress(chapterKey, maxProgress, scrollTop, completed);
        // Não regrede a barra visual para o max (barra mostra atual); manter UI fluida
        console.debug(`Progresso máximo salvo: ${(maxProgress * 100).toFixed(1)}% (atual ${(current * 100).toFixed(1)}%)`);
      } catch (error) {
        console.warn('Erro ao salvar progresso:', error);
      }
    }
  };

  window.addEventListener('scroll', () => {
    clearTimeout(saveTimeout);
    const current = computeProgress();
    if (current > maxProgress) maxProgress = current;
    applyProgressToBar(current);
    saveTimeout = setTimeout(saveMaxProgress, 1000);
  });

  // Salva ao sair
  window.addEventListener('beforeunload', saveMaxProgress);

  // Inicializa barra e realiza primeiro save non-blocking
  const current = computeProgress();
  if (current > maxProgress) maxProgress = current;
  applyProgressToBar(current);
  setTimeout(saveMaxProgress, 300);
}

/** Atualiza UI com informações do usuário */
function updateUserUI() {
  const navMenu = document.querySelector('.nav-menu');
  if (!navMenu) return;

  const existing = navMenu.querySelector('.user-info, .auth-buttons');
  if (existing) existing.remove();

  if (apiClient.isAuthenticated() && apiClient.user) {
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

/** Logout do usuário */
function handleLogout() {
  apiClient.logout();
  alert('Logout realizado com sucesso!');
  window.location.href = '../homePage/homeIndex.html';
}
