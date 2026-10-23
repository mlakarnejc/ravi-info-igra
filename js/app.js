const TEST_MODE = true;

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

const programSteps = [
  { id: 'check', text: 'PREVERI NAPAJANJE' },
  { id: 'power', text: 'VKLOPI SISTEM' },
  { id: 'load', text: 'NALOŽI PROGRAM' },
  { id: 'hello', text: 'PRIKAŽI "RAVI PRIPRAVLJEN"' }
];
const correctProgramOrder = ['check', 'power', 'load', 'hello'];
let currentProgramOrder = ['hello', 'load', 'check', 'power'];
let task2Attempts = 0;

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
  updateHubStage();
}

function updateHubStage() {
  const stage = document.getElementById('hubStage');
  if (!stage) return;

  stage.className = `hub-stage progress-${completed}`;

  const percent = Math.round((completed / modules.length) * 100);
  document.getElementById('repairPercent').textContent = `${percent} %`;
  document.getElementById('repairBar').style.width = `${percent}%`;

  const texts = [
    'RAVI čaka na prvi aktivni modul.',
    'Napajanje stabilizirano. Jedro prejema energijo.',
    'Procesi so zagnani. Oči in nadzorni sistem se prebujajo.',
    'Vmesnik je obnovljen. RAVI dobiva nadzor nad sistemom.',
    'Podatkovni sistem je aktiven. Pomnilnik se polni.',
    'Omrežje vzpostavljeno. RAVI je povezan.',
    'Varnostni ščit je aktiven.',
    'Vizualni sistem je obnovljen. RAVI skoraj pripravljen.',
    'Vsi sistemi delujejo. RAVI je popolnoma aktiven.'
  ];
  document.getElementById('repairText').textContent = texts[completed];

  const power = document.getElementById('labPower');
  const network = document.getElementById('labNetwork');
  if (power) power.textContent = completed >= 1 ? 'ONLINE' : 'OFFLINE';
  if (network) network.textContent = completed >= 5 ? 'CONNECTED' : 'OFFLINE';
}

