// ==================== SOUND ENGINE ====================
let audioCtx = null, muted = false;
function getCtx() {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) { return null; }
  }
  if (audioCtx.state === 'suspended') { audioCtx.resume().catch(()=>{}); }
  return audioCtx;
}
// Initialize audio on first user interaction (required by browsers)
function initAudio() {
  getCtx();
  document.removeEventListener('pointerdown', initAudio);
  document.removeEventListener('keydown', initAudio);
}
document.addEventListener('pointerdown', initAudio);
document.addEventListener('keydown', initAudio);

function playTone(freq, duration, type, vol) {
  if (muted) return;
  try {
    const ctx = getCtx();
    if (!ctx || ctx.state !== 'running') return;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, ctx.currentTime);
    g.gain.setValueAtTime(vol, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + duration);
  } catch(e) {}
}
function soundCorrect() { playTone(660, .15, 'sine', .15); setTimeout(() => playTone(880, .2, 'sine', .12), 100); }
function soundWrong() { playTone(180, .25, 'triangle', .12); }
function soundFinish(good) { if (good) { playTone(440, .15, 'sine', .15); setTimeout(() => playTone(554, .15, 'sine', .12), 120); setTimeout(() => playTone(660, .25, 'sine', .12), 240); } }
function toggleMute() { muted = !muted; document.getElementById('muteBtn').textContent = muted ? '🔇' : '🔊'; }

