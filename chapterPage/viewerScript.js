/**
 * Viewer de Capítulo
 * - Lê parâmetros (?key, ?title, ?file)
 * - Carrega arquivo .tex e renderiza com MathJax
 * - Salva/recupera progresso via API
 */

const urlParams = new URLSearchParams(window.location.search);
const chapterKey = urlParams.get('key') || 'semana1';
const chapterTitle = urlParams.get('title') || 'Capítulo';
const chapterFile = urlParams.get('file') || '';

document.addEventListener('DOMContentLoaded', async () => {
  updateChapterInfo();
  await loadChapterProgress();
  trackReadingProgress();
  await loadTexContent();
  updateUserUI();
  // Ocultar links "Entrar" estáticos, se existirem
  const navMenu = document.querySelector('.nav-menu');
  if (navMenu && apiClient.isAuthenticated()) {
    [...navMenu.querySelectorAll('a.nav-link')]
      .filter(a => a.textContent.trim().toLowerCase() === 'entrar')
      .forEach(a => a.remove());
  }
});

function updateChapterInfo(){
  const chapterTitleEl = document.querySelector('.chapter');
  const tituloEl = document.querySelector('.titulo');
  
  if (chapterTitleEl) {
    chapterTitleEl.textContent = chapterTitle.split('—')[0]?.trim() || chapterTitle;
  }
  if (tituloEl) {
    tituloEl.textContent = chapterTitle.split('—')[1]?.trim() || chapterTitle;
  }
}

async function loadTexContent(){
  if(!chapterFile) {
    console.warn('Nenhum arquivo .tex especificado');
    return;
  }
  
  try{
    // Normalizar caminho do arquivo
    const normalized = chapterFile.replace(/^\.\/?/, '');
    const filePath = `../${normalized}`;
    
    console.log('Carregando arquivo:', filePath);
    
    const res = await fetch(filePath);
    if(!res.ok) throw new Error(`Falha ao buscar arquivo TeX (${res.status})`);
    
    const texContent = await res.text();
    const viewer = document.getElementById('tex-viewer');
    
    if(viewer){
      // Processar conteúdo LaTeX para HTML básico
      const processedContent = processLatexToHtml(texContent);
      viewer.innerHTML = processedContent;
      
      // Renderizar matemática com MathJax se disponível
      if(window.MathJax?.typesetPromise){
        await window.MathJax.typesetPromise([viewer]);
      }
    }
  }catch(err){
    console.error('Erro ao carregar capítulo:', err);
    const viewer = document.getElementById('tex-viewer');
    if(viewer){
      viewer.innerHTML = `
        <div style="padding: 20px; background: #2a0000; border-left: 4px solid #ff4444; border-radius: 8px;">
          <h3 style="color: #ff4444; margin-top: 0;">❌ Erro ao carregar capítulo</h3>
          <p style="color: #ffaaaa;">Não foi possível carregar este capítulo.</p>
          <p style="color: #888; font-size: 0.9em;">Arquivo: ${chapterFile}</p>
          <p style="color: #888; font-size: 0.9em;">Erro: ${err.message}</p>
        </div>
      `;
    }
  }
}

/**
 * Processa conteúdo LaTeX para HTML básico
 */