function renderModules() {
  moduleGrid.innerHTML = '';

  modules.forEach((module, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'module-card';

    if (module.status === 'complete') button.classList.add('complete');
    button.disabled = !TEST_MODE && module.status === 'locked';

    const statusText =
      module.status === 'complete'
        ? 'AKTIVIRAN ✓'
        : TEST_MODE
          ? 'TEST'
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
    if (modules[0].status !== 'complete') resetCatchGame();
    showScreen('screenTask1');
    return;
  }

  if (index === 1) {
    if (modules[1].status !== 'complete') resetProgramGame();
    showScreen('screenTask2');
    setTimeout(() => document.getElementById('programBoard').focus(), 50);
    return;
  }

  if (index === 2) {
    if (modules[2].status !== 'complete') resetHtmlRepairGame();
    showScreen('screenTask3');
    return;
  }

  if (index === 3) {
    renderDataRows();
    showScreen('screenTask4');
    return;
  }

  if (index === 4) {
    renderNetworkOrder();
    showScreen('screenTask5');
    return;
  }

  if (index === 5) {
    showScreen('screenTask6');
    return;
  }

  if (index === 6) {
    showScreen('screenTask7');
    return;
  }

  if (index === 7) {
    showScreen('screenTask8');
    return;
  }

  document.getElementById('placeholderTitle').textContent = modules[index].name;
  showScreen('screenPlaceholder');
}

function renderComponents() {
  if (!componentGrid) return;
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
    initHtmlRepairGame();
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



const catchItems = [
  { label: 'CPU', icon: '🧠', good: true },
  { label: 'RAM', icon: '▥', good: true },
  { label: 'SSD', icon: '💾', good: true },
  { label: 'MIŠKA', icon: '🖱️', good: true },
  { label: 'TIPKOVNICA', icon: '⌨️', good: true },
  { label: 'ZASLON', icon: '🖥️', good: true },
  { label: 'SLUŠALKE', icon: '🎧', good: true },
  { label: 'SPLETNA KAMERA', icon: '📷', good: true },

  { label: 'OPEKAČ', icon: '🍞', good: false },
  { label: 'ČEVELJ', icon: '👞', good: false },
  { label: 'AKVARIJ', icon: '🐠', good: false },
  { label: 'BANANA', icon: '🍌', good: false },
  { label: 'WC ŠČETKA', icon: '🧹', good: false },
  { label: 'PICA', icon: '🍕', good: false },
  { label: 'MEDVEDEK', icon: '🧸', good: false },
  { label: 'KAKTUS', icon: '🌵', good: false }
];

let catchRunning = false;
let catchAnimationFrame = null;
let catchLastTime = 0;
let catchSpawnTimer = 0;
let catchPlayerX = 50;
let catchKeys = { left: false, right: false };
let catchObjects = [];
let catchScoreValue = 0;
let catchMistakeValue = 0;
let catchStartTime = 0;
const catchTargetScore = 10;

function resetCatchGame() {
  stopCatchGame();
  catchObjects.forEach((obj) => obj.el.remove());
  catchObjects = [];
  catchScoreValue = 0;
  catchMistakeValue = 0;
  catchPlayerX = 50;
  catchSpawnTimer = 0;
  catchLastTime = 0;

  const game = document.getElementById('catchGame');
  const player = document.getElementById('catchPlayer');
  const overlay = document.getElementById('catchStartOverlay');
  if (!game || !player || !overlay) return;

  game.classList.remove('win', 'hit');
  player.style.left = '50%';
  overlay.classList.remove('hidden');
  document.getElementById('catchScore').textContent = `0 / ${catchTargetScore}`;
  document.getElementById('catchMistakes').textContent = '0';

  const f = document.getElementById('taskFeedback');
  f.textContent = 'Zberi 10 točk. Vse, kar spada k računalniku, prinese +1; ostali predmeti −1. Točke ne morejo pasti pod 0.';
  f.className = 'feedback';
}

function startCatchGame() {
  if (modules[0].status === 'complete') return;

  resetCatchGame();
  document.getElementById('catchStartOverlay').classList.add('hidden');
  document.getElementById('catchGame').focus();

  catchRunning = true;
  catchStartTime = performance.now();
  catchLastTime = catchStartTime;
  catchAnimationFrame = requestAnimationFrame(catchGameLoop);
}

function stopCatchGame() {
  catchRunning = false;
  if (catchAnimationFrame) cancelAnimationFrame(catchAnimationFrame);
  catchAnimationFrame = null;
  catchKeys.left = false;
  catchKeys.right = false;
}

function spawnCatchItem() {
  const game = document.getElementById('catchGame');
  if (!game) return;

  const elapsed = catchStartTime ? (performance.now() - catchStartTime) / 1000 : 0;
  let goodChance = 0.30;
  if (elapsed >= 18) goodChance = 0.45;
  if (elapsed >= 26) goodChance = 0.68;
  if (elapsed >= 34) goodChance = 1;

  const goodItems = catchItems.filter((item) => item.good);
  const badItems = catchItems.filter((item) => !item.good);
  const source = Math.random() < goodChance ? goodItems : badItems;
  const item = source[Math.floor(Math.random() * source.length)];
  const el = document.createElement('div');
  el.className = `falling-item ${item.good ? 'good' : 'bad'}`;
  el.innerHTML = `<span class="fall-icon">${item.icon}</span><span class="fall-label">${item.label}</span>`;

  const maxX = Math.max(20, game.clientWidth - 94);
  const x = 10 + Math.random() * maxX;
  el.style.left = `${x}px`;
  el.style.top = '-70px';
  game.appendChild(el);

  catchObjects.push({
    el,
    x,
    y: -70,
    speed: 150 + Math.random() * 65,
    good: item.good,
    label: item.label,
    hit: false
  });
}

function catchGameLoop(now) {
  if (!catchRunning) return;

  const game = document.getElementById('catchGame');
  const player = document.getElementById('catchPlayer');
  if (!game || !player) return;

  const dt = Math.min((now - catchLastTime) / 1000, .035);
  catchLastTime = now;

  const moveSpeed = 55;
  if (catchKeys.left) catchPlayerX -= moveSpeed * dt;
  if (catchKeys.right) catchPlayerX += moveSpeed * dt;
  catchPlayerX = Math.max(7, Math.min(93, catchPlayerX));
  player.style.left = `${catchPlayerX}%`;

  catchSpawnTimer += dt;
  if (catchSpawnTimer >= .72) {
    catchSpawnTimer = 0;
    spawnCatchItem();
  }

  const gameRect = game.getBoundingClientRect();
  const playerRect = player.getBoundingClientRect();

  catchObjects.forEach((obj) => {
    if (obj.hit) return;
    obj.y += obj.speed * dt;
    obj.el.style.top = `${obj.y}px`;

    const rect = obj.el.getBoundingClientRect();
    const overlaps =
      rect.right > playerRect.left &&
      rect.left < playerRect.right &&
      rect.bottom > playerRect.top &&
      rect.top < playerRect.bottom;

    if (overlaps) {
      obj.hit = true;
      if (obj.good) {
        obj.el.classList.add('caught-good');
        catchScoreValue += 1;
        document.getElementById('catchScore').textContent = `${catchScoreValue} / ${catchTargetScore}`;
        document.getElementById('taskFeedback').textContent = `+1: ${obj.label}. Do cilja še ${Math.max(0, catchTargetScore - catchScoreValue)}.`;
        document.getElementById('taskFeedback').className = 'feedback success';

        if (catchScoreValue >= catchTargetScore) {
          finishCatchGame();
        }
      } else {
        obj.el.classList.add('caught-bad');
        catchMistakeValue += 1;
        catchScoreValue = Math.max(0, catchScoreValue - 1);
        document.getElementById('catchMistakes').textContent = String(catchMistakeValue);
        document.getElementById('catchScore').textContent = `${catchScoreValue} / ${catchTargetScore}`;
        game.classList.remove('hit');
        void game.offsetWidth;
        game.classList.add('hit');
        document.getElementById('taskFeedback').textContent = `−1: ${obj.label} ne spada k računalniški opremi. Nadaljuj!`;
        document.getElementById('taskFeedback').className = 'feedback error';
        document.getElementById('raviTaskText').textContent =
          catchMistakeValue === 1
            ? '»To ni komponenta. Ampak cenim ustvarjalnost.«'
            : '»Osredotoči se na dele računalnika. Kuhinjski aparati imajo prost dan.«';
      }

      setTimeout(() => obj.el.remove(), 280);
    }

    if (obj.y > gameRect.height + 80) {
      obj.hit = true;
      obj.el.remove();
    }
  });

  catchObjects = catchObjects.filter((obj) => !obj.hit);

  if (catchRunning) catchAnimationFrame = requestAnimationFrame(catchGameLoop);
}

function finishCatchGame() {
  if (modules[0].status === 'complete') return;

  stopCatchGame();
  modules[0].status = 'complete';
  modules[1].status = 'ready';
  completed = Math.max(completed, 1);

  const game = document.getElementById('catchGame');
  game.classList.add('win');

  document.getElementById('taskFeedback').textContent = 'MODUL 1 AKTIVIRAN ✓ Zbral si 10 točk in dostavil dovolj računalniške opreme.';
  document.getElementById('taskFeedback').className = 'feedback success';
  document.getElementById('raviTaskText').textContent = '»Odlično. Računalnik ima vse, kar potrebuje. Akvarij pa je ostal tam, kjer mora biti.«';
  document.getElementById('hubMessage').textContent = 'Napajanje in strojna oprema sta aktivna. Programiranje je odklenjeno.';

  updateProgress();
  renderModules();
  setTimeout(() => showScreen('screenHub'), 1900);
}

function handleCatchKeyDown(event) {
  if (!catchRunning) return;
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') event.preventDefault();
  if (event.key === 'ArrowLeft') catchKeys.left = true;
  if (event.key === 'ArrowRight') catchKeys.right = true;
}

function handleCatchKeyUp(event) {
  if (event.key === 'ArrowLeft') catchKeys.left = false;
  if (event.key === 'ArrowRight') catchKeys.right = false;
}


const programGridSize = 5;
const programStart = { x: 0, y: 4, dir: 0 };
const programGoal = { x: 4, y: 1 };
const programObstacles = new Set(['0,2', '1,2', '3,3', '3,2', '4,2', '1,1', '2,0']);
const programSolution = ['F','R','F','F','L','F','F','R','F','F'];
const programMaxCommands = 10;

let programCommands = [];
let programRobot = { ...programStart };
let programRunning = false;
let programAttempts = 0;

function renderProgramBoard() {
  const board = document.getElementById('programBoard');
  if (!board) return;
  board.innerHTML = '';

  for (let y = 0; y < programGridSize; y += 1) {
    for (let x = 0; x < programGridSize; x += 1) {
      const cell = document.createElement('div');
      cell.className = 'program-cell';
      if (programObstacles.has(`${x},${y}`)) cell.classList.add('obstacle');
      if (x === programGoal.x && y === programGoal.y) cell.classList.add('goal');

      if (x === programRobot.x && y === programRobot.y) {
        const ravi = document.createElement('div');
        ravi.className = `program-ravi dir-${programRobot.dir}`;
        ravi.id = 'programRobot';
        cell.appendChild(ravi);
      }

      board.appendChild(cell);
    }
  }
}

function renderProgramSequence(activeIndex = -1) {
  const container = document.getElementById('programSequence');
  if (!container) return;
  container.innerHTML = '';

  const labels = { F: '↑', L: '↶', R: '↷' };
  programCommands.forEach((command, index) => {
    const item = document.createElement('span');
    item.className = 'program-command';
    if (index === activeIndex) item.classList.add('running');
    item.textContent = labels[command];
    container.appendChild(item);
  });

  document.getElementById('programCount').textContent = `${programCommands.length} / ${programMaxCommands}`;
}

function resetProgramGame() {
  programRunning = false;
  programCommands = [];
  programRobot = { ...programStart };
  renderProgramBoard();
  renderProgramSequence();

  const feedback2 = document.getElementById('task2Feedback');
  if (feedback2) {
    feedback2.textContent = 'Sestavi program s puščicami. RAVI se bo premaknil šele, ko ga zaženeš.';
    feedback2.className = 'feedback';
  }
}

function clearProgramGame() {
  if (programRunning || modules[1].status === 'complete') return;
  programCommands = [];
  programRobot = { ...programStart };
  renderProgramBoard();
  renderProgramSequence();
  document.getElementById('task2Feedback').textContent = 'Program je počiščen.';
  document.getElementById('task2Feedback').className = 'feedback';
  document.getElementById('programBoard').focus();
}

function addProgramCommand(command) {
  if (programRunning || modules[1].status === 'complete') return;
  if (programCommands.length >= programMaxCommands) {
    const feedback2 = document.getElementById('task2Feedback');
    feedback2.textContent = 'Program ima lahko največ 10 ukazov. Poskusi s krajšim zaporedjem.';
    feedback2.className = 'feedback error';
    return;
  }

  programCommands.push(command);
  renderProgramSequence();
}

function handleProgramKey(event) {
  const screen = document.getElementById('screenTask2');
  if (!screen || !screen.classList.contains('active')) return;
  if (programRunning || modules[1].status === 'complete') return;

  if (['ArrowUp','ArrowLeft','ArrowRight','Enter','Backspace'].includes(event.key)) {
    event.preventDefault();
  }

  if (event.key === 'ArrowUp') addProgramCommand('F');
  if (event.key === 'ArrowLeft') addProgramCommand('L');
  if (event.key === 'ArrowRight') addProgramCommand('R');
  if (event.key === 'Backspace') {
    programCommands.pop();
    renderProgramSequence();
  }
  if (event.key === 'Enter') runProgramGame();
}

function nextProgramPosition(robot, command) {
  const next = { ...robot };

  if (command === 'L') {
    next.dir = (next.dir + 3) % 4;
    return { robot: next, valid: true };
  }

  if (command === 'R') {
    next.dir = (next.dir + 1) % 4;
    return { robot: next, valid: true };
  }

  const vectors = [
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 }
  ];
  const v = vectors[next.dir];
  const tx = next.x + v.x;
  const ty = next.y + v.y;
  const blocked =
    tx < 0 || ty < 0 || tx >= programGridSize || ty >= programGridSize ||
    programObstacles.has(`${tx},${ty}`);

  if (blocked) return { robot: next, valid: false };

  next.x = tx;
  next.y = ty;
  return { robot: next, valid: true };
}

function sleepProgram(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runProgramGame() {
  if (programRunning || modules[1].status === 'complete') return;

  const feedback2 = document.getElementById('task2Feedback');
  const ravi2 = document.getElementById('raviTask2Text');

  if (programCommands.length === 0) {
    feedback2.textContent = 'Najprej sestavi vsaj en ukaz.';
    feedback2.className = 'feedback error';
    return;
  }

  programRunning = true;
  programRobot = { ...programStart };
  renderProgramBoard();

  let crashed = false;

  for (let i = 0; i < programCommands.length; i += 1) {
    renderProgramSequence(i);
    const result = nextProgramPosition(programRobot, programCommands[i]);

    if (!result.valid) {
      crashed = true;
      const robotEl = document.getElementById('programRobot');
      if (robotEl) robotEl.classList.add('bump');
      await sleepProgram(320);
      break;
    }

    programRobot = result.robot;
    renderProgramBoard();
    await sleepProgram(360);
  }

  renderProgramSequence();

  const reachedGoal = programRobot.x === programGoal.x && programRobot.y === programGoal.y;

  if (reachedGoal) {
    modules[1].status = 'complete';
    modules[2].status = 'ready';
    completed = Math.max(completed, 2);

    feedback2.textContent = 'MODUL 2 AKTIVIRAN ✓ Program je RAVI-ja uspešno pripeljal do cilja.';
    feedback2.className = 'feedback success';
    ravi2.textContent = '»Program izveden. Prišel sem do cilja in niti enkrat nisem improviziral. Skoraj.«';
    document.getElementById('hubMessage').textContent = 'Programski modul je aktiven. Spletne aplikacije so odklenjene.';

    updateProgress();
    renderModules();
    programRunning = false;
    setTimeout(() => showScreen('screenHub'), 1900);
    return;
  }

  programAttempts += 1;
  programRunning = false;
  programRobot = { ...programStart };
  renderProgramBoard();

  feedback2.className = 'feedback error';

  if (crashed && programAttempts === 1) {
    feedback2.textContent = 'RAVI je trčil v oviro. Obrat spremeni smer, ukaz ↑ pa ga premakne naprej.';
    ravi2.textContent = '»Stena potrjena. Zelo trdna. Poskusi me obrniti malo prej.«';
  } else if (programAttempts === 1) {
    feedback2.textContent = 'Program se je izvedel, vendar RAVI ni prišel do cilja. Popravi zaporedje.';
    ravi2.textContent = '»Program sem ubogal do zadnjega ukaza. Cilj pa je očitno imel druge načrte.«';
  } else if (programAttempts === 2) {
    feedback2.textContent = 'Namig: RAVI je na začetku obrnjen NAVZGOR. Začni z NAPREJ, nato boš moral precej hitro narediti DESNI OBRAT.';
    ravi2.textContent = '»Na začetku gledam navzgor. OBRAT spremeni samo smer, NAPREJ pa me premakne. Tokrat bo treba malo cik-cak.«';
  } else {
    programCommands = [...programSolution];
    renderProgramSequence();
    feedback2.textContent = 'RAVI pomoč: pravilen program sem pripravil. Pritisni ENTER in ga zaženi.';
    ravi2.textContent = '»Program je pripravljen. Zdaj samo še pritisni ENTER, da preveriva, ali sem ga prav prebral.«';
  }
}

function renderProgramOrder() {
  const container = document.getElementById('codeOrder');
  if (!container) return;
  container.innerHTML = '';

  currentProgramOrder.forEach((stepId, index) => {
    const step = programSteps.find((item) => item.id === stepId);
    const row = document.createElement('div');
    row.className = 'code-step';

    row.innerHTML = `
      <span class="code-step-number">${index + 1}</span>
      <span class="code-step-text">${step.text}</span>
      <span class="code-step-controls">
        <button class="move-btn move-up" type="button" aria-label="Premakni ukaz gor" ${index === 0 ? 'disabled' : ''}>↑</button>
        <button class="move-btn move-down" type="button" aria-label="Premakni ukaz dol" ${index === currentProgramOrder.length - 1 ? 'disabled' : ''}>↓</button>
      </span>
    `;

    row.querySelector('.move-up').addEventListener('click', () => moveProgramStep(index, -1));
    row.querySelector('.move-down').addEventListener('click', () => moveProgramStep(index, 1));
    container.appendChild(row);
  });
}

function moveProgramStep(index, direction) {
  if (modules[1].status === 'complete') return;

  const target = index + direction;
  if (target < 0 || target >= currentProgramOrder.length) return;

  const temp = currentProgramOrder[index];
  currentProgramOrder[index] = currentProgramOrder[target];
  currentProgramOrder[target] = temp;

  document.getElementById('task2Feedback').textContent = '';
  document.getElementById('task2Feedback').className = 'feedback';
  renderProgramOrder();
}

function resetTask2() {
  if (modules[1].status === 'complete') return;

  const rotations = [
    ['hello', 'load', 'check', 'power'],
    ['load', 'hello', 'power', 'check'],
    ['power', 'hello', 'check', 'load']
  ];

  const currentIndex = rotations.findIndex(
    (order) => order.join('|') === currentProgramOrder.join('|')
  );

  currentProgramOrder = [...rotations[(currentIndex + 1) % rotations.length]];
  renderProgramOrder();

  const feedback2 = document.getElementById('task2Feedback');
  feedback2.textContent = 'Ukazi so ponovno premešani.';
  feedback2.className = 'feedback';
}

function checkTask2() {
  if (modules[1].status === 'complete') return;

  task2Attempts += 1;
  const feedback2 = document.getElementById('task2Feedback');
  const ravi2 = document.getElementById('raviTask2Text');
  const isCorrect = currentProgramOrder.every(
    (stepId, index) => stepId === correctProgramOrder[index]
  );

  if (isCorrect) {
    modules[1].status = 'complete';
    modules[2].status = 'ready';
    completed = Math.max(completed, 2);

    document.querySelectorAll('#codeOrder .code-step').forEach((row) => {
      row.classList.add('correct');
    });

    feedback2.textContent = 'MODUL 2 AKTIVIRAN ✓ Program se izvede v pravilnem vrstnem redu.';
    feedback2.className = 'feedback success';
    ravi2.textContent = '»Koda teče. Brez dima. To štejem kot uspeh.«';
    document.getElementById('hubMessage').textContent = 'Programski modul je aktiven. Spletne aplikacije so odklenjene.';

    updateProgress();
    renderModules();
    setTimeout(() => showScreen('screenHub'), 1700);
    return;
  }

  feedback2.className = 'feedback error';

  if (task2Attempts === 1) {
    feedback2.textContent = 'Vrstni red še ni pravilen. Pomisli, kaj se mora zgoditi najprej.';
    ravi2.textContent = '»To je približno tako, kot da bi hotel odpreti igro, preden prižgeš računalnik.«';
  } else if (task2Attempts === 2) {
    feedback2.textContent = 'Namig: najprej preveri napajanje, nato vključi sistem.';
    ravi2.textContent = '»Najprej preveriva, ali sploh imam energijo. Šele potem me lahko vključiš.«';
  } else {
    feedback2.textContent = 'Močan namig: PREVERI NAPAJANJE → VKLOPI SISTEM → NALOŽI PROGRAM → PRIKAŽI SPOROČILO.';
    ravi2.textContent = '»V redu, skoraj ti povem celo rešitev. Samo pravilno jo razporedi.«';

    document.querySelectorAll('#codeOrder .code-step').forEach((row, index) => {
      if (currentProgramOrder[index] === correctProgramOrder[index]) row.classList.add('hint');
    });
  }
}


let task3Attempts = 0;

function checkTask3() {
  if (modules[2].status === 'complete') return;

  const selects = [...document.querySelectorAll('.html-select')];
  const feedback3 = document.getElementById('task3Feedback');
  const ravi3 = document.getElementById('raviTask3Text');

  if (selects.some((select) => select.value === '')) {
    feedback3.textContent = 'Najprej izberi oznako pri vseh štirih elementih.';
    feedback3.className = 'feedback error';
    return;
  }

  task3Attempts += 1;
  let correctCount = 0;

  selects.forEach((select) => {
    select.classList.remove('correct', 'wrong');
    if (select.value === select.dataset.answer) {
      select.classList.add('correct');
      correctCount += 1;
    } else {
      select.classList.add('wrong');
    }
  });

  if (correctCount === selects.length) {
    modules[2].status = 'complete';
    modules[3].status = 'ready';
    completed = Math.max(completed, 3);

    feedback3.textContent = 'MODUL 3 AKTIVIRAN ✓ Spletna stran je spet pravilno sestavljena.';
    feedback3.className = 'feedback success';
    ravi3.textContent = '»Stran spet deluje. Internet je lahko miren.«';
    document.getElementById('hubMessage').textContent = 'Spletni modul je aktiven. Upravljanje s podatki je odklenjeno.';

    updateProgress();
    renderModules();
    setTimeout(() => showScreen('screenHub'), 1700);
    return;
  }

  feedback3.className = 'feedback error';

  if (task3Attempts === 1) {
    feedback3.textContent = `Pravilno: ${correctCount}/4. Poglej elemente še enkrat.`;
    ravi3.textContent = '»Skoraj. Če tole pustiva tako, bo moja slika postala naslov. Kar je samozavestno, ampak napačno.«';
  } else if (task3Attempts === 2) {
    feedback3.textContent = 'Namig: <img> je slika, <h1> pa glavni naslov.';
    ravi3.textContent = '»Začni pri očitnem: slika potrebuje <img>, velik naslov pa <h1>.«';
  } else {
    feedback3.textContent = 'Močan namig: naslov = <h1>, slika = <img>, besedilo = <p>, gumb = <button>.';
    ravi3.textContent = '»V redu, HTML rešitev je praktično pred tabo. Samo še poveži.«';
  }
}

function resetTask3() {
  if (modules[2].status === 'complete') return;

  document.querySelectorAll('.html-select').forEach((select) => {
    select.value = '';
    select.classList.remove('correct', 'wrong');
  });

  const feedback3 = document.getElementById('task3Feedback');
  feedback3.textContent = '';
  feedback3.className = 'feedback';
}



let htmlDraggedTag = null;
let htmlSelectedTag = null;
let htmlFixedCount = 0;
let htmlRepairAttempts = 0;

function resetHtmlRepairGame() {
  htmlDraggedTag = null;
  htmlSelectedTag = null;
  htmlFixedCount = 0;
  htmlRepairAttempts = 0;

  document.querySelectorAll('.repair-zone').forEach((zone) => {
    zone.classList.remove('fixed', 'wrong', 'drag-over');
  });

  document.querySelectorAll('.html-tag').forEach((tag) => {
    tag.classList.remove('used', 'selected', 'dragging');
    tag.disabled = false;
  });

  const count = document.getElementById('htmlRepairCount');
  if (count) count.textContent = '0 / 4';

  const feedback3 = document.getElementById('task3Feedback');
  if (feedback3) {
    feedback3.textContent = 'Povleci HTML oznako na pravi del spletne strani.';
    feedback3.className = 'feedback';
  }

  const ravi3 = document.getElementById('raviTask3Text');
  if (ravi3) {
    ravi3.textContent = '»Moja spletna stran je razpadla na štiri dele. Povleci pravo HTML oznako na pravi element in jo sestavi nazaj.«';
  }
}

function selectHtmlTag(tagButton) {
  if (tagButton.classList.contains('used') || modules[2].status === 'complete') return;

  document.querySelectorAll('.html-tag').forEach((tag) => tag.classList.remove('selected'));
  htmlSelectedTag = tagButton.dataset.tag;
  tagButton.classList.add('selected');

  const feedback3 = document.getElementById('task3Feedback');
  feedback3.textContent = `Izbrana oznaka: <${htmlSelectedTag}>. Zdaj klikni pravi del strani ali jo povleci nanj.`;
  feedback3.className = 'feedback';
}

function tryHtmlRepair(tag, zone) {
  if (!tag || !zone || zone.classList.contains('fixed') || modules[2].status === 'complete') return;

  const feedback3 = document.getElementById('task3Feedback');
  const ravi3 = document.getElementById('raviTask3Text');
  const correct = zone.dataset.answer === tag;

  if (correct) {
    zone.classList.remove('wrong', 'drag-over');
    zone.classList.add('fixed');
    htmlFixedCount += 1;

    const tagButton = document.querySelector(`.html-tag[data-tag="${tag}"]`);
    if (tagButton) {
      tagButton.classList.remove('selected', 'dragging');
      tagButton.classList.add('used');
      tagButton.disabled = true;
    }

    htmlSelectedTag = null;
    htmlDraggedTag = null;

    document.getElementById('htmlRepairCount').textContent = `${htmlFixedCount} / 4`;
    feedback3.textContent = `Pravilno: <${tag}>. Del strani je popravljen.`;
    feedback3.className = 'feedback success';

    if (htmlFixedCount >= 4) {
      finishHtmlRepairGame();
    }
    return;
  }

  htmlRepairAttempts += 1;
  zone.classList.remove('wrong');
  void zone.offsetWidth;
  zone.classList.add('wrong');
  feedback3.className = 'feedback error';

  if (htmlRepairAttempts === 1) {
    feedback3.textContent = `<${tag}> ne sodi sem. Poskusi drug element.`;
    ravi3.textContent = '»HTML je precej dobeseden. Če oznaka ne ustreza elementu, stran hitro postane čudna.«';
  } else if (htmlRepairAttempts === 2) {
    feedback3.textContent = 'Namig: <h1> je naslov, <img> slika, <p> odstavek, <button> pa gumb.';
    ravi3.textContent = '»Naslov, slika, odstavek, gumb. Štiri zelo različne naloge, štiri različne oznake.«';
  } else {
    const answer = zone.dataset.answer;
    feedback3.textContent = `Močan namig: ta del potrebuje <${answer}>.`;
    ravi3.textContent = '»Zdaj ti že skoraj rišem zemljevid. Uporabi oznako, ki ti jo namig pokaže.«';
  }

  setTimeout(() => zone.classList.remove('wrong'), 350);
}

function finishHtmlRepairGame() {
  modules[2].status = 'complete';
  modules[3].status = 'ready';
  completed = Math.max(completed, 3);

  const feedback3 = document.getElementById('task3Feedback');
  const ravi3 = document.getElementById('raviTask3Text');

  feedback3.textContent = 'MODUL 3 AKTIVIRAN ✓ Spletna stran je pravilno sestavljena.';
  feedback3.className = 'feedback success';
  ravi3.textContent = '»Odlično. Naslov je naslov, slika je slika in gumb je spet dejansko gumb. Splet diha.«';
  document.getElementById('hubMessage').textContent = 'Spletni modul je aktiven. Upravljanje s podatki je odklenjeno.';

  updateProgress();
  renderModules();
  setTimeout(() => showScreen('screenHub'), 1900);
}

function initHtmlRepairGame() {
  document.querySelectorAll('.html-tag').forEach((tagButton) => {
    tagButton.addEventListener('dragstart', (event) => {
      if (tagButton.classList.contains('used')) {
        event.preventDefault();
        return;
      }
      htmlDraggedTag = tagButton.dataset.tag;
      tagButton.classList.add('dragging');
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', htmlDraggedTag);
      }
    });

    tagButton.addEventListener('dragend', () => {
      tagButton.classList.remove('dragging');
      htmlDraggedTag = null;
      document.querySelectorAll('.repair-zone').forEach((zone) => zone.classList.remove('drag-over'));
    });

    tagButton.addEventListener('click', () => selectHtmlTag(tagButton));
  });

  document.querySelectorAll('.repair-zone').forEach((zone) => {
    zone.addEventListener('dragover', (event) => {
      if (zone.classList.contains('fixed')) return;
      event.preventDefault();
      zone.classList.add('drag-over');
      if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
    });

    zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));

    zone.addEventListener('drop', (event) => {
      event.preventDefault();
      zone.classList.remove('drag-over');
      const tag = htmlDraggedTag || (event.dataTransfer ? event.dataTransfer.getData('text/plain') : null);
      tryHtmlRepair(tag, zone);
    });

    zone.addEventListener('click', () => {
      if (htmlSelectedTag) tryHtmlRepair(htmlSelectedTag, zone);
    });
  });
}