// ==================== QUESTIONS ====================
const QUESTIONS = {

  povijest: [
    {q:"Na osnovi kojega pisma nastaje ćirilica?", o:["latinskoga","grčkoga alfabeta","glagoljice","feničkoga pisma"], a:1, x:"Ćirilica je grčki alfabet prilagođen za slavenski jezik krajem 9. stoljeća u Bugarskoj."},
    {q:"Koje je godine ćirilica proglašena službenim pismom Bugarskoga Carstva?", o:["863.","885.","893.","925."], a:2, x:"Proglašenje ćirilice službenim pismom Bugarskoga Carstva 893. godine presudno je utjecalo na njezino širenje među slavenskim narodima."},
    {q:"Tko je uveo naziv <i>bosančica</i>?", o:["Franjo Rački","Vatroslav Jagić","Ćiro Truhelka","Ivan Kukuljević Sakcinski"], a:2, x:"Naziv <i>bosančica</i> uveo je hrvatski arheolog i paleograf Ćiro Truhelka 1889. godine u radu <i>Bosančica: Prinos bosanskoj paleografiji</i>."},
    {q:"Od kojega do kojega se stoljeća hrvatska ćirilica rabila među Hrvatima?", o:["10. – 15. stoljeća","12. – 19. stoljeća","14. – 17. stoljeća","11. – 16. stoljeća"], a:1, x:"Hrvatska ćirilica rabila se od 12. do 19. stoljeća, a u nekim krajevima (npr. Župa Radobilje kraj Poljica) u crkvenim knjigama sve do 1867. Sporadično i u 20. stoljeću."},
    {q:"Koja su tri osnovna geografska tipa hrvatske ćirilice?", o:["zagrebački, splitski, osječki","bosanski, dubrovački, poljički (srednjodalmatinski)","slavonski, lički, istarski","hercegovački, sarajevski, mostarski"], a:1, x:"Ivan Berčić je 1860. u svom <i>Bukvaru</i> podijelio bosančicu na tri geografske inačice: bosansku, dubrovačku i poljičku (srednjodalmatinsku)."},
    {q:"U kojem se hrvatskom gradu čuva najveći broj ćiriličnih spisa na Balkanu?", o:["Zagreb","Split","Zadar","Dubrovnik"], a:3, x:"U Državnome arhivu u Dubrovniku sačuvan je najveći broj ćiriličnih spisa na čitavome Balkanu. Po nekim procjenama čak 10 000 dokumenata."},
    {q:"Kako su Poljičani nazivali ćirilicu?", o:["bosančicom","poljičicom","glagoljicom","arvaticom"], a:2, x:"Poljičani su ćirilicu nazivali <i>glagoljicom</i>. Takva zamjena naziva dvaju slavenskih pisama nije iznimka. U Dubrovniku je naziv <i>presbyteri chiurillice</i> označavao popove glagoljaše."},
    {q:"Koja tri pisma čine hrvatsku tropismenost?", o:["glagoljica, ćirilica i arebica","glagoljica, latinica i ćirilica","latinica, grčko pismo i ćirilica","glagoljica, latinica i glagoljski kurziv"], a:1, x:"Hrvatsku kulturnu povijest obilježava tropismenost: istovremena uporaba glagoljice, latinice i ćirilice (bosančice). To je bogatstvo, a ne nedostatak."},
    {q:"Kojim su pismom osmanski krajiški kapetani komunicirali s hrvatskim časnicima?", o:["latinskim","turskim (arapskim)","bosančicom","glagoljicom"], a:2, x:"Od 15. do 19. stoljeća osmanski su krajiški kapetani s hrvatskim časnicima i vlastima komunicirali bosančicom, najčešće ikavicom. Ta su pisma velike povijesne i literarne vrijednosti."},
    {q:"Što znači da bosančica nije bila kodificirana ni normirana?", o:["bila je strogo propisana","učila se na sveučilištima","bila je narodno pismo, bez službenog standarda","postojala je samo u tisku"], a:2, x:"Bosančica je bila <i>narodno pismo</i>. Nije bila ni službeno propisana, ni normirana, niti nametana školama. Zato je s vremenom došlo do njezina odumiranja, ali je upravo ta neformalnost omogućila široku uporabu."},
    {q:"Tko je objavio jedini priručnik za učenje bosančice?", o:["Matija Divković","Ivan Berčić","Ćiro Truhelka","Benedikta Zelić-Bučan"], a:1, x:"Ivan Berčić objavio je 1860. <i>Bukvar staroslovenskoga jezika glagolskimi pismeni za čitanje crkvenih knjig</i>. Jedini dosad objavljen priručnik za učenje bosančice.", img:"slike/bercic-bukvar.jpg", cap:"Stranica Berčićeva Bukvara (1860.), jedinog priručnika za učenje bosančice."},
    {q:"Na koje se razdoblje odnosi pojam <i>bosančica</i> u užemu smislu?", o:["na svu hrvatsku ćirilicu","na ćirilsku minuskulu 15. – 19. stoljeća","na epigrafske natpise 11. – 13. stoljeća","na tiskanu ćirilicu 16. stoljeća"], a:1, x:"Često se pod bosančicom razumijeva hrvatska (zapadna) ćirilica općenito, ali taj naziv u užemu smislu označuje <b>ćirilsku minuskulu 15. – 19. stoljeća</b>."},
    {q:"Zbog čega je bosančica s vremenom počela nestajati?", o:["zbog zabrane pape","zbog zahtjeva austrijskih vlasti za latinicom","zbog dolaska turaka","zbog izuma tiska"], a:1, x:"Najteži udarac bosančici zadan je ukidanjem sjemeništa u Priku 1821., zahtjevom austrijskih vlasti da se u matičnim knjigama koristi latinica, te otvaranjem pučkih škola s latinicom i novijom ćirilicom."},
    {q:"Do kada su se u župi Radobilje (kraj Poljica) crkvene knjige pisale bosančicom?", o:["do 1700.","do 1821.","do 1867.","do 1918."], a:2, x:"Na području starohrvatske župe Radobilje, susjedne Poljičkoj republici, crkvene knjige pisane su arvaticom sve do 1867., a od tada latinicom."},
    {q:"Na čijem su dvoru pisana ćirilična diplomatska pisma duboko u unutrašnjosti?", o:["Kralja Zvonimira","Bana Kulina","Kralja Matijaša Korvina","Kralja Tomislava"], a:2, x:"Diplomatska prepiska ćirilicom vodila se i na dvoru hrvatsko-ugarskoga kralja Matijaša Korvina. Mnogi plemići 16. st. koristili su ćirilicu, npr. Nikola Jurišić, branitelj Kisega.", img:"slike/matijas-korvin.jpg", cap:"Portret kralja Matijaša Korvina, djelo Andree Mantegne (15. st.)."}
  ],

  abeceda: [
    {q:"Koje je tipično slovo za bosančicu koje se od 14. st. rabi za glasove /ć/ i /đ/?", o:["Jat (ѣ)","Jer (ь)","Đerv (Ꙉ)","Jus (Ѧ)"], a:2, x:"<b>Đerv</b> je najprepoznatljivije slovo bosančice. Od početka 14. st. rabi se za oba glasa. Iz njega će kasnije u reformiranoj ćirilici nastati slova ć i đ."},
    {q:"Kakva su slova bosančice u odnosu na ustavne ćirilične oblike?", o:["identicalna","toliko preoblikovana da mala postaju velika i obratno","bez razlika","koristi samo tiskana slova"], a:1, x:"Slova bosančice toliko su preoblikovana da često prelaze u suprotnost. Mala postaju velika i obratno."},
    {q:"Koliko nadslovnih znakova ima bosančica u odnosu na standardnu ćirilicu?", o:["više","isto","samo title. znatno manje","nema ih"], a:2, x:"U standardnoj ćirilici nad slovima je mnogo znakova, u bosančici <b>samo title</b>. To je ključna grafička razlika."},
    {q:"Na koliko je načina pisan glas /j/ u bosančici?", o:["na jedan","na dva","na tri","na pet"], a:2, x:"Glas /j/ pisao se na <b>tri načina</b>. Glasovi /lj/ i /nj/ imali su još više varijanti. Pisali su se u mnogo različitih kombinacija."},
    {q:"Kako se označivao glas /dž/ u bosančici?", o:["posebnim slovom","istim slovom kao /č/","kombinacijom dvaju slova","nije se označivao"], a:1, x:"Glas /dž/ označivao se <b>istim slovom kao /č/</b>."},
    {q:"Zašto je bosančica lako čitljiva?", o:["jer ima mnogo slova","jer koristi latinici slična slova","jer svako slovo prikazuje uvijek isti glas bez dvoznačnosti","jer nema kurzivnih oblika"], a:2, x:"Bosančica je lako čitljiva jer vrijedi načelo: <b>svako slovo = uvijek isti glas</b>, i nijedno drugo slovo ne prikazuje taj glas. Nema dvoznačnosti!"},
    {q:"Kako Ivan Berčić dijeli bosančicu u svom Bukvaru (1860.)?", o:["na staru i novu","na tri geografske inačice","na glagoljsku i ćiriličnu","na rukopisnu i tiskanu"], a:1, x:"Berčić je bosančicu, koju naziva <i>bosanska azbukva</i>, podijelio na tri geografske inačice: bosansku, dubrovačku i poljičku (srednjodalmatinsku). Naveo je i tiskane i rukopisne oblike slova i brojeva."},
    {q:"Kako se opisuje vizualni izgled bosančice?", o:["oblo i zaobljeno","otežalo pismo, čvrstih i oštrih poteza s isticanjem vertikala","sitno i zbijeno","široko i rastegnuto"], a:1, x:"Bosančica je <b>otežalo pismo, čvrstih i oštrih poteza s osobitim isticanjem vertikala</b>. Od ostalih kurzivnih ćirilica toliko je udaljena da odaje sliku sasvim drukčijega pisma."},
    {q:"Sadrži li bosančica slova koja se drugdje u ćirilici ne pojavljuju?", o:["ne","samo u brojevnome sustavu","da, u svojoj grafiji","samo u tiskanim knjigama"], a:2, x:"Grafija bosančice sadrži <b>slova koja se drugdje u ćirilici ne pojavljuju</b>. To je jedna od njezinih najvažnijih paleografskih osobitosti."},
    {q:"Kakav je odnos bosančice prema glagoljici?", o:["Nema veze","Općenito je izražen utjecaj glagoljice. Na slova i brojevni sustav","Bosančica je izravno nastala iz glagoljice","Samo su brojevi isti"], a:1, x:"Općenito je izražen <b>utjecaj glagoljice</b> na bosančicu. Brojevni sustav je pod utjecajem glagoljice, ali u cjelini se ne poklapa ni s ćirilicom ni s glagoljicom."},
    {q:"Pod kojim su nazivom muslimani u Bosni pisali bosančicu?", o:["arebica","begovica","alhamijado","hurufatica"], a:1, x:"Muslimani su u Bosni bosančicu nazivali <b>begovica</b>. Bosančica je bila pismo svih triju konfesija: katolika, pravoslavnih i muslimana."},
    {q:"Kako se u bosančici u pravilu bilježe /ć/ i /đ/?", o:["posebnim slovima ć i đ","đervom","latiničnim slovima","kombinacijom slova"], a:1, x:"Glasovi /ć/ i /đ/ u pravilu su se bilježili <b>đervom</b>, a rjeđe posebnim znakovima."},
    {q:"Koja tri drevna pisma dijele gotovo identičan vizualni oblik za slovo „Š\" (Ш)?", o:["Ćirilica, glagoljica i hebrejski alfabet","Armenski alfabet, ćirilica i glagoljica","Ćirilica, glagoljica i grčki alfabet","Arapsko pismo, ćirilica i glagoljica"], a:0, x:"Slovo <b>Š (Ш)</b> gotovo je identično u ćirilici, glagoljici i hebrejskom alfabetu. To je jedan od zanimljivih primjera sličnosti među drevnim pismima."}
  ],

  spomenici: [
    {q:"Koji je najstariji datirani cjeloviti hrvatski ćirilični natpis?", o:["Bašćanska ploča","Humačka ploča","Povaljski prag","Povelja Kulina bana"], a:2, x:"<b>Povaljski prag</b> iz 1184. najstariji je datirani cjeloviti hrvatski ćirilični natpis."},
    {q:"Koje je godine napisana Povelja Kulina bana?", o:["1180.","1184.","1189.","1250."], a:2, x:"<b>Povelja Kulina bana</b> iz 1189. Pergamentni je dokument koji svjedoči o postojanju dubrovačke slavenske kancelarije već krajem 12. stoljeća.", img:"slike/povelja-kulina-bana.jpg", cap:"Povelja Kulina bana (1189.), najstariji sačuvani bosanski diplomatski dokument."},
    {q:"Koji je najstariji sačuvani dokument pisan hrvatskom ćirilicom?", o:["Povelja Kulina bana","Humačka ploča","Povaljska listina","Poljički statut"], a:2, x:"<b>Povaljska listina</b> iz 1250. najstariji je sačuvani dokument pisan hrvatskom ćirilicom. Prijepis posjedovne isprave benediktinskog samostana u Povljima na Braču.", img:"slike/povaljska-poljicki-kolaz.jpg", cap:"Lijevo: Povaljska listina (1250.), najstariji sačuvani dokument pisan hrvatskom ćirilicom. Desno: Poljički statut (1440.), pravni spomenik pisan bosančicom."},
    {q:"Za koga je pisan Hvalov zbornik?", o:["Za kralja Zvonimira","Za bana Kulina","Za hercega Hrvoja Vukčića Hrvatinića","Za kralja Tomislava"], a:2, x:"<b>Hvalov zbornik</b> (~1404.) iluminirani je rukopis pisan za hercega Hrvoja Vukčića Hrvatinića, vjerojatno u njegovoj rezidenciji u Omišu.", img:"slike/hvalov-zbornik.jpg", cap:"Stranica Hvalova zbornika (~1404.), iluminiranog rukopisa pisanog za Hrvoja Vukčića Hrvatinića."},
    {q:"Koja je prva hrvatska ćirilička tiskana knjiga?", o:["Nauk karstianski","Libro od mnozijeh razloga","Ofičje Blažene Djeve Marije","Poljički statut"], a:2, x:"Prvo hrvatskoćirilično tiskano izdanje: <b>Ofičje Blažene Djeve Marije</b>, Venecija 1512."},
    {q:"Koji je pravni spomenik iz 1440. pisan bosančicom?", o:["Vinodolski zakon","Poljički statut","Kulinova povelja","Statut Dubrovnika"], a:1, x:"<b>Poljički statut</b> (1440.) reprezentativan je pravni spomenik. Poljičani su u njemu ćirilicu nazivali <i>glagoljicom</i>.", img:"slike/poljicki-statut.jpg", cap:"Poljički statut (1440.), pravni spomenik pisan bosančicom."},
    {q:"Na kojem se otoku nalaze Povaljska listina i Povaljski prag?", o:["Hvaru","Korčuli","Braču","Visu"], a:2, x:"Oba spomenika potječu iz Povalja na otoku <b>Braču</b>."},
    {q:"Tko je autor <i>Nauka karstianskoga</i> (1611.)?", o:["Ivan Bandulavić","Pavao Posilović","Matija Divković","Franjo Rački"], a:2, x:"<b>Matija Divković</b>, bosanski franjevac, autor je <i>Nauka karstianskoga za narod slovinski</i> (Venecija, 1611.).", img:"slike/divkovic-nauk-krstjanski.jpg", cap:"Naslovnica Nauka karstianskoga Matije Divkovića (1611.), tiskanog bosančicom."},
    {q:"Na kojem se glagoljskom spomeniku nalaze i ćirilična slova?", o:["Bašćanska ploča","Povaljski prag","Humačka ploča","Povaljska listina"], a:0, x:"Na glagoljskoj <b>Bašćanskoj ploči</b> (~1100.) pojavljuju se i ćirilična slova. Rani suživot dvaju pisama na hrvatskome tlu.", img:"slike/bascanska-ploca.png", cap:"Bašćanska ploča (~1100.), najpoznatiji glagoljski natpis na kojem se javljaju i ćirilična slova."},
    {q:"Koji dokument svjedoči o postojanju dubrovačke slavenske kancelarije već krajem 12. stoljeća?", o:["Poljički statut","Libro od mnozijeh razloga","Povelja Kulina bana","Hvalov zbornik"], a:2, x:"<b>Povelja Kulina bana</b> (1189.) svjedoči o postojanju dubrovačke slavenske kancelarije krajem 12. stoljeća. Dubrovnik će kasnije sačuvati najveći broj ćiriličnih spisa na Balkanu.", img:"slike/povelja-kulina-bana.jpg", cap:"Povelja Kulina bana (1189.) svjedoči o postojanju dubrovačke slavenske kancelarije već krajem 12. st."}
  ],

  nazivi: [
    {q:"Kako Dmine Papalić (16. st.) naziva pismo kojim piše?", o:["bosančica","harvacko pismo","poljičica","srbska slova"], a:1, x:"Dmine Papalić, splitski plemić, oko 1510. prepisuje Hrvatsku kroniku i pismo naziva <b>harvacko pismo</b>. Jedan od najstarijih autohtonih hrvatskih naziva."},
    {q:"Koji naziv za ćirilicu nalazimo u Povaljskoj listini i Poljičkom statutu?", o:["bosanica","arvatica ili arvacko pismo","zapadna ćirilica","hrvatska ćirilica"], a:1, x:"U Povaljskoj listini (1250.) i Poljičkom statutu (1655.) pismo se naziva <b>arvatica</b> ili <b>arvacko pismo</b>. Od pridjeva <i>harvacki</i> (hrvatski).", img:"slike/povaljska-poljicki-kolaz.jpg", cap:"Lijevo je Povaljska listina, a desno Poljički statut."},
    {q:"Kako je Franjo Rački nazivao bosančicu?", o:["hrvatsko-bosanska ćirilica","bosančica","bosanska ćirilica","zapadna ćirilica"], a:2, x:"Franjo Rački, jedan od utemeljitelja hrvatske historiografije, upotrebljavao je naziv <b>bosanska ćirilica</b>.", img:"slike/racki.png", cap:"Portret hrvatskoga povjesničara Franje Račkoga (1828. – 1894.), naslikao Theodor Mayerhofer (1897.)."},
    {q:"Tko je uveo naziv <i>hrvatsko-bosanska ćirilica</i>?", o:["Vatroslav Jagić","Ivan Kukuljević Sakcinski","Stjepan Ivšić","Ćiro Truhelka"], a:1, x:"Naziv <b>hrvatsko-bosanska ćirilica</b> uveo je Ivan Kukuljević Sakcinski, hrvatski povjesničar i političar 19. stoljeća.", img:"slike/kukuljevic-sakcinski.png", cap:"Portret Ivana Kukuljevića Sakcinskoga (1816. – 1889.), hrvatskoga povjesničara i političara, naslikao Josef Mukařovský."},
    {q:"Kako Vatroslav Jagić naziva bosančicu?", o:["hrvatska ćirilica","bosančica","bosansko-dalmatinska ćirilica","poljičica"], a:2, x:"Vatroslav Jagić, jedan od najvećih slavista svoga doba, upotrebljavao je naziv <b>bosansko-dalmatinska ćirilica</b>.", img:"slike/jagic.jpg", cap:"Vatroslav Jagić (1838. – 1923.), hrvatski jezikoslovac i slavist."},
    {q:"Koji naziv uvodi Stjepan Ivšić?", o:["poljičica","arvatica","zapadna (bosanska) ćirilica","harvacko pismo"], a:2, x:"Stjepan Ivšić, hrvatski jezikoslovac, uveo je naziv <b>zapadna (bosanska) ćirilica</b>.", img:"slike/ivsic.jpg", cap:"Portret hrvatskoga jezikoslovca Stjepana Ivšića (1884. – 1962.)."},
    {q:"Kako Matija Divković naziva pismo kojim piše?", o:["harvacko pismo","bosančica","serbska slova","arvatica"], a:2, x:"Matija Divković pismo naziva <b>serbska slova</b>. Nazivlje je bilo fluidno i ovisilo o autoru i kontekstu."},
    {q:"Kako je narod u Poljicima nazivao bosančicu?", o:["arvatica","poljička azbukvica ili poljičica","bosanska azbukva","harvacko pismo"], a:1, x:"U Poljicima se bosančica nazivala <b>poljička azbukvica</b> ili <b>poljičica</b> (zabilježio Frane Ivanišević)."}
  ]
};

