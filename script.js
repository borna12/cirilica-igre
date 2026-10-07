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
    {q:"Koje je godine ćirilica proglašena službenim pismom Bugarskoga Carstva?", o:["863.", "885.", "893.", "925."], a:2, x:"Proglašenje ćirilice službenim pismom Bugarskoga Carstva 893. godine presudno je utjecalo na njezino širenje među slavenskim narodima."},
    {q:"Od kojega do kojega se stoljeća hrvatska ćirilica rabila među Hrvatima?", o:["10. – 15. stoljeća", "12. – 19. stoljeća", "14. – 17. stoljeća", "11. – 16. stoljeća"], a:1, x:"Hrvatska ćirilica rabila se od 12. do 19. stoljeća, a u nekim krajevima (npr. Župa Radobilje kraj Poljica) u crkvenim knjigama sve do 1867. Sporadično i u 20. stoljeću."},
    {q:"Koja su tri osnovna geografska tipa hrvatske ćirilice?", o:["zagrebački, splitski, osječki", "bosanski, dubrovački, poljički (srednjodalmatinski)", "slavonski, lički, istarski", "hercegovački, sarajevski, mostarski"], a:1, x:"Ivan Berčić je 1860. u svom <i>Bukvaru</i> podijelio bosančicu na tri geografske inačice: bosansku, dubrovačku i poljičku (srednjodalmatinsku)."},
    {q:"U kojem se hrvatskom gradu čuva najveći broj ćiriličnih spisa na Balkanu?", o:["Zagreb", "Split", "Zadar", "Dubrovnik"], a:3, x:"U Državnome arhivu u Dubrovniku sačuvan je najveći broj ćiriličnih spisa na čitavome Balkanu. Po nekim procjenama čak 10 000 dokumenata."},
    {q:"Koja tri pisma čine hrvatsku tropismenost?", o:["glagoljica, ćirilica i arebica", "glagoljica, latinica i ćirilica", "latinica, grčko pismo i ćirilica", "glagoljica, latinica i glagoljski kurziv"], a:1, x:"Hrvatsku kulturnu povijest obilježava tropismenost: istovremena uporaba glagoljice, latinice i ćirilice (bosančice). To je bogatstvo, a ne nedostatak."},
    {q:"Kojim su pismom osmanski krajiški kapetani komunicirali s hrvatskim časnicima?", o:["latinskim", "turskim (arapskim)", "bosančicom", "glagoljicom"], a:2, x:"Od 15. do 19. stoljeća osmanski su krajiški kapetani s hrvatskim časnicima i vlastima komunicirali bosančicom, najčešće ikavicom. Ta su pisma velike povijesne i literarne vrijednosti."},
    {q:"Što znači da bosančica nije bila kodificirana ni normirana?", o:["bila je strogo propisana", "učila se na sveučilištima", "bila je narodno pismo, bez službene norme", "postojala je samo u tisku"], a:2, x:"Bosančica je bila <i>narodno pismo</i>. Nije bila ni službeno propisana, ni normirana, niti nametana školama. Zato je s vremenom došlo do njezina odumiranja, ali je upravo ta neformalnost omogućila široku uporabu."},
    {q:"Tko je objavio jedini priručnik za učenje bosančice?", o:["Matija Divković", "Ivan Berčić", "Ćiro Truhelka", "Benedikta Zelić-Bučan"], a:1, x:"Ivan Berčić objavio je 1860. <i>Bukvar staroslovenskoga jezika glagolskimi pismeni za čitanje crkvenih knjig</i>. Jedini dosad objavljen priručnik za učenje bosančice.", img:"slike/bercic-bukvar.jpg", cap:"Stranica Berčićeva Bukvara (1860.), jedinog priručnika za učenje bosančice."},
    {q:"Zbog čega je bosančica s vremenom počela nestajati?", o:["zbog zabrane pape", "zbog zahtjeva austrijskih vlasti za latinicom", "zbog dolaska turaka", "zbog izuma tiska"], a:1, x:"Najteži udarac bosančici zadan je ukidanjem sjemeništa u Priku 1821., zahtjevom austrijskih vlasti da se u matičnim knjigama koristi latinica, te otvaranjem pučkih škola s latinicom i novijom ćirilicom."},
    {q:"Na čijem su dvoru pisana ćirilična diplomatska pisma duboko u unutrašnjosti?", o:["Kralja Zvonimira", "Bana Kulina", "Kralja Matijaša Korvina", "Kralja Tomislava"], a:2, x:"Diplomatska prepiska ćirilicom vodila se i na dvoru hrvatsko-ugarskoga kralja Matijaša Korvina. Mnogi plemići 16. st. koristili su ćirilicu, npr. Nikola Jurišić, branitelj Kisega.", img:"slike/matijas-korvin.jpg", cap:"Portret kralja Matijaša Korvina, djelo Andree Mantegne (15. st.)."},
    {q:"Od kada se može pratiti početak dokumentirane uporabe ćirilice u hrvatskoj kulturnoj baštini?", o:["od 9. stoljeća", "od kraja 11. i početka 12. stoljeća", "od 14. stoljeća", "od 16. stoljeća"], a:1, x:"Početak dokumentirane uporabe ćirilice prati se od <b>kraja 11. i početka 12. stoljeća</b> (<i>Natpis popa Tjehodraga</i>, <i>Povelja Kulina bana</i>, <i>Povaljski prag</i>, <i>Humačka ploča</i>), a prisutnost se proteže sve do 19. stoljeća (Paskojević 2024)."},
    {q:"Tko je pisao hrvatski tekst <i>Povelje Kulina bana</i>?", o:["dubrovački notar Marin", "Kulinov dijak Radoje", "logotet Vladoje", "Nikša Zvijezdić"], a:1, x:"Hrvatski tekst <i>Povelje Kulina bana</i> pisao je <b>Kulinov dijak Radoje</b>, dok se pretpostavlja da je dubrovačka kancelarija sudjelovala u izradi formulacija (Vrana 1955, prema Paskojević 2024)."},
    {q:"Koje su rijeke krajem 12. stoljeća činile granicu između glagoljice i ćirilice?", o:["Sava i Drava", "Krka i Vrbas", "Neretva i Cetina", "Kupa i Una"], a:1, x:"Krajem 12. stoljeća fizičku granicu između glagoljice i ćirilice činile su rijeke <b>Krka i Vrbas</b>; ćirilica postaje primarno sredstvo komunikacije istočno od tih dviju rijeka (Paskojević 2024)."},
    {q:"Do kada je zabilježena uporaba ćirilice u dubrovačkoj slavenskoj kancelariji?", o:["do 1455.", "do 1512.", "do prosinca 1807.", "do 1918."], a:2, x:"Uporaba ćirilice zabilježena je sve do <b>prosinca 1807.</b>, kad je grof Natali poslao ćirilično pismo Porti — neprekidna uporaba od najmanje 618 godina potvrđena dokumentima (Paskojević 2024)."},
    {q:"Kada je Dubrovački arhiv u potpunosti preseljen u Beč?", o:["1833.", "1889.", "1901.", "1947."], a:0, x:"Godine <b>1833.</b> Dubrovački je arhiv u potpunosti preseljen u Beč; nakon Prvoga svjetskog rata vraćen je Kraljevini Jugoslaviji, a u Dubrovnik napokon 1947. (Čremošnik 1948, prema Paskojević 2024)."},
    {q:"Tko je objavio transliteracije većine ćiriličnih povelja iz Dubrovačkoga arhiva (1929.)?", o:["Gregor Čremošnik", "Ljubomir Stojanović", "Vladimir Mošin", "Josip Vrana"], a:1, x:"Srpski filolog i paleograf <b>Ljubomir Stojanović</b> objavio je u djelu <i>Stare srpske povelje i pisma</i> (1929.) transliteracije većine ćiriličnih povelja iz Dubrovačkoga arhiva (Paskojević 2024)."},
    {q:"Sadrži li bosančica slova koja se drugdje u ćirilici ne pojavljuju?", o:["ne", "samo u brojevnome sustavu", "da, u svojoj grafiji", "samo u tiskanim knjigama"], a:2, x:"Grafija bosančice sadrži <b>slova koja se drugdje u ćirilici ne pojavljuju</b>. To je jedna od njezinih najvažnijih paleografskih osobitosti."},
    {q:"Koja tri drevna pisma dijele gotovo jednak oblik za slovo „Š\" (Ш)?", o:["Ćirilica, glagoljica i hebrejski alfabet", "Armenski alfabet, ćirilica i glagoljica", "Ćirilica, glagoljica i grčki alfabet", "Arapsko pismo, ćirilica i glagoljica"], a:0, x:"Slovo <b>Š (Ш)</b> gotovo je jednako u ćirilici, glagoljici i hebrejskom alfabetu. To je jedan od zanimljivih primjera sličnosti među drevnim pismima."},
    {q:"Kada se na području Hrvatske i Bosne razvio bosanički brzopis?", o:["prije turskih osvajanja", "nakon završetka turskih osvajanja", "u 12. stoljeću", "u 19. stoljeću"], a:1, x:"Kurziv se nije stigao razviti do konačnoga završetka turskih osvajanja. Nakon toga razvija se <b>bosanički brzopis</b>, koji sadržava osnovne forme minuskule oblikovane prije sloma Bosanskoga Kraljevstva (Paskojević 2024)."},
    {q:"Gdje se nalazi najzapadniji zapis ćiriličnih slova na hrvatskim prostorima?", o:["u Bašci na Krku", "u Svetom Petru u Šumi u Istri", "u Kninu", "u Plastovu kraj Skradina"], a:1, x:"Riječ AMENЪ na <b><i>Supetarskom ulomku</i></b> iz 12. stoljeća, iz <b>Svetoga Petra u Šumi</b>, najzapadniji je zapis ćiriličnih slova na hrvatskim prostorima (Damjanović 2012)."},
  ],
  spomenici: [
    {q:"Koji je najstariji datirani cjeloviti hrvatski ćirilični natpis?", o:["<i>Bašćanska ploča</i>", "<i>Humačka ploča</i>", "<i>Povaljski prag</i>", "<i>Povelja Kulina bana</i>"], a:2, x:"<b><i>Povaljski prag</i></b> iz 1184. najstariji je datirani cjeloviti hrvatski ćirilični natpis.", img:"slike/Povaljski-prag.jpg", cap:"Povaljski prag (1184.), najstariji datirani cjeloviti hrvatski ćirilični natpis."},
    {q:"Koje je godine napisana <i>Povelja Kulina bana</i>?", o:["1180.", "1184.", "1189.", "1250."], a:2, x:"<b><i>Povelja Kulina bana</i></b> iz 1189. Pergamentni je dokument koji svjedoči o postojanju dubrovačke slavenske kancelarije već krajem 12. stoljeća.", img:"slike/povelja-kulina-bana.jpg", cap:"Povelja Kulina bana (1189.), najstariji sačuvani bosanski diplomatski dokument."},
    {q:"Koji je najstariji sačuvani dokument pisan hrvatskom ćirilicom?", o:["<i>Povelja Kulina bana</i>", "<i>Humačka ploča</i>", "<i>Povaljska listina</i>", "<i>Poljički statut</i>"], a:2, x:"<b><i>Povaljska listina</i></b> iz 1250. najstariji je sačuvani dokument pisan hrvatskom ćirilicom. Prijepis posjedovne isprave benediktinskog samostana u Povljima na Braču.", img:"slike/povaljska-poljicki-kolaz.jpg", cap:"Lijevo: Povaljska listina (1250.), najstariji sačuvani dokument pisan hrvatskom ćirilicom. Desno: Poljički statut (1440.), pravni spomenik pisan bosančicom."},
    {q:"Za koga je pisan <i>Hvalov zbornik</i>?", o:["Za kralja Zvonimira", "Za bana Kulina", "Za hercega Hrvoja Vukčića Hrvatinića", "Za kralja Tomislava"], a:2, x:"<b><i>Hvalov zbornik</i></b> (~1404.) iluminirani je rukopis pisan za hercega Hrvoja Vukčića Hrvatinića, vjerojatno u njegovoj rezidenciji u Omišu.", img:"slike/Hrvoje_Vukcic_Hrvatinic.jpg", cap:"Herceg Hrvoje Vukčić Hrvatinić, ilustracija iz Hrvojeva misala."},
    {q:"Koja je prva hrvatska ćirilička tiskana knjiga?", o:["<i>Nauk karstianski</i>", "<i>Libro od mnozijeh razloga</i>", "<i>Ofičje Blažene Djeve Marije</i>", "<i>Poljički statut</i>"], a:2, x:"Prvo hrvatskoćirilično tiskano izdanje: <b><i>Ofičje Blažene Djeve Marije</i></b>, Venecija 1512."},
    {q:"Koji je pravni spomenik iz 1440. pisan bosančicom?", o:["<i>Vinodolski zakon</i>", "<i>Poljički statut</i>", "<i>Kulinova povelja</i>", "<i>Statut Dubrovnika</i>"], a:1, x:"<b><i>Poljički statut</i></b> (1440.) istaknut je pravni spomenik. Poljičani su u njemu ćirilicu nazivali <i>glagoljicom</i>.", img:"slike/poljicki-statut.jpg", cap:"Poljički statut (1440.), pravni spomenik pisan bosančicom."},
    {q:"Na kojem se otoku nalaze <i>Povaljska listina</i> i <i>Povaljski prag</i>?", o:["Hvaru", "Korčuli", "Braču", "Visu"], a:2, x:"Oba spomenika pronađena su u mjestu <b>Povlja</b> na otoku <b>Braču</b>.", img:"slike/Povlja.JPG", cap:"Povlja na otoku Braču, mjesto u kojem su pronađeni Povaljska listina i Povaljski prag."},
    {q:"Tko je autor <i>Nauka karstianskoga</i> (1611.)?", o:["Ivan Bandulavić", "Pavao Posilović", "Matija Divković", "Franjo Rački"], a:2, x:"<b>Matija Divković</b>, bosanski franjevac, autor je <i>Nauka karstianskoga za narod slovinski</i> (Venecija, 1611.).", img:"slike/divkovic-nauk-krstjanski.jpg", cap:"Naslovnica Nauka karstianskoga Matije Divkovića (1611.), tiskanog bosančicom."},
    {q:"Na kojem se glagoljskom spomeniku nalaze i ćirilična slova?", o:["<i>Bašćanska ploča</i>", "<i>Povaljski prag</i>", "<i>Humačka ploča</i>", "<i>Povaljska listina</i>"], a:0, x:"Na glagoljskoj <b><i>Bašćanskoj ploči</i></b> (~1100.) pojavljuju se i ćirilična slova. Rani suživot dvaju pisama na hrvatskome tlu.", img:"slike/bascanska-ploca.png", cap:"Bašćanska ploča (~1100.), najpoznatiji glagoljski natpis na kojem se javljaju i ćirilična slova."},
    {q:"Koji dokument svjedoči o postojanju dubrovačke slavenske kancelarije već krajem 12. stoljeća?", o:["<i>Poljički statut</i>", "<i>Libro od mnozijeh razloga</i>", "<i>Povelja Kulina bana</i>", "<i>Hvalov zbornik</i>"], a:2, x:"<b><i>Povelja Kulina bana</i></b> (1189.) svjedoči o postojanju dubrovačke slavenske kancelarije krajem 12. stoljeća. Dubrovnik će kasnije sačuvati najveći broj ćiriličnih spisa na Balkanu.", img:"slike/povelja-kulina-bana.jpg", cap:"Povelja Kulina bana (1189.) svjedoči o postojanju dubrovačke slavenske kancelarije već krajem 12. st."},
    {q:"Gdje je pronađen <i>Natpis popa Tjehodraga</i>?", o:["u Humcu u Hercegovini", "u Lištanima u Livanjskome polju", "u Povljima na Braču", "u Priku kraj Omiša"], a:1, x:"<b><i>Natpis popa Tjehodraga</i></b> pronađen je 2003. na lokalitetu Podvornice u Lištanima (Livanjsko polje). Jedan je od najstarijih natpisa pisanih hrvatskom ćirilicom i donosi spomen najstarijega imenom poznatoga popa glagoljaša (Paskojević 2024).", img:"slike/natpis-popa-tjehodraga.jpg", cap:"Natpis popa Tjehodraga (Lištani, Livanjsko polje). Foto: Darko Žubrinić."},
    {q:"Što je <i>Humačka ploča</i>?", o:["nadgrobni natpis na stećku", "spiralno ispisani ćirilični natpis s glagoljičnim slovima", "latinski natpis iz 9. stoljeća", "glagoljski molitvenik"], a:1, x:"<b><i>Humačka ploča</i></b> (12. st.) spiralno je ispisani ćirilični natpis s nekoliko glagoljičnih slova, koji se nalazio u zidu franjevačkoga samostana u Humcu i svjedoči o zidanju crkve. Neki je smatraju najstarijim hrvatskim ćiriličnim epigrafom (Paskojević 2024).", img:"slike/Humacka_ploca.jpg", cap:"Humačka ploča (12. st.), franjevački samostan u Humcu."},
    {q:"Tko je ovjerio <i>Povaljsku listinu</i> (1250.)?", o:["hvarski notar Ivan, ujedno splitski kanonik", "dubrovački notar Paskal", "logotet Vladoje", "Kulinov dijak Radoje"], a:0, x:"<i>Povaljsku listinu</i> (1. prosinca 1250.) ovjerio je <b>hvarski notar Ivan, ujedno splitski kanonik</b>. U njoj se navode potvrde samostanskoga zemljišnog posjedovanja od knezova bračkih i hvarskih (Paskojević 2024)."},
    {q:"Što je <i>Libro od mnozijeh razloga</i> (1520.)?", o:["prva tiskana hrvatska ćirilična knjiga", "zbirka proznih tekstova s najstarijim primjerima dubrovačke književnosti", "pravni statut Poljičke Republike", "iluminirani rukopis za Hrvoja Vukčića"], a:1, x:"<b><i>Libro od mnozijeh razloga</i></b> (1520.) zbirka je proznih tekstova koja sadržava neke od najstarijih primjera dubrovačke književnosti, s utjecajima srednjovjekovlja i renesanse te ispreplitanjem zapadnih i slavenskih utjecaja (Paskojević 2024)."},
    {q:"Gdje se čuva pretpostavljeni izvornik <i>Povelje Kulina bana</i>?", o:["u Državnome arhivu u Dubrovniku", "u Ruskoj akademiji znanosti u Sankt Peterburgu", "u Nacionalnoj i sveučilišnoj knjižnici u Zagrebu", "u Arhivu Bosne i Hercegovine u Sarajevu"], a:1, x:"Pretpostavljeni izvornik <i>Povelje Kulina bana</i> u posjedu je <b>Ruske akademije znanosti u Sankt Peterburgu</b>, gdje je dospio sredinom 19. stoljeća, dok se dva prijepisa čuvaju u Državnome arhivu u Dubrovniku (Paskojević 2024).", img:"slike/akademija-znanosti-spb.jpg", cap:"Zgrada Ruske akademije znanosti u Sankt Peterburgu (arhitekt Giacomo Quarenghi, 1783. – 1789.)."},
    {q:"Koji je car poslije 1230. dao Dubrovčanima slobodu trgovine?", o:["Ivan Asen II.", "Stefan Dušan", "Mehmed II.", "Bajazit II."], a:0, x:"<b>Car Ivan Asen II.</b> (poslije 1230.) dao je Dubrovčanima slobodu trgovine; povelja se čuva u Sankt Peterburgu (Paskojević 2024).", img:"slike/ivan-asen-ii.jpg", cap:"Car Ivan Asen II., portret Georgija Dančova (19. st.)."},
    {q:"Kojim je pismom pisan <i>Hvalov zbornik</i> (~1404.)?", o:["diplomatičkom minuskulom", "ćiriličnim ustavom", "glagoljičnim kurzivom", "bosaničkim brzopisom"], a:1, x:"<i>Hvalov zbornik</i> pisan je <b>ćiriličnim ustavom</b> i najvjerojatnije je nastao u Hrvojevoj rezidenciji u Omišu, prepisan s glagoljičnoga predloška (Paskojević 2024).", img:"slike/hvalov-zbornik.jpg", cap:"Stranica Hvalova zbornika (oko 1404.), pisanog ćiriličnim ustavom."},
  ],
  opcenito: [
    {q:"Koje je slavensko pismo starije: glagoljica ili ćirilica?", o:["ćirilica", "glagoljica", "nastala su istodobno", "bosančica"], a:1, x:"Prevladava uvjerenje da je <b>glagoljica</b> najstarije slavensko pismo. Jedan od argumenata za veću starinu glagoljice jest to što je ćirilica slova za glasove kojih nije bilo u grčkome popunila upravo iz glagoljičkoga inventara (Hrvatska enciklopedija, <i>glagoljica</i>).", img:"slike/kijevski-listici.jpg", cap:"Kijevski listići (potkraj 10. stoljeća), najstariji starocrkvenoslavenski liturgijski spomenik, pisan glagoljicom."},
    {q:"Ćirilica nosi ime po Ćirilu (Konstantinu Filozofu). Kako je ona zapravo nastala?", o:["sastavio ju je sam Ćiril 863. za moravsku misiju", "nastala je postupno, kroz povijesni proces prilagođavanja grčkoga pisma slavenskom glasovnom sustavu", "sastavio ju je Metod nakon Ćirilove smrti", "nastala je preoblikovanjem latinice"], a:1, x:"Iako nosi ime po Ćirilu, ćirilica nije djelo jednoga autora. Prevladava mišljenje da je nastala kao rezultat <b>povijesnoga procesa</b>, tj. <b>postupnoga prilagođavanja grčkoga pisma slavenskom fonološkom sustavu</b> (Damjanović 2012; Hrvatska enciklopedija, <i>ćirilica</i>). Ćiril je, prema prevladavajućem mišljenju, sastavio glagoljicu."},
    {q:"U kojoj se državi ćirilica prvi put počela koristiti kao službeno pismo?", o:["u Velikoj Moravskoj", "u Bizantu", "u Bugarskom Carstvu", "u Kijevskoj Rusiji"], a:2, x:"Nakon dugotrajna prilagođivanja grčkoga pisanja slavenskom glasovnom sustavu ćirilica je kodificirana kao <b>službeno bugarsko pismo</b> nakon državno-crkvenoga sabora u Preslavu (Hrvatska enciklopedija, <i>ćirilica</i>; Damjanović 2012)."},
    {q:"Kada je oblikovana ćirilica?", o:["sredinom 8. stoljeća", "potkraj 9. ili početkom 10. stoljeća", "u 11. stoljeću", "u 12. stoljeću"], a:1, x:"Ćirilični ustav, najstariji oblik ćirilice, oblikovan je <b>potkraj 9. stoljeća</b> (Paskojević 2024), a najstariji ćirilični natpisi potječu iz 10. stoljeća (Damjanović 2012)."},
    {q:"Ćirilica nosi ime po Konstantinu Filozofu (Ćirilu). Koje je pismo, prema prevladavajućem mišljenju, on zapravo sastavio?", o:["ćirilicu", "glagoljicu", "grčku uncijalu", "bosančicu"], a:1, x:"Konstantin Filozof sastavio je <b>glagoljicu</b>, sredinom 9. stoljeća, prije 863. Njegovo se ime ipak vezuje uz ćirilicu, iako ona nije njegovo djelo (Hrvatska enciklopedija, <i>glagoljica</i> i <i>ćirilica</i>).", img:"slike/sv-ciril-solun.jpg", cap:"Prikaz sv. Ćirila kod hrama sv. Ćirila i Metoda u Solunu."},
    {q:"Koji se natpis danas smatra najstarijim poznatim ćiriličnim natpisom u svijetu?", o:["<i>Samuilov natpis</i>", "<i>Krepčanski natpis</i>", "<i>Humačka ploča</i>", "<i>Povaljski prag</i>"], a:1, x:"Najstarijim poznatim ćiriličnim natpisom smatra se <b><i>Krepčanski natpis</i> iz 921.</b> Donedavno se kao najstariji navodio <i>Samuilov natpis</i> iz 992. – 993. (Damjanović 2012; Hrvatska enciklopedija).", img:"slike/krepcanski-natpis.jpg", cap:"Krepčanski natpis (921.), najstariji poznati ćirilični natpis, uklesan u stijenu špiljskoga samostana kraj sela Krepče u Bugarskoj."},
    {q:"Kada se naziv <i>ćirilica</i> prvi put spominje?", o:["863. u Moravskoj", "1047. u zapisu ruskoga popa Upira Lihoga", "1189. u <i>Povelji Kulina bana</i>", "1512. u <i>Ofičju Blažene Djeve Marije</i>"], a:1, x:"Naziv <i>ćirilica</i> prvi se put spominje <b>1047.</b> u zapisu ruskoga popa <b>Upira Lihoga</b>, sačuvanom u mlađem prijepisu (Hrvatska enciklopedija, <i>ćirilica</i>)."},
    {q:"Kojim je od navedenih naroda ćirilica danas službeno pismo?", o:["Bugarima, Rusima, Ukrajincima, Bjelorusima, Srbima i Makedoncima", "Poljacima, Česima i Slovacima", "Litavcima, Latvijcima i Estoncima", "Rumunjima, Mađarima i Albancima"], a:0, x:"Ćirilica je službeno pismo <b>Bjelorusa, Bugara, Crnogoraca, Makedonaca, Rusa, Srba i Ukrajinaca</b> (Hrvatska enciklopedija, <i>ćirilica</i>)."},
    {q:"Koji je tip ćiriličnoga pisma kronološki najstariji?", o:["ustav", "poluustav", "brzopis (skoropis)", "minuskula"], a:0, x:"Starija paleografija dijeli ćirilicu na ustav, poluustav i brzopis (skoropis). <b>Ustav</b> je kronološki najstariji i prvi osnovni oblik ćiriličnoga pisma u svim kulturama koje se njime koriste (Paskojević 2024)."},
    {q:"Na osnovi kojega pisma nastaje ćirilica?", o:["latinskoga", "grčkoga alfabeta", "glagoljice", "feničkoga pisma"], a:1, x:"Ćirilica je grčki alfabet prilagođen za slavenski jezik krajem 9. stoljeća u Bugarskoj."},
  ],
};