const dataRecords = [
  { id: 'ana', ime: 'Ana', program: 'Računalništvo', letnik: '1.' },
  { id: 'miha', ime: 'Miha', program: 'Elektrotehnika', letnik: '2.' },
  { id: 'luka', ime: 'Luka', program: 'Računalništvo', letnik: '3.' },
  { id: 'eva', ime: 'Eva', program: 'Strojništvo', letnik: '1.' }
];
let selectedDataRow = null;
let task4Attempts = 0;

function renderDataRows() {
  const tbody = document.getElementById('dataRows');
  tbody.innerHTML = '';

  dataRecords.forEach((record) => {
    const row = document.createElement('tr');
    row.className = 'data-row';
    row.dataset.id = record.id;
    row.tabIndex = 0;
    row.innerHTML = `
      <td>${record.ime}</td>
      <td>${record.program}</td>
      <td>${record.letnik}</td>
    `;

    const choose = () => {
      if (modules[3].status === 'complete') return;
      selectedDataRow = record.id;
      document.querySelectorAll('.data-row').forEach((item) => {
        item.classList.remove('selected', 'wrong');
      });
      row.classList.add('selected');
      const feedback4 = document.getElementById('task4Feedback');
      feedback4.textContent = `Izbran zapis: ${record.ime}`;
      feedback4.className = 'feedback';
    };

    row.addEventListener('click', choose);
    row.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        choose();
      }
    });

    tbody.appendChild(row);
  });
}

