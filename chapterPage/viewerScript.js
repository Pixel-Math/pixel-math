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
  const savedProgress = await loadChapterProgress(); // Agora retorna o progresso
  trackReadingProgress(savedProgress); // Passa o progresso inicial
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
      renderNextChapterCta();
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
  
  // Processar listas (itemize e enumerate com ou sem opções)
  html = html.replace(/\\begin\{itemize\}(?:\[[^\]]*\])?/g, '<ul class="latex-list">');
  html = html.replace(/\\end\{itemize\}/g, '</ul>');
  html = html.replace(/\\begin\{enumerate\}(?:\[[^\]]*\])?/g, '<ol class="latex-list">');
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
  
  // Processar parágrafos (melhorado para evitar espaçamento excessivo)
  const lines = html.split('\n');
  let inParagraph = false;
  let result = [];
  
  for(let line of lines) {
    line = line.trim();
    
    // Linha vazia - fechar parágrafo se houver
    if(!line) {
      if(inParagraph) {
        result.push('</p>');
        inParagraph = false;
      }
      continue;
    }
    
    // Linha começa com tag HTML - não é parágrafo de texto
    if(line.startsWith('<')) {
      if(inParagraph) {
        result.push('</p>');
        inParagraph = false;
      }
      result.push(line);
    } else {
      // Texto normal - adicionar ao parágrafo
      if(!inParagraph) {
        result.push('<p>');
        inParagraph = true;
      }
      result.push(line);
    }
  }
  
  if(inParagraph) {
    result.push('</p>');
  }
  
  return result.join('\n');
}

function renderNextChapterCta(){
  try {
    const el = document.getElementById('next-chapter');
    if(!el) return;
    fetch('../assets/files/livro_epub/chapters.json')
      .then(r=>r.json())
      .then(chaps => {
        const idx = chaps.findIndex(c => c.key === chapterKey);
        
        // Container de navegação
        let html = '<div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; margin-top: 30px; padding: 25px; background: rgba(255, 117, 24, 0.05); border-radius: 15px; border: 1px solid rgba(255, 117, 24, 0.2);">';
        
        // Botão próximo capítulo (se não for o último)
        if(idx >= 0 && idx < chaps.length - 1){
          const next = chaps[idx+1];
          const params = new URLSearchParams({ key: next.key, title: next.title, file: next.file });
          html += `
            <a class="action-button next-chapter-btn" href="../chapterPage/chapterIndex.html?${params.toString()}">
              <i class="bi bi-chevron-right"></i> Ler próximo capítulo
            </a>`;
        }
        
        // Botão ver todos os capítulos (sempre aparece)
        html += `
          <a class="action-button chapters-btn" href="../chaptersPage/chaptersIndex.html">
            <i class="bi bi-grid-3x3-gap"></i> Ver todos os capítulos
          </a>
        `;
        
        html += '</div>';
        el.innerHTML = html;
      }).catch(()=>{});
  } catch {}
}

async function loadChapterProgress(){
  if(!apiClient.isAuthenticated()) return 0;
  try{
    const progress = await apiClient.getChapterProgress(chapterKey);
    const bar = document.querySelector('.current-progress');
    if(bar) bar.style.width = `${(progress.progress || 0)*100}%`;
    
    // Restaurar posição APENAS se houver progresso salvo e não estiver no topo
    if(progress.last_position > 0 && window.pageYOffset === 0) {
      window.scrollTo(0, progress.last_position);
      console.log(`Restaurando última posição: ${progress.last_position}px`);
    }
    
    return progress.progress || 0; // Retornar o progresso salvo
  }catch(err){ 
    console.warn('Erro ao carregar progresso:', err);
    return 0;
  }
}

function trackReadingProgress(initialProgress = 0){
  let maxProgress = initialProgress; // Inicializar com o progresso salvo
  let scrollTimeout;
  
  const updateProgress = async () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const currentProgress = scrollHeight > 0 ? Math.min(scrollTop / scrollHeight, 1) : 0;
    
    // Atualizar o máximo progresso alcançado
    if(currentProgress > maxProgress) {
      maxProgress = currentProgress;
    }
    
    // Atualizar barra de progresso visualmente com o progresso ATUAL
    const progressBar = document.querySelector('.current-progress');
    if(progressBar) {
      progressBar.style.width = `${currentProgress * 100}%`;
    }
    
    if(!apiClient.isAuthenticated()) return;
    
    // Salvar o MÁXIMO progresso alcançado (não o atual)
    if(maxProgress > 0.01){
      try{
        const completed = maxProgress >= 0.95;
        await apiClient.saveProgress(chapterKey, maxProgress, scrollTop, completed);
        console.log(`Progresso máximo salvo: ${(maxProgress * 100).toFixed(1)}% (atual: ${(currentProgress * 100).toFixed(1)}%)`);
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
    
    // Atualizar máximo
    if(progress > maxProgress) {
      maxProgress = progress;
    }
    
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