// ==================== LOGIC ====================
const ALL_TOPICS = Object.keys(QUESTIONS);
const TOPIC_LABELS = {opcenito:'Općenito o ćirilici', povijest:'Ćirilica u Hrvatskoj', spomenici:'Spomenici'};
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
  document.getElementById('namesArea').classList.add('hidden');
  document.getElementById('endScreen').classList.remove('show');
  document.getElementById('endScreen').style.display = 'none';
  document.getElementById('feedbackModal').classList.add('hidden');
  clearInterval(lqTimer);
}

function renderQuestion() {
  if (currentIndex >= shuffledQuestions.length) { showEndScreen(); return; }
  const item = shuffledQuestions[currentIndex];
  const icons = {povijest:'ikone/grafija.png', spomenici:'ikone/spomenici.png', opcenito:'ikone/povijest.png'};
  const card = document.getElementById('questionCard');
  card.className = 'q-card topic-' + item.topic;
  // Shuffle answer options and remap correct index
  const optIndices = shuffle([...item.o.keys()]);
  item.shuffledA = optIndices.indexOf(item.a);
  card.innerHTML = `<div class="inner">
    <div class="q-num">${icons[item.topic] ? `<img src="${icons[item.topic]}" alt="" class="q-num-icon">` : ''} ${TOPIC_LABELS[item.topic] || (item.topic.charAt(0).toUpperCase()+item.topic.slice(1))} · ${currentIndex+1}/${shuffledQuestions.length}</div>
    <div class="q-text">${item.q}</div>
    <div class="opts">${optIndices.map((oi,pos)=>`<div class="opt" onclick="selectAnswer(${pos})"><span class="letter">${'ABCD'[pos]}.</span><span>${item.o[oi]}</span></div>`).join('')}</div>
  </div>`;
  updateTopBar();
}