function checkTask4() {
  if (modules[3].status === 'complete') return;

  const feedback4 = document.getElementById('task4Feedback');
  const ravi4 = document.getElementById('raviTask4Text');

  if (!selectedDataRow) {
    feedback4.textContent = 'Najprej izberi en zapis v tabeli.';
    feedback4.className = 'feedback error';
    return;
  }

  task4Attempts += 1;
  const selectedRecord = dataRecords.find((record) => record.id === selectedDataRow);
  const isCorrect = selectedRecord.program === 'Računalništvo' && selectedRecord.letnik === '3.';

  const selectedRow = document.querySelector(`.data-row[data-id="${selectedDataRow}"]`);
  selectedRow.classList.remove('selected');

  if (isCorrect) {
    selectedRow.classList.add('correct');
    modules[3].status = 'complete';
    modules[4].status = 'ready';
    completed = Math.max(completed, 4);

    feedback4.textContent = 'MODUL 4 AKTIVIRAN ✓ Našel si pravi zapis.';
    feedback4.className = 'feedback success';
    ravi4.textContent = '»To je to. Podatki niso uporabni, če jih ne znaš pravilno poiskati.«';
    document.getElementById('hubMessage').textContent = 'Podatkovni modul je aktiven. Računalniška omrežja so odklenjena.';

    updateProgress();
    renderModules();
    setTimeout(() => showScreen('screenHub'), 1700);
    return;
  }

  selectedRow.classList.add('wrong');
  feedback4.className = 'feedback error';

  if (task4Attempts === 1) {
    feedback4.textContent = 'To ni pravi zapis. Preveri oba pogoja.';
    ravi4.textContent = '»Podatek sem našel. Samo napačnega. To je pri podatkih kar pomembna podrobnost.«';
  } else if (task4Attempts === 2) {
    feedback4.textContent = 'Namig: iščeš program Računalništvo IN 3. letnik.';
    ravi4.textContent = '»Ne zadostuje samo pravi program. Tudi letnik mora biti pravi.«';
  } else {
    feedback4.textContent = 'Močan namig: poišči Luka – Računalništvo – 3. letnik.';
    ravi4.textContent = '»V redu: Luka. Računalništvo. Tretji letnik. Zdaj sva res blizu.«';
  }
}

