const TEST_MODE = true;

const modules = [
  { name: 'Strojna in programska oprema', status: 'ready' },
  { name: 'Osnove programiranja', status: 'locked' },
  { name: 'Spletne aplikacije', status: 'locked' },
  { name: 'Upravljanje s podatki', status: 'locked' },
  { name: 'Računalniška omrežja', status: 'locked' },
  { name: 'Varnost in zaščita', status: 'locked' },
  { name: 'Programiranje aplikacij', status: 'locked' },
  { name: 'Umetna inteligenca', status: 'locked' }
];

const storyRooms = [
  {
    code:'SOBA 01', room:'HARDWARE LAB', subject:'Strojna in programska oprema',
    title:'Kaj je znotraj računalnika?',
    description:'Spoznamo dele računalnika in kako skupaj tvorijo sistem.',
    instructions:[
      '<b>← →</b> premikaj lovilec',
      'Zberi <b>10 točk</b>',
      '<b>+1</b> računalniška oprema · <b>−1</b> napačen predmet'
    ],
    ravi:'»Najprej morava skozi strojni laboratorij. Brez osnovnega sistema ne pridem daleč.«'
  },
  {
    code:'SOBA 02', room:'CODE ROOM', subject:'Osnove programiranja',
    title:'Računalnik potrebuje natančna navodila.',
    description:'Z ukazi računalniku povemo, kaj naj naredi. Iz zaporedja ukazov nastane program.',
    instructions:[
      'S tipkami <b>↑ ↶ ↷</b> sestavi program',
      '<b>↑</b> naprej · <b>↶</b> levo · <b>↷</b> desno',
      '<b>ENTER</b> zažene program · pripelji RAVI-ja do cilja'
    ],
    ravi:'»Tukaj ne smeva ugibati. Program naredi točno to, kar mu poveš.«'
  },
  {
    code:'SOBA 03', room:'WEB LAB', subject:'Spletne aplikacije',
    title:'Iz kode nastane splet.',
    description:'Iz HTML elementov, vsebine in oblikovanja nastanejo spletne strani in aplikacije.',
    instructions:[
      'Povleci HTML oznake na prava mesta',
      'Popravi vseh <b>6 delov strani</b>',
      'V orodjarni so tudi oznake, ki jih <b>ne potrebuješ</b>'
    ],
    ravi:'»Moja spletna stran je razpadla. Sestaviva jo, preden naju kdo vidi.«'
  },
  {
    code:'SOBA 04', room:'DATA VAULT', subject:'Upravljanje s podatki',
    title:'Podatki so uporabni samo, če jih znamo najti.',
    description:'Podatkovne baze hranijo, urejajo in omogočajo hitro iskanje velike količine podatkov.',
    instructions:[
      'Nastavi pravilne <b>filtre</b>',
      'Poišči dijaka programa <b>Računalništvo, 3. letnik</b>',
      'Nato uredi po <b>točkah</b> in izberi najboljšega'
    ],
    ravi:'»V podatkovnem trezorju je pravi zapis. Najdiva ga, preden se vrata zaprejo.«'
  },
  {
    code:'SOBA 05', room:'NETWORK CONTROL', subject:'Računalniške komunikacije in omrežja',
    title:'Podatki morajo najti pravo pot.',
    description:'Naprave komunicirajo prek omrežij, podatki pa potujejo skozi različne povezave in naprave.',
    instructions:[
      'Začni pri <b>RAČUNALNIKU</b>',
      'Klikaj naprave po pravilni poti paketa',
      'Cilj je dostaviti paket do <b>RAVI-ja</b>'
    ],
    ravi:'»Pošlji paket do cilja. Napačna pot pomeni slepo ulico.«'
  },
  {
    code:'SOBA 06', room:'SECURITY ZONE', subject:'Varnost in zaščita v informatiki',
    title:'Vsakemu sporočilu ne smemo zaupati.',
    description:'Prepoznavamo nevarnosti ter ščitimo naprave, uporabnike in podatke.',
    instructions:[
      'Preberi sporočilo in poišči sumljive znake',
      '<b>←</b> SUMljivo · <b>→</b> VARNO',
      'Razvrsti vseh <b>6 sporočil</b>'
    ],
    ravi:'»Varnostni sistem je strog. Ločiti morava varno od sumljivega.«'
  },
  {
    code:'SOBA 07', room:'APP DEVELOPMENT LAB', subject:'Programiranje aplikacij',
    title:'Iz kode nastanejo prave aplikacije.',
    description:'Programerji iz idej in kode ustvarjajo igre, aplikacije in uporabne sisteme.',
    instructions:[
      '<b>← →</b> premikanje · <b>SPACE</b> skok',
      'Poberi vse <b>3 koščke kode</b>',
      'Pridi do terminala in dokončaj aplikacijo'
    ],
    ravi:'»Čaka naju testna aplikacija. Tokrat ne govoriva o igri — igrala jo bova.«'
  },
  {
    code:'SOBA 08', room:'AI CORE', subject:'Umetna inteligenca',
    title:'Umetna inteligenca se uči iz podatkov.',
    description:'AI išče vzorce v podatkih, kakovost podatkov in človeško preverjanje pa odločata o rezultatu.',
    instructions:[
      'Razvrsti primere na <b>MAČKE</b> in <b>PSE</b>',
      'Opazuj, kako se model iz podatkov <b>uči</b>',
      'Ko se zmoti, izberi podatke, ki ga bodo najbolje <b>izboljšali</b>'
    ],
    ravi:'»Zadnja soba. Tokrat boš moral naučiti mene.«'
  }
];

let storyRoomIndex = 0;

function renderStoryRoom(index = storyRoomIndex) {
  storyRoomIndex = Math.max(0, Math.min(storyRooms.length - 1, index));
  const room = storyRooms[storyRoomIndex];

  document.getElementById('storyRoomCode').textContent = room.code;
  document.getElementById('storyRoomName').textContent = room.room;
  document.getElementById('storySubject').textContent = room.subject;
  document.getElementById('storyDescription').textContent = room.description;

  const storyPercent = getRaviRecoveryPercent(storyRoomIndex);
  document.getElementById('airlockAccess').textContent = `${String(storyRoomIndex + 1).padStart(2,'0')} / 08`;
  document.getElementById('airlockStatus').textContent = 'READY';
  document.getElementById('airlockPower').textContent = `${storyPercent} %`;
  document.getElementById('airlockDoor').textContent = 'SECURED';
  document.getElementById('airlockConsoleRoom').textContent = `LAB ${String(storyRoomIndex + 1).padStart(2,'0')}`;

  document.querySelectorAll('.story-room-marker').forEach((marker, markerIndex) => {
    marker.classList.toggle('active', markerIndex === storyRoomIndex);
    marker.classList.toggle('done', markerIndex < storyRoomIndex);
  });

  const door = document.getElementById('storyDoor');
  door.classList.remove('door-open');
  void door.offsetWidth;
}

function showStoryRoom(index) {
  renderStoryRoom(index);
  setRaviStageImage(
    document.querySelector('.story-ravi-placeholder'),
    Math.min(storyRoomIndex + 1, 8),
    `RAVI pred modulom ${Math.min(storyRoomIndex + 1, 8)}`
  );
  showScreen('screenStory');
}

function enterStoryRoom() {
  syncTaskRaviForModule(storyRoomIndex);
  const door = document.getElementById('storyDoor');
  const doorStatus = document.getElementById('airlockDoor');
  const moduleStatus = document.getElementById('airlockStatus');
  if (doorStatus) doorStatus.textContent = 'UNLOCKING';
  if (moduleStatus) moduleStatus.textContent = 'ACCESSING';
  door.classList.add('door-open');

  setTimeout(() => {
    if (doorStatus) doorStatus.textContent = 'OPEN';
    if (moduleStatus) moduleStatus.textContent = 'ENTER';

    openModule(storyRoomIndex);
  }, 620);
}



function completeTaskFlow(moduleIndex, feedbackId, message, delay = 1600) {
  const feedback = document.getElementById(feedbackId);
  if (feedback) {
    feedback.textContent = message;
    feedback.className = 'feedback success';
  }

  updateProgress();

  setTimeout(() => {
    showRecoveryAfterModule(moduleIndex);
  }, delay);
}

const raviRepairSteps = [
  'Samopopravljanje je zagnano. RAVI je začel ponovno sestavljati podvozje.',
  'Prvo kolo je spet na mestu. RAVI se že lažje postavi pokonci.',
  'Obe kolesi sta pritrjeni. RAVI lahko spet stoji in se premika.',
  'Poškodovane žice so pospravljene in notranje povezave so spet stabilne.',
  'Ohišje se obnavlja. Glavne praske in poškodbe so odpravljene.',
  'Ohišje in zaslon sta obnovljena. Ostala je samo še poškodovana signalna žarnica.',
  'Tudi žarnica je popravljena. Še ne sveti — manjka samo še zadnji zagon sistema.',
  'Vsi deli so obnovljeni. RAVI je pripravljen na popoln zagon.'
];