// ==================== LOGIC ====================
const ALL_TOPICS = Object.keys(QUESTIONS);
let currentTopic = null, currentIndex = 0, score = 0, shuffledQuestions = [];

function shuffle(a) { const r = [...a]; for (let i = r.length-1; i>0; i--) { const j = Math.floor(Math.random()*(i+1)); [r[i],r[j]]=[r[j],r[i]]; } return r; }

function startQuiz(topic) {
  currentTopic = topic; currentIndex = 0; score = 0;
  shuffledQuestions = topic === 'mix'
    ? shuffle(ALL_TOPICS.flatMap(t => QUESTIONS[t].map((q,i) => ({...q, topic:t, origIdx:i}))))
    : shuffle(QUESTIONS[topic].map((q,i) => ({...q, topic, origIdx:i})));

  document.getElementById('startScreen').style.display = 'none';
  document.getElementById('quizArea').classList.remove('hidden');
  document.getElementById('endScreen').classList.remove('show');
  document.getElementById('endScreen').style.display = 'none';
  document.getElementById('feedbackModal').classList.add('hidden');
  renderQuestion();
}

function backToStart() {
  document.getElementById('startScreen').style.display = '';
  document.getElementById('quizArea').classList.add('hidden');
  document.getElementById('matchingArea').classList.add('hidden');
  document.getElementById('letterQuizArea').classList.add('hidden');
  document.getElementById('endScreen').classList.remove('show');
  document.getElementById('endScreen').style.display = 'none';
  document.getElementById('feedbackModal').classList.add('hidden');
  clearInterval(lqTimer);
}

