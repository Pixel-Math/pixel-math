const capitulos = {
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

document.addEventListener("DOMContentLoaded", function () {
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
});

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".capitulos-container");

  Object.entries(capitulos).forEach(([capitulo, info]) => {
    const capDiv = document.createElement("div");
    capDiv.classList.add("capitulo");

    const header = document.createElement("div");
    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.style.color = "#ff7518";

    const titleP = document.createElement("p");
    titleP.textContent = capitulo;
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

    // Monta capítulo
    capDiv.appendChild(header);
    capDiv.appendChild(h4);
    capDiv.appendChild(descP);
    capDiv.appendChild(progressBar);

    // Adiciona ao container
    container.appendChild(capDiv);
  });
});
