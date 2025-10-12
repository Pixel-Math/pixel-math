const chapters = {
  "Capítulo 1": {
    titulo: "Noções sobre conjuntos no espaço euclidiano",
    descricao:
      "Fundamentos de conjuntos no espaço euclidiano e suas propriedades topológicas.",
    progresso: 0.5,
  },
  "Capítulo 2": {
    titulo: "Funções de várias variáveis",
    descricao:
      "Estudo de funções com múltiplas variáveis e suas propriedades analíticas.",
    progresso: 0.3,
  },
  "Capítulo 3": {
    titulo: "Limite e Continuidade",
    descricao:
      "Análise do comportamento de funções próximo a pontos específicos e sua variação contínua.",
    progresso: 0.7,
  },
  "Capítulo 4": {
    titulo: "Derivadas Parciais",
    descricao: "Taxas de variação de funções em direções específicas.",
    progresso: 0.2,
  },
  "Capítulo 5": {
    titulo: "Curvas Parametrizadas",
    descricao: "Representação matemática de trajetórias no espaço",
    progresso: 0.4,
  },
  "Capítulo 6": {
    titulo: "Plano Tangente e reta normal a superfícies em ℝ³",
    descricao: "Geometria local de superfícies tridimensionais",
    progresso: 0.6,
  },
  "Capítulo 7": {
    titulo: "Aproximação linear e diferencial total",
    descricao: "Métodos para linearizar funções de múltiplas variáveis.",
    progresso: 0.6,
  },
  "Capítulo 8": {
    titulo: "Derivadas de segunda ordem e aproximação quadrática",
    descricao: "Análise do comportamento curvado de funções multivariáveis.",
    progresso: 0.6,
  },
  "Capítulo 9": {
    titulo: "Máximos e Mínimos",
    descricao:
      "Técnicas para identificar pontos extremos de funções multivariáveis.",
    progresso: 0.6,
  },
};

// ==================== INTEGRAÇÃO COM API ====================

/**
 * Carrega progresso do usuário da API
 */
async function loadUserProgress() {
  if (!apiClient.isAuthenticated()) {
    console.log('Usuário não autenticado. Usando progresso local.');
    return;
  }

  try {
    const progressList = await apiClient.getAllProgress();
    
    // Atualizar progresso dos capítulos com dados da API
    progressList.forEach(progress => {
      if (chapters[progress.chapter_key]) {
        chapters[progress.chapter_key].progresso = progress.progress;
      }
    });
    
    console.log('Progresso carregado da API:', progressList);
  } catch (error) {
    console.error('Erro ao carregar progresso:', error);
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
  // Carregar progresso do usuário da API
  await loadUserProgress();
  
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

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".chapters-container");

  Object.entries(chapters).forEach(([chapter, info]) => {
    const capDiv = document.createElement("div");
    capDiv.classList.add("chapter");

    const header = document.createElement("div");
    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.style.color = "#ff7518";

    const titleP = document.createElement("p");
    titleP.textContent = chapter;
    const icon = document.createElement("i");
    icon.classList.add("bi", "bi-chevron-right");

    header.appendChild(titleP);
    header.appendChild(icon);

    const h4 = document.createElement("h4");
    h4.textContent = info.titulo;

    const descP = document.createElement("p");
    descP.textContent = info.descricao;

    const progressBar = document.createElement("div");
    progressBar.classList.add("progress-bar");
    const current = document.createElement("div");
    current.classList.add("current-progress");
    current.style.width = `${info.progresso * 100}%`;

    progressBar.appendChild(current);

    capDiv.appendChild(header);
    capDiv.appendChild(h4);
    capDiv.appendChild(descP);
    capDiv.appendChild(progressBar);

    container.appendChild(capDiv);

    capDiv.addEventListener("click", () => {
      // Salvar informação do capítulo clicado
      localStorage.setItem('currentChapter', chapter);
      window.location.href = "../chapterPage/chapterIndex.html";
    });
  });
});

// ==================== UI DE AUTENTICAÇÃO ====================

/**
 * Atualiza UI com informações do usuário
 */
function updateUserUI() {
  const navMenu = document.querySelector('.nav-menu');
  
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
  } else {
    // Adicionar botão de login
    const authButtons = document.createElement('div');
    authButtons.className = 'auth-buttons';
    authButtons.style.display = 'flex';
    authButtons.style.gap = '10px';
    
    authButtons.innerHTML = `
      <button onclick="showLoginModal()" class="button" style="padding: 8px 15px; font-size: 0.9rem;">
        Entrar
      </button>
      <button onclick="showRegisterModal()" class="button" style="padding: 8px 15px; font-size: 0.9rem; background: transparent; border: 2px solid var(--color-secondary);">
        Cadastrar
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
 * Mostra modal de login (implementação básica)
 */
function showLoginModal() {
  const username = prompt('Username:');
  const password = prompt('Password:');
  
  if (username && password) {
    apiClient.login(username, password)
      .then(() => {
        alert('Login realizado com sucesso!');
        window.location.reload();
      })
      .catch(error => {
        alert('Erro ao fazer login: ' + error.message);
      });
  }
}

/**
 * Mostra modal de registro (implementação básica)
 */
function showRegisterModal() {
  const username = prompt('Username:');
  const email = prompt('Email:');
  const password = prompt('Password:');
  
  if (username && email && password) {
    apiClient.register(username, email, password)
      .then(() => {
        alert('Cadastro realizado com sucesso!');
        window.location.reload();
      })
      .catch(error => {
        alert('Erro ao cadastrar: ' + error.message);
      });
  }
}