function renderQuestion() {
  if (currentIndex >= shuffledQuestions.length) { showEndScreen(); return; }
  const item = shuffledQuestions[currentIndex];
  const icons = {povijest:'ikone/povijest.png', abeceda:'ikone/grafija.png', spomenici:'ikone/spomenici.png', nazivi:'ikone/naziv.png'};
  const card = document.getElementById('questionCard');
  card.className = 'q-card topic-' + item.topic;
  // Shuffle answer options and remap correct index
  const optIndices = shuffle([...item.o.keys()]);
  item.shuffledA = optIndices.indexOf(item.a);
  card.innerHTML = `<div class="inner">
    <div class="q-num">${icons[item.topic] ? `<img src="${icons[item.topic]}" alt="" class="q-num-icon">` : ''} ${item.topic.charAt(0).toUpperCase()+item.topic.slice(1)} · ${currentIndex+1}/${shuffledQuestions.length}</div>
    <div class="q-text">${item.q}</div>
    <div class="opts">${optIndices.map((oi,pos)=>`<div class="opt" onclick="selectAnswer(${pos})"><span class="letter">${'ABCD'[pos]}.</span><span>${item.o[oi]}</span></div>`).join('')}</div>
  </div>`;
  updateTopBar();
}

function imgHTML(item) {
  if (!item.img) return '';
  return `<div class="q-img-wrap"><img src="${item.img}" alt="Ilustracija" class="q-img" onclick="openLightbox('${item.img}', '${item.cap || ''}')"><div class="q-img-cap">${item.cap || ''}</div></div>`;
}

function openLightbox(src, cap) {
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  img.onload = function() { lb.classList.remove('hidden'); resetZoom(); };
  img.onerror = function() { lb.classList.remove('hidden'); resetZoom(); };
  img.src = src;
  document.getElementById('lightboxCap').textContent = cap;
  // Hide modal behind so it doesn't show through
  document.getElementById('feedbackModal').classList.add('hidden');
}

// ===== LIGHTBOX ZOOM / PAN / PINCH =====
let lbScale = 1, lbTx = 0, lbTy = 0;
let pinchDist = 0, isDragging = false, dragStartX = 0, dragStartY = 0, dragOrigTx = 0, dragOrigTy = 0;

function resetZoom() {
  lbScale = 1; lbTx = 0; lbTy = 0;
  const stage = document.getElementById('lightboxStage');
  stage.classList.remove('zoomed', 'dragging');
  document.getElementById('lightboxImg').style.transform = '';
}

function applyTransform() {
  const img = document.getElementById('lightboxImg');
  img.style.transform = `translate(${lbTx}px, ${lbTy}px) scale(${lbScale})`;
}

