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

  if (index === 1) {
    renderProgramOrder();
    showScreen('screenTask2');
    return;
  }

  if (index === 2) {
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


function renderProgramOrder() {
  const container = document.getElementById('codeOrder');
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

document.getElementById('startBtn').addEventListener('click', () => showScreen('screenHub'));
document.getElementById('checkTask1').addEventListener('click', checkTask1);
document.getElementById('backHub1').addEventListener('click', () => showScreen('screenHub'));
document.getElementById('checkTask2').addEventListener('click', checkTask2);
document.getElementById('resetTask2').addEventListener('click', resetTask2);
document.getElementById('backHub2').addEventListener('click', () => showScreen('screenHub'));
document.getElementById('checkTask3').addEventListener('click', checkTask3);
document.getElementById('resetTask3').addEventListener('click', resetTask3);
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
document.getElementById('placeholderBack').addEventListener('click', () => showScreen('screenHub'));

renderModules();
renderComponents();
renderProgramOrder();
renderDataRows();
renderNetworkOrder();
updateProgress();