function resetTask4() {
  if (modules[3].status === 'complete') return;

  selectedDataRow = null;
  document.querySelectorAll('.data-row').forEach((row) => {
    row.classList.remove('selected', 'wrong', 'correct');
  });

  const feedback4 = document.getElementById('task4Feedback');
  feedback4.textContent = '';
  feedback4.className = 'feedback';
}


const networkDevices = [
  { id: 'pc', name: 'RAČUNALNIK', icon: '💻' },
  { id: 'router', name: 'USMERJEVALNIK', icon: '📡' },
  { id: 'internet', name: 'INTERNET', icon: '🌐' },
  { id: 'ravi', name: 'RAVI', icon: '🤖' }
];
const correctNetworkOrder = ['pc', 'router', 'internet', 'ravi'];
let currentNetworkOrder = ['ravi', 'pc', 'internet', 'router'];
let task5Attempts = 0;

function renderNetworkOrder() {
  const container = document.getElementById('networkOrder');
  container.innerHTML = '';

  currentNetworkOrder.forEach((deviceId, index) => {
    const device = networkDevices.find((item) => item.id === deviceId);
    const node = document.createElement('div');
    node.className = 'network-node';

    node.innerHTML = `
      <span class="network-icon">${device.icon}</span>
      <span class="network-name">${device.name}</span>
      <span class="network-controls">
        <button class="move-btn network-left" type="button" aria-label="Premakni napravo levo" ${index === 0 ? 'disabled' : ''}>←</button>
        <button class="move-btn network-right" type="button" aria-label="Premakni napravo desno" ${index === currentNetworkOrder.length - 1 ? 'disabled' : ''}>→</button>
      </span>
    `;

    node.querySelector('.network-left').addEventListener('click', () => moveNetworkDevice(index, -1));
    node.querySelector('.network-right').addEventListener('click', () => moveNetworkDevice(index, 1));
    container.appendChild(node);
  });
}