function zoomAt(scale, cx, cy) {
  const stage = document.getElementById('lightboxStage');
  const rect = stage.getBoundingClientRect();
  const img = document.getElementById('lightboxImg');
  // Point in image coordinates before zoom
  const px = cx - rect.left - rect.width/2 - lbTx;
  const py = cy - rect.top - rect.height/2 - lbTy;
  const newScale = Math.min(8, Math.max(1, scale));
  const ratio = newScale / lbScale;
  lbTx = cx - rect.left - rect.width/2 - px * ratio;
  lbTy = cy - rect.top - rect.height/2 - py * ratio;
  lbScale = newScale;
  stage.classList.toggle('zoomed', lbScale > 1);
  applyTransform();
}

function initLightboxEvents() {
  const stage = document.getElementById('lightboxStage');
  const img = document.getElementById('lightboxImg');

  // Click to zoom in (only when not zoomed); stop propagation so lightbox doesn't close
  stage.addEventListener('click', function(e) {
    e.stopPropagation();
    if (lbScale <= 1) { zoomAt(2, e.clientX, e.clientY); }
  });

  // Double-click to exit zoom
  stage.addEventListener('dblclick', function(e) {
    e.stopPropagation();
    resetZoom();
  });

  // Mouse wheel zoom
  stage.addEventListener('wheel', function(e) {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.2 : 1/1.2;
    zoomAt(lbScale * factor, e.clientX, e.clientY);
  }, { passive: false });

  // Mouse drag to pan
  stage.addEventListener('mousedown', function(e) {
    if (lbScale <= 1) return;
    isDragging = true;
    dragStartX = e.clientX; dragStartY = e.clientY;
    dragOrigTx = lbTx; dragOrigTy = lbTy;
    stage.classList.add('dragging');
    e.preventDefault();
  });
  window.addEventListener('mousemove', function(e) {
    if (!isDragging) return;
    lbTx = dragOrigTx + (e.clientX - dragStartX);
    lbTy = dragOrigTy + (e.clientY - dragStartY);
    applyTransform();
  });
  window.addEventListener('mouseup', function() {
    isDragging = false;
    stage.classList.remove('dragging');
  });

  // Touch: pinch zoom + pan
  let touchCache = [];
  stage.addEventListener('touchstart', function(e) {
    touchCache = Array.from(e.touches);
    if (touchCache.length === 2) {
      pinchDist = Math.hypot(
        touchCache[0].clientX - touchCache[1].clientX,
        touchCache[0].clientY - touchCache[1].clientY
      );
    } else if (touchCache.length === 1 && lbScale > 1) {
      isDragging = true;
      dragStartX = touchCache[0].clientX; dragStartY = touchCache[0].clientY;
      dragOrigTx = lbTx; dragOrigTy = lbTy;
    }
  }, { passive: true });

  stage.addEventListener('touchmove', function(e) {
    e.preventDefault();
    const touches = Array.from(e.touches);
    if (touches.length === 2) {
      const dist = Math.hypot(
        touches[0].clientX - touches[1].clientX,
        touches[0].clientY - touches[1].clientY
      );
      if (pinchDist > 0) {
        const midX = (touches[0].clientX + touches[1].clientX) / 2;
        const midY = (touches[0].clientY + touches[1].clientY) / 2;
        zoomAt(lbScale * (dist / pinchDist), midX, midY);
      }
      pinchDist = dist;
    } else if (touches.length === 1 && isDragging) {
      lbTx = dragOrigTx + (touches[0].clientX - dragStartX);
      lbTy = dragOrigTy + (touches[0].clientY - dragStartY);
      applyTransform();
    }
  }, { passive: false });

  stage.addEventListener('touchend', function(e) {
    touchCache = Array.from(e.touches);
    pinchDist = 0;
    if (touchCache.length < 2) isDragging = false;
  }, { passive: true });
}
initLightboxEvents();

function closeLightbox() {
  document.getElementById('lightbox').classList.add('hidden');
  resetZoom();
  // Restore the modal with the explanation
  document.getElementById('feedbackModal').classList.remove('hidden');
}

function showModal(type, html) {
  const modal = document.getElementById('feedbackModal');
  const content = document.getElementById('modalContent');
  const btn = document.getElementById('modalNextBtn');
  content.className = 'modal-content ' + type;
  content.innerHTML = html;
  btn.textContent = currentIndex+1 < shuffledQuestions.length ? 'sljedeće →' : 'vidi rezultat 🏆';
  btn.onclick = modalNext;
  modal.classList.remove('hidden');
}

function modalNext() {
  const modal = document.getElementById('feedbackModal');
  modal.classList.add('closing');
  setTimeout(() => {
    modal.classList.add('hidden');
    modal.classList.remove('closing');
    nextQuestion();
  }, 250);
}

function selectAnswer(chosen) {
  const item = shuffledQuestions[currentIndex];
  const card = document.getElementById('questionCard');
  const opts = card.querySelectorAll('.opt');
  const correctPos = item.shuffledA;

  opts.forEach(o => o.style.pointerEvents = 'none');
  opts[correctPos].classList.add('correct');
  opts[chosen].classList.add('picked');

  if (chosen === correctPos) {
    score++; soundCorrect();
    showModal('correct', '✅ <b>Točno!</b> ' + item.o[item.a] + '<span class="explanation">' + item.x + '</span>' + imgHTML(item));
    card.classList.add('correct-flash');
  } else {
    soundWrong();
    opts[chosen].classList.add('wrong');
    showModal('wrong', '❌ <b>Netočno.</b> Točan odgovor: <b>' + 'ABCD'[correctPos] + '. ' + item.o[item.a] + '</b><span class="explanation">' + item.x + '</span>' + imgHTML(item));
    card.classList.add('wrong-flash');
  }

  updateTopBar();
}

function nextQuestion() {
  currentIndex++;
  if (currentIndex >= shuffledQuestions.length) { showEndScreen(); }
  else { renderQuestion(); }
}

function showEndScreen() {
  document.getElementById('quizArea').classList.add('hidden');
  const end = document.getElementById('endScreen');
  end.style.display = 'flex'; end.classList.add('show');
  const pct = Math.round((score/shuffledQuestions.length)*100);
  let cls, msg;
  if (pct >= 90) { cls='good'; msg='Sjajno! 🎉 Pravi si znalac hrvatske ćirilične baštine!'; }
  else if (pct >= 70) { cls='ok'; msg='Vrlo dobro! 👍 Još malo vježbe i bit ćeš ekspert.'; }
  else if (pct >= 50) { cls='ok'; msg='Dobro! 📚 Još malo učenja i ide.'; }
  else { cls='poor'; msg='Ne odustaj! 💪 Nauči i pokušaj opet.'; }
  soundFinish(pct >= 70);
  end.innerHTML = `<h2 style="color:var(--accent);">🏁 Kraj kviza!</h2>
    <div class="big-score ${cls}">${score} / ${shuffledQuestions.length}</div>
    <div class="end-pct">${pct}%</div><p class="end-msg">${msg}</p>
    <button class="mix-btn" onclick="startQuiz(currentTopic)">🔄 pokušaj ponovo</button>
    <button class="mix-btn" style="background:var(--border);color:var(--text);margin-top:.5rem;" onclick="backToStart()">← odaberi drugu temu</button>`;
}