function imgHTML(item) {
  if (!item.img) return '';
  return `<div class="q-img-wrap"><img src="${item.img}" alt="Ilustracija" class="q-img" onclick="openLightbox('${item.img}', '${item.cap || ''}')"><div class="q-img-cap">${item.cap || ''}</div></div>`;
}

let lightboxRestoreModal = false;
function openLightbox(src, cap) {
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  img.onload = function() { lb.classList.remove('hidden'); resetZoom(); };
  img.onerror = function() { lb.classList.remove('hidden'); resetZoom(); };
  img.src = src;
  document.getElementById('lightboxCap').textContent = cap;
  // Hide modal behind so it doesn't show through (remember if it was open)
  const fm = document.getElementById('feedbackModal');
  lightboxRestoreModal = !fm.classList.contains('hidden');
  fm.classList.add('hidden');
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
  // Restore the modal with the explanation only if it was open before
  if (lightboxRestoreModal) document.getElementById('feedbackModal').classList.remove('hidden');
  lightboxRestoreModal = false;
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
  const nextTopicMap = {opcenito:'povijest', povijest:'spomenici', spomenici:'opcenito', mix:'opcenito'};
  const otherTopic = nextTopicMap[currentTopic] || 'opcenito';
  const otherLabel = {opcenito:'Općenito o ćirilici', povijest:'Ćirilica u Hrvatskoj', spomenici:'Spomenici'}[otherTopic];
  end.innerHTML = `<h2 style="color:var(--accent);">🏁 Kraj kviza!</h2>
    <div class="big-score ${cls}">${score} / ${shuffledQuestions.length}</div>
    <div class="end-pct">${pct}%</div><p class="end-msg">${msg}</p>
    <button class="mix-btn" onclick="startQuiz(currentTopic)">🔄 pokušaj ponovo</button>
    <button class="mix-btn" style="background:var(--accent);color:#fff;margin-top:.5rem;" onclick="startQuiz('${otherTopic}')">→ odigraj kviz: ${otherLabel}</button>
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
  {c:'Ш ш', l:'Š š', g:'š'},
  {c:'Ђ ђ', l:'Đ đ', g:'J'},
  {c:'Ћ ћ', l:'Ć ć', g:'J'},
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
  matchPairs = shuffleM(LETTER_PAIRS); // use all 27
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
  {c:'Ч',l:'ч',lat:'Č č', g:'C', gr:'—'},{c:'Џ',l:'џ',lat:'Dž dž', g:'dZ', gr:'—'},{c:'Ш',l:'ш',lat:'Š š', g:'š', gr:'—'},
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

// ==================== IMPRESSUM ====================
function openImpressum() {
  const m = document.getElementById('impressumModal');
  m.classList.remove('hidden', 'closing');
  m.querySelector('.modal-box').scrollTop = 0;
}
function closeImpressum() {
  document.getElementById('impressumModal').classList.add('hidden');
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !document.getElementById('impressumModal').classList.contains('hidden')) closeImpressum();
});

// ==================== NAZIVI (višestruki odabir) ====================
const NAMES_GAME = {
  q: "Kojim se sve nazivima označavala hrvatska ćirilica (bosančica)? Označi <b>sve</b> točne nazive pa pritisni <b>Potvrdi</b>.",
  o: [
    {t:"harvacko pismo", ok:true},
    {t:"arvatica", ok:true},
    {t:"bosančica", ok:true},
    {t:"bosanska ćirilica", ok:true},
    {t:"hrvatsko-bosanska ćirilica", ok:true},
    {t:"bosansko-dalmatinska ćirilica", ok:true},
    {t:"zapadna (bosanska) ćirilica", ok:true},
    {t:"serbska slova", ok:true},
    {t:"poljička azbukvica (poljičica)", ok:true},
    {t:"begovica", ok:true},
    {t:"arebica", ok:false},
    {t:"uglata glagoljica", ok:false},
    {t:"grčka uncijala", ok:false},
    {t:"hrvatska latinica", ok:false},
    {t:"gotica", ok:false},
  ],
  x: `<ul class="names-expl">
    <li><b>harvacko pismo</b> — Dmine Papalić, splitski plemić, oko 1510., za pismo kojim prepisuje Hrvatsku kroniku</li>
    <li><b>arvatica</b> (<i>arvacko pismo</i>) — u <i>Povaljskoj listini</i> (1250.) i <i>Poljičkom statutu</i>, od pridjeva <i>harvacki</i> (hrvatski)</li>
    <li><b>bosančica</b> — naziv je 1889. uveo Ćiro Truhelka; od svih naziva najviše je zaživio. U užem smislu označuje ćiriličnu minuskulu 15. – 19. stoljeća <span class="names-thumb" onclick="openLightbox('slike/truhelka.jpg','Ćiro Truhelka (1865. – 1942.)')"><img src="slike/truhelka.jpg" alt="Ćiro Truhelka"></span></li>
    <li><b>bosanska ćirilica</b> — Franjo Rački, 19. stoljeće <span class="names-thumb" onclick="openLightbox('slike/racki.png','Franjo Rački')"><img src="slike/racki.png" alt="Franjo Rački"></span></li>
    <li><b>hrvatsko-bosanska ćirilica</b> — Ivan Kukuljević Sakcinski, 19. stoljeće <span class="names-thumb" onclick="openLightbox('slike/kukuljevic-sakcinski.png','Ivan Kukuljević Sakcinski')"><img src="slike/kukuljevic-sakcinski.png" alt="Ivan Kukuljević Sakcinski"></span></li>
    <li><b>bosansko-dalmatinska ćirilica</b> — Vatroslav Jagić, 19. stoljeće <span class="names-thumb" onclick="openLightbox('slike/jagic.jpg','Vatroslav Jagić (1838. – 1923.)')"><img src="slike/jagic.jpg" alt="Vatroslav Jagić"></span></li>
    <li><b>zapadna (bosanska) ćirilica</b> — Stjepan Ivšić, 20. stoljeće <span class="names-thumb" onclick="openLightbox('slike/ivsic.jpg','Stjepan Ivšić')"><img src="slike/ivsic.jpg" alt="Stjepan Ivšić"></span></li>
    <li><b>serbska slova</b> — Matija Divković, 17. stoljeće</li>
    <li><b>poljička azbukvica</b> ili <b>poljičica</b> — narod u Poljicima (zabilježio Frane Ivanišević)</li>
    <li><b>begovica</b> — tako su je nazivali muslimani u Bosni</li>
  </ul>
  <p class="names-note">Zanimljivo: Poljičani su svoje ćirilično pismo nazivali i <i>glagoljicom</i>, a u Dubrovniku je naziv <i>presbyteri chiurillice</i> označavao popove glagoljaše (Damjanović 2012).</p>
  <p class="names-note">Netočni su ponuđeni nazivi: <i>arebica</i> (bosanskohercegovačko pismo na arapskoj osnovi), <i>uglata glagoljica</i> (tip glagoljice), <i>grčka uncijala</i> (grčko pismo, uzor ćirilici), <i>hrvatska latinica</i> i <i>gotica</i> (latinično pismo).</p>`
};
let namesOrder = [], namesSel = new Set(), namesDone = false;

function startNames() {
  namesOrder = shuffle([...NAMES_GAME.o.keys()]);
  namesSel = new Set(); namesDone = false;
  document.getElementById('startScreen').style.display = 'none';
  document.getElementById('endScreen').style.display = 'none';
  document.getElementById('namesArea').classList.remove('hidden');
  renderNames();
}

function renderNames() {
  const total = NAMES_GAME.o.filter(o => o.ok).length;
  let result = '';
  if (namesDone) {
    const hit = [...namesSel].filter(i => NAMES_GAME.o[i].ok).length;
    const bad = [...namesSel].filter(i => !NAMES_GAME.o[i].ok).length;
    const perfect = hit === total && bad === 0;
    result = `<div class="names-result ${perfect ? 'good' : 'poor'}">${perfect ? '🎉 Sve točno!' : 'Rješenje'}<span>Točno označenih: <b>${hit}/${total}</b> · pogrešno označenih: <b>${bad}</b></span></div>
      <div class="names-legend"><span class="lg correct">označeno točno</span><span class="lg missed">propušteno</span><span class="lg wrong">pogrešno označeno</span></div>`;
  }
  const opts = namesOrder.map(i => {
    const o = NAMES_GAME.o[i], sel = namesSel.has(i);
    let cls = 'opt name-opt';
    if (!namesDone) { if (sel) cls += ' picked'; }
    else if (o.ok && sel) cls += ' correct';
    else if (o.ok) cls += ' missed';
    else if (sel) cls += ' wrong';
    else cls += ' faded';
    const mark = namesDone ? (o.ok ? (sel ? '✓' : '!') : (sel ? '✗' : '')) : (sel ? '✓' : '');
    return `<div class="${cls}" ${namesDone ? '' : `onclick="toggleName(${i})"`}><span class="name-box">${mark}</span><span>${o.t}</span></div>`;
  }).join('');
  document.getElementById('namesCard').innerHTML = `<div class="inner">
    <div class="q-num"><img src="ikone/naziv.png" alt="" class="q-num-icon"> Nazivi</div>
    <div class="q-text">${NAMES_GAME.q}</div>
    ${result}
    <div class="names-grid">${opts}</div>
    <div class="names-submit-wrap"><button class="next-btn show" id="namesSubmit" onclick="submitNames()"></button></div>
    ${namesDone ? `<div class="names-explanation"><h3>Nazivi hrvatske ćirilice</h3>${NAMES_GAME.x}</div>` : ''}
  </div>`;
  const btn = document.getElementById('namesSubmit');
  btn.textContent = namesDone ? '🔄 Pokušaj ponovo' : 'Potvrdi';
  btn.disabled = !namesDone && namesSel.size === 0;
}

function toggleName(i) {
  if (namesDone) return;
  namesSel.has(i) ? namesSel.delete(i) : namesSel.add(i);
  renderNames();
}

function submitNames() {
  if (namesDone) { startNames(); return; }
  if (namesSel.size === 0) return;
  namesDone = true;
  const total = NAMES_GAME.o.filter(o => o.ok).length;
  const hit = [...namesSel].filter(i => NAMES_GAME.o[i].ok).length;
  const bad = namesSel.size - hit;
  (hit === total && bad === 0) ? soundCorrect() : soundWrong();
  if (hit === total && bad === 0) soundFinish(true);
  renderNames();
  document.querySelector('.main-wrap').scrollTop = 0;
}