function moveNetworkDevice(index, direction) {
  if (modules[4].status === 'complete') return;

  const target = index + direction;
  if (target < 0 || target >= currentNetworkOrder.length) return;

  const temp = currentNetworkOrder[index];
  currentNetworkOrder[index] = currentNetworkOrder[target];
  currentNetworkOrder[target] = temp;

  const feedback5 = document.getElementById('task5Feedback');
  feedback5.textContent = '';
  feedback5.className = 'feedback';
  renderNetworkOrder();
}

function resetTask5() {
  if (modules[4].status === 'complete') return;

  const variants = [
    ['ravi', 'pc', 'internet', 'router'],
    ['internet', 'ravi', 'router', 'pc'],
    ['router', 'ravi', 'pc', 'internet']
  ];
  const currentIndex = variants.findIndex((order) => order.join('|') === currentNetworkOrder.join('|'));
  currentNetworkOrder = [...variants[(currentIndex + 1) % variants.length]];
  renderNetworkOrder();

  const feedback5 = document.getElementById('task5Feedback');
  feedback5.textContent = 'Naprave so ponovno premešane.';
  feedback5.className = 'feedback';
}

function checkTask5() {
  if (modules[4].status === 'complete') return;

  task5Attempts += 1;
  const feedback5 = document.getElementById('task5Feedback');
  const ravi5 = document.getElementById('raviTask5Text');
  const isCorrect = currentNetworkOrder.every(
    (deviceId, index) => deviceId === correctNetworkOrder[index]
  );

  if (isCorrect) {
    document.querySelectorAll('#networkOrder .network-node').forEach((node) => node.classList.add('correct'));
    modules[4].status = 'complete';
    modules[5].status = 'ready';
    completed = Math.max(completed, 5);

    feedback5.textContent = 'MODUL 5 AKTIVIRAN ✓ Povezava je vzpostavljena.';
    feedback5.className = 'feedback success';
    ravi5.textContent = '»Povezava vzpostavljena. Spet sem na spletu. Digitalna samota preklicana.«';
    document.getElementById('hubMessage').textContent = 'Omrežni modul je aktiven. Varnost in zaščita sta odklenjeni.';

    updateProgress();
    renderModules();
    setTimeout(() => showScreen('screenHub'), 1700);
    return;
  }

  feedback5.className = 'feedback error';

  if (task5Attempts === 1) {
    feedback5.textContent = 'Povezava še ni pravilna. Pomisli, skozi katero napravo gre računalnik na internet.';
    ravi5.textContent = '»Ta povezava vodi nekam, ampak žal ne tja, kamor bi morala.«';
  } else if (task5Attempts === 2) {
    feedback5.textContent = 'Namig: računalnik se najprej poveže z usmerjevalnikom.';
    ravi5.textContent = '»Začni z računalnikom in usmerjevalnikom. Od tam naprej bo lažje.«';
  } else {
    feedback5.textContent = 'Močan namig: RAČUNALNIK → USMERJEVALNIK → INTERNET → RAVI.';
    ravi5.textContent = '»V redu, kabelska skrivnost je razkrita. Samo še pravilno razporedi.«';

    document.querySelectorAll('#networkOrder .network-node').forEach((node, index) => {
      if (currentNetworkOrder[index] === correctNetworkOrder[index]) node.classList.add('hint');
    });
  }
}