function processLatexToHtml(texContent) {
  let html = texContent;
  
  // Remover comentários LaTeX primeiro
  html = html.replace(/%.*$/gm, '');
  
  // Preservar matemática: $$ $$, \[ \], \( \), $ $
  const placeholders = [];
  const pushPh = (m) => { placeholders.push(m); return `__MATH_${placeholders.length-1}__`; };
  // $$...$$ (greedy-safe)
  html = html.replace(/\$\$([\s\S]*?)\$\$/g, (m)=> pushPh(m));
  // \[...\]
  html = html.replace(/\\\[([\s\S]*?)\\\]/g, (m)=> pushPh(m));
  // \(...\)
  html = html.replace(/\\\(([\s\S]*?)\\\)/g, (m)=> pushPh(m));
  // $...$
  html = html.replace(/(?<!\\)\$([^$\n]+?)(?<!\\)\$/g, (m)=> pushPh(m));
  
  // Processar comandos estruturais
  html = html.replace(/\\chapter\{([^}]+)\}/g, '<h1 class="chapter-title">$1</h1>');
  html = html.replace(/\\section\{([^}]+)\}/g, '<h2 class="section-title">$1</h2>');
  html = html.replace(/\\subsection\{([^}]+)\}/g, '<h3 class="subsection-title">$1</h3>');
  html = html.replace(/\\subsubsection\{([^}]+)\}/g, '<h4 class="subsubsection-title">$1</h4>');
  
  // Processar ambientes especiais (definition, example, etc)
  html = html.replace(/\\begin\{definition\}\{([^}]*)\}\{([^}]*)\}([\s\S]*?)\\end\{definition\}/g, 
    '<div class="latex-definition"><div class="def-header">📐 Definição: $1</div><div class="def-content">$3</div></div>');
  
  html = html.replace(/\\begin\{example\}\{([^}]*)\}\{([^}]*)\}([\s\S]*?)\\end\{example\}/g, 
    '<div class="latex-example"><div class="ex-header">💡 Exemplo: $1</div><div class="ex-content">$3</div></div>');
  
  html = html.replace(/\\begin\{examples\}\{([^}]*)\}\{([^}]*)\}([\s\S]*?)\\end\{examples\}/g, 
    '<div class="latex-example"><div class="ex-header">💡 Exemplos: $1</div><div class="ex-content">$3</div></div>');
  
  html = html.replace(/\\begin\{theorem\}\{([^}]*)\}\{([^}]*)\}([\s\S]*?)\\end\{theorem\}/g, 
    '<div class="latex-theorem"><div class="thm-header">🎯 Teorema: $1</div><div class="thm-content">$3</div></div>');
  
  html = html.replace(/\\begin\{remark\}\{([^}]*)\}\{([^}]*)\}([\s\S]*?)\\end\{remark\}/g, 
    '<div class="latex-remark"><div class="rem-header">💭 Observação: $1</div><div class="rem-content">$3</div></div>');
  
  html = html.replace(/\\resumo\{[^}]*\}\{([\s\S]*?)\}/g, 
    '<div class="latex-summary"><div class="sum-header">📋 Resumo</div><div class="sum-content">$1</div></div>');
  
  // Processar listas
  html = html.replace(/\\begin\{itemize\}/g, '<ul class="latex-list">');
  html = html.replace(/\\end\{itemize\}/g, '</ul>');
  html = html.replace(/\\begin\{enumerate\}/g, '<ol class="latex-list">');
  html = html.replace(/\\end\{enumerate\}/g, '</ol>');
  html = html.replace(/\\item\s*/g, '<li>');
  
  // Processar formatação de texto
  html = html.replace(/\\textbf\{([^}]+)\}/g, '<strong>$1</strong>');
  html = html.replace(/\\textit\{([^}]+)\}/g, '<em>$1</em>');
  html = html.replace(/\\emph\{([^}]+)\}/g, '<em>$1</em>');
  html = html.replace(/\\texttt\{([^}]+)\}/g, '<code>$1</code>');
  
  // Processar comandos especiais
  html = html.replace(/\\newpage/g, '<div class="page-break"></div>');
  html = html.replace(/\\\\/g, '<br>');
  html = html.replace(/\\footnote\{([^}]+)\}/g, '<sup class="footnote">*</sup><span class="footnote-text">$1</span>');
  html = html.replace(/\\footnotemark/g, '<sup class="footnote">*</sup>');
  html = html.replace(/\\footnotetext\{([^}]+)\}/g, '<div class="footnote-text">* $1</div>');
  html = html.replace(/\\begin\{proof\}([\s\S]*?)\\end\{proof\}/g, '<div class="latex-proof"><div class="pf-header">📎 Prova</div><div class="pf-content">$1</div></div>');
  html = html.replace(/\\begin\{equation\}([\s\S]*?)\\end\{equation\}/g, (m, g1)=> pushPh(`$$${g1}$$`));
  
  // Remover comandos LaTeX restantes (que não processamos)
  html = html.replace(/\\(usepackage|documentclass|newcommand|renewcommand|DeclareMathOperator)[^\n]*\n?/g, '');
  // comandos simples restantes sem argumentos
  html = html.replace(/\\[a-zA-Z]+(\s*)/g, '$1');
  
  // Restaurar matemática
  placeholders.forEach((m, i)=> { html = html.replace(new RegExp(`__MATH_${i}__`,'g'), m); });
  
  // Processar parágrafos
  const lines = html.split('\n');
  let inParagraph = false;
  let result = [];
  
  for(let line of lines) {
    line = line.trim();
    
    if(!line) {
      if(inParagraph) {
        result.push('</p>');
        inParagraph = false;
      }
      continue;
    }
    
    if(line.startsWith('<')) {
      if(inParagraph) {
        result.push('</p>');
        inParagraph = false;
      }
      result.push(line);
    } else {
      if(!inParagraph) {
        result.push('<p>');
        inParagraph = true;
      }
      result.push(line + ' ');
    }
  }
  
  if(inParagraph) {
    result.push('</p>');
  }
  
  return result.join('\n');
}

