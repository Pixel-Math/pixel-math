// Carrega lista de capítulos do manifest e cria cards

async function loadChapters(){
  const listEl = document.getElementById('chaptersList');
  try{
    const res = await fetch('../assets/files/livro_epub/chapters.json');
    const items = await res.json();

    items.forEach((it, idx) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <h3>${it.title}</h3>
        <p class="path">${it.file}</p>
        <div class="meta">
          <span class="badge">Capítulo ${idx+1}</span>
          <button class="open">Ler</button>
        </div>
      `;
      card.querySelector('.open').addEventListener('click', () => openChapter(it));
      listEl.appendChild(card);
    })
  }catch(err){
    listEl.textContent = 'Falha ao carregar capítulos.';
    console.error(err);
  }
}

function openChapter(item){
  const url = new URL('../chapterPage/chapterIndex.html', window.location.href);
  url.searchParams.set('key', item.key);
  url.searchParams.set('title', item.title);
  url.searchParams.set('file', item.file);
  window.location.href = url.toString();
}

loadChapters();
