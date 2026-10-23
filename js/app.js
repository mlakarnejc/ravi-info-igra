const modules = [
  { name: 'Strojna in programska oprema', status: 'ready' },
  { name: 'Osnove programiranja', status: 'locked' },
  { name: 'Spletne aplikacije', status: 'locked' },
  { name: 'Upravljanje s podatki', status: 'locked' },
  { name: 'Računalniška omrežja', status: 'locked' },
  { name: 'Varnost in zaščita', status: 'locked' },
  { name: 'Računalniško oblikovanje', status: 'locked' },
  { name: 'Umetna inteligenca', status: 'locked' }
];

const components = [
  { id: 'cpu', label: 'Procesor', icon: '🧠', correct: true },
  { id: 'ram', label: 'RAM', icon: '▥', correct: true },
  { id: 'ssd', label: 'SSD', icon: '💾', correct: true },
  { id: 'microwave', label: 'Mikrovalovna pečica', icon: '🍲', correct: false },
  { id: 'battery', label: 'AA baterija', icon: '🔋', correct: false },
  { id: 'toaster', label: 'Opekač', icon: '🍞', correct: false },
  { id: 'shoe', label: 'Športni copat', icon: '👟', correct: false },
  { id: 'plant', label: 'Lončnica', icon: '🪴', correct: false }
];

let completed = 0;
let attempts = 0;
let selected = new Set();

const screens = [...document.querySelectorAll('.screen')];
const moduleGrid = document.getElementById('moduleGrid');
const componentGrid = document.getElementById('componentGrid');
const feedback = document.getElementById('taskFeedback');
const raviTaskText = document.getElementById('raviTaskText');

function showScreen(id) {
  screens.forEach((screen) => screen.classList.toggle('active', screen.id === id));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgress() {
  const percent = Math.round((completed / modules.length) * 100);
  document.getElementById('progressText').textContent = `${completed} / ${modules.length} modulov`;
  document.getElementById('progressPercent').textContent = `${percent} %`;
  document.getElementById('progressBar').style.width = `${percent}%`;
}

function renderModules() {
  moduleGrid.innerHTML = '';

  modules.forEach((module, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'module-card';

    if (module.status === 'complete') button.classList.add('complete');
    button.disabled = module.status === 'locked';

    const statusText =
      module.status === 'complete'
        ? 'AKTIVIRAN ✓'
        : module.status === 'locked'
          ? 'ZAKLENJENO'
          : 'PRIPRAVLJENO';

    button.innerHTML = `
      <span class="module-index">MODUL ${String(index + 1).padStart(2, '0')}</span>
      <span class="module-name">${module.name}</span>
      <span class="module-status">${statusText}</span>
    `;

    button.addEventListener('click', () => openModule(index));
    moduleGrid.appendChild(button);
  });
}

function openModule(index) {
  if (index === 0) {
    showScreen('screenTask1');
    return;
  }

  document.getElementById('placeholderTitle').textContent = modules[index].name;
  showScreen('screenPlaceholder');
}

function renderComponents() {
  componentGrid.innerHTML = '';

  components.forEach((component) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'component-btn';
    button.dataset.id = component.id;
    button.innerHTML = `<span class="icon">${component.icon}</span><strong>${component.label}</strong>`;

    button.addEventListener('click', () => {
      if (modules[0].status === 'complete') return;

      if (selected.has(component.id)) {
        selected.delete(component.id);
      } else if (selected.size < 3) {
        selected.add(component.id);
      }

      button.classList.toggle('selected', selected.has(component.id));
      feedback.textContent =
        selected.size < 3
          ? `Izbrano: ${selected.size}/3`
          : 'Izbrane so 3 komponente. Preveri rešitev.';
      feedback.className = 'feedback';
    });

    componentGrid.appendChild(button);
  });
}

function checkTask1() {
  if (modules[0].status === 'complete') return;

  if (selected.size !== 3) {
    feedback.textContent = 'Izberi natanko 3 komponente.';
    feedback.className = 'feedback error';
    return;
  }

  attempts += 1;
  const selectedObjects = components.filter((component) => selected.has(component.id));
  const allCorrect = selectedObjects.every((component) => component.correct);

  document.querySelectorAll('.component-btn').forEach((button) => {
    const component = components.find((item) => item.id === button.dataset.id);
    if (selected.has(component.id)) {
      button.classList.add(component.correct ? 'correct' : 'wrong');
    }
  });

  if (allCorrect) {
    modules[0].status = 'complete';
    modules[1].status = 'ready';
    completed = 1;

    feedback.textContent = 'MODUL 1 AKTIVIRAN ✓ Procesor: OK. Pomnilnik: OK. Disk: OK.';
    feedback.className = 'feedback success';
    raviTaskText.textContent = '»Koda še ni, ampak strojna oprema živi. Brez dima. To štejem kot uspeh.«';
    document.getElementById('hubMessage').textContent = 'Prvi sistem je aktiven. Naslednji modul je odklenjen.';

    updateProgress();
    renderModules();
    setTimeout(() => showScreen('screenHub'), 1600);
    return;
  }

  if (attempts === 1) {
    feedback.textContent = 'Nekaj ni v redu. Poskusi še enkrat.';
    raviTaskText.textContent = '»Tole bi sicer lahko pogrelo malico ali okrasilo mizo, mene pa ne bo zagnalo.«';
  } else if (attempts === 2) {
    feedback.textContent = 'Namig: išči dele, ki jih najdeš znotraj računalnika.';
    raviTaskText.textContent = '»Namig: išči tri dele, ki jih najdeš znotraj računalnika.«';
  } else {
    feedback.textContent = 'Močan namig: procesor, RAM in SSD so zelo dobra smer.';
    raviTaskText.textContent = '»V redu, skoraj ti povem: procesor, RAM in SSD. Zdaj pa hitro, preden kdo vidi.«';
  }

  feedback.className = 'feedback error';
  selected.clear();

  setTimeout(() => {
    document.querySelectorAll('.component-btn').forEach((button) => {
      button.classList.remove('selected', 'correct', 'wrong');
    });
  }, 700);
}

document.getElementById('startBtn').addEventListener('click', () => showScreen('screenHub'));
document.getElementById('checkTask1').addEventListener('click', checkTask1);
document.getElementById('backHub1').addEventListener('click', () => showScreen('screenHub'));
document.getElementById('placeholderBack').addEventListener('click', () => showScreen('screenHub'));

renderModules();
renderComponents();
updateProgress();