async function loadChapterProgress(){
  if(!apiClient.isAuthenticated()) return;
  try{
    const progress = await apiClient.getChapterProgress(chapterKey);
    const bar = document.querySelector('.current-progress');
    if(bar) bar.style.width = `${(progress.progress || 0)*100}%`;
    if(progress.last_position > 0) window.scrollTo(0, progress.last_position);
  }catch(err){ console.warn(err); }
}

function trackReadingProgress(){
  let lastProgress = 0;
  let scrollTimeout;
  
  const updateProgress = async () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollHeight > 0 ? Math.min(scrollTop / scrollHeight, 1) : 0;
    
    // Atualizar barra de progresso visualmente
    const progressBar = document.querySelector('.current-progress');
    if(progressBar) {
      progressBar.style.width = `${progress * 100}%`;
    }
    
    if(!apiClient.isAuthenticated()) return;
    
    // Só salvar se mudou significativamente (>1%)
    if(Math.abs(progress - lastProgress) > 0.01){
      lastProgress = progress;
      try{
        const completed = progress >= 0.95;
        await apiClient.saveProgress(chapterKey, progress, scrollTop, completed);
        console.log(`Progresso salvo: ${(progress * 100).toFixed(1)}%`);
      }catch(err){ 
        console.warn('Erro ao salvar progresso:', err); 
      }
    }
  };
  
  // Atualizar ao scrollar (com debounce)
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    
    // Atualizar barra visualmente imediatamente
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollHeight > 0 ? Math.min(scrollTop / scrollHeight, 1) : 0;
    const progressBar = document.querySelector('.current-progress');
    if(progressBar) {
      progressBar.style.width = `${progress * 100}%`;
    }
    
    // Salvar no backend com delay
    scrollTimeout = setTimeout(updateProgress, 1000);
  });
  
  // Salvar ao sair da página
  window.addEventListener('beforeunload', updateProgress);
  
  // Inicializar progresso
  updateProgress();
}

function updateUserUI(){
  const navMenu = document.querySelector('.nav-menu');
  if(!navMenu) return;
  
  // Remover elementos anteriores
  const existing = navMenu.querySelector('.user-info, .auth-buttons');
  if(existing) existing.remove();
  
  if(apiClient.isAuthenticated() && apiClient.user){
    // Usuário logado
    const div = document.createElement('div');
    div.className = 'user-info';
    div.style.cssText = `
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 8px 15px;
      background: rgba(255, 117, 24, 0.1);
      border-radius: 10px;
      border: 1px solid rgba(255, 117, 24, 0.3);
    `;
    div.innerHTML = `
      <span style="color: var(--color-secondary); font-weight: 600; display: flex; align-items: center; gap: 8px;">
        <i class="bi bi-person-circle" style="font-size: 1.3rem;"></i> 
        ${apiClient.user.username}
      </span>
      <button class="logout-btn" style="
        padding: 6px 12px;
        font-size: 0.85rem;
        background: transparent;
        border: 1px solid var(--color-secondary);
        color: var(--color-secondary);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 600;
      " onclick="(function(){apiClient.logout();location.href='../homePage/homeIndex.html'})()">
        <i class="bi bi-box-arrow-right"></i> Sair
      </button>
    `;
    navMenu.appendChild(div);
  }
}