function showRecoveryAfterModule(moduleIndex) {
  const percent = getRaviRecoveryPercent(moduleIndex + 1);
  setRaviStageImage(
    document.querySelector('.recovery-core'),
    Math.min(moduleIndex + 2, 9),
    `RAVI po obnovi modula ${moduleIndex + 1}`
  );
  document.getElementById('recoveryPercent').textContent = `${percent} %`;
  document.getElementById('recoveryBar').style.width = `${percent}%`;
  document.getElementById('recoveryTitle').textContent = moduleIndex === 7
    ? 'SYSTEM RECOVERY COMPLETE ✓'
    : 'MODUL OBNOVLJEN ✓';

  const nextRoom = storyRooms[moduleIndex + 1];
  const repairText = raviRepairSteps[moduleIndex] || 'RAVI je obnovil del sistema.';
  document.getElementById('recoveryText').textContent = nextRoom
    ? `${repairText} Naslednja postaja: ${nextRoom.room}.`
    : `${repairText} Začenja se končni zagon.`;

  const moduleNumber = String(moduleIndex + 1).padStart(2, '0');
  document.getElementById('recoveryModuleReadout').textContent = `MODULE ${moduleNumber} / 08`;
  document.getElementById('recoveryModulesStatus').textContent = `${moduleNumber} / 08`;
  document.getElementById('recoveryCoreStatus').textContent = moduleIndex === 7 ? 'ONLINE' : 'STABLE';
  document.getElementById('recoveryNextStatus').textContent = nextRoom
    ? `LAB ${String(moduleIndex + 2).padStart(2, '0')}`
    : 'RAVI';
  const continueStoryBtn = document.getElementById('continueStory');
  if (continueStoryBtn) {
    continueStoryBtn.textContent = moduleIndex === 7 ? 'DOKONČAJ OBNOVO' : 'NADALJUJ Z OBNOVO';
  }

  const recoveryScreen = document.getElementById('screenRecovery');
  document.querySelectorAll('.screen').forEach((screen) => {
    screen.classList.toggle('active', screen === recoveryScreen);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

let finalResetTimer = null;
let finalCountdownTimer = null;

function startFinalSequence() {
  showScreen('screenFinal');

  const finalScreen = document.getElementById('screenFinal');
  const transition = document.getElementById('finalTransition');
  const countdownEl = document.getElementById('finalResetCountdown');

  finalScreen?.classList.add('final-sequence-start');
  transition?.classList.remove('finished');

  setTimeout(() => {
    transition?.classList.add('finished');
    finalScreen?.classList.add('final-sequence-revealed');
  }, 2600);

  if (finalResetTimer) clearTimeout(finalResetTimer);
  if (finalCountdownTimer) clearInterval(finalCountdownTimer);

  let seconds = 30;
  if (countdownEl) countdownEl.textContent = String(seconds);

  finalCountdownTimer = setInterval(() => {
    seconds -= 1;
    if (countdownEl) countdownEl.textContent = String(Math.max(seconds, 0));
    if (seconds <= 0) clearInterval(finalCountdownTimer);
  }, 1000);

  finalResetTimer = setTimeout(resetWholeMission, 30000);
}

function resetWholeMission() {
  if (finalResetTimer) clearTimeout(finalResetTimer);
  if (finalCountdownTimer) clearInterval(finalCountdownTimer);
  finalResetTimer = null;
  finalCountdownTimer = null;

  completed = 0;
  storyRoomIndex = 0;
  modules.forEach((module, index) => {
    module.status = index === 0 ? 'ready' : 'locked';
  });

  resetCatchGame();
  resetProgramGame();
  resetHtmlRepairGame();
  resetTask4();
  resetNetworkGame();
  resetTask6();
  resetRunnerGame();

  mlPlaced = new Map();
  mlStage = 0;
  mlBusy = false;
  updateMLStage(0);
  setMLPhase('mlTrainingPhase');
  renderMLTrainingCards();

  document.getElementById('screenFinal')?.classList.remove('final-sequence-start','final-sequence-revealed');
  document.getElementById('finalTransition')?.classList.add('finished');

  updateProgress();
  renderModules();
  syncRaviStageImages();
  showScreen('screenIntro');
}

function continueStoryPath() {
  if (completed >= 8) {
    startFinalSequence();
    return;
  }

  showStoryRoom(Math.min(completed, 7));
}



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


const RAVI_IMAGE_BASE = 'assets/ravi';

function setRaviStageImage(container, stage, alt = 'RAVI') {
  if (!container) return;

  const safeStage = Math.max(1, Math.min(9, Number(stage) || 1));
  let image = container.querySelector(':scope > .ravi-stage-image');

  if (!image) {
    image = document.createElement('img');
    image.className = 'ravi-stage-image';
    container.appendChild(image);
  }

  const wantedSrc = `${RAVI_IMAGE_BASE}/ravi-${safeStage}.webp`;

  image.onload = () => container.classList.add('has-ravi-image');
  image.onerror = () => container.classList.remove('has-ravi-image');

  if (!image.getAttribute('src')?.endsWith(wantedSrc)) {
    container.classList.remove('has-ravi-image');
    image.src = wantedSrc;
  } else if (image.complete && image.naturalWidth > 0) {
    container.classList.add('has-ravi-image');
  }

  image.alt = alt;
  image.dataset.stage = String(safeStage);
}

function syncRaviStageImages() {
  setRaviStageImage(
    document.querySelector('.intro-ravi-avatar'),
    1,
    'RAVI v začetnem poškodovanem stanju'
  );

  setRaviStageImage(
    document.querySelector('.story-ravi-placeholder'),
    Math.min(storyRoomIndex + 1, 8),
    `RAVI pred modulom ${Math.min(storyRoomIndex + 1, 8)}`
  );

  for (let task = 1; task <= 7; task += 1) {
    setRaviStageImage(
      document.querySelector(`#screenTask${task} .mini-ravi`),
      task,
      `RAVI – stanje ${task}`
    );
  }

  setRaviStageImage(
    document.querySelector('#screenTask8 .ml-core-wrap'),
    8,
    'RAVI – stanje 8'
  );

  setRaviStageImage(
    document.querySelector('.hub-ravi'),
    Math.min(completed + 1, 9),
    'Trenutno stanje RAVI-ja'
  );

  setRaviStageImage(
    document.querySelector('.final-ravi-robot'),
    9,
    'Popolnoma obnovljen RAVI'
  );
}

function showScreen(id) {
  screens.forEach((screen) => screen.classList.toggle('active', screen.id === id));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


function setRaviMessage(elementId, message, state = 'instruction') {
  const textEl = document.getElementById(elementId);
  if (!textEl) return;

  textEl.textContent = message;
  const panel = textEl.closest('.ravi-message-panel');
  if (!panel) return;

  panel.classList.remove('message-instruction','message-hint','message-error','message-success','message-flash');
  panel.classList.add(`message-${state}`);
  void panel.offsetWidth;
  panel.classList.add('message-flash');

  const label = panel.querySelector('.ravi-message-head span');
  if (label) {
    const labels = {
      instruction:'NAVODILO',
      hint:'NAMIG',
      error:'NAPAKA',
      success:'USPEH'
    };
    label.textContent = labels[state] || 'NAVODILO';
  }
}

function getRaviRecoveryPercent(completedModules) {
  const baseRecovery = 18;
  const totalRepair = 100 - baseRecovery;
  const clamped = Math.max(0, Math.min(8, Number(completedModules) || 0));
  return Math.round(baseRecovery + (totalRepair * clamped / 8));
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

  const percent = getRaviRecoveryPercent(completed);
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
    'Aplikacijski modul deluje. RAVI skoraj pripravljen.',
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


function syncTaskRaviForModule(moduleIndex) {
  const taskNumber = Math.max(1, Math.min(8, Number(moduleIndex) + 1));
  const container = taskNumber === 8
    ? document.querySelector('#screenTask8 .ml-core-wrap')
    : document.querySelector(`#screenTask${taskNumber} .mini-ravi`);

  setRaviStageImage(
    container,
    taskNumber,
    `RAVI – stanje ${taskNumber}`
  );
}

function openModule(index) {
  syncTaskRaviForModule(index);
  if (index === 0) {
    if (modules[0].status !== 'complete') resetCatchGame();
    showScreen('screenTask1');
    showTaskStartOverlay(1);
    return;
  }

  if (index === 1) {
    if (modules[1].status !== 'complete') resetProgramGame();
    showScreen('screenTask2');
    showTaskStartOverlay(2);
    setTimeout(() => document.getElementById('programBoard').focus(), 50);
    return;
  }

  if (index === 2) {
    if (modules[2].status !== 'complete') resetHtmlRepairGame();
    showScreen('screenTask3');
    showTaskStartOverlay(3);
    return;
  }

  if (index === 3) {
    if (modules[3].status !== 'complete') resetTask4();
    showScreen('screenTask4');
    showTaskStartOverlay(4);
    return;
  }

  if (index === 4) {
    showScreen('screenTask5');
    showTaskStartOverlay(5);
    if (modules[4].status !== 'complete') resetNetworkGame();
    return;
  }

  if (index === 5) {
    showScreen('screenTask6');
    showTaskStartOverlay(6);
    if (modules[5].status !== 'complete') resetTask6();
    return;
  }

  if (index === 6) {
    showScreen('screenTask7');
    showTaskStartOverlay(7);
    return;
  }

  if (index === 7) {
    showScreen('screenTask8');
    showTaskStartOverlay(8);
    if (modules[7].status !== 'complete') resetTask8();
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
    renderModules();
    setTimeout(() => showRecoveryAfterModule(0), 1600);
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


function setTechHudValue(type, label, value) {
  const hud = document.querySelector(`[data-tech-hud="${type}"]`);
  if (!hud) return;
  const items = [...hud.querySelectorAll('span')];
  const item = items.find((el) => el.textContent.trim().startsWith(label));
  const valueEl = item?.querySelector('b');
  if (valueEl) valueEl.textContent = value;
}

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
  setTechHudValue('hardware', 'CPU', '36%');
  setTechHudValue('hardware', 'RAM', '4.2 GB');
  document.getElementById('catchMistakes').textContent = '0';

  const f = document.getElementById('taskFeedback');
  f.textContent = '';
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
        setTechHudValue('hardware', 'CPU', `${36 + catchScoreValue * 4}%`);
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

  document.getElementById('taskFeedback').textContent = 'NALOGA KONČANA ✓ Zbral si vseh 10 točk.';
  document.getElementById('taskFeedback').className = 'feedback success';
  document.getElementById('raviTaskText').textContent = '»Odlično. Računalnik ima vse, kar potrebuje. Akvarij pa je ostal tam, kjer mora biti.«';
  document.getElementById('hubMessage').textContent = 'Napajanje in strojna oprema sta aktivna. Programiranje je odklenjeno.';

  if (game) {
    let victory = game.querySelector('.catch-victory');
    if (!victory) {
      victory = document.createElement('div');
      victory.className = 'catch-victory';
      victory.innerHTML = `
        <span>10 / 10 ✓</span>
        <strong>VSA OPREMA ZBRANA</strong>
      `;
      game.appendChild(victory);
    }
    victory.classList.add('show');
  }

  setRaviMessage('raviTaskText', '»Odlično. Prvi sistem je spet pripravljen.«', 'success');

  completeTaskFlow(0, 'taskFeedback', 'NALOGA KONČANA ✓ Zbral si vseh 10 točk.', 1400);
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
  setTechHudValue('code', 'STEPS', `${programCommands.length}/10`);

  const feedback2 = document.getElementById('task2Feedback');
  if (feedback2) {
    feedback2.textContent = '';
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
  if (isTaskStartOverlayOpen(2)) return;
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
  setTechHudValue('code', 'STATUS', 'EXECUTING');
  setTechHudValue('code', 'EXECUTION', 'RUNNING');
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

    feedback2.textContent = 'NALOGA KONČANA ✓ Program je RAVI-ja uspešno pripeljal do cilja.';
    feedback2.className = 'feedback success';
    ravi2.textContent = '»Program izveden. Prišel sem do cilja in niti enkrat nisem improviziral. Skoraj.«';
    document.getElementById('hubMessage').textContent = 'Programski modul je aktiven. Spletne aplikacije so odklenjene.';

    programRunning = false;
    setTechHudValue('code', 'STATUS', 'SUCCESS');
    setTechHudValue('code', 'EXECUTION', 'DONE');
    completeTaskFlow(1, 'task2Feedback', 'NALOGA KONČANA ✓ Program je RAVI-ja uspešno pripeljal do cilja.', 1600);
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
    setTimeout(() => showRecoveryAfterModule(2), 1700);
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
    setTimeout(() => showRecoveryAfterModule(2), 1700);
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
const htmlTargetCount = 6;
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
  if (count) count.textContent = `0 / ${htmlTargetCount}`;

  const live = document.getElementById('htmlLivePage');
  const finalPreview = document.getElementById('htmlFinalPreview');
  const toolbox = document.getElementById('htmlToolbox');
  const finishBtn = null;
  if (live) live.classList.remove('hidden');
  if (finalPreview) {
    finalPreview.classList.add('hidden');
    finalPreview.classList.remove('magic-reveal');
  }
  const shell = document.querySelector('#screenTask3 .html-preview-shell');
  if (shell) shell.classList.remove('magic-build');
  if (toolbox) toolbox.classList.remove('hidden');
  if (finishBtn) finishBtn.classList.add('hidden');

  const feedback3 = document.getElementById('task3Feedback');
  if (feedback3) {
    feedback3.textContent = '';
    feedback3.className = 'feedback';
  }

  const ravi3 = document.getElementById('raviTask3Text');
  if (ravi3) {
    ravi3.textContent = '»Moja spletna stran je razpadla na šest delov. Povleci prave HTML oznake na pravo mesto in jo sestavi nazaj.«';
  }
}

function selectHtmlTag(tagButton) {
  if (tagButton.classList.contains('used') || modules[2].status === 'complete') return;

  document.querySelectorAll('.html-tag').forEach((tag) => tag.classList.remove('selected'));
  htmlDraggedTag = null;
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

    if (tag === 'img') {
      const imageBox = zone.querySelector('.repair-image-placeholder');
      if (imageBox) {
        imageBox.innerHTML = `
          <img
            class="repair-ravi-photo"
            alt="RAVI robot"
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 420 300'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23101927'/%3E%3Cstop offset='1' stop-color='%2322334a'/%3E%3C/linearGradient%3E%3ClinearGradient id='metal' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23d9e1ea'/%3E%3Cstop offset='1' stop-color='%238692a3'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='420' height='300' rx='30' fill='url(%23bg)'/%3E%3Ccircle cx='210' cy='150' r='110' fill='%232a3b54' opacity='.65'/%3E%3Cline x1='210' y1='55' x2='210' y2='28' stroke='%236a7890' stroke-width='9' stroke-linecap='round'/%3E%3Ccircle cx='210' cy='20' r='11' fill='%23ef3340'/%3E%3Crect x='118' y='58' width='184' height='110' rx='38' fill='url(%23metal)' stroke='%2353637b' stroke-width='10'/%3E%3Ccircle cx='168' cy='108' r='14' fill='%23ef3340'/%3E%3Ccircle cx='252' cy='108' r='14' fill='%23ef3340'/%3E%3Cpath d='M165 139 Q210 166 255 139' fill='none' stroke='%23313b4b' stroke-width='8' stroke-linecap='round'/%3E%3Crect x='138' y='180' width='144' height='92' rx='30' fill='%23213045' stroke='%2353637b' stroke-width='10'/%3E%3Ccircle cx='210' cy='226' r='31' fill='%23ef3340'/%3E%3Ctext x='210' y='237' text-anchor='middle' font-family='Arial' font-weight='700' font-size='34' fill='white'%3ER%3C/text%3E%3Cpath d='M128 206 L90 226' stroke='%2353637b' stroke-width='14' stroke-linecap='round'/%3E%3Cpath d='M292 206 L330 226' stroke='%2353637b' stroke-width='14' stroke-linecap='round'/%3E%3C/svg%3E"
          >
        `;
      }
    }

    htmlSelectedTag = null;
    htmlDraggedTag = null;

    document.getElementById('htmlRepairCount').textContent = `${htmlFixedCount} / ${htmlTargetCount}`;
    feedback3.textContent = `Pravilno: <${tag}>. Del strani je popravljen.`;
    feedback3.className = 'feedback success';

    if (htmlFixedCount >= htmlTargetCount) {
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
    feedback3.textContent = 'Namig: <h1> je naslov, <img> slika, <p> odstavek, <button> gumb, <nav> navigacija, <footer> pa noga strani.';
    ravi3.textContent = '»Šest različnih nalog, šest različnih oznak. Nekaj oznak v orodjarni je samo vaba.«';
  } else {
    const answer = zone.dataset.answer;
    feedback3.textContent = `Močan namig: ta del potrebuje <${answer}>.`;
    ravi3.textContent = '»Zdaj ti že skoraj rišem zemljevid. Uporabi oznako, ki ti jo namig pokaže.«';
  }

  setTimeout(() => zone.classList.remove('wrong'), 350);
}

function finishHtmlRepairGame() {
  const live = document.getElementById('htmlLivePage');
  const finalPreview = document.getElementById('htmlFinalPreview');
  const toolbox = document.getElementById('htmlToolbox');
  const finishBtn = document.getElementById('finishTask3');
  const shell = document.querySelector('#screenTask3 .html-preview-shell');

  if (toolbox) toolbox.classList.add('hidden');
  if (finishBtn) finishBtn.classList.add('hidden');
  if (shell) shell.classList.add('magic-build');

  setTimeout(() => {
    if (live) live.classList.add('hidden');
    if (finalPreview) {
      finalPreview.classList.remove('hidden');
      finalPreview.classList.remove('magic-reveal');
      void finalPreview.offsetWidth;
      finalPreview.classList.add('magic-reveal');
    }
  }, 1250);

  setTimeout(() => {
    if (shell) shell.classList.remove('magic-build');
  }, 2400);

  modules[2].status = 'complete';
  modules[3].status = 'ready';
  completed = Math.max(completed, 3);

  const feedback3 = document.getElementById('task3Feedback');
  const ravi3 = document.getElementById('raviTask3Text');

  feedback3.textContent = 'NALOGA KONČANA ✓ Spletna stran je pravilno sestavljena.';
  feedback3.className = 'feedback success';
  ravi3.textContent = '»Odlično. Šest elementov, ena prava stran. Tako je videti, ko se HTML končno ne prepira sam s sabo.«';
  document.getElementById('hubMessage').textContent = 'Spletni modul je aktiven. Upravljanje s podatki je odklenjeno.';

  completeTaskFlow(2, 'task3Feedback', 'NALOGA KONČANA ✓ Spletna stran je pravilno sestavljena.', 3000);
}

function initHtmlRepairGame() {
  document.querySelectorAll('.html-tag').forEach((tagButton) => {
    tagButton.addEventListener('dragstart', (event) => {
      if (tagButton.classList.contains('used')) {
        event.preventDefault();
        return;
      }
      document.querySelectorAll('.html-tag').forEach((tag) => tag.classList.remove('selected'));
      htmlSelectedTag = null;
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
  { id: 'ana', ime: 'Ana', spol: 'Ž', program: 'Računalništvo', letnik: '3.', tocke: 94 },
  { id: 'luka', ime: 'Luka', spol: 'M', program: 'Računalništvo', letnik: '3.', tocke: 88 },
  { id: 'jan', ime: 'Jan', spol: 'M', program: 'Računalništvo', letnik: '3.', tocke: 96 },
  { id: 'rok', ime: 'Rok', spol: 'M', program: 'Računalništvo', letnik: '3.', tocke: 91 },
  { id: 'miha', ime: 'Miha', spol: 'M', program: 'Elektrotehnika', letnik: '3.', tocke: 98 },
  { id: 'tim', ime: 'Tim', spol: 'M', program: 'Računalništvo', letnik: '2.', tocke: 99 },
  { id: 'nina', ime: 'Nina', spol: 'Ž', program: 'Mehatronika', letnik: '3.', tocke: 79 },
  { id: 'lara', ime: 'Lara', spol: 'Ž', program: 'Elektrotehnika', letnik: '4.', tocke: 90 },
  { id: 'eva', ime: 'Eva', spol: 'Ž', program: 'Strojništvo', letnik: '1.', tocke: 88 },
  { id: 'nejc', ime: 'Nejc', spol: 'M', program: 'Strojništvo', letnik: '4.', tocke: 83 },
  { id: 'zala', ime: 'Zala', spol: 'Ž', program: 'Računalništvo', letnik: '1.', tocke: 97 },
  { id: 'vid', ime: 'Vid', spol: 'M', program: 'Mehatronika', letnik: '2.', tocke: 87 }
];

let task4Attempts = 0;
let dataSortedByPoints = false;

function getFilteredDataRecords() {
  const spol = document.getElementById('filterSpol')?.value || '';
  const program = document.getElementById('filterProgram')?.value || '';
  const letnik = document.getElementById('filterLetnik')?.value || '';

  let rows = dataRecords.filter((record) => {
    const spolOk = !spol || record.spol === spol;
    const programOk = !program || record.program === program;
    const letnikOk = !letnik || record.letnik === letnik;
    return spolOk && programOk && letnikOk;
  });

  if (dataSortedByPoints) {
    rows = [...rows].sort((a, b) => b.tocke - a.tocke);
  }

  return rows;
}

function updateDataQueryText() {
  const spol = document.getElementById('filterSpol')?.value || '';
  const program = document.getElementById('filterProgram')?.value || '';
  const letnik = document.getElementById('filterLetnik')?.value || '';
  const parts = [];

  if (spol) parts.push(`SPOL = "${spol}"`);
  if (program) parts.push(`PROGRAM = "${program}"`);
  if (letnik) parts.push(`LETNIK = "${letnik}"`);

  let query = parts.length
    ? `PRIKAŽI ZAPISE KJER ${parts.join(' IN ')}`
    : 'PRIKAŽI VSE ZAPISE';

  if (dataSortedByPoints) query += ' | RAZVRSTI PO TOČKAH ↓';

  const queryText = document.getElementById('dataQueryText');
  if (queryText) queryText.textContent = query;
}

function renderDataRows() {
  const tbody = document.getElementById('dataRows');
  if (!tbody) return;

  const filtered = getFilteredDataRecords();
  tbody.innerHTML = '';

  filtered.forEach((record, index) => {
    const row = document.createElement('tr');
    row.className = 'data-row reveal';
    row.dataset.id = record.id;
    row.style.animationDelay = `${index * 45}ms`;
    row.innerHTML = `
      <td>${record.ime}</td>
      <td>${record.spol}</td>
      <td>${record.program}</td>
      <td>${record.letnik}</td>
      <td>${record.tocke}</td>
    `;
    tbody.appendChild(row);
  });

  const count = document.getElementById('dataResultCount');
  if (count) count.textContent = String(filtered.length);
  setTechHudValue('data', 'ROWS', String(filtered.length));
  setTechHudValue('data', 'FILTER', filtered.length === dataRecords.length ? 'OFF' : 'ACTIVE');

  const phase = document.getElementById('dataPhaseHint');
  const sortBtn = document.getElementById('sortPointsBtn');
  const readyForSort =
    document.getElementById('filterSpol')?.value === 'M' &&
    document.getElementById('filterProgram')?.value === 'Računalništvo' &&
    document.getElementById('filterLetnik')?.value === '3.';

  if (phase) {
    phase.textContent = dataSortedByPoints
      ? '2. RAZVRŠČENO PO TOČKAH ↓'
      : readyForSort
        ? '2. ZDAJ RAZVRSTI PO TOČKAH'
        : '1. FILTRIRAJ PODATKE';
  }

  if (sortBtn) {
    sortBtn.classList.toggle('ready', readyForSort);
    sortBtn.classList.toggle('sorted', dataSortedByPoints);
    sortBtn.textContent = dataSortedByPoints ? 'Točke ↓' : 'Točke ↕';
  }

  updateDataQueryText();

  const wrap = document.querySelector('#screenTask4 .data-table-wrap');
  if (wrap) {
    wrap.classList.remove('querying');
    void wrap.offsetWidth;
    wrap.classList.add('querying');
    setTimeout(() => wrap.classList.remove('querying'), 380);
  }

  const feedback4 = document.getElementById('task4Feedback');
  if (feedback4 && modules[3].status !== 'complete') {
    if (readyForSort && !dataSortedByPoints) {
      feedback4.textContent = 'Pravilno filtrirano. Ostali so 3 dijaki. Zdaj razvrsti po točkah.';
      feedback4.className = 'feedback success';
    } else if (dataSortedByPoints && filtered.length === 3) {
      feedback4.textContent = 'Razvrščeno. Najboljši rezultat je zdaj na vrhu — potrdi rezultat.';
      feedback4.className = 'feedback success';
    } else {
      feedback4.textContent = `Prikazanih zapisov: ${filtered.length}. Nadaljuj s filtriranjem.`;
      feedback4.className = 'feedback info';
    }
  }
}

function resetTask4() {
  if (modules[3].status === 'complete') return;

  task4Attempts = 0;
  dataSortedByPoints = false;

  const spol = document.getElementById('filterSpol');
  const program = document.getElementById('filterProgram');
  const letnik = document.getElementById('filterLetnik');

  if (spol) spol.value = '';
  if (program) program.value = '';
  if (letnik) letnik.value = '';

  const ravi4 = document.getElementById('raviTask4Text');
  if (ravi4) {
    ravi4.textContent = '»Najdi dijaka 3. letnika računalništva, ki ima največ točk. Najprej ga izlušči s filtri, potem pa razvrsti rezultate.«';
  }

  renderDataRows();
}

function sortDataByPoints() {
  if (modules[3].status === 'complete') return;

  const spol = document.getElementById('filterSpol')?.value || '';
  const program = document.getElementById('filterProgram')?.value || '';
  const letnik = document.getElementById('filterLetnik')?.value || '';
  const feedback4 = document.getElementById('task4Feedback');
  const ravi4 = document.getElementById('raviTask4Text');

  if (!(spol === 'M' && program === 'Računalništvo' && letnik === '3.')) {
    feedback4.textContent = 'Najprej pravilno filtriraj podatke. Razvrščanje pride na vrsto šele nato.';
    feedback4.className = 'feedback error';
    ravi4.textContent = '»Če razvrstiva napačen nabor podatkov, dobiva zelo urejeno napačen odgovor.«';
    return;
  }

  dataSortedByPoints = true;
  renderDataRows();
}

function checkTask4() {
  if (modules[3].status === 'complete') return;

  const spol = document.getElementById('filterSpol')?.value || '';
  const program = document.getElementById('filterProgram')?.value || '';
  const letnik = document.getElementById('filterLetnik')?.value || '';
  const feedback4 = document.getElementById('task4Feedback');
  const ravi4 = document.getElementById('raviTask4Text');
  const filtered = getFilteredDataRecords();

  task4Attempts += 1;

  const filtersCorrect =
    spol === 'M' &&
    program === 'Računalništvo' &&
    letnik === '3.';

  const isCorrect =
    filtersCorrect &&
    dataSortedByPoints &&
    filtered.length === 3 &&
    filtered[0].id === 'jan';

  if (isCorrect) {
    const row = document.querySelector('.data-row[data-id="jan"]');
    if (row) row.classList.add('correct');

    modules[3].status = 'complete';
    modules[4].status = 'ready';
    completed = Math.max(completed, 4);

    feedback4.textContent = 'NALOGA KONČANA ✓ Našel si pravilen zapis.';
    feedback4.className = 'feedback success';
    ravi4.textContent = '»Filtriranje in razvrščanje. Dvanajst zapisov je postalo en uporaben podatek.«';
    document.getElementById('hubMessage').textContent = 'Podatkovni modul je aktiven. Računalniška omrežja so odklenjena.';

    completeTaskFlow(3, 'task4Feedback', 'NALOGA KONČANA ✓ Našel si pravilen zapis.', 1600);
    return;
  }

  feedback4.className = 'feedback error';

  if (!filtersCorrect) {
    if (task4Attempts === 1) {
      feedback4.textContent = 'Preberi zahtevo natančno. Beseda "dijaka" pomeni tudi pogoj za spol.';
      ravi4.textContent = '»V vprašanju je več pogojev, kot jih je videti na prvi pogled.«';
    } else if (task4Attempts === 2) {
      feedback4.textContent = 'Namig: SPOL = M, PROGRAM = Računalništvo, LETNIK = 3.';
      ravi4.textContent = '»Najprej izloči vse, ki ne ustrezajo trem pogojem.«';
    } else {
      document.getElementById('filterSpol').value = 'M';
      document.getElementById('filterProgram').value = 'Računalništvo';
      document.getElementById('filterLetnik').value = '3.';
      dataSortedByPoints = false;
      renderDataRows();
      feedback4.textContent = 'RAVI pomoč: filtri so pravilno nastavljeni. Zdaj klikni TOČKE, da jih razvrstiš.';
      ravi4.textContent = '»Filtri so pripravljeni. Zdaj še ugotoviva, kdo ima največ točk.«';
    }
    return;
  }

  if (!dataSortedByPoints) {
    feedback4.textContent = 'Filtri so pravilni, vendar naloga zahteva še največ točk. Klikni glavo stolpca TOČKE.';
    feedback4.className = 'feedback success';
    ravi4.textContent = '»Trije ustrezajo. Potrebujem najboljšega — razvrsti jih po točkah.«';
    return;
  }

  feedback4.textContent = 'Podatki so že razvrščeni. Najvišji rezultat je prvi zapis v tabeli.';
  feedback4.className = 'feedback success';
  ravi4.textContent = '»Po razvrščanju je odgovor na vrhu. Zdaj ga samo še potrdi.«';
}

function initDataFilterGame() {
  const spol = document.getElementById('filterSpol');
  const program = document.getElementById('filterProgram');
  const letnik = document.getElementById('filterLetnik');
  const sortBtn = document.getElementById('sortPointsBtn');

  [spol, program, letnik].forEach((select) => {
    if (!select || select.dataset.bound === '1') return;
    select.dataset.bound = '1';
    select.addEventListener('change', () => {
      dataSortedByPoints = false;
      renderDataRows();
    });
  });

  if (sortBtn && sortBtn.dataset.bound !== '1') {
    sortBtn.dataset.bound = '1';
    sortBtn.addEventListener('click', sortDataByPoints);
  }
}


const topologyNodes = {
  pc:       { label: 'RAČUNALNIK', x: 11, y: 58 },
  switch:   { label: 'STIKALO', x: 23, y: 86 },
  router:   { label: 'USMERJEVALNIK', x: 25, y: 24 },
  nas:      { label: 'NAS', x: 49, y: 18 },
  server:   { label: 'STREŽNIK', x: 47, y: 63 },
  ap:       { label: 'DOSTOPNA TOČKA', x: 49, y: 88 },
  internet: { label: 'INTERNET', x: 90, y: 49 },
  camera:   { label: 'KAMERA', x: 73, y: 70 },
  ravi:     { label: 'RAVI', x: 86, y: 18 },
  cloud:    { label: 'OBLAK', x: 69, y: 30 },
  phone:    { label: 'TELEFON', x: 90, y: 84 }
};

const topologyLinks = {
  pc: ['router', 'switch', 'server'],
  router: ['pc', 'nas', 'server'],
  switch: ['pc', 'server', 'ap'],
  nas: ['router', 'cloud', 'camera'],
  server: ['pc', 'router', 'switch', 'cloud', 'internet', 'camera'],
  ap: ['switch', 'camera', 'phone'],
  cloud: ['nas', 'server', 'internet', 'ravi'],
  camera: ['nas', 'server', 'ap', 'internet', 'phone'],
  internet: ['server', 'cloud', 'camera', 'ravi', 'phone'],
  ravi: ['cloud', 'internet'],
  phone: ['ap', 'camera', 'internet']
};

const correctTopologyRoute = ['pc', 'router', 'server', 'internet', 'ravi'];
let topologyCurrent = 'pc';
let topologyStage = 0;
let topologyWrongAttempts = 0;
let topologyMoving = false;

function resetNetworkGame() {
  if (modules[4].status === 'complete') return;

  topologyCurrent = 'pc';
  topologyStage = 0;
  topologyWrongAttempts = 0;
  topologyMoving = false;

  const packet = document.getElementById('networkPacketDot');
  if (packet) {
    packet.style.setProperty('--x', topologyNodes.pc.x + '%');
    packet.style.setProperty('--y', topologyNodes.pc.y + '%');
    packet.classList.remove('moving');
  }

  document.querySelectorAll('.topology-node').forEach((node) => {
    node.classList.remove('current', 'correct-hop', 'wrong-hop', 'hint-next');
    if (node.dataset.node === 'pc') node.classList.add('current');
  });

  renderDiscoveredRoute();

  const feedback5 = document.getElementById('task5Feedback');
  const ravi5 = document.getElementById('raviTask5Text');
  if (feedback5) {
    feedback5.textContent = '';
    feedback5.className = 'feedback';
  }
  if (ravi5) {
    ravi5.textContent = '»Pošlji paket od računalnika do mene. Omrežje ima več naprav in niso vse prava pot. Izbiraj pametno.«';
  }
}

function renderDiscoveredRoute() {
  const routeBox = document.getElementById('networkDiscoveredRoute');
  const currentLabel = document.getElementById('networkCurrentNode');
  if (!routeBox || !currentLabel) return;

  const discovered = correctTopologyRoute.slice(0, topologyStage + 1);
  routeBox.innerHTML = discovered
    .map((id) => `<span class="route-chip">${topologyNodes[id].label}</span>`)
    .join('');

  currentLabel.textContent = topologyNodes[topologyCurrent].label;
}

function moveTopologyPacket(targetId, returnBack = false) {
  const packet = document.getElementById('networkPacketDot');
  if (!packet) return;

  packet.classList.add('moving');
  packet.style.setProperty('--x', topologyNodes[targetId].x + '%');
  packet.style.setProperty('--y', topologyNodes[targetId].y + '%');

  if (returnBack) {
    setTimeout(() => {
      packet.style.setProperty('--x', topologyNodes[topologyCurrent].x + '%');
      packet.style.setProperty('--y', topologyNodes[topologyCurrent].y + '%');
    }, 620);

    setTimeout(() => {
      packet.classList.remove('moving');
      topologyMoving = false;
    }, 1200);
  } else {
    setTimeout(() => {
      packet.classList.remove('moving');
    }, 580);
  }
}

function chooseTopologyNode(targetId) {
  if (modules[4].status === 'complete' || topologyMoving || targetId === topologyCurrent) return;

  const feedback5 = document.getElementById('task5Feedback');
  const ravi5 = document.getElementById('raviTask5Text');
  const targetButton = document.querySelector(`.topology-node[data-node="${targetId}"]`);
  const linked = topologyLinks[topologyCurrent]?.includes(targetId);
  const expected = correctTopologyRoute[topologyStage + 1];

  if (!linked) {
    topologyWrongAttempts += 1;
    feedback5.textContent = `Med ${topologyNodes[topologyCurrent].label} in ${topologyNodes[targetId].label} ni neposredne povezave.`;
    feedback5.className = 'feedback error';

    if (targetButton) {
      targetButton.classList.remove('wrong-hop');
      void targetButton.offsetWidth;
      targetButton.classList.add('wrong-hop');
      setTimeout(() => targetButton.classList.remove('wrong-hop'), 420);
    }

    applyTopologyHint();
    return;
  }

  topologyMoving = true;
  moveTopologyPacket(targetId, targetId !== expected);

  if (targetId !== expected) {
    topologyWrongAttempts += 1;
    feedback5.textContent = `${topologyNodes[targetId].label} je povezan, vendar paket po tej poti ne pride pravilno do cilja.`;
    feedback5.className = 'feedback error';

    if (targetButton) {
      targetButton.classList.add('wrong-hop');
      setTimeout(() => targetButton.classList.remove('wrong-hop'), 500);
    }

    if (topologyWrongAttempts === 1) {
      ravi5.textContent = '»Povezava obstaja, ampak ni vsaka povezava prava pot do cilja.«';
    }

    applyTopologyHint();
    return;
  }

  setTimeout(() => {
    document.querySelectorAll('.topology-node').forEach((node) => {
      node.classList.remove('current', 'hint-next');
    });

    topologyCurrent = targetId;
    topologyStage += 1;
    topologyMoving = false;

    if (targetButton) {
      targetButton.classList.add('current', 'correct-hop');
      setTimeout(() => targetButton.classList.remove('correct-hop'), 700);
    }

    renderDiscoveredRoute();
    setTechHudValue('network', 'ROUTE', `${topologyStage + 1} HOPS`);
    setTechHudValue('network', 'PACKET', targetId === 'ravi' ? 'DELIVERED' : 'MOVING');

    if (targetId === 'ravi') {
      finishNetworkGame();
      return;
    }

    feedback5.textContent = `Pravilno ✓ Paket je dosegel: ${topologyNodes[targetId].label}.`;
    feedback5.className = 'feedback success';

    if (targetId === 'router') {
      ravi5.textContent = '»Dobro. Usmerjevalnik je prava smer, ampak pot še ni končana.«';
    } else if (targetId === 'server') {
      ravi5.textContent = '»Pravilno. Paket je prišel do vmesnega strežnika. Kam naprej?«';
    } else if (targetId === 'internet') {
      ravi5.textContent = '»Zdaj je paket v internetu. Do mene manjka še zadnji korak.«';
    }
  }, 590);
}

function applyTopologyHint() {
  const feedback5 = document.getElementById('task5Feedback');
  const ravi5 = document.getElementById('raviTask5Text');
  const expected = correctTopologyRoute[topologyStage + 1];

  if (topologyWrongAttempts === 2) {
    if (topologyStage === 0) {
      ravi5.textContent = '»Katera naprava odloča, kam naj omrežni promet potuje naprej?«';
    } else if (topologyStage === 1) {
      ravi5.textContent = '»Ni še čas za internet. Poglej, katera vmesna naprava je povezana naprej.«';
    } else if (topologyStage === 2) {
      ravi5.textContent = '»Zdaj poišči izhod iz lokalnega omrežja.«';
    } else {
      ravi5.textContent = '»Paket je že v internetu. Cilj je precej očiten.«';
    }
  }

  if (topologyWrongAttempts >= 4 && expected) {
    const hintNode = document.querySelector(`.topology-node[data-node="${expected}"]`);
    if (hintNode) hintNode.classList.add('hint-next');
    feedback5.textContent += ' RAVI je označil verjetno naslednjo napravo.';
  }
}

function finishNetworkGame() {
  modules[4].status = 'complete';
  modules[5].status = 'ready';
  completed = Math.max(completed, 5);

  const feedback5 = document.getElementById('task5Feedback');
  const ravi5 = document.getElementById('raviTask5Text');

  feedback5.textContent = 'NALOGA KONČANA ✓ Paket je uspešno prišel do RAVI-ja.';
  feedback5.className = 'feedback success';
  ravi5.textContent = '»Paket dostavljen. Pot si odkril sam — tako omrežje dobi smisel.«';
  document.getElementById('hubMessage').textContent = 'Omrežni modul je aktiven. Varnostni sistem je odklenjen.';

  completeTaskFlow(4, 'task5Feedback', 'NALOGA KONČANA ✓ Paket je uspešno prišel do RAVI-ja.', 1600);
}

function initNetworkTopologyGame() {
  document.querySelectorAll('.topology-node').forEach((node) => {
    if (node.dataset.bound === '1') return;
    node.dataset.bound = '1';
    node.addEventListener('click', () => chooseTopologyNode(node.dataset.node));
  });
}


const securityMessages = [
  {
    sender: 'Google <no-reply@accounts.google.com>',
    subject: 'Nova prijava v vaš Google račun',
    body: 'Zaznali smo novo prijavo v vaš račun. Če ste bili to vi, ni potrebno storiti ničesar.',
    extra: 'accounts.google.com/security',
    safe: true,
    reason: 'Uradna Google domena, brez zahteve po geslu ali občutljivih podatkih.'
  },
  {
    sender: 'Šolski administrator <admin@srednja-sola-ravne.support>',
    subject: 'NUJNO: račun bo izbrisan v 30 minutah',
    body: 'Potrdite geslo takoj, sicer bo vaš šolski račun trajno izbrisan.',
    extra: 'POTRDI GESLO → srednja-sola-ravne.support/login',
    safe: false,
    reason: 'Lažna domena, časovni pritisk in zahteva po geslu so klasični znaki phishinga.'
  },
  {
    sender: 'Knjižnica <knjiznica@srednjasolaravne.si>',
    subject: 'Opomnik za vračilo knjige',
    body: 'Prosimo, da izposojeno knjigo vrnete do petka. Če ste jo že vrnili, sporočilo prezrite.',
    extra: 'Brez povezav in brez zahtev po osebnih podatkih.',
    safe: true,
    reason: 'Šolska domena in običajno informativno sporočilo brez občutljivih zahtev.'
  },
  {
    sender: 'NAGRADA <winner@free-gift-now.biz>',
    subject: 'ČESTITAMO! Osvojili ste iPhone',
    body: 'Za prevzem nagrade vnesite podatke kartice. Ponudba velja samo še 10 minut!',
    extra: 'PREVZEMI → free-gift-now.biz/claim',
    safe: false,
    reason: 'Neverjetna nagrada, sumljiva domena, časovni pritisk in zahteva po podatkih kartice.'
  },
  {
    sender: 'Google <no-reply@accounts.google.com>',
    subject: 'Varnostno opozorilo',
    body: 'Geslo za vaš račun je bilo spremenjeno. Če ste to storili vi, lahko sporočilo prezrete.',
    extra: 'accounts.google.com',
    safe: true,
    reason: 'Uradna domena in tipično varnostno obvestilo brez zahteve po pošiljanju gesla.'
  },
  {
    sender: 'Microsoft <security@mikrosoft.com>',
    subject: 'Preverjanje varnosti računa',
    body: 'Zaradi varnostnega pregleda prosimo, da preverite aktivnost v svojem računu.',
    extra: 'https://mikrosoft.com/account/security',
    safe: false,
    reason: 'Skoraj vse izgleda pravilno, vendar je domena napačna: MIKROSOFT namesto MICROSOFT. Ena sama napačna črka je lahko znak prevare.'
  }
];

let securityIndex = 0;
let securityMistakes = 0;
let securityLocked = false;
let activeSecurityMessages = [...securityMessages];

function shuffleSecurityMessages() {
  const tricky = securityMessages[activeSecurityMessages.length - 1];
  const others = securityMessages.slice(0, -1);

  for (let i = others.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = others[i];
    others[i] = others[j];
    others[j] = tmp;
  }

  activeSecurityMessages = [...others, tricky];
}

function renderSecurityMessage() {
  const msg = activeSecurityMessages[securityIndex];
  if (!msg) return;

  document.getElementById('securitySender').textContent = msg.sender;
  document.getElementById('securitySubject').textContent = msg.subject;
  document.getElementById('securityBody').textContent = msg.body;
  document.getElementById('securityExtra').textContent = msg.extra;
  document.getElementById('securityBadge').textContent = `${securityIndex + 1} / ${activeSecurityMessages.length}`;
  document.getElementById('securityProgress').textContent = `${securityIndex} / ${activeSecurityMessages.length}`;
  document.getElementById('securityMistakes').textContent = String(securityMistakes);
  setTechHudValue('security', 'SAFE', `${securityIndex}/${activeSecurityMessages.length}`);

  const card = document.getElementById('securityMessageCard');
  card.classList.remove('swipe-left','swipe-right','wrong-answer','vault-left','vault-right');
  document.getElementById('securityReason').className = 'security-reason hidden';
}

function resetTask6() {
  if (modules[5].status === 'complete') return;

  securityIndex = 0;
  securityMistakes = 0;
  securityLocked = false;
  shuffleSecurityMessages();

  const feedback6 = document.getElementById('task6Feedback');
  const ravi6 = document.getElementById('raviTask6Text');
  feedback6.textContent = '';
  feedback6.className = 'feedback hidden';
  ravi6.textContent = '»Varnostni skener je poln sporočil. Ti odločaš: levo v karanteno, desno med varna.«';

  renderSecurityMessage();
  setTimeout(() => document.getElementById('securityScanner')?.focus(), 30);
}

function classifySecurityMessage(choice) {
  if (modules[5].status === 'complete' || securityLocked) return;

  const msg = activeSecurityMessages[securityIndex];
  const isSafeChoice = choice === 'safe';
  const correct = isSafeChoice === msg.safe;
  const card = document.getElementById('securityMessageCard');
  const reason = document.getElementById('securityReason');
  const feedback6 = document.getElementById('task6Feedback');
  const ravi6 = document.getElementById('raviTask6Text');

  securityLocked = true;
  card.classList.remove('vault-left','vault-right');
  card.classList.add(choice === 'safe' ? 'swipe-right' : 'swipe-left');

  if (correct) {
    feedback6.textContent = '';
    feedback6.className = 'feedback hidden';
    reason.innerHTML = `<strong>PRAVILNO ✓</strong><span>${msg.reason}</span>`;
    reason.className = 'security-reason result-correct';

    setTimeout(() => {
      card.classList.add(choice === 'safe' ? 'vault-right' : 'vault-left');
    }, 650);

    setTimeout(() => {
      securityIndex += 1;

      if (securityIndex >= activeSecurityMessages.length) {
        finishSecurityGame();
        return;
      }

      securityLocked = false;
      renderSecurityMessage();
    }, 2550);

    return;
  }

  securityMistakes += 1;
  document.getElementById('securityMistakes').textContent = String(securityMistakes);
  feedback6.textContent = '';
  feedback6.className = 'feedback hidden';
  reason.innerHTML = `<strong>NAPAČNO ✕</strong><span>${msg.reason}</span>`;
  reason.className = 'security-reason result-wrong';
  card.classList.add('wrong-answer');

  setTimeout(() => {
    card.classList.remove('swipe-left','swipe-right','wrong-answer');
    securityLocked = false;
  }, 2800);
}

function finishSecurityGame() {
  modules[5].status = 'complete';
  modules[6].status = 'ready';
  completed = Math.max(completed, 6);

  document.getElementById('securityProgress').textContent = `${activeSecurityMessages.length} / ${activeSecurityMessages.length}`;
  const feedback6 = document.getElementById('task6Feedback');
  const ravi6 = document.getElementById('raviTask6Text');

  feedback6.textContent = 'NALOGA KONČANA ✓ Pravilno si pregledal vseh 6 sporočil.';
  feedback6.className = 'feedback success';
  const reason = document.getElementById('securityReason');
  reason.classList.add('hidden');
  ravi6.textContent = '»Dobro. Pri varnosti ni dovolj biti hiter — pomembno je opaziti prave znake.«';
  document.getElementById('hubMessage').textContent = 'Varnostni modul je aktiven. Programiranje aplikacij je odklenjeno.';

  completeTaskFlow(5, 'task6Feedback', 'NALOGA KONČANA ✓ Pravilno si pregledal vseh 6 sporočil.', 1600);
}

function handleSecurityKey(event) {
  if (!document.getElementById('screenTask6')?.classList.contains('active')) return;
  if (isTaskStartOverlayOpen(6)) return;
  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    classifySecurityMessage('danger');
  } else if (event.key === 'ArrowRight') {
    event.preventDefault();
    classifySecurityMessage('safe');
  }
}

function initSecurityScanner() {
  const danger = document.getElementById('securityDangerBtn');
  const safe = document.getElementById('securitySafeBtn');

  if (danger && danger.dataset.bound !== '1') {
    danger.dataset.bound = '1';
    danger.addEventListener('click', () => classifySecurityMessage('danger'));
  }
  if (safe && safe.dataset.bound !== '1') {
    safe.dataset.bound = '1';
    safe.addEventListener('click', () => classifySecurityMessage('safe'));
  }
}

const runnerState = {
  x:80, y:70, vx:0, vy:0, running:false, left:false, right:false,
  onGround:true, collected:new Set(), hits:0, checkpoint:80,
  lastTime:0, raf:null, invulnerableUntil:0, finishing:false, firewallOpen:false
};

const runnerGroundY = 70;
const runnerWorldWidth = 2360;
const runnerPlatforms = [
  { x:700, w:170, y:161 },
  { x:1180, w:170, y:161 },
  { x:1690, w:180, y:161 },
  { x:1855, w:150, y:241 }
];

const runnerHazards = [
  { x:535, w:64, h:44 },
  { x:1030, w:76, h:58 },
  { x:2050, w:90, h:190 }
];

const runnerCodes = [
  { x:365, y:150, checkpoint:300 },
  { x:860, y:255, checkpoint:700 },
  { x:1345, y:255, checkpoint:1180 }
];

function updateRunnerHud() {
  document.getElementById('runnerCodeCount').textContent = `${runnerState.collected.size} / 3`;
  document.getElementById('runnerHits').textContent = String(runnerState.hits);
  setTechHudValue('runner', 'CHECKPOINT', String(runnerState.collected.size + 1).padStart(2,'0'));
  setTechHudValue('runner', 'EVENTS', runnerState.running ? 'LIVE' : 'READY');
}

function renderRunnerPosition() {
  const player = document.getElementById('runnerPlayer');
  const world = document.getElementById('runnerWorld');
  const viewport = document.getElementById('runnerViewport');
  if (!player || !world || !viewport) return;

  player.style.setProperty('--x', runnerState.x + 'px');
  player.style.setProperty('--y', runnerState.y + 'px');

  const maxCamera = Math.max(0, runnerWorldWidth - viewport.clientWidth);
  const cameraX = Math.max(0, Math.min(runnerState.x - viewport.clientWidth * 0.36, maxCamera));
  world.style.transform = `translateX(${-cameraX}px)`;
}

function resetRunnerGame() {
  if (runnerState.raf) cancelAnimationFrame(runnerState.raf);

  runnerState.x = 80;
  runnerState.y = runnerGroundY;
  runnerState.vx = 0;
  runnerState.vy = 0;
  runnerState.running = false;
  runnerState.left = false;
  runnerState.right = false;
  runnerState.onGround = true;
  runnerState.collected = new Set();
  runnerState.hits = 0;
  runnerState.checkpoint = 80;
  runnerState.lastTime = 0;
  runnerState.raf = null;
  runnerState.invulnerableUntil = 0;
  runnerState.finishing = false;
  runnerState.firewallOpen = false;

  document.querySelectorAll('.runner-code').forEach((el) => el.classList.remove('collected'));
  document.getElementById('runnerGoal')?.classList.remove('unlocked');
  document.querySelector('.runner-final-wall')?.classList.remove('open', 'completed-open');
  document.getElementById('runnerOverlay')?.classList.add('hidden');

  const feedback7 = document.getElementById('task7Feedback');
  if (feedback7) {
    feedback7.textContent = '';
    feedback7.className = 'feedback';
  }

  const ravi7 = document.getElementById('raviTask7Text');
  if (ravi7) ravi7.textContent = '»Tokrat ne bo dovolj samo teči naravnost. Nekatere ovire zahtevajo malo višine.«';

  updateRunnerHud();
  requestAnimationFrame(renderRunnerPosition);
}

function startRunnerGame() {
  if (modules[6].status === 'complete' || runnerState.running || runnerState.finishing) return;
  document.getElementById('runnerOverlay')?.classList.add('hidden');
  runnerState.running = true;
  runnerState.lastTime = performance.now();
  document.getElementById('runnerViewport')?.focus();
  runnerState.raf = requestAnimationFrame(runnerLoop);
}

function runnerJump() {
  if (!runnerState.running || !runnerState.onGround) return;
  runnerState.vy = 570;
  runnerState.onGround = false;
}

function handleRunnerKeyDown(event) {
  if (!document.getElementById('screenTask7')?.classList.contains('active')) return;
  if (isTaskStartOverlayOpen(7)) return;

  if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') {
    event.preventDefault();
    runnerState.left = true;
  }
  if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') {
    event.preventDefault();
    runnerState.right = true;
  }
  if (event.code === 'Space') {
    event.preventDefault();
    runnerJump();
  }
}

function handleRunnerKeyUp(event) {
  if (isTaskStartOverlayOpen(7)) return;
  if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') runnerState.left = false;
  if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') runnerState.right = false;
}

function runnerHit(respawnX = null) {
  runnerState.hits += 1;
  runnerState.invulnerableUntil = performance.now() + 450;
  runnerState.x = respawnX ?? runnerState.checkpoint;
  runnerState.y = runnerGroundY;
  runnerState.vx = 0;
  runnerState.vy = 0;

  const player = document.getElementById('runnerPlayer');
  player?.classList.add('hit');
  setTimeout(() => player?.classList.remove('hit'), 500);

  document.getElementById('task7Feedback').textContent = 'BUG! RAVI se je vrnil na zadnjo varno točko.';
  document.getElementById('task7Feedback').className = 'feedback error';
  updateRunnerHud();
}

function collectRunnerCode(index) {
  if (runnerState.collected.has(index)) return;
  runnerState.collected.add(index);
  runnerState.checkpoint = runnerCodes[index].checkpoint;

  document.querySelector(`.runner-code[data-code="${index}"]`)?.classList.add('collected');
  updateRunnerHud();

  const feedback7 = document.getElementById('task7Feedback');
  feedback7.textContent = `Košček kode ${runnerState.collected.size}/3 zbran ✓`;
  feedback7.className = 'feedback success';

  if (runnerState.collected.size === 3) {
    document.getElementById('runnerGoal')?.classList.add('unlocked');
    document.getElementById('raviTask7Text').textContent = '»Vsa koda zbrana. Zdaj samo še do terminala — brez dramatičnega padca tik pred ciljem.«';
  }
}

function runnerLoop(now) {
  if (!runnerState.running) return;

  const dt = Math.min((now - runnerState.lastTime) / 1000, 0.032);
  runnerState.lastTime = now;

  const accel = 1050;
  const maxSpeed = 260;

  if (runnerState.left) runnerState.vx -= accel * dt;
  if (runnerState.right) runnerState.vx += accel * dt;
  if (!runnerState.left && !runnerState.right) runnerState.vx *= 0.84;
  runnerState.vx = Math.max(-maxSpeed, Math.min(maxSpeed, runnerState.vx));

  const previousY = runnerState.y;
  runnerState.vy -= 1500 * dt;
  runnerState.x += runnerState.vx * dt;
  runnerState.y += runnerState.vy * dt;
  runnerState.x = Math.max(24, Math.min(runnerWorldWidth - 30, runnerState.x));

  const firewallEl = document.querySelector('.runner-final-wall');

  if (!runnerState.firewallOpen && runnerState.x > 2145) {
    runnerState.firewallOpen = true;

    if (runnerState.collected.size === 3) {
      firewallEl?.classList.remove('open');
      firewallEl?.classList.add('completed-open');
    } else {
      firewallEl?.classList.add('open');
    }
  }

  if (runnerState.firewallOpen && runnerState.x < 2000 && runnerState.collected.size < 3) {
    runnerState.firewallOpen = false;
    firewallEl?.classList.remove('open');
  }

  runnerState.onGround = false;

  let landingY = null;
  const crossedGroundFromAbove =
    previousY >= runnerGroundY &&
    runnerState.y <= runnerGroundY &&
    runnerState.vy <= 0;

  if (crossedGroundFromAbove) {
    landingY = runnerGroundY;
  }

  if (runnerState.vy <= 0) {
    for (const platform of runnerPlatforms) {
      const overPlatform =
        runnerState.x + 18 > platform.x &&
        runnerState.x - 18 < platform.x + platform.w;

      const wasAboveSurface = previousY >= platform.y;
      const reachedSurface = runnerState.y <= platform.y;

      if (overPlatform && wasAboveSurface && reachedSurface) {
        if (landingY === null || platform.y > landingY) landingY = platform.y;
      }
    }
  }

  if (landingY !== null) {
    runnerState.y = landingY;
    runnerState.vy = 0;
    runnerState.onGround = true;
  }

  if (runnerState.y < -75) {
    runnerHit();
  }

  for (const hazard of runnerHazards) {
    const playerLeft = runnerState.x - 18;
    const playerRight = runnerState.x + 18;
    const playerBottom = runnerState.y;
    const playerTop = runnerState.y + 68;
    const hazardLeft = hazard.x;
    const hazardRight = hazard.x + hazard.w;
    const hazardBottom = runnerGroundY;
    const hazardTop = runnerGroundY + hazard.h;

    const isFinalWall = hazard.x >= 2000;
    const overlaps =
      playerRight > hazardLeft &&
      playerLeft < hazardRight &&
      playerTop > hazardBottom &&
      playerBottom < hazardTop;

    if (overlaps && !(isFinalWall && runnerState.firewallOpen)) {
      runnerHit(isFinalWall ? 1575 : null);
      break;
    }
  }

  runnerCodes.forEach((code, index) => {
    if (runnerState.collected.has(index)) return;
    const playerLeft = runnerState.x - 18;
    const playerRight = runnerState.x + 18;
    const playerBottom = runnerState.y;
    const playerTop = runnerState.y + 68;

    const codeLeft = code.x - 20;
    const codeRight = code.x + 20;
    const codeBottom = code.y;
    const codeTop = code.y + 40;

    const touching =
      playerRight >= codeLeft &&
      playerLeft <= codeRight &&
      playerTop >= codeBottom &&
      playerBottom <= codeTop;

    if (touching) collectRunnerCode(index);
  });

  if (runnerState.x > 2215) {
    if (runnerState.collected.size === 3) {
      startRunnerExitSequence();
      return;
    }

    runnerState.x = 2195;
    runnerState.vx = 0;

    const feedback7 = document.getElementById('task7Feedback');
    feedback7.textContent = `ACCESS DENIED ✕ KODA: ${runnerState.collected.size} / 3`;
    feedback7.className = 'feedback error';
    document.getElementById('raviTask7Text').textContent = '»Terminal potrebuje vse tri koščke kode. Firewall je odprt — lahko greš nazaj po manjkajočega.«';
  }

  renderRunnerPosition();
  runnerState.raf = requestAnimationFrame(runnerLoop);
}

function startRunnerExitSequence() {
  if (runnerState.finishing) return;

  runnerState.finishing = true;
  runnerState.running = false;
  if (runnerState.raf) cancelAnimationFrame(runnerState.raf);

  const player = document.getElementById('runnerPlayer');
  const goal = document.getElementById('runnerGoal');
  const firewallEl = document.querySelector('.runner-final-wall');

  runnerState.firewallOpen = true;
  firewallEl?.classList.remove('open');
  firewallEl?.classList.add('completed-open');
  const feedback7 = document.getElementById('task7Feedback');

  if (feedback7) {
    feedback7.textContent = 'TERMINAL ODKLENJEN ✓ RAVI vstopa v sistem ...';
    feedback7.className = 'feedback success';
  }

  goal?.classList.add('entering');
  player?.classList.add('entering-terminal');

  setTimeout(() => {
    player?.classList.add('inside-terminal');
  }, 520);

  setTimeout(() => {
    finishRunnerGame();
  }, 1250);
}

function finishRunnerGame() {
  runnerState.running = false;
  runnerState.finishing = false;
  if (runnerState.raf) cancelAnimationFrame(runnerState.raf);

  modules[6].status = 'complete';
  modules[7].status = 'ready';
  completed = Math.max(completed, 7);

  const feedback7 = document.getElementById('task7Feedback');
  feedback7.textContent = 'NALOGA KONČANA ✓ Zbral si vso kodo in odklenil terminal.';
  feedback7.className = 'feedback success';
  document.getElementById('raviTask7Text').textContent = '»To je že bolj podobno pravi aplikaciji: gibanje, dogodki, kolizije in cilj. In nič opekačev.«';
  document.getElementById('hubMessage').textContent = 'Programiranje aplikacij je aktivno. Zadnji modul – Umetna inteligenca – je odklenjen.';

  completeTaskFlow(6, 'task7Feedback', 'NALOGA KONČANA ✓ Zbral si vso kodo in odklenil terminal.', 1600);
}


const mlTrainingItems = [
  { id:'cat1', label:'Muca', type:'cat', icon:'🐱' },
  { id:'dog1', label:'Pes', type:'dog', icon:'🐶' },
  { id:'cat2', label:'Mačka', type:'cat', icon:'🐈' },
  { id:'dog2', label:'Kuža', type:'dog', icon:'🐕' },
  { id:'cat3', label:'Svetla mačka', type:'cat', icon:'🐱' },
  { id:'dog3', label:'Velik pes', type:'dog', icon:'🐕‍🦺' },
  { id:'cat4', label:'Majhna mačka', type:'cat', icon:'🐈' },
  { id:'dog4', label:'Temen pes', type:'dog', icon:'🐕' }
];

let mlPlaced = new Map();
let mlStage = 0;
let mlBusy = false;

function setMLPhase(id) {
  document.querySelectorAll('#screenTask8 .ml-phase').forEach((phase) => {
    phase.classList.toggle('active', phase.id === id);
  });
}

function updateMLStage(stage) {
  mlStage = stage;
  document.getElementById('mlStageLabel').textContent = `${stage + 1} / 4`;
  document.querySelectorAll('.ml-progress-dots span').forEach((dot,index) => {
    dot.classList.toggle('active', index === stage);
    dot.classList.toggle('done', index < stage);
  });
}

function renderMLTrainingCards() {
  const container = document.getElementById('mlTrainingCards');
  if (!container) return;
  container.innerHTML = '';

  const shuffledItems = [...mlTrainingItems].sort(() => Math.random() - 0.5);

  shuffledItems.forEach((item,index) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'ml-training-card';
    card.draggable = true;
    card.dataset.id = item.id;
    card.dataset.type = item.type;
    card.innerHTML = `
      <span class="ml-card-index">${String(index + 1).padStart(2,'0')}</span>
      <span class="ml-card-animal">${item.icon}</span>
      <strong>${item.label}</strong>
      <small>TRAINING SAMPLE</small>
    `;

    card.addEventListener('dragstart', (event) => {
      event.dataTransfer.setData('text/plain', item.id);
      card.classList.add('dragging');
    });

    card.addEventListener('dragend', () => card.classList.remove('dragging'));

    card.addEventListener('click', () => {
      if (mlPlaced.has(item.id)) return;
      const target = item.type === 'cat'
        ? document.querySelector('.ml-dropzone.cat-zone')
        : document.querySelector('.ml-dropzone.dog-zone');
      placeMLItem(item.id, target?.dataset.class);
    });

    container.appendChild(card);
  });
}

function placeMLItem(itemId, targetClass) {
  if (mlBusy || mlPlaced.has(itemId)) return;

  const item = mlTrainingItems.find((entry) => entry.id === itemId);
  if (!item) return;

  const card = document.querySelector(`.ml-training-card[data-id="${itemId}"]`);
  if (!card) return;

  mlBusy = true;
  const analysis = document.getElementById('mlSampleAnalysis');
  const analysisText = document.getElementById('mlSampleAnalysisText');

  analysis.classList.remove('hidden','correct','wrong');
  analysisText.textContent = `${item.icon}  ${item.label.toUpperCase()} // ANALIZA`;
  setRaviMessage('raviTask8Text', '»Analiziram izbrani primer ...«', 'instruction');

  setTimeout(() => {
    const correct = item.type === targetClass;

    if (!correct) {
      analysis.classList.add('wrong');
      analysisText.textContent = 'NAPAČNA SKUPINA ✕';
      card.classList.add('wrong');
      setRaviMessage(
        'raviTask8Text',
        item.type === 'cat'
          ? '»To je mačka. Premakni jo v skupino MAČKA.«'
          : '»To je pes. Premakni ga v skupino PES.«',
        'error'
      );

      setTimeout(() => {
        analysis.classList.add('hidden');
        analysis.classList.remove('wrong');
        card.classList.remove('wrong');
        mlBusy = false;
      }, 560);
      return;
    }

    mlPlaced.set(itemId, targetClass);
    card.classList.add('placed', targetClass);
    card.draggable = false;
    analysis.classList.add('correct');
    analysisText.textContent = 'PRIMER DODAN ✓';

    const cats = [...mlPlaced.values()].filter((value) => value === 'cat').length;
    const dogs = [...mlPlaced.values()].filter((value) => value === 'dog').length;
    const total = mlPlaced.size;

    document.getElementById('mlTrainCount').textContent = `${total} / 8`;
    document.getElementById('mlDatasetStatus').textContent = `${total} / 8`;
    document.getElementById('mlCatCount').textContent = `${cats} primerov`;
    document.getElementById('mlDogCount').textContent = `${dogs} primerov`;

    setRaviMessage(
      'raviTask8Text',
      total < 8
        ? `»Pravilno. Primer ${total}/8 je dodan v trening podatke.«`
        : '»Vseh 8 primerov je pripravljenih. Začenjam trening modela.«',
      'success'
    );

    setTimeout(() => {
      analysis.classList.add('hidden');
      analysis.classList.remove('correct');

      if (total === 8) {
        document.getElementById('raviTask8Text').textContent = '»Dataset pripravljen. Začenjam trening modela.«';
        startMLTraining();
      } else {
        mlBusy = false;
      }
    }, 560);
  }, 520);
}

function initMLDropzones() {
  document.querySelectorAll('.ml-dropzone').forEach((zone) => {
    zone.addEventListener('dragover', (event) => {
      event.preventDefault();
      zone.classList.add('drag-over');
    });

    zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));

    zone.addEventListener('drop', (event) => {
      event.preventDefault();
      zone.classList.remove('drag-over');
      placeMLItem(event.dataTransfer.getData('text/plain'), zone.dataset.class);
    });
  });
}

function startMLTraining() {
  updateMLStage(1);
  setMLPhase('mlTrainingAnimation');
  setRaviMessage('raviTask8Text', '»Trening je avtomatski. Opazuj, kako model išče vzorce v podatkih.«', 'instruction');
  document.getElementById('mlModelStatus').textContent = 'TRAINING';
  document.getElementById('mlAccuracyStatus').textContent = '--';

  const bar = document.getElementById('mlTrainingBar');
  const percent = document.getElementById('mlTrainingPercent');
  const step = document.getElementById('mlTrainingStep');
  bar.style.width = '0%';
  percent.textContent = '0 %';

  const frames = [
    { p:18, text:'Priprava podatkov ...' },
    { p:41, text:'Iskanje vzorcev ...' },
    { p:67, text:'Prilagajanje uteži ...' },
    { p:84, text:'Preverjanje modela ...' },
    { p:100, text:'MODEL READY' }
  ];

  frames.forEach((frame,index) => {
    setTimeout(() => {
      bar.style.width = `${frame.p}%`;
      percent.textContent = `${frame.p} %`;
      step.textContent = frame.text;
    }, 450 + index * 620);
  });

  setTimeout(() => {
    document.getElementById('mlModelStatus').textContent = 'ONLINE';
    document.getElementById('mlAccuracyStatus').textContent = '84 %';
    document.getElementById('raviTask8Text').textContent = '»Model je pripravljen. Zdaj bom poskusil sam.«';
    updateMLStage(2);
    setMLPhase('mlTestPhase');
    setRaviMessage('raviTask8Text', '»Nov primer: črna mačka. Poglej, kaj bom napovedal.«', 'instruction');
    mlBusy = false;
    setTimeout(runMLBadPrediction, 420);
  }, 3900);
}

function runMLBadPrediction() {
  const continueBtn = document.getElementById('mlContinueAfterError');
  const errorExplain = document.getElementById('mlErrorExplain');

  if (continueBtn) {
    continueBtn.disabled = true;
    continueBtn.hidden = true;
    continueBtn.classList.add('hidden');
    continueBtn.textContent = 'POPRAVI MODEL';
  }
  errorExplain?.classList.add('hidden');

  const phase = document.getElementById('mlTestPhase');
  const scene = phase.querySelector('.ml-test-scene');
  scene.classList.add('scanning');

  document.getElementById('mlPredictionText').textContent = 'ANALIZA ...';
  document.getElementById('mlPredictionConfidence').textContent = '--';

  setTimeout(() => {
    scene.classList.remove('scanning');
    scene.classList.add('prediction-wrong');
    document.getElementById('mlPredictionText').textContent = 'PES';
    document.getElementById('mlPredictionConfidence').textContent = '92 %';
    document.getElementById('mlPredictionSub').textContent = 'Napačna napoved: prikazana je črna mačka.';
    setRaviMessage('raviTask8Text', '»Zmotil sem se. Moji učni podatki niso bili dovolj raznoliki.«', 'error');

    errorExplain?.classList.remove('hidden');

    if (continueBtn) {
      continueBtn.disabled = false;
      continueBtn.hidden = false;
      continueBtn.classList.remove('hidden');
      continueBtn.onclick = () => {
        continueBtn.hidden = true;
        continueBtn.classList.add('hidden');
        errorExplain?.classList.add('hidden');
        updateMLStage(2);
        setMLPhase('mlRetrainPhase');
        setRaviMessage('raviTask8Text', '»Izberi EN paket podatkov, ki bi moj model najbolje izboljšal.«', 'instruction');
      };
    }
  }, 1450);
}

function chooseMLPackage(packageId) {
  if (mlBusy) return;

  document.getElementById('mlContinueAfterError')?.classList.add('hidden');

  const feedback = document.getElementById('mlPackageFeedback');
  const continueWrap = document.getElementById('mlPackageContinueWrap');
  const continuePackageBtn = document.getElementById('mlContinueAfterPackage');
  const buttons = document.querySelectorAll('.ml-data-package');

  continueWrap?.classList.add('hidden');

  if (packageId !== 'a') {
    feedback.className = 'ml-package-feedback wrong';
    feedback.innerHTML = packageId === 'b'
      ? '<strong>PREMALO RAZNOLIKO ✕</strong><span>Še več enakih primerov modelu ne pomaga razumeti novih oblik, barv in velikosti. Poskusi drug paket.</span>'
      : '<strong>NAPAČNI PODATKI ✕</strong><span>Avtomobili ne pomagajo modelu razlikovati med mačko in psom. Poskusi drug paket.</span>';

    setRaviMessage(
      'raviTask8Text',
      packageId === 'b'
        ? '»Več istega ni vedno boljše. Potrebujem bolj raznolike primere.«'
        : '»Avtomobili so zanimivi, ampak moj problem je še vedno mačka proti psu.«',
      'error'
    );
    return;
  }

  buttons.forEach((button) => button.classList.remove('selected'));
  document.querySelector('.ml-data-package[data-package="a"]')?.classList.add('selected');

  feedback.className = 'ml-package-feedback correct';
  feedback.innerHTML = '<strong>DOBRA IZBIRA ✓</strong><span>Raznoliki primeri mačk in psov pomagajo modelu ločiti pomembne značilnosti in zmanjšajo možnost, da bi sklepal samo po barvi ali velikosti.</span>';
  setRaviMessage('raviTask8Text', '»To so boljši podatki. Preberi zakaj, nato nadaljujeva z učenjem.«', 'success');

  continueWrap?.classList.remove('hidden');
  if (continuePackageBtn) {
    continuePackageBtn.onclick = () => {
      mlBusy = true;
      buttons.forEach((button) => button.disabled = true);
      continueWrap.classList.add('hidden');
      startMLRetrainingScan();
    };
  }
}

function startMLRetrainingScan() {
  updateMLStage(3);
  setMLPhase('mlRetrainScanPhase');
  setRaviMessage('raviTask8Text', '»Pregledujem nove, bolj raznolike primere.«', 'instruction');

  const samples = [
    { icon:'🐈‍⬛', label:'ČRNA MAČKA' },
    { icon:'🐩', label:'MAJHEN PES' },
    { icon:'🐈', label:'VELIKA MAČKA' },
    { icon:'🐕‍🦺', label:'TEMEN PES' },
    { icon:'🐱', label:'SVETLA MAČKA' },
    { icon:'🐶', label:'SVETEL PES' }
  ];

  let index = 0;
  const animal = document.getElementById('mlRetrainAnimal');
  const label = document.getElementById('mlRetrainLabel');
  const counter = document.getElementById('mlRetrainCounter');
  const scene = document.querySelector('.ml-retrain-scan');

  function showSample() {
    const sample = samples[index];
    scene.classList.remove('scanning');
    void scene.offsetWidth;
    scene.classList.add('scanning');
    animal.textContent = sample.icon;
    label.textContent = sample.label;
    counter.textContent = `${index + 1} / ${samples.length}`;

    index += 1;
    if (index < samples.length) {
      setTimeout(showSample, 760);
    } else {
      setTimeout(startMLRetraining, 1050);
    }
  }

  showSample();
}

function startMLRetraining() {
  updateMLStage(3);
  setMLPhase('mlTrainingAnimation');
  setRaviMessage('raviTask8Text', '»Dobri podatki izbrani. Ponovno treniram isti model.«', 'success');

  document.getElementById('mlTrainingPercent').textContent = '0 %';
  document.getElementById('mlTrainingBar').style.width = '0%';
  document.getElementById('mlTrainingStep').textContent = 'ADDING NEW DATA ...';
  document.getElementById('mlModelStatus').textContent = 'RETRAINING';

  const frames = [
    { p:24, text:'ADDING NEW DATA ...' },
    { p:49, text:'REBALANCING MODEL ...' },
    { p:73, text:'LEARNING NEW FEATURES ...' },
    { p:100, text:'MODEL IMPROVED' }
  ];

  frames.forEach((frame,index) => {
    setTimeout(() => {
      document.getElementById('mlTrainingBar').style.width = `${frame.p}%`;
      document.getElementById('mlTrainingPercent').textContent = `${frame.p} %`;
      document.getElementById('mlTrainingStep').textContent = frame.text;
    }, 350 + index * 620);
  });

  setTimeout(() => {
    document.getElementById('mlModelStatus').textContent = 'IMPROVED';
    document.getElementById('mlAccuracyStatus').textContent = '97 %';
    document.getElementById('raviTask8Text').textContent = '»Model posodobljen. Ponoviva isti primer.«';
    setMLPhase('mlFinalPhase');
    setRaviMessage('raviTask8Text', '»Isti primer še enkrat. Ponovno ga analiziram z izboljšanim modelom.«', 'instruction');
    runMLFinalRetest();
    mlBusy = false;
  }, 3200);
}

function runMLFinalRetest() {
  const finalPhase = document.getElementById('mlFinalPhase');
  finalPhase?.classList.remove('reveal-insight');

  const scene = document.querySelector('.ml-final-scan');
  const panel = scene?.querySelector('.ml-prediction-panel');
  const title = panel?.querySelector('strong');
  const text = panel?.querySelector('p');
  const confidence = scene?.querySelector('.ml-detect-frame b');

  if (!scene || !panel || !title || !text || !confidence) return;

  scene.classList.remove('scanning');
  void scene.offsetWidth;
  scene.classList.add('scanning');

  title.textContent = 'ANALIZA ...';
  text.textContent = 'RAVI ponovno preverja isti primer.';
  confidence.textContent = '--';

  setTimeout(() => {
    scene.classList.remove('scanning');
    title.textContent = 'MAČKA ✓';
        text.textContent = 'Tokrat je RAVI pravilno prepoznal črno mačko. Boljši podatki so izboljšali model.';
    confidence.textContent = '97 %';
    finalPhase?.classList.add('reveal-insight');
    setRaviMessage('raviTask8Text', '»Tokrat sem jo pravilno prepoznal. Boljši podatki so očitno pomagali.«', 'success');

    setTimeout(finishMLModule, 3200);
  }, 1300);
}

function finishMLModule() {
  if (modules[7].status === 'complete') return;

  mlBusy = true;
  const shell = document.querySelector('.ml-lab-shell');
  shell?.classList.add('ml-complete');
  document.getElementById('raviTask8Text').textContent =
    '»Zdaj razumem bistvo: AI se uči iz podatkov. Boljši podatki pomenijo boljši model — človek pa mora znati preveriti rezultat.«';

  modules[7].status = 'complete';
  completed = 8;
  document.getElementById('hubMessage').textContent = 'Vseh 8 modulov je aktivnih. Sistem je pripravljen.';
    completeTaskFlow(7, null, '', 1800);

  setTimeout(() => {
    shell?.classList.remove('ml-complete');
  }, 1800);
}

function resetTask8() {
  if (modules[7].status === 'complete') return;

  mlPlaced = new Map();
  mlStage = 0;
  mlBusy = false;
  updateMLStage(0);
  setMLPhase('mlTrainingPhase');

  document.getElementById('mlDatasetStatus').textContent = '0 / 8';
  document.getElementById('mlModelStatus').textContent = 'OFFLINE';
  document.getElementById('mlAccuracyStatus').textContent = '--';
  document.getElementById('mlTrainCount').textContent = '0 / 8';
  document.getElementById('mlCatCount').textContent = '0 primerov';
  document.getElementById('mlDogCount').textContent = '0 primerov';
  document.getElementById('mlTrainingBar').style.width = '0%';
  document.getElementById('mlTrainingPercent').textContent = '0 %';

  const feedback = document.getElementById('mlPackageFeedback');
  feedback.className = 'ml-package-feedback hidden';
  feedback.textContent = '';
  document.getElementById('mlPackageContinueWrap')?.classList.add('hidden');
  document.getElementById('mlErrorExplain')?.classList.add('hidden');
  const mlContinueAfterError = document.getElementById('mlContinueAfterError');
  if (mlContinueAfterError) {
    mlContinueAfterError.disabled = true;
    mlContinueAfterError.hidden = true;
    mlContinueAfterError.classList.add('hidden');
    mlContinueAfterError.textContent = 'POPRAVI MODEL';
  }
  

  document.querySelectorAll('.ml-data-package').forEach((button) => {
    button.disabled = false;
    button.classList.remove('selected');
  });

  const testScene = document.querySelector('.ml-test-scene');
  testScene?.classList.remove('prediction-wrong','scanning');
  document.getElementById('mlFinalPhase')?.classList.remove('reveal-insight');

  document.getElementById('raviTask8Text').textContent =
    '»Najprej potrebujem primere. Razvrsti jih pravilno, potem se bom iz njih učil.«';
  setRaviMessage('raviTask8Text', '»Razvrsti prvi primer. Po vsakem izboru ga bom na hitro analiziral.«', 'instruction');

  renderMLTrainingCards();
}

/* initialize restart buttons hidden until each task starts */
[1,2,3,4,5,6,7,8].forEach((taskNumber) => setTaskRestartVisible(taskNumber, false));

function isTaskStartOverlayOpen(taskNumber) {
  const overlay = taskNumber === 1
    ? document.getElementById('catchStartOverlay')
    : document.getElementById(`task${taskNumber}StartOverlay`);

  const screen = document.getElementById(`screenTask${taskNumber}`);

  return !!overlay &&
    !!screen &&
    screen.classList.contains('active') &&
    !overlay.classList.contains('hidden');
}

function handleStartOverlayEnter(event) {
  if (event.key !== 'Enter' || event.repeat) return;

  const startButtons = [
    { task:1, id:'startCatchGame' },
    { task:2, id:'startTask2Game' },
    { task:3, id:'startTask3Game' },
    { task:4, id:'startTask4Game' },
    { task:5, id:'startTask5Game' },
    { task:6, id:'startTask6Game' },
    { task:7, id:'startTask7Game' },
    { task:8, id:'startTask8Game' }
  ];

  const active = startButtons.find(({ task, id }) => {
    const button = document.getElementById(id);
    return button && !button.disabled && isTaskStartOverlayOpen(task);
  });

  if (!active) return;

  event.preventDefault();
  event.stopImmediatePropagation();
  document.getElementById(active.id)?.click();
}


function handleGlobalPrimaryEnter(event) {
  if (event.key !== 'Enter' || event.repeat || event.defaultPrevented) return;

  const activeScreen = document.querySelector('.screen.active');
  if (!activeScreen) return;

  const target = event.target;
  const editable = target &&
    (target.tagName === 'INPUT' ||
     target.tagName === 'TEXTAREA' ||
     target.tagName === 'SELECT' ||
     target.isContentEditable);

  if (editable) return;

  const primaryButtons = [...activeScreen.querySelectorAll('.primary-btn')]
    .filter((button) =>
      !button.disabled &&
      !button.hidden &&
      button.offsetParent !== null
    );

  if (primaryButtons.length !== 1) return;

  event.preventDefault();
  event.stopImmediatePropagation();
  primaryButtons[0].click();
}

document.addEventListener('keydown', handleGlobalPrimaryEnter, true);
document.addEventListener('keydown', handleStartOverlayEnter, true);

document.getElementById('startBtn').addEventListener('click', () => showStoryRoom(0));

function initTestRoomJump() {
  const testRoomJump = document.getElementById('testRoomJump');
  if (!testRoomJump) return;

  testRoomJump.hidden = !TEST_MODE;
  if (!TEST_MODE) return;

  testRoomJump.querySelectorAll('[data-test-room]').forEach((button) => {
    button.addEventListener('click', () => {
      const roomIndex = Number(button.dataset.testRoom);

      completed = Math.max(completed, roomIndex);
      modules.forEach((module, index) => {
        if (index < roomIndex) module.status = 'complete';
        else if (index === roomIndex) module.status = 'ready';
      });

      updateProgress();
      showStoryRoom(roomIndex);
    });
  });
}

initTestRoomJump();
document.getElementById('startCatchGame').addEventListener('click', () => {
  document.getElementById('catchStartOverlay')?.classList.add('hidden');
  setTaskRestartVisible(1, true);
  startCatchGame();
});
document.getElementById('restartCatchGame').addEventListener('click', () => { resetCatchGame(); showTaskStartOverlay(1); });
document.getElementById('backHub1').addEventListener('click', () => {
  stopCatchGame();
  showStoryRoom(0);
});
document.addEventListener('keydown', handleCatchKeyDown);
document.addEventListener('keyup', handleCatchKeyUp);
document.getElementById('runProgramGame').addEventListener('click', runProgramGame);
document.getElementById('clearProgramGame').addEventListener('click', clearProgramGame);
document.getElementById('restartTask2').addEventListener('click', () => {
  resetProgramGame();
  showTaskStartOverlay(2);
});
document.getElementById('backHub2').addEventListener('click', () => {
  programRunning = false;
  showStoryRoom(1);
});
document.addEventListener('keydown', handleProgramKey);
document.getElementById('resetTask3').addEventListener('click', () => { resetHtmlRepairGame(); showTaskStartOverlay(3); });
document.getElementById('backHub3').addEventListener('click', () => showStoryRoom(2));
document.getElementById('checkTask4').addEventListener('click', checkTask4);
document.getElementById('resetTask4').addEventListener('click', () => { resetTask4(); showTaskStartOverlay(4); });
document.getElementById('backHub4').addEventListener('click', () => showStoryRoom(3));
document.getElementById('resetTask5').addEventListener('click', () => { resetNetworkGame(); showTaskStartOverlay(5); });
document.getElementById('backHub5').addEventListener('click', () => showStoryRoom(4));
document.getElementById('resetTask6').addEventListener('click', () => { resetTask6(); showTaskStartOverlay(6); });
document.getElementById('backHub6').addEventListener('click', () => showStoryRoom(5));
document.addEventListener('keydown', handleSecurityKey);
document.getElementById('startRunner').addEventListener('click', startRunnerGame);
document.getElementById('resetTask7').addEventListener('click', () => { resetRunnerGame(); showTaskStartOverlay(7); });
document.getElementById('backHub7').addEventListener('click', () => {
  runnerState.running = false;
  if (runnerState.raf) cancelAnimationFrame(runnerState.raf);
  showStoryRoom(6);
});
document.addEventListener('keydown', handleRunnerKeyDown);
document.addEventListener('keyup', handleRunnerKeyUp);
document.querySelectorAll('.ml-data-package').forEach((button) => {
  button.addEventListener('click', () => chooseMLPackage(button.dataset.package));
});
document.getElementById('resetTask8').addEventListener('click', () => { resetTask8(); showTaskStartOverlay(8); });
document.getElementById('backHub8').addEventListener('click', () => showStoryRoom(7));
document.getElementById('enterStoryRoom').addEventListener('click', enterStoryRoom);

function setTaskRestartVisible(taskNumber, visible) {
  const ids = {
    1:'restartCatchGame',
    2:'restartTask2',
    3:'resetTask3',
    4:'resetTask4',
    5:'resetTask5',
    6:'resetTask6',
    7:'resetTask7',
    8:'resetTask8'
  };

  const button = document.getElementById(ids[taskNumber]);
  if (!button) return;

  button.hidden = !visible;
  button.disabled = !visible;
}

function showTaskStartOverlay(taskNumber) {
  setTaskRestartVisible(taskNumber, false);

  if (taskNumber === 1) {
    document.getElementById('catchStartOverlay')?.classList.remove('hidden');
    return;
  }
  document.getElementById(`task${taskNumber}StartOverlay`)?.classList.remove('hidden');
}

function dismissTaskStartOverlay(taskNumber) {
  const overlay = document.getElementById(`task${taskNumber}StartOverlay`);
  if (overlay) overlay.classList.add('hidden');
  setTaskRestartVisible(taskNumber, true);
}

[2,3,4,5,6,8].forEach((taskNumber) => {
  const button = document.getElementById(`startTask${taskNumber}Game`);
  if (button) {
    button.addEventListener('click', () => dismissTaskStartOverlay(taskNumber));
  }
});

const startTask7Game = document.getElementById('startTask7Game');
if (startTask7Game) {
  startTask7Game.addEventListener('click', () => {
    dismissTaskStartOverlay(7);
    startRunnerGame();
  });
}

document.getElementById('continueStory').addEventListener('click', continueStoryPath);
document.getElementById('placeholderBack').addEventListener('click', () => showStoryRoom(storyRoomIndex));


document.querySelectorAll('.ravi-message-panel').forEach((panel) => {
  panel.classList.add('message-instruction');
  const text = panel.querySelector('p');
  if (!text) return;

  const observer = new MutationObserver(() => {
    panel.classList.remove('message-flash');
    void panel.offsetWidth;
    panel.classList.add('message-flash');
  });
  observer.observe(text, { childList:true, characterData:true, subtree:true });
});

// Critical shell first: the hub must render even if one mini-game initialization fails.
renderModules();
updateProgress();

function safeInit(name, initFn) {
  try {
    initFn();
  } catch (error) {
    console.error(`RAVI init error: ${name}`, error);
  }
}

safeInit('HTML repair', initHtmlRepairGame);
safeInit('Data filter', initDataFilterGame);
safeInit('Network topology', initNetworkTopologyGame);
safeInit('Security scanner', initSecurityScanner);
safeInit('ML dropzones', initMLDropzones);
safeInit('ML training cards', renderMLTrainingCards);
safeInit('Legacy components', renderComponents);
safeInit('Program order', renderProgramOrder);
safeInit('Data rows', renderDataRows);


syncRaviStageImages();
// RAVI_STAGE_IMAGES_READY