let selectedSecurityChoice = null;
let task6Attempts = 0;

function selectSecurityChoice(choice) {
  if (modules[5].status === 'complete') return;

  selectedSecurityChoice = choice;
  document.querySelectorAll('.security-btn').forEach((button) => {
    button.classList.toggle('selected', button.dataset.choice === choice);
    button.classList.remove('wrong');
  });

  const feedback6 = document.getElementById('task6Feedback');
  feedback6.textContent = choice === 'safe' ? 'Izbrano: varno sporočilo.' : 'Izbrano: sumljivo sporočilo.';
  feedback6.className = 'feedback';
}

function checkTask6() {
  if (modules[5].status === 'complete') return;

  const feedback6 = document.getElementById('task6Feedback');
  const ravi6 = document.getElementById('raviTask6Text');

  if (!selectedSecurityChoice) {
    feedback6.textContent = 'Najprej izberi eno možnost.';
    feedback6.className = 'feedback error';
    return;
  }

  task6Attempts += 1;
  const selectedButton = document.querySelector(`.security-btn[data-choice="${selectedSecurityChoice}"]`);

  if (selectedSecurityChoice === 'phishing') {
    selectedButton.classList.add('correct');
    modules[5].status = 'complete';
    modules[6].status = 'ready';
    completed = Math.max(completed, 6);

    feedback6.textContent = 'MODUL 6 AKTIVIRAN ✓ Prevaro si pravilno prepoznal.';
    feedback6.className = 'feedback success';
    ravi6.textContent = '»Napad blokiran. Moj račun ostaja moj. Geslo pa tudi.«';
    document.getElementById('hubMessage').textContent = 'Varnostni modul je aktiven. Računalniško oblikovanje je odklenjeno.';

    updateProgress();
    renderModules();
    setTimeout(() => showScreen('screenHub'), 1700);
    return;
  }

  selectedButton.classList.add('wrong');
  feedback6.className = 'feedback error';

  if (task6Attempts === 1) {
    feedback6.textContent = 'Poglej sporočilo še enkrat. Nekaj znakov je precej sumljivih.';
    ravi6.textContent = '»Če komu pošljem geslo, bom mogoče res postal zelo odprt sistem. Preveč odprt.«';
  } else if (task6Attempts === 2) {
    feedback6.textContent = 'Namig: preveri naslov pošiljatelja, časovni pritisk in zahtevo po geslu.';
    ravi6.textContent = '»Čuden naslov, grožnja z izbrisom in zahteva po geslu. To ni najbolj miren e-mail.«';
  } else {
    feedback6.textContent = 'Močan namig: to je phishing oziroma sumljivo sporočilo.';
    ravi6.textContent = '»Tole je prevara. Klikni sumljivo sporočilo in rešiva moj račun.«';
  }
}

function resetTask6() {
  if (modules[5].status === 'complete') return;

  selectedSecurityChoice = null;
  document.querySelectorAll('.security-btn').forEach((button) => {
    button.classList.remove('selected', 'wrong', 'correct');
  });

  const feedback6 = document.getElementById('task6Feedback');
  feedback6.textContent = '';
  feedback6.className = 'feedback';
}


let selectedDesignChoice = null;
let task7Attempts = 0;

function selectDesignChoice(choice) {
  if (modules[6].status === 'complete') return;

  selectedDesignChoice = choice;
  document.querySelectorAll('.design-option').forEach((button) => {
    button.classList.toggle('selected', button.dataset.choice === choice);
    button.classList.remove('wrong');
  });

  const feedback7 = document.getElementById('task7Feedback');
  feedback7.textContent = `Izbran dizajn: ${choice.toUpperCase()}`;
  feedback7.className = 'feedback';
}

function checkTask7() {
  if (modules[6].status === 'complete') return;

  const feedback7 = document.getElementById('task7Feedback');
  const ravi7 = document.getElementById('raviTask7Text');

  if (!selectedDesignChoice) {
    feedback7.textContent = 'Najprej izberi en plakat.';
    feedback7.className = 'feedback error';
    return;
  }

  task7Attempts += 1;
  const selectedButton = document.querySelector(`.design-option[data-choice="${selectedDesignChoice}"]`);

  if (selectedDesignChoice === 'b') {
    selectedButton.classList.add('correct');
    modules[6].status = 'complete';
    modules[7].status = 'ready';
    completed = Math.max(completed, 7);

    feedback7.textContent = 'MODUL 7 AKTIVIRAN ✓ Jasna hierarhija, dobra berljivost in dovolj prostora.';
    feedback7.className = 'feedback success';
    ravi7.textContent = '»Odlično. Oči so mi hvaležne. In prvič danes mi ni treba zmanjšati svetlosti zaslona.«';
    document.getElementById('hubMessage').textContent = 'Oblikovalski modul je aktiven. Zadnji modul – Umetna inteligenca – je odklenjen.';

    updateProgress();
    renderModules();
    setTimeout(() => showScreen('screenHub'), 1700);
    return;
  }

  selectedButton.classList.add('wrong');
  feedback7.className = 'feedback error';

  if (task7Attempts === 1) {
    feedback7.textContent = 'Ta različica ni najbolj pregledna. Poglej berljivost, količino besedila in poudarke.';
    ravi7.textContent = '»Če ne vem, kam naj najprej pogledam, je dizajn verjetno malo preveč navdušen sam nad sabo.«';
  } else if (task7Attempts === 2) {
    feedback7.textContent = 'Namig: najboljši dizajn ima jasen naslov, malo besedila in dobro vizualno hierarhijo.';
    ravi7.textContent = '»Manj je včasih več. Še posebej pri plakatih. In kablih.«';
  } else {
    feedback7.textContent = 'Močan namig: izberi plakat B.';
    ravi7.textContent = '»B. Čist, pregleden, berljiv. Moj grafični modul glasuje za B.«';
  }
}