function updateTopBar() {
  if (currentIndex >= shuffledQuestions.length) return;
  document.getElementById('progressText').textContent = `Pitanje ${currentIndex+1}/${shuffledQuestions.length}`;
  document.getElementById('scoreNum').textContent = `${score}`;
  document.getElementById('progressBar').style.width = ((currentIndex/shuffledQuestions.length)*100)+'%';
}

// ==================== MATCHING GAME ====================
const LETTER_PAIRS = [
  {c:'А а', l:'A a',  g:'a'},
  {c:'Б б', l:'B b',  g:'b'},
  {c:'В в', l:'V v',  g:'v'},
  {c:'Г г', l:'G g',  g:'g'},
  {c:'Д д', l:'D d',  g:'d'},
  {c:'Е е', l:'E e',  g:'e'},
  {c:'Ж ж', l:'Ž ž', g:'x'},
  {c:'З з', l:'Z z',  g:'z'},
  {c:'И и', l:'I i',  g:'i'},
  {c:'К к', l:'K k',  g:'k'},
  {c:'Л л', l:'L l',  g:'l'},
  {c:'М м', l:'M m',  g:'m'},
  {c:'Н н', l:'N n',  g:'n'},
  {c:'О о', l:'O o',  g:'o'},
  {c:'П п', l:'P p',  g:'p'},
  {c:'Р р', l:'R r',  g:'r'},
  {c:'С с', l:'S s',  g:'s'},
  {c:'Т т', l:'T t',  g:'t'},
  {c:'У у', l:'U u',  g:'u'},
  {c:'Ф ф', l:'F f',  g:'f'},
  {c:'Х х', l:'H h',  g:'h'},
  {c:'Ц ц', l:'C c',  g:'c'},
  {c:'Ч ч', l:'Č č', g:'C'},
  {c:'Ш ш', l:'Š š', g:'S'},
  {c:'Ђ ђ', l:'Đ đ', g:'J'},
  {c:'Ћ ћ', l:'Ć ć', g:'J'},
  {c:'Љ љ', l:'Lj lj', g:'lj'},
  {c:'Њ њ', l:'Nj nj', g:'nj'},
  {c:'Џ џ', l:'Dž dž', g:'dZ'},
  {c:'Ј ј', l:'J j',  g:'j'}
];
let matchMode = 'lat', matchSelected = null, matchPairs = [], matchFound = 0;

function shuffleM(a) { const r=[...a]; for(let i=r.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[r[i],r[j]]=[r[j],r[i]];} return r; }

