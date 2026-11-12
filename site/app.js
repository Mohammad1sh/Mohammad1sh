function startApp(SECTIONS, GROUPS){
const CAT = {"Anatomi":"var(--c-ana)","Fizyoloji":"var(--c-fiz)","Kinezyoloji":"var(--c-kin)","Rehabilitasyon":"var(--c-reh)","Değerlendirme":"var(--c-deg)"};
const store = {
  get(k,d){ try{ const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; }catch(e){ return d; } },
  set(k,v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
};
let known = store.get("ftr-known", {});
let best = store.get("ftr-best", {});
let wrongs = store.get("ftr-wrong", {});
let days = store.get("ftr-days", {});
const ALL = SECTIONS.flatMap(s => s.cards.map((c,i) => ({...c, sid:s.id, key:s.id+":"+i})));
const ORDERED = GROUPS.flatMap(g => SECTIONS.filter(s => s.tag===g));
const PSEUDO = { all:{id:"all", title:"Tümü"}, wrong:{id:"wrong", title:"Yanlışlarım"} };
const secById = id => SECTIONS.find(s => s.id === id) || PSEUDO[id];
const isPseudo = id => id in PSEUDO;
const catOf = id => id==="all" ? "var(--brand)" : id==="wrong" ? "var(--bad)" : CAT[secById(id).tag];

const state = { view:"konular", sec:store.get("ftr-sec","ust"), onlyUnknown:false, deck:[], idx:0, revealed:false, deckSig:"", qn:store.get("ftr-qn",20) };
let quiz = { phase:"start", qs:[], i:0, picked:null, wrong:[], correct:0 };
const $ = s => document.querySelector(s);
const shuffle = a => { const b=[...a]; for(let i=b.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [b[i],b[j]]=[b[j],b[i]]; } return b; };
const resetQuiz = () => { quiz = { phase:"start", qs:[], i:0, picked:null, wrong:[], correct:0 }; };
function poolFor(sid){ return sid==="all" ? ALL : sid==="wrong" ? ALL.filter(c=>wrongs[c.key]) : ALL.filter(c=>c.sid===sid); }
function knownCount(sid){ return poolFor(sid).filter(c=>known[c.key]).length; }
const reduced = () => { try{ return matchMedia("(prefers-reduced-motion: reduce)").matches; }catch(e){ return false; } };

const svg = p => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const ICON = {
  vaka: svg('<path d="M9 3h6M10 3v4.5L5.5 17a2.5 2.5 0 0 0 2.2 3.6h8.6a2.5 2.5 0 0 0 2.2-3.6L14 7.5V3"/><path d="M7.5 14h9"/>'),
  exam: svg('<rect x="4" y="3" width="16" height="18" rx="2.5"/><path d="M8 8h8M8 12h8M8 16h5"/>'),
  wrong: svg('<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 8v4l3 2"/>'),
  search: svg('<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>'),
  chev: svg('<path d="M6 9l6 6 6-6"/>'),
  x: svg('<path d="M6 6l12 12M18 6L6 18"/>'),
  left: svg('<path d="M15 6l-6 6 6 6"/>'),
  right: svg('<path d="M9 6l6 6-6 6"/>'),
  bolt: svg('<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>'),
  clock: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>')
};

/* ---- Günlük çalışma ve seri ---- */
const dayKey = d => d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
function bump(){ const k = dayKey(new Date()); days[k] = (days[k]||0) + 1; store.set("ftr-days", days); }
function streakDays(){ let n = 0; const d = new Date(); if(!days[dayKey(d)]) d.setDate(d.getDate()-1); while(days[dayKey(d)]){ n++; d.setDate(d.getDate()-1); } return n; }

$("#secCount").textContent = SECTIONS.length;
$("#cardCount").textContent = ALL.length;

function renderTotal(){
  const k = knownCount("all"), p = Math.round(k/ALL.length*100);
  $("#ring").style.setProperty("--p", p);
  $("#totalPct").textContent = "%" + p;
  $("#totalText").textContent = k + " / " + ALL.length;
  const di = $("#dayInfo");
  if(di) di.innerHTML = `<span>${ICON.bolt}<b class="mono">${days[dayKey(new Date())]||0}</b> bugün</span><span><b class="mono">${streakDays()}</b> gün seri</span>`;
}

/* ---- Bölüm seçici ---- */
function chipSmall(id){ return id==="wrong" ? poolFor("wrong").length : knownCount(id)+"/"+poolFor(id).length; }
function renderChips(){
  const withAll = state.view !== "konular";
  if(!secById(state.sec) || (!withAll && isPseudo(state.sec))) state.sec = ORDERED[0].id;
  const chip = (s,c) => `<button class="chip${s.id==="vaka"?" hot":""}" style="--gc:${c}" data-sec="${s.id}" aria-pressed="${state.sec===s.id}">${s.title}<small>${chipSmall(s.id)}</small></button>`;
  const cur = secById(state.sec);
  let html = `<div class="pickrow">
    <button class="picker" id="openSheet" style="--gc:${catOf(state.sec)}"><i></i><span class="pk-t"><small>${cur.tag || "Karışık"}</small><b>${cur.title}</b></span><em class="mono">${chipSmall(state.sec)}</em>${ICON.chev}</button>
    <span class="pk-hint"><b class="mono">${SECTIONS.length}</b> bölüm · <b class="mono">${ALL.length}</b> kart</span>
    <button class="searchbtn" id="openSearch" aria-label="Bölümlerde ve kartlarda ara">${ICON.search}<span>Ara</span></button>
  </div>`;
  $("#chips").innerHTML = html;
}
function setSec(id, scroll){
  state.sec = id; store.set("ftr-sec", id);
  if(state.view==="test") resetQuiz();
  render();
  if(scroll){ const m = $("main"); window.scrollTo({top: Math.max(0, m.offsetTop - 70), behavior: reduced() ? "auto" : "smooth"}); }
}
$("#chips").addEventListener("click", e => {
  if(e.target.closest("#openSheet")) return openSheet(false);
  if(e.target.closest("#openSearch")) return openSheet(true);
  const b = e.target.closest("[data-sec]"); if(b) setSec(b.dataset.sec);
});

/* ---- Bölüm paneli ve arama ---- */
const fold = s => String(s).replace(/<[^>]+>/g," ").toLocaleLowerCase("tr").replace(/[çğıöşüâî]/g, ch => ({"ç":"c","ğ":"g","ı":"i","ö":"o","ş":"s","ü":"u","â":"a","î":"i"})[ch]);
const blockText = b => [b.h, b.p, ...(b.ul||[]), ...(b.ol||[]), ...(b.table ? b.table.head.concat(...b.table.rows) : [])].filter(Boolean).join(" ");
let SEC_TEXT = null;
const sheet = document.createElement("div");
sheet.className = "sheet"; sheet.hidden = true;
sheet.innerHTML = `<div class="sh-back" data-close></div>
  <div class="sh-panel" role="dialog" aria-modal="true" aria-label="Bölümler">
    <div class="sh-head"><div><small>Hepsi burada</small><b>Bölümler</b></div><button class="sh-x" data-close aria-label="Kapat">${ICON.x}</button></div>
    <label class="sh-search">${ICON.search}<input id="shq" type="search" placeholder="Bölüm, konu ya da kart ara…" autocomplete="off" enterkeyhint="search"></label>
    <div class="sh-body" id="shBody"></div>
  </div>`;
document.body.appendChild(sheet);
function tile(s){
  const id = s.id, pool = poolFor(id), k = knownCount(id), w = id==="wrong";
  return `<button class="tile${id==="vaka"?" hot":""}" style="--gc:${catOf(id)}" data-pick="${id}" aria-pressed="${state.sec===id}">
    <b>${s.title}</b><span class="mono">${w ? pool.length+" soru" : k+" / "+pool.length}</span>
    <span class="bar"><i style="width:${!w && pool.length ? k/pool.length*100 : 0}%"></i></span></button>`;
}
const shGroup = (g,c,list) => `<div class="sh-grp"><span class="glabel" style="--gc:${c}"><i></i>${g}</span><div class="tiles">${list.map(tile).join("")}</div></div>`;
function renderSheet(){
  const q = fold($("#shq").value.trim());
  let h = "";
  if(!q){
    const v = SECTIONS.find(s => s.id==="vaka");
    if(v) h += shGroup("Öne çıkan","var(--c-deg)",[v]);
    if(state.view !== "konular") h += shGroup("Karışık","var(--brand)",[PSEUDO.all, PSEUDO.wrong]);
    for(const g of GROUPS){ const list = SECTIONS.filter(s => s.tag===g); if(list.length) h += shGroup(g, CAT[g], list); }
  } else {
    if(!SEC_TEXT) SEC_TEXT = Object.fromEntries(SECTIONS.map(s => [s.id, fold(s.title+" "+s.lead+" "+s.blocks.map(blockText).join(" "))]));
    const secs = ORDERED.filter(s => SEC_TEXT[s.id].includes(q));
    const all = ALL.filter(c => fold(c.q+" "+c.a).includes(q));
    if(secs.length) h += `<div class="sh-grp"><span class="glabel"><i></i>Konu özetinde geçen bölümler</span><div class="tiles">${secs.map(tile).join("")}</div></div>`;
    h += `<div class="sh-grp"><span class="glabel"><i></i>Kartlar · <span class="mono">${all.length}</span></span>`
      + (all.length ? `<ul class="hits">${all.slice(0,40).map(c => `<li><button data-pick="${c.sid}" style="--gc:${CAT[secById(c.sid).tag]}"><small>${secById(c.sid).title}</small><span>${c.q}</span><b>${c.a}</b></button></li>`).join("")}</ul>${all.length>40?`<p class="empty">İlk 40 sonuç gösteriliyor. Aramayı daralt.</p>`:""}`
      : `<p class="empty">“${$("#shq").value.trim()}” için sonuç yok.</p>`) + `</div>`;
  }
  $("#shBody").innerHTML = h;
}
function openSheet(focus){
  sheet.hidden = false; document.documentElement.classList.add("lock");
  $("#shq").value = ""; renderSheet(); $("#shBody").scrollTop = 0;
  if(focus) setTimeout(() => $("#shq").focus(), 60);
}
function closeSheet(){ sheet.hidden = true; document.documentElement.classList.remove("lock"); }
sheet.addEventListener("click", e => {
  if(e.target.closest("[data-close]")) return closeSheet();
  const p = e.target.closest("[data-pick]");
  if(p){ closeSheet(); setSec(p.dataset.pick, true); }
});
$("#shq").addEventListener("input", renderSheet);

/* ---- Öne çıkanlar ---- */
function spotHTML(){
  const v = SECTIONS.find(s => s.id==="vaka"), w = poolFor("wrong").length;
  let t = "";
  if(v) t += `<button class="sp sp-vaka" data-spot="vaka">${ICON.vaka}<span><b>Vaka Soruları</b><small>${v.cards.length} klinik senaryo · dersleri birleştirir</small></span>${ICON.right}</button>`;
  t += `<button class="sp sp-exam" data-spot="exam">${ICON.exam}<span><b>Deneme Sınavı</b><small>Tüm bölümlerden 50 karışık soru</small></span>${ICON.right}</button>`;
  t += `<button class="sp sp-wrong" data-spot="wrong">${ICON.wrong}<span><b>Yanlışlarım</b><small>${w ? w+" soru tekrar bekliyor" : "Testte yanlış yaptıkların burada toplanır"}</small></span>${ICON.right}</button>`;
  return `<div class="spot">${t}</div>`;
}
function goTest(id){
  state.sec = id; store.set("ftr-sec", id); resetQuiz();
  if(location.hash !== "#test") location.hash = "test"; else { render(); window.scrollTo(0,0); }
}

/* ---- Konular ---- */
function blockHTML(b){
  let h = `<section class="blk"><h3>${b.h}</h3>`;
  if(b.p) h += `<p>${b.p}</p>`;
  if(b.ul) h += `<ul>${b.ul.map(x=>`<li>${x}</li>`).join("")}</ul>`;
  if(b.ol) h += `<ol>${b.ol.map(x=>`<li>${x}</li>`).join("")}</ol>`;
  if(b.table) h += `<div class="tw"><table><thead><tr>${b.table.head.map(x=>`<th scope="col">${x}</th>`).join("")}</tr></thead><tbody>${b.table.rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  return h + `</section>`;
}
function renderTopics(){
  const s = secById(state.sec), k = knownCount(s.id);
  const i = ORDERED.findIndex(x => x.id===s.id), pv = ORDERED[i-1], nx = ORDERED[i+1];
  $("#view").innerHTML = spotHTML() + `
    <div class="sec-head fade-in">
      <span class="eyebrow">${s.tag}</span>
      <h2>${s.title}</h2>
      <p>${s.lead}</p>
      <div class="facts"><span><b class="mono">${s.cards.length}</b> kart</span><span><b class="mono">${s.blocks.length}</b> konu başlığı</span><span><b class="mono">${Math.round(k/s.cards.length*100)}%</b> bildiğin</span></div>
      <div class="meter"><div class="bar"><i style="width:${k/s.cards.length*100}%"></i></div><span class="mono">${k}/${s.cards.length}</span></div>
      <div class="actions">
        <button class="btn primary" data-go="kartlar">Kartlarla çalış</button>
        <button class="btn" data-go="test">Bu bölümün testini çöz</button>
      </div>
    </div>
    <div class="blocks">${s.blocks.map(blockHTML).join("")}</div>
    <div class="pager">${pv ? `<button class="pg" data-nav="${pv.id}" style="--gc:${CAT[pv.tag]}">${ICON.left}<span><small>Önceki</small><b>${pv.title}</b></span></button>` : "<span></span>"}${nx ? `<button class="pg next" data-nav="${nx.id}" style="--gc:${CAT[nx.tag]}"><span><small>Sonraki</small><b>${nx.title}</b></span>${ICON.right}</button>` : ""}</div>`;
}

/* ---- Kartlar ---- */
function buildDeck(){
  let list = poolFor(state.sec);
  if(state.onlyUnknown) list = list.filter(c=>!known[c.key]);
  state.deck = shuffle(list); state.idx = 0; state.revealed = false;
  state.deckSig = state.sec + "|" + state.onlyUnknown;
}
const tapIcon = svg('<path d="M3 12a9 9 0 0 1 15.5-6.2L21 8M21 3v5h-5"/>');
let suppressUntil = 0;
function renderCards(){
  if(state.deckSig !== state.sec + "|" + state.onlyUnknown) buildDeck();
  const d = state.deck, i = state.idx;
  const bar = `<div class="deckbar">
      <label class="toggle"><input type="checkbox" id="onlyUnknown" ${state.onlyUnknown?"checked":""}> Sadece bilmediklerim</label>
      <span class="count">${Math.min(i+1,d.length)} / ${d.length}</span>
    </div>
    <div class="bar deckprog"><i style="width:${d.length?Math.min(i,d.length)/d.length*100:0}%"></i></div>`;
  if(d.length===0){
    $("#view").innerHTML = bar + `<div class="panel fade-in"><h2>${state.sec==="wrong" ? "Yanlış listen boş" : "Bu bölümdeki tüm kartları biliyorsun"}</h2><p>${state.sec==="wrong" ? "Testlerde yanlış yaptığın sorular burada birikir." : "“Sadece bilmediklerim” filtresini kapatıp tekrar edebilir ya da teste geçebilirsin."}</p><div class="actions"><button class="btn primary" data-go="test">Teste geç</button></div></div>`;
    return;
  }
  if(i >= d.length){
    const k = d.filter(c=>known[c.key]).length;
    $("#view").innerHTML = bar + `<div class="panel fade-in"><h2>Desteyi bitirdin</h2><p>Bu destede bildiğin kart: <b class="mono">${k} / ${d.length}</b></p>
      <div class="actions"><button class="btn primary" id="restart">Karıştırıp baştan başla</button><button class="btn" id="unknownOnly">Bilmediklerimi çalış</button><button class="btn" data-go="test">Teste geç</button></div></div>`;
    return;
  }
  const c = d[i], s = secById(c.sid);
  $("#view").style.setProperty("--cat", CAT[s.tag]);
  $("#view").innerHTML = bar + `
    <div class="stack">
    <div class="flip ${state.revealed?"on":""}" id="flip" role="button" tabindex="0" aria-label="Kartı çevir">
      <div class="flip-in">
        <article class="face front">
          <div class="meta"><span>${s.title}</span>${known[c.key]?'<span class="known">Biliyorsun</span>':'<span>Soru</span>'}</div>
          <div class="q">${c.q}</div>
          <div class="grow"></div>
          <div class="hint">${tapIcon}Cevabı görmek için karta dokun</div>
        </article>
        <article class="face back" aria-live="polite">
          <div class="meta"><span>Cevap</span>${known[c.key]?'<span class="known">Biliyorsun</span>':''}</div>
          <div class="qsmall">${c.q}</div>
          <div class="a">${state.revealed ? c.a : ""}</div>
          <div class="grow"></div>
          <div class="swipe-hint">${ICON.left}Tekrar · Biliyorum${ICON.right}</div>
        </article>
      </div>
    </div>
    </div>
    <div class="card-actions">
      <button class="btn bad" id="again" ${state.revealed?"":"disabled"}>Tekrar et</button>
      <button class="btn good" id="gotit" ${state.revealed?"":"disabled"}>Biliyorum</button>
    </div>
    <div class="keys"><kbd>Boşluk</kbd> çevir · <kbd>←</kbd> tekrar et · <kbd>→</kbd> biliyorum</div>`;
  bindSwipe();
}
function bindSwipe(){
  const el = $("#flip"); if(!el) return;
  let x0 = null, dx = 0, drag = false;
  el.addEventListener("pointerdown", e => { if(!state.revealed || e.button > 0) return; x0 = e.clientX; dx = 0; drag = false; });
  el.addEventListener("pointermove", e => {
    if(x0 === null) return;
    dx = e.clientX - x0;
    if(!drag && Math.abs(dx) > 10){ drag = true; el.classList.add("drag"); try{ el.setPointerCapture(e.pointerId); }catch(_){} }
    if(drag){ el.style.transform = `translateX(${dx}px) rotate(${dx/26}deg)`; el.dataset.sw = dx > 70 ? "r" : dx < -70 ? "l" : ""; }
  });
  const end = () => {
    if(x0 === null) return; x0 = null;
    if(!drag) return;
    suppressUntil = Date.now() + 350; el.classList.remove("drag");
    if(Math.abs(dx) > 90){
      const dir = dx > 0 ? 1 : -1;
      el.classList.add("fly"); el.style.transform = `translateX(${dir*Math.max(innerWidth,700)}px) rotate(${dir*18}deg)`;
      setTimeout(() => mark(dir > 0), 200);
    } else { el.style.transform = ""; el.dataset.sw = ""; }
  };
  el.addEventListener("pointerup", end); el.addEventListener("pointercancel", end);
}
function reveal(){
  if(state.revealed) return;
  state.revealed = true;
  const c = state.deck[state.idx];
  $("#flip").classList.add("on");
  $("#flip .back .a").textContent = c.a;
  $("#again").disabled = false; $("#gotit").disabled = false;
}
function mark(isKnown){
  const c = state.deck[state.idx];
  if(!c) return;
  if(isKnown) known[c.key] = true; else delete known[c.key];
  store.set("ftr-known", known); bump();
  state.idx++; state.revealed = false; render();
}

/* ---- Test ---- */
const quizN = () => state.sec==="all" ? state.qn : poolFor(state.sec).length;
const bestKey = () => state.sec==="all" ? (state.qn===20 ? "all" : "all-"+state.qn) : state.sec;
const fmt = ms => { const s = Math.floor(ms/1000); return String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0"); };
function startQuiz(){
  const pool = poolFor(state.sec);
  if(!pool.length) return;
  const n = Math.min(quizN(), pool.length);
  quiz = { phase:"q", i:0, picked:null, wrong:[], correct:0, streak:0, maxStreak:0, t0:Date.now(), t1:0,
    qs: shuffle(pool).slice(0,n).map(c => ({...c, opts: shuffle([c.a, ...c.d])})) };
  render();
}
setInterval(() => { const el = $("#qtime"); if(el && quiz.phase==="q" && quiz.t0) el.textContent = fmt(Date.now()-quiz.t0); }, 1000);
function renderQuiz(){
  const label = state.sec==="all" ? "Tüm bölümler" : secById(state.sec).title;
  if(quiz.phase==="start"){
    const pool = poolFor(state.sec), n = Math.min(quizN(), pool.length), b = best[bestKey()];
    if(!pool.length){
      $("#view").innerHTML = spotHTML() + `<div class="panel fade-in"><span class="eyebrow">Test</span><h2>Yanlış listen şu an boş</h2><p>Herhangi bir testte yanlış yaptığın sorular burada toplanır. Doğru cevapladığında listeden çıkar.</p><div class="actions"><button class="btn primary" data-spot="exam">Deneme sınavına başla</button></div></div>`;
      return;
    }
    const seg = state.sec==="all" ? `<div class="seg" role="group" aria-label="Soru sayısı">${[[20,"Hızlı"],[50,"Deneme"],[100,"Büyük deneme"]].map(([v,t]) => `<button data-qn="${v}" aria-pressed="${state.qn===v}"><b class="mono">${v}</b><small>${t}</small></button>`).join("")}</div>` : "";
    const intro = state.sec==="all" ? "Bütün bölümlerden karışık sorular. Soru sayısını seç." : state.sec==="wrong" ? "Daha önce yanlış yaptığın sorular. Doğru cevapladıkların listeden çıkar." : state.sec==="vaka" ? "Birden fazla dersi birleştiren klinik senaryolar." : "Bu bölümün bütün kartları, her soruda tek doğru cevap.";
    $("#view").innerHTML = spotHTML() + `<div class="panel fade-in">
      <span class="eyebrow">Test</span>
      <h2>${label}</h2>
      <p>${intro}</p>
      ${seg}
      <div class="stats">
        <div class="stat"><span>Soru sayısı</span><b class="mono">${n}</b></div>
        <div class="stat"><span>En iyi skorun</span><b>${b ? b.c+" / "+b.n : "Henüz yok"}</b></div>
        <div class="stat"><span>Tahmini süre</span><b>${Math.max(1,Math.round(n*0.6))} dk</b></div>
      </div>
      <div class="actions"><button class="btn primary big" id="startQuiz">Testi başlat</button></div>
    </div>`;
    return;
  }
  if(quiz.phase==="end"){
    const n = quiz.qs.length, p = Math.round(quiz.correct/n*100);
    $("#view").innerHTML = `<div class="panel fade-in">
      <span class="eyebrow">Sonuç · ${label}</span>
      <div class="result">
        <div class="ring" style="--p:${p}"><div><b>%${p}</b><span>${quiz.correct} / ${n}</span></div></div>
        <div><h2>${p===100 ? "Hepsi doğru!" : p>=80 ? "Harika gidiyorsun" : p>=60 ? "İyi, biraz daha tekrar" : "Tekrar zamanı"}</h2><p>${quiz.correct===n ? "Başka bir bölüme geçebilirsin." : "Yanlış yaptığın sorular aşağıda, doğru cevaplarıyla birlikte. Hepsi “Yanlışlarım” listene eklendi."}</p></div>
      </div>
      <div class="stats">
        <div class="stat"><span>Süre</span><b class="mono">${fmt(quiz.t1-quiz.t0)}</b></div>
        <div class="stat"><span>En uzun seri</span><b class="mono">${quiz.maxStreak}</b></div>
        <div class="stat"><span>Yanlış</span><b class="mono">${quiz.wrong.length}</b></div>
      </div>
      ${quiz.wrong.length ? `<ul class="wrong">${quiz.wrong.map(w=>`<li>${w.q}<b>${w.a}</b></li>`).join("")}</ul>` : ""}
      <div class="actions"><button class="btn primary" id="startQuiz">Yeniden çöz</button>${quiz.wrong.length ? `<button class="btn" data-spot="wrong">Yanlışlarımı çöz</button>` : ""}<button class="btn" data-go="kartlar">Kartlara dön</button></div>
    </div>`;
    return;
  }
  const q = quiz.qs[quiz.i], answered = quiz.picked!==null;
  if(isPseudo(state.sec)) $("#view").style.setProperty("--cat", CAT[secById(q.sid).tag]);
  const letters = "ABCD";
  const ok = answered && q.opts[quiz.picked]===q.a;
  $("#view").innerHTML = `<div class="panel qpanel">
    <div class="qprog"><span>${label}${isPseudo(state.sec) ? " · "+secById(q.sid).title : ""}</span><span class="qmeta">${quiz.streak>=2 ? `<span class="streak${answered&&ok?" pulse":""}">${ICON.bolt}${quiz.streak} seri</span>` : ""}<span class="mono">${ICON.clock}<span id="qtime">${fmt(Date.now()-quiz.t0)}</span></span><span class="mono">${quiz.i+1} / ${quiz.qs.length}</span></span></div>
    <div class="bar"><i style="width:${(quiz.i+(answered?1:0))/quiz.qs.length*100}%"></i></div>
    <h2 class="${answered?"":"fade-in"}">${q.q}</h2>
    <div class="opts">${q.opts.map((o,j)=>{
      let cls = "opt" + (answered ? "" : " in");
      if(answered && o===q.a) cls += " ok";
      else if(answered && j===quiz.picked) cls += " no";
      return `<button class="${cls}" style="--i:${j}" data-opt="${j}" ${answered?"disabled":""}><span class="k">${letters[j]}</span><span>${o}</span></button>`;
    }).join("")}</div>
    ${answered ? `<div class="feedback ${ok?"ok":"no"}">${ok ? (quiz.streak>=3 ? "Doğru! "+quiz.streak+" soru üst üste." : "Doğru!") : "Yanlış. Doğru cevap: "+q.a}</div>
      <div class="actions"><button class="btn primary" id="nextQ">${quiz.i+1<quiz.qs.length?"Sonraki soru":"Sonucu gör"}</button></div>` : ""}
  </div>`;
}
function pick(j){
  if(quiz.picked!==null) return;
  const q = quiz.qs[quiz.i]; quiz.picked = j;
  if(q.opts[j]===q.a){ quiz.correct++; quiz.streak++; quiz.maxStreak = Math.max(quiz.maxStreak, quiz.streak); delete wrongs[q.key]; }
  else { quiz.wrong.push(q); quiz.streak = 0; wrongs[q.key] = true; }
  store.set("ftr-wrong", wrongs); bump();
  render();
}
function nextQ(){
  quiz.i++; quiz.picked = null;
  if(quiz.i >= quiz.qs.length){
    quiz.phase = "end"; quiz.t1 = Date.now();
    const k = bestKey(), prev = best[k];
    if(state.sec!=="wrong" && (!prev || quiz.correct/quiz.qs.length > prev.c/prev.n)){ best[k] = {c:quiz.correct, n:quiz.qs.length}; store.set("ftr-best", best); }
    render(); window.scrollTo(0, Math.max(0, $("main").offsetTop - 70));
    if(quiz.correct/quiz.qs.length >= 0.8) confetti();
    return;
  }
  render();
}
function confetti(){
  if(reduced()) return;
  const c = document.createElement("canvas"); c.className = "confetti"; document.body.appendChild(c);
  const r = window.devicePixelRatio || 1, W = c.width = innerWidth*r, H = c.height = innerHeight*r, x = c.getContext("2d");
  const cols = ["#14B8A6","#2F7BEA","#E0761C","#C2418C","#8B5CF6","#FACC15"];
  const P = Array.from({length:150}, () => ({ x:W/2+(Math.random()-.5)*W*.4, y:H*.4, vx:(Math.random()-.5)*16*r, vy:(-Math.random()*17-6)*r, s:(5+Math.random()*7)*r, a:Math.random()*6, va:(Math.random()-.5)*.35, c:cols[Math.floor(Math.random()*cols.length)] }));
  let t = 0;
  (function f(){
    t++; x.clearRect(0,0,W,H);
    for(const p of P){ p.vy += .42*r; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.a += p.va; x.save(); x.translate(p.x,p.y); x.rotate(p.a); x.fillStyle = p.c; x.fillRect(-p.s/2,-p.s/4,p.s,p.s/2); x.restore(); }
    if(t < 160) requestAnimationFrame(f); else c.remove();
  })();
}

/* ---- Olaylar ---- */
$("#view").addEventListener("click", e => {
  if(e.target.closest("#flip")){
    if(Date.now() < suppressUntil) return;
    if(!state.revealed) reveal(); else { state.revealed=false; $("#flip").classList.remove("on"); $("#again").disabled=true; $("#gotit").disabled=true; }
    return;
  }
  const t = e.target.closest("button"); if(!t) return;
  if(t.dataset.go){ location.hash = t.dataset.go; return; }
  if(t.dataset.spot){ const s = t.dataset.spot; if(s==="exam"){ state.qn = 50; store.set("ftr-qn", 50); goTest("all"); } else goTest(s); return; }
  if(t.dataset.nav){ setSec(t.dataset.nav, true); return; }
  if(t.dataset.qn){ state.qn = +t.dataset.qn; store.set("ftr-qn", state.qn); render(); return; }
  if(t.dataset.opt !== undefined){ pick(+t.dataset.opt); return; }
  switch(t.id){
    case "again": mark(false); break;
    case "gotit": mark(true); break;
    case "restart": buildDeck(); render(); break;
    case "unknownOnly": state.onlyUnknown = true; buildDeck(); render(); break;
    case "startQuiz": startQuiz(); window.scrollTo(0, Math.max(0, $("main").offsetTop - 70)); break;
    case "nextQ": nextQ(); break;
  }
});
$("#view").addEventListener("change", e => {
  if(e.target.id==="onlyUnknown"){ state.onlyUnknown = e.target.checked; buildDeck(); render(); }
});
document.addEventListener("keydown", e => {
  if(!sheet.hidden){ if(e.key==="Escape") closeSheet(); return; }
  if(e.target.matches("input,textarea,select") || state.view==="atlas") return;
  if(e.key==="/" ){ e.preventDefault(); openSheet(true); return; }
  if(state.view==="kartlar" && state.idx < state.deck.length){
    if((e.code==="Space" || e.key==="Enter") && !state.revealed){ e.preventDefault(); reveal(); }
    else if(state.revealed && e.key==="ArrowRight"){ mark(true); }
    else if(state.revealed && e.key==="ArrowLeft"){ mark(false); }
  }
  if(state.view==="test" && quiz.phase==="q"){
    const n = "1234".indexOf(e.key); if(n>-1 && n < quiz.qs[quiz.i].opts.length) pick(n);
    if(e.key==="Enter" && quiz.picked!==null) nextQ();
  }
});

function render(){
  document.querySelectorAll(".tabs a").forEach(a => { if(a.dataset.v===state.view) a.setAttribute("aria-current","page"); else a.removeAttribute("aria-current"); });
  const atlasOn = state.view==="atlas";
  $("#atlasRoot").hidden = !atlasOn; $("#chips").hidden = atlasOn; $("#view").hidden = atlasOn;
  renderTotal();
  if(atlasOn){
    const show = () => window.FTRAtlas.show($("#atlasRoot"));
    if(window.FTRAtlas) show();
    else { $("#atlasRoot").innerHTML = '<div class="panel">3D atlas hazırlanıyor…</div>'; window.addEventListener("ftr-atlas-ready", show, {once:true}); }
    return;
  }
  renderChips();
  $("#view").style.setProperty("--cat", catOf(state.sec));
  if(state.view==="konular") renderTopics();
  else if(state.view==="kartlar") renderCards();
  else renderQuiz();
}
function route(){
  const h = location.hash.slice(1);
  const v = ["konular","kartlar","test","atlas"].includes(h) ? h : "konular";
  if(v !== state.view && v==="test") resetQuiz();
  state.view = v; render(); window.scrollTo(0,0);
}
window.addEventListener("hashchange", route);
route();
}
fetch("data/v1.html").then(r=>r.text()).then(t=>{const a=t.indexOf("const SECTIONS = ["),b=t.indexOf("/* ---------- storage");const d=new Function(t.slice(a,b)+";return {SECTIONS,GROUPS};")();startApp(d.SECTIONS,d.GROUPS);});