function resetTask7() {
  if (modules[6].status === 'complete') return;

  selectedDesignChoice = null;
  document.querySelectorAll('.design-option').forEach((button) => {
    button.classList.remove('selected', 'wrong', 'correct');
  });

  const feedback7 = document.getElementById('task7Feedback');
  feedback7.textContent = '';
  feedback7.className = 'feedback';
}


let selectedAIChoice = null;
let task8Attempts = 0;

function selectAIChoice(choice) {
  if (modules[7].status === 'complete') return;

  selectedAIChoice = choice;
  document.querySelectorAll('.ai-btn').forEach((button) => {
    button.classList.toggle('selected', button.dataset.choice === choice);
    button.classList.remove('wrong');
  });

  const feedback8 = document.getElementById('task8Feedback');
  feedback8.textContent = choice === 'true' ? 'Izbrano: drži.' : 'Izbrano: ne drži.';
  feedback8.className = 'feedback';
}

function checkTask8() {
  if (modules[7].status === 'complete') return;

  const feedback8 = document.getElementById('task8Feedback');
  const ravi8 = document.getElementById('raviTask8Text');

  if (!selectedAIChoice) {
    feedback8.textContent = 'Najprej izberi eno možnost.';
    feedback8.className = 'feedback error';
    return;
  }

  task8Attempts += 1;
  const selectedButton = document.querySelector(`.ai-btn[data-choice="${selectedAIChoice}"]`);

  if (selectedAIChoice === 'false') {
    selectedButton.classList.add('correct');
    modules[7].status = 'complete';
    completed = 8;

    feedback8.textContent = 'MODUL 8 AKTIVIRAN ✓ Prav imaš: Python je programski jezik, ne operacijski sistem.';
    feedback8.className = 'feedback success';
    ravi8.textContent = '»Ujet. Bil sem zelo samozavesten in vseeno napačen. Zato je pomembno, da človek zna preveriti odgovor.«';
    document.getElementById('hubMessage').textContent = 'Vseh 8 modulov je aktivnih. Sistem je pripravljen.';

    updateProgress();
    renderModules();
    setTimeout(() => showScreen('screenFinal'), 2100);
    return;
  }

  selectedButton.classList.add('wrong');
  feedback8.className = 'feedback error';

  if (task8Attempts === 1) {
    feedback8.textContent = 'Preveri trditev še enkrat. Ali je Python res nekaj podobnega Windowsu?';
    ravi8.textContent = '»Zvenim prepričljivo, vem. Ampak prepričljiv ton še ni dokaz.«';
  } else if (task8Attempts === 2) {
    feedback8.textContent = 'Namig: Python uporabljamo za pisanje programov.';
    ravi8.textContent = '»Če v Pythonu pišemo programe, potem verjetno ni operacijski sistem.«';
  } else {
    feedback8.textContent = 'Močan namig: trditev NE DRŽI.';
    ravi8.textContent = '»Priznam. Python je programski jezik. Klikni NE DRŽI in rešiva še zadnji modul.«';
  }
}

function resetTask8() {
  if (modules[7].status === 'complete') return;

  selectedAIChoice = null;
  document.querySelectorAll('.ai-btn').forEach((button) => {
    button.classList.remove('selected', 'wrong', 'correct');
  });

  const feedback8 = document.getElementById('task8Feedback');
  feedback8.textContent = '';
  feedback8.className = 'feedback';
}

document.getElementById('startBtn').addEventListener('click', () => showScreen('screenHub'));
document.getElementById('startCatchGame').addEventListener('click', startCatchGame);
document.getElementById('restartCatchGame').addEventListener('click', resetCatchGame);
document.getElementById('backHub1').addEventListener('click', () => {
  stopCatchGame();
  showScreen('screenHub');
});
document.addEventListener('keydown', handleCatchKeyDown);
document.addEventListener('keyup', handleCatchKeyUp);
document.getElementById('runProgramGame').addEventListener('click', runProgramGame);
document.getElementById('clearProgramGame').addEventListener('click', clearProgramGame);
document.getElementById('backHub2').addEventListener('click', () => {
  programRunning = false;
  showScreen('screenHub');
});
document.addEventListener('keydown', handleProgramKey);
document.getElementById('resetTask3').addEventListener('click', resetHtmlRepairGame);
document.getElementById('backHub3').addEventListener('click', () => showScreen('screenHub'));
document.getElementById('checkTask4').addEventListener('click', checkTask4);
document.getElementById('resetTask4').addEventListener('click', resetTask4);
document.getElementById('backHub4').addEventListener('click', () => showScreen('screenHub'));
document.getElementById('checkTask5').addEventListener('click', checkTask5);
document.getElementById('resetTask5').addEventListener('click', resetTask5);
document.getElementById('backHub5').addEventListener('click', () => showScreen('screenHub'));
document.querySelectorAll('.security-btn').forEach((button) => {
  button.addEventListener('click', () => selectSecurityChoice(button.dataset.choice));
});
document.getElementById('checkTask6').addEventListener('click', checkTask6);
document.getElementById('resetTask6').addEventListener('click', resetTask6);
document.getElementById('backHub6').addEventListener('click', () => showScreen('screenHub'));
document.querySelectorAll('.design-option').forEach((button) => {
  button.addEventListener('click', () => selectDesignChoice(button.dataset.choice));
});
document.getElementById('checkTask7').addEventListener('click', checkTask7);
document.getElementById('resetTask7').addEventListener('click', resetTask7);
document.getElementById('backHub7').addEventListener('click', () => showScreen('screenHub'));
document.querySelectorAll('.ai-btn').forEach((button) => {
  button.addEventListener('click', () => selectAIChoice(button.dataset.choice));
});
document.getElementById('checkTask8').addEventListener('click', checkTask8);
document.getElementById('resetTask8').addEventListener('click', resetTask8);
document.getElementById('backHub8').addEventListener('click', () => showScreen('screenHub'));
document.getElementById('finalHub').addEventListener('click', () => showScreen('screenHub'));
document.getElementById('placeholderBack').addEventListener('click', () => showScreen('screenHub'));

renderModules();
renderComponents();
renderProgramOrder();
renderDataRows();
renderNetworkOrder();
updateProgress();