function setMatchMode(mode) {
  matchMode = mode;
  document.querySelectorAll('.match-mode-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
  startMatching();
}

function startMatching() {
  document.getElementById('startScreen').style.display = 'none';
  document.getElementById('quizArea').classList.add('hidden');
  document.getElementById('endScreen').classList.remove('show');
  document.getElementById('endScreen').style.display = 'none';
  document.getElementById('matchingArea').classList.remove('hidden');
  matchSelected = null; matchFound = 0;
  matchPairs = shuffleM(LETTER_PAIRS); // use all 30
  if (matchMode === 'all') renderDragDrop();
  else renderMatchGrid();
  updateMatchBar();
}

// ===== CLICK MODE (two columns) =====
function renderMatchGrid() {
  const grid = document.getElementById('matchGrid');
  grid.className = 'match-grid';
  const isGla = matchMode === 'gla';
  const leftLabel = 'ćirilica', rightLabel = isGla ? 'glagoljica' : 'latinica';
  const leftItems = shuffleM(matchPairs.map((p, i) => ({text:p.c, pairIdx:i})));
  const rightItems = matchPairs.map((p, i) => ({text: isGla ? p.g : p.l, pairIdx:i}));
  if (!isGla) rightItems.sort((a,b) => a.text.localeCompare(b.text));
  grid.innerHTML = `
    <div class="match-col">
      <div class="match-col-header">${leftLabel}</div>
      ${leftItems.map(t => `<div class="match-tile" data-type="a" data-pair="${t.pairIdx}"
        onclick="selectMatchTile(this, 'a', ${t.pairIdx})"><span class="cyr">${t.text}</span></div>`).join('')}
    </div>
    <div class="match-col">
      <div class="match-col-header">${rightLabel}</div>
      ${rightItems.map(t => `<div class="match-tile" data-type="b" data-pair="${t.pairIdx}"
        onclick="selectMatchTile(this, 'b', ${t.pairIdx})"><span class="${isGla ? 'cyr gla-font' : 'lat'}" style="${isGla ? 'color:#6b3fa0' : ''}">${t.text}</span></div>`).join('')}
    </div>`;
}

// ===== DRAG-DROP MODE (all three) =====
function renderDragDrop() {
  const grid = document.getElementById('matchGrid');
  grid.className = 'match-grid drag-mode';
  // Sort by Latin so targets appear alphabetically
  const sorted = [...matchPairs].sort((a,b) => a.l.localeCompare(b.l));
  const targets = sorted.map(p => {
    const i = matchPairs.indexOf(p);
    return `<div class="drag-group" data-pair="${i}" id="dg-${i}"
      ondragover="dragOver(event)" ondragleave="dragLeave(event)" ondrop="dropOn(event)">
      <span class="dg-lat">${p.l}</span>
      <span class="dg-cyr" id="dgc-${i}" style="display:none">${p.c}</span>
      <span class="dg-gla" id="dgg-${i}" style="display:none">${p.g}</span>
    </div>`;
  }).join('');
  // Sources: Cyrillic + Glagolitic tiles mixed (random order)
  const sources = [];
  matchPairs.forEach((p, i) => {
    sources.push({text:p.c, type:'c', pairIdx:i});
    sources.push({text:p.g, type:'g', pairIdx:i});
  });
  const srcTiles = shuffleM(sources).map(t => `
    <div class="drag-tile ${t.type==='g'?'gla':''}" draggable="true"
      data-pair="${t.pairIdx}" data-type="${t.type}" ondragstart="dragStart(event)" id="ds-${t.type}-${t.pairIdx}"
      onclick="manualDrop(this, ${t.pairIdx})">${t.text}</div>`).join('');
  grid.innerHTML = `<div class="drag-targets">${targets}</div><div class="drag-source-area">${srcTiles}</div>`;
}

let dragEl = null;
function dragStart(e) { dragEl = e.target; e.target.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', `${e.target.dataset.pair}|${e.target.dataset.type}`); }
function dragOver(e) { e.preventDefault(); const g = e.currentTarget.closest('.drag-group'); if (g) g.classList.add('over'); }
function dragLeave(e) { const g = e.currentTarget.closest('.drag-group'); if (g) g.classList.remove('over'); }

function matchPair(targetPair, srcEl, srcType) {
  const group = document.getElementById('dg-' + targetPair);
  if (!group) return false;
  if (srcType === 'c') {
    const cyr = document.getElementById('dgc-' + targetPair);
    if (cyr && cyr.style.display !== 'none') return false; // already filled
    if (cyr) { cyr.style.display = ''; group.classList.add('has-cyr'); }
  } else {
    const gla = document.getElementById('dgg-' + targetPair);
    if (gla && gla.style.display !== 'none') return false;
    if (gla) { gla.style.display = ''; group.classList.add('has-gla'); }
  }
  soundCorrect(); matchFound++;
  srcEl.classList.add('matched'); srcEl.draggable = false;
  group.classList.add('matched-group');
  updateMatchBar(); checkDragDone();
  return true;
}

function dropOn(e) {
  e.preventDefault();
  const group = e.currentTarget.closest('.drag-group');
  if (group) group.classList.remove('over');
  if (!dragEl) return;
  const targetPair = parseInt(group.dataset.pair);
  const srcPair = parseInt(dragEl.dataset.pair);
  const srcType = dragEl.dataset.type;
  if (targetPair === srcPair && matchPair(targetPair, dragEl, srcType)) {
    // success. Handled in matchPair
  } else {
    soundWrong();
    dragEl.classList.add('wrong-flash');
    if (group) group.classList.add('wrong-flash');
    setTimeout(() => {
      dragEl.classList.remove('wrong-flash');
      if (group) group.classList.remove('wrong-flash');
    }, 400);
  }
  dragEl.classList.remove('dragging'); dragEl = null;
}

function manualDrop(el, pairIdx) {
  if (el.classList.contains('matched')) return;
  const srcType = el.dataset.type;
  if (!matchPair(pairIdx, el, srcType)) {
    soundWrong();
    el.classList.add('wrong-flash');
    setTimeout(() => el.classList.remove('wrong-flash'), 400);
  }
}

function checkDragDone() {
  if (matchFound >= matchPairs.length * 2) {
    setTimeout(() => {
      document.getElementById('matchGrid').innerHTML = `<div style="text-align:center;grid-column:1/-1;padding:2rem;">
        <h2 style="color:var(--accent);">🏁 Svi znakovi spojeni!</h2>
        <p style="font-size:1.2rem;margin:1rem 0;">${matchFound}/${MATCH_COUNT*2}</p>
      </div>`;
      soundFinish(true);
    }, 400);
  }
}

function selectMatchTile(el, type, pairIdx) {
  if (el.classList.contains('matched')) return;
  // Click same tile again → deselect
  if (matchSelected && matchSelected.el === el) {
    el.classList.remove('selected');
    matchSelected = null;
    return;
  }
  if (matchSelected && matchSelected.type === type) {
    document.querySelectorAll('.match-tile.selected').forEach(t => t.classList.remove('selected'));
    el.classList.add('selected');
    matchSelected = {el, type, pairIdx};
    return;
  }
  if (!matchSelected) {
    document.querySelectorAll('.match-tile.selected').forEach(t => t.classList.remove('selected'));
    el.classList.add('selected');
    matchSelected = {el, type, pairIdx};
    return;
  }
  if (matchSelected.pairIdx === pairIdx) {
    soundCorrect();
    matchSelected.el.classList.add('matched');
    el.classList.add('matched');
    matchFound++;
    updateMatchBar();
    matchSelected = null;
    if (matchFound === matchPairs.length) {
      setTimeout(() => {
        document.getElementById('matchGrid').innerHTML = `<div style="text-align:center;grid-column:1/-1;padding:2rem;">
          <h2 style="color:var(--accent);">🏁 Sva slova spojena!</h2>
          <p style="font-size:1.2rem;margin:1rem 0;">${MATCH_COUNT}/${MATCH_COUNT}</p>
        </div>`;
        soundFinish(true);
      }, 400);
    }
  } else {
    soundWrong();
    el.classList.add('wrong-flash');
    matchSelected.el.classList.add('wrong-flash');
    const sel = matchSelected.el;
    setTimeout(() => { el.classList.remove('wrong-flash'); sel.classList.remove('wrong-flash'); }, 400);
    matchSelected = null;
  }
}

function updateMatchBar() {
  const total = matchMode === 'all' ? matchPairs.length * 2 : matchPairs.length;
  document.getElementById('matchProgress').textContent = `Spojeno: ${matchFound} / ${total}`;
  document.getElementById('matchScoreNum').textContent = `${matchFound}`;
}

// ==================== LETTER QUIZ ====================
const LETTERS = [
  {c:'А',l:'а',lat:'A a', g:'a', gr:'Α α'},{c:'Б',l:'б',lat:'B b', g:'b', gr:'Β β'},{c:'В',l:'в',lat:'V v', g:'v', gr:'Β β'},
  {c:'Г',l:'г',lat:'G g', g:'g', gr:'Γ γ'},{c:'Д',l:'д',lat:'D d', g:'d', gr:'Δ δ'},{c:'Ђ',l:'ђ',lat:'Đ đ', g:'J', gr:'—'},
  {c:'Е',l:'е',lat:'E e', g:'e', gr:'Ε ε'},{c:'Ж',l:'ж',lat:'Ž ž', g:'x', gr:'Ζ ζ'},{c:'З',l:'з',lat:'Z z', g:'z', gr:'Ζ ζ'},
  {c:'И',l:'и',lat:'I i', g:'i', gr:'Η η'},{c:'Ј',l:'ј',lat:'J j', g:'j', gr:'—'},{c:'К',l:'к',lat:'K k', g:'k', gr:'Κ κ'},
  {c:'Л',l:'л',lat:'L l', g:'l', gr:'Λ λ'},{c:'Љ',l:'љ',lat:'Lj lj', g:'lj', gr:'—'},{c:'М',l:'м',lat:'M m', g:'m', gr:'Μ μ'},
  {c:'Н',l:'н',lat:'N n', g:'n', gr:'Ν ν'},{c:'Њ',l:'њ',lat:'Nj nj', g:'nj', gr:'—'},{c:'О',l:'о',lat:'O o', g:'o', gr:'Ο ο'},
  {c:'П',l:'п',lat:'P p', g:'p', gr:'Π π'},{c:'Р',l:'р',lat:'R r', g:'r', gr:'Ρ ρ'},{c:'С',l:'с',lat:'S s', g:'s', gr:'Σ σ'},
  {c:'Т',l:'т',lat:'T t', g:'t', gr:'Τ τ'},{c:'Ћ',l:'ћ',lat:'Ć ć', g:'J', gr:'—'},{c:'У',l:'у',lat:'U u', g:'u', gr:'Υ υ'},
  {c:'Ф',l:'ф',lat:'F f', g:'f', gr:'Φ φ'},{c:'Х',l:'х',lat:'H h', g:'h', gr:'Χ χ'},{c:'Ц',l:'ц',lat:'C c', g:'c', gr:'—'},
  {c:'Ч',l:'ч',lat:'Č č', g:'C', gr:'—'},{c:'Џ',l:'џ',lat:'Dž dž', g:'dZ', gr:'—'},{c:'Ш',l:'ш',lat:'Š š', g:'S', gr:'—'},
];
const LQ_TOTAL = 15;
let lqQuestions = [], lqIdx = 0, lqScore = 0, lqTimer = null, lqAnswered = false;

function startLetterQuiz() {
  document.getElementById('startScreen').style.display = 'none';
  document.getElementById('quizArea').classList.add('hidden');
  document.getElementById('matchingArea').classList.add('hidden');
  document.getElementById('endScreen').classList.remove('show');
  document.getElementById('endScreen').style.display = 'none';
  document.getElementById('letterQuizArea').classList.remove('hidden');

  lqQuestions = shuffleM(LETTERS).slice(0, LQ_TOTAL);
  lqIdx = 0; lqScore = 0; lqAnswered = false;
  clearInterval(lqTimer);
  lqShowQuestion();
}

function lqShowQuestion() {
  if (lqIdx >= lqQuestions.length) { lqShowEnd(); return; }
  lqAnswered = false;
  const q = lqQuestions[lqIdx];
  document.getElementById('letterBig').textContent = q.c + q.l;
  const correct = q.lat;
  const wrongs = shuffleM(LETTERS.filter(l => l.lat !== correct)).slice(0,3);
  const opts = shuffleM([correct, ...wrongs.map(w=>w.lat)]);
  document.getElementById('lqOptions').innerHTML = opts.map(o =>
    `<div class="lq-opt" onclick="lqSelect(this, '${o}')">${o}</div>`).join('');
  document.getElementById('lqFeedback').textContent = '';
  document.getElementById('lqFeedback').className = 'feedback-overlay';
  document.getElementById('lqNextBtn').classList.remove('show');
  document.getElementById('lqCounter').textContent = `Pitanje ${lqIdx+1}/${LQ_TOTAL}`;
  document.getElementById('lqScoreNum').textContent = `${lqScore}`;
}

function lqSelect(el, chosen) {
  if (lqAnswered) return;
  lqAnswered = true;
  const q = lqQuestions[lqIdx];
  const correct = q.lat;
  document.querySelectorAll('.lq-opt').forEach(o => o.classList.add('disabled'));
  if (chosen === correct) {
    lqScore++; soundCorrect();
    el.classList.add('correct');
    lqShowModal('correct', '✅ <b>Točno!</b>');
  } else {
    soundWrong();
    el.classList.add('wrong');
    document.querySelectorAll('.lq-opt').forEach(o => {
      if (o.textContent.trim() === correct) o.classList.add('correct');
    });
    lqShowModal('wrong', '❌ <b>Netočno.</b> Točan odgovor: <b>' + correct + '</b>');
  }
  document.getElementById('lqScoreNum').textContent = `${lqScore}`;
}

function lqShowModal(type, msg) {
  const modal = document.getElementById('feedbackModal');
  const content = document.getElementById('modalContent');
  const btn = document.getElementById('modalNextBtn');
  const q = lqQuestions[lqIdx];
  content.className = 'modal-content ' + type;
  content.innerHTML = msg + lqCompareTable(q);
  btn.textContent = lqIdx+1 < LQ_TOTAL ? 'sljedeće →' : 'vidi rezultat 🏆';
  btn.onclick = lqModalNext;
  modal.classList.remove('hidden');
}

function lqCompareTable(q) {
  return `<div class="lq-table-wrap">
    <table class="lq-table">
      <tr><th>Hrvatska ćirilica</th><th>Latinica</th><th>Glagoljica</th><th>Suvremena ćirilica</th><th>Grčki</th></tr>
      <tr>
        <td class="lq-cell-cyr">${q.c} ${q.l}</td>
        <td class="lq-cell-lat">${q.lat}</td>
        <td class="lq-cell-gla">${q.g}</td>
        <td class="lq-cell-mod">${q.c} ${q.l}</td>
        <td class="lq-cell-gr">${q.gr}</td>
      </tr>
    </table>
  </div>`;
}

function lqModalNext() {
  const modal = document.getElementById('feedbackModal');
  modal.classList.add('closing');
  setTimeout(() => {
    modal.classList.add('hidden');
    modal.classList.remove('closing');
    letterQuizNext();
  }, 250);
}

function letterQuizNext() {
  lqIdx++;
  if (lqIdx >= LQ_TOTAL) { lqShowEnd(); }
  else { lqShowQuestion(); }
}

function lqShowEnd() {
  document.getElementById('letterQuizArea').classList.add('hidden');
  const end = document.getElementById('endScreen');
  end.style.display = 'flex'; end.classList.add('show');
  const pct = Math.round((lqScore/LQ_TOTAL)*100);
  let cls, msg;
  if (pct>=90){cls='good';msg='Sjajno! 🎉 Znaš ćirilicu!';}
  else if(pct>=70){cls='ok';msg='Vrlo dobro! 👍';}
  else if(pct>=50){cls='ok';msg='Dobro! 📚';}
  else{cls='poor';msg='Ne odustaj! 💪';}
  soundFinish(pct>=70);
  end.innerHTML = `<h2 style="color:var(--accent);">🏁 Kraj!</h2>
    <div class="big-score ${cls}">${lqScore} / ${LQ_TOTAL}</div>
    <div class="end-pct">${pct}%</div><p class="end-msg">${msg}</p>
    <button class="mix-btn" onclick="startLetterQuiz()">🔄 pokušaj ponovo</button>
    <button class="mix-btn" style="background:var(--border);color:var(--text);margin-top:.5rem;" onclick="backToStart()">← odaberi drugu temu</button>`;
}

