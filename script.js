const capitulos = {
  "Capítulo 1": {
    titulo: "Funções e Limite",
    descricao: "Introdução aos conceitos fundamentais do cálculo",
    progresso: 0.5,
  },
  "Capítulo 2": {
    titulo: "Derivadas",
    descricao: "Conceitos e aplicações das derivadas",
    progresso: 0.3,
  },
  "Capítulo 3": {
    titulo: "Integrais",
    descricao: "Conceitos e aplicações das integrais",
    progresso: 0.7,
  },
  "Capítulo 4": {
    titulo: "Séries",
    descricao: "Conceitos e aplicações das séries",
    progresso: 0.2,
  },
  "Capítulo 5": {
    titulo: "Equações Diferenciais",
    descricao: "Conceitos e aplicações das equações diferenciais",
    progresso: 0.4,
  },
  "Capítulo 6": {
    titulo: "Aplicações do Cálculo",
    descricao: "Aplicações práticas do cálculo em diversas áreas",
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
    // Criar elementos principais
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

    // Montar capítulo
    capDiv.appendChild(header);
    capDiv.appendChild(h4);
    capDiv.appendChild(descP);
    capDiv.appendChild(progressBar);

    // Adicionar ao container
    container.appendChild(capDiv);
  });
});

$(function () {
  const feature = $(".feature");
  const initialBackgroundSize = 250; // Valor inicial do background-size em porcentagem
  const blurFactor = 100; // Fator de ajuste para o blur
  const opacityFactor = 1.3; // Fator de ajuste para a opacidade

  $(window).on("scroll", function () {
    const fromTop = $(window).scrollTop();
    const newSize = initialBackgroundSize - fromTop / 3;

    if (newSize > 100) {
      // Garante que o tamanho não fique menor que 100%
      feature.css({
        "background-size": `${newSize}%`,
        filter: `blur(${fromTop / blurFactor}px)`,
        opacity: 1 - (fromTop / $(document).height()) * opacityFactor,
      });
    }
  });
});

$(function () {
  var isChrome =
    /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  var isSafari =
    /Safari/.test(navigator.userAgent) &&
    /Apple Computer/.test(navigator.vendor);

  if (isChrome || isSafari) {
  } else {
    $(".feature").append('<div class="opaque"></div>');
    $(window).on("scroll", function () {
      var opacity = 0 + $(window).scrollTop() / 5000;
      $(".opaque").css("opacity", opacity);
    });
  }
});
