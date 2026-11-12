import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

/* ---------- labels ---------- */
const SYS = [
  {id:"skeletal", tr:"İskelet", color:"#E9DFC9", on:true},
  {id:"muscular", tr:"Kaslar", color:"#C8564B", on:false},
  {id:"nervous", tr:"Sinir sistemi", color:"#E8C547", on:false},
  {id:"arterial", tr:"Arterler", color:"#D9363E", on:false},
  {id:"venous", tr:"Venler", color:"#4069D0", on:false},
  {id:"cardiac", tr:"Kalp", color:"#B8323E", on:true},
  {id:"respiratory", tr:"Solunum", color:"#E8A0AC", on:true},
  {id:"digestive", tr:"Sindirim", color:"#E9A86E", on:true},
  {id:"urinary", tr:"Üriner", color:"#D8B64C", on:true},
  {id:"reproductive", tr:"Üreme", color:"#D88AA0", on:false},
  {id:"reproductive_f", tr:"Kadın üreme sistemi", color:"#E0709C", on:false},
  {id:"endocrine", tr:"Endokrin", color:"#8E6BD1", on:true},
  {id:"lymphatic", tr:"Lenfatik", color:"#6BBF8A", on:true},
  {id:"sensory", tr:"Duyu organları", color:"#9BC7E8", on:false},
  {id:"connective", tr:"Bağ dokusu", color:"#D6CDB8", on:false},
  {id:"integumentary", tr:"Deri", color:"#E9C3A3", on:false},
  /* detail layers (data packs). alpha → translucent, overlay → lies on another surface (polygonOffset) */
  {id:"joints", tr:"Eklemler ve bağlar", color:"#A9C4D6", on:true, layer:1},
  {id:"bursae", tr:"Bursalar ve tendon kılıfları", color:"#5FB4E6", on:false, layer:1, alpha:.5},
  {id:"fascia", tr:"Fasyalar ve retinakulumlar", color:"#CFC6E6", on:false, layer:1, alpha:.36},
  {id:"attachments", tr:"Kas yapışma yerleri (origo–insersiyo)", color:"#E0453C", color2:"#3D7BE0", on:false, layer:1, overlay:2},
  {id:"landmarks", tr:"Kemik ve organ işaretleri", color:"#F2884B", on:false, layer:1, overlay:1},
  /* body surface regions lie on the skin, which is itself pushed 6 mm outward → push a bit further */
  {id:"regions", tr:"Vücut bölgeleri", color:"#F2C14E", on:false, layer:1, alpha:.55, overlay:1, push:.0075}
];
/* base-atlas parts filed under the wrong system in the source data */
const SYS_FIX = {FJ1730:"nervous", FJ1731:"nervous", FJ1752:"nervous", FJ1767:"nervous", FJ1814:"nervous", FJ1471:"fascia", FJ1471M:"fascia"};
const EXCLUSIVE = {reproductive_f:"reproductive", reproductive:"reproductive_f"};
const SYSMAP = Object.fromEntries(SYS.map(s => [s.id, s]));
const MUSCLE_IN_SKELETAL = /^(fibularis (brevis|longus|tertius)|levator scapulae|subscapularis|tibialis (anterior|posterior))$/;
const ORD = {first:1,second:2,third:3,fourth:4,fifth:5,sixth:6,seventh:7,eighth:8,ninth:9,tenth:10,eleventh:11,twelfth:12};
const ROMAN = ["","I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII"];
const BONES = {
  "femur":["Femur","Uyluk kemiği"], "tibia":["Tibia","Kaval kemiği"], "fibula":["Fibula","Kamış kemiği"],
  "patella":["Patella","Diz kapağı"], "humerus":["Humerus","Kol kemiği"], "radius":["Radius","Döner kemik"],
  "ulna":["Ulna","Dirsek kemiği"], "clavicle":["Clavicula","Köprücük kemiği"], "scapula":["Scapula","Kürek kemiği"],
  "hip bone":["Os coxae","Kalça kemiği"], "sacrum":["Os sacrum","Sağrı kemiği"], "calcaneus":["Calcaneus","Topuk kemiği"],
  "talus":["Talus","Aşık kemiği"], "cuboid bone":["Os cuboideum",""], "navicular bone of foot":["Os naviculare",""],
  "medial cuneiform bone":["Os cuneiforme mediale",""], "intermediate cuneiform bone":["Os cuneiforme intermedium",""],
  "lateral cuneiform bone":["Os cuneiforme laterale",""], "scaphoid":["Os scaphoideum",""], "lunate":["Os lunatum",""],
  "triquetral":["Os triquetrum",""], "pisiform":["Os pisiforme",""], "trapezium":["Os trapezium",""],
  "trapezoid":["Os trapezoideum",""], "capitate":["Os capitatum",""], "hamate":["Os hamatum",""],
  "mandible":["Mandibula","Alt çene kemiği"], "maxilla":["Maxilla","Üst çene kemiği"], "frontal bone":["Os frontale","Alın kemiği"],
  "parietal bone":["Os parietale","Yan kafa kemiği"], "occipital bone":["Os occipitale","Art kafa kemiği"],
  "temporal bone":["Os temporale","Şakak kemiği"], "sphenoid bone":["Os sphenoidale","Kama kemiği"],
  "ethmoid":["Os ethmoidale","Kalbur kemiği"], "zygomatic bone":["Os zygomaticum","Elmacık kemiği"],
  "nasal bone":["Os nasale","Burun kemiği"], "vomer":["Vomer","Sapan kemiği"], "palatine bone":["Os palatinum","Damak kemiği"],
  "hyoid bone":["Os hyoideum","Dil kemiği"], "manubrium":["Manubrium sterni","Göğüs kemiği sapı"],
  "body of sternum":["Corpus sterni","Göğüs kemiği gövdesi"], "xiphoid process":["Processus xiphoideus",""],
  "atlas":["Atlas (C1)","1. boyun omuru"], "axis":["Axis (C2)","2. boyun omuru"],
  "sesamoid bone of foot":["Os sesamoideum",""], "thyroid cartilage":["Cartilago thyroidea",""], "cricoid cartilage":["Cartilago cricoidea",""],
  "intervertebral disk":["Discus intervertebralis",""]
};
const MUSCLES = {
  "deltoid":"M. deltoideus", "trapezius":"M. trapezius", "pectoralis major":"M. pectoralis major", "infraspinatus muscle":"M. infraspinatus",
  "external oblique":"M. obliquus externus abdominis", "sternocleidomastoid":"M. sternocleidomastoideus", "rhomboid major":"M. rhomboideus major",
  "rhomboid minor":"M. rhomboideus minor", "diaphragm":"Diaphragma", "biceps brachii":"M. biceps brachii", "triceps brachii":"M. triceps brachii",
  "biceps femoris":"M. biceps femoris", "gastrocnemius":"M. gastrocnemius", "flexor carpi ulnaris":"M. flexor carpi ulnaris",
  "pronator teres":"M. pronator teres", "external intercostal muscle":"Mm. intercostales externi", "internal intercostal muscle":"Mm. intercostales interni",
  "innermost intercostal muscle":"Mm. intercostales intimi"
};
const NERVES = {
  "median nerve":["N. medianus","Orta sinir"], "ulnar nerve":["N. ulnaris","Dirsek siniri"], "radial nerve":["N. radialis","Döner sinir"],
  "axillary nerve":["N. axillaris","Koltuk altı siniri"], "musculocutaneous nerve":["N. musculocutaneus",""], "sciatic nerve":["N. ischiadicus","Siyatik sinir"],
  "tibial nerve":["N. tibialis",""], "common fibular nerve":["N. fibularis communis",""], "deep fibular nerve":["N. fibularis profundus",""],
  "superficial fibular nerve":["N. fibularis superficialis",""], "femoral nerve":["N. femoralis",""], "obturator nerve":["N. obturatorius",""],
  "saphenous nerve":["N. saphenus",""], "sural nerve":["N. suralis",""], "pudendal nerve":["N. pudendus",""], "superior gluteal nerve":["N. gluteus superior",""],
  "lateral femoral cutaneous nerve":["N. cutaneus femoris lateralis",""], "posterior femoral cutaneous nerve":["N. cutaneus femoris posterior",""],
  "genitofemoral nerve":["N. genitofemoralis",""], "ilio-inguinal nerve":["N. ilioinguinalis",""], "iliohypogastric nerve":["N. iliohypogastricus",""],
  "medial plantar nerve":["N. plantaris medialis",""], "lateral plantar nerve":["N. plantaris lateralis",""], "long thoracic nerve":["N. thoracicus longus",""],
  "thoracodorsal nerve":["N. thoracodorsalis",""], "suprascapular nerve":["N. suprascapularis",""], "dorsal scapular nerve":["N. dorsalis scapulae",""],
  "subclavian nerve":["N. subclavius",""], "lateral pectoral nerve":["N. pectoralis lateralis",""], "medial pectoral nerve":["N. pectoralis medialis",""],
  "medial antebrachial cutaneous nerve":["N. cutaneus antebrachii medialis",""], "lateral antebrachial cutaneous nerve":["N. cutaneus antebrachii lateralis",""],
  "posterior antebrachial cutaneous nerve":["N. cutaneus antebrachii posterior",""], "medial brachial cutaneous nerve":["N. cutaneus brachii medialis",""],
  "deep branch of radial nerve":["R. profundus n. radialis",""], "superficial branch of radial nerve":["R. superficialis n. radialis",""],
  "deep branch of ulnar nerve":["R. profundus n. ulnaris",""], "superficial branch of ulnar nerve":["R. superficialis n. ulnaris",""],
  "intercostal nerves":["Nn. intercostales","Kaburgalar arası sinirler"], "roots of brachial plexus":["Radices plexus brachialis","Plexus brachialis kökleri"],
  "superior trunk of brachial plexus":["Truncus superior plexus brachialis","Plexus brachialis üst trunkusu"],
  "middle trunk of brachial plexus":["Truncus medius plexus brachialis","Plexus brachialis orta trunkusu"],
  "inferior trunk of brachial plexus":["Truncus inferior plexus brachialis","Plexus brachialis alt trunkusu"],
  "posterior cord of brachial plexus":["Fasciculus posterior plexus brachialis","Plexus brachialis arka kordu"],
  "anterior root of spinal nerve":["Radix anterior n. spinalis","Spinal sinir ön kökü"], "posterior root of spinal nerve":["Radix posterior n. spinalis","Spinal sinir arka kökü"],
  "spinal cord":["Medulla spinalis","Omurilik"], "cauda equina":["Cauda equina","At kuyruğu"], "sympathetic trunk":["Truncus sympathicus","Sempatik zincir"],
  "sympathetic nerves":["Nn. sympathici","Sempatik sinirler"], "vagus nerve (x)":["N. vagus (X)","10. kranial sinir"], "facial nerve (vii)":["N. facialis (VII)","7. kranial sinir"],
  "hypoglossal nerve (xii)":["N. hypoglossus (XII)","12. kranial sinir"], "accessory nerve (xi)":["N. accessorius (XI)","11. kranial sinir"],
  "glossopharyngeal nerve (ix)":["N. glossopharyngeus (IX)","9. kranial sinir"], "trigeminal nerve (v)":["N. trigeminus (V)","5. kranial sinir"],
  "oculomotor nerve (iii)":["N. oculomotorius (III)","3. kranial sinir"], "abducens nerve (vi)":["N. abducens (VI)","6. kranial sinir"],
  "ophthalmic nerve":["N. ophthalmicus (V1)",""], "maxillary nerve":["N. maxillaris (V2)",""], "inferior alveolar nerve":["N. alveolaris inferior",""],
  "lingual nerve":["N. lingualis",""], "mental nerve":["N. mentalis",""], "buccal nerve":["N. buccalis",""]
};
const JOINTS = {
  "anterior cruciate ligament":["Lig. cruciatum anterius","Ön çapraz bağ"], "posterior cruciate ligament":["Lig. cruciatum posterius","Arka çapraz bağ"],
  "medial meniscus":["Meniscus medialis","İç menisküs"], "lateral meniscus":["Meniscus lateralis","Dış menisküs"],
  "tibial collateral ligament":["Lig. collaterale tibiale","İç yan bağ"], "fibular collateral ligament":["Lig. collaterale fibulare","Dış yan bağ"],
  "medial collateral ligament":["Lig. collaterale mediale","İç yan bağ"], "lateral collateral ligament":["Lig. collaterale laterale","Dış yan bağ"],
  "patellar ligament":["Lig. patellae","Patella bağı"], "transverse ligament of knee":["Lig. transversum genus","Dizin enine bağı"],
  "anterior longitudinal ligament":["Lig. longitudinale anterius","Ön uzunlamasına bağ"], "posterior longitudinal ligament":["Lig. longitudinale posterius","Arka uzunlamasına bağ"],
  "ligamentum flavum":["Lig. flavum","Sarı bağ"], "supraspinous ligament":["Lig. supraspinale",""], "interspinous ligament":["Lig. interspinale",""],
  "nuchal ligament":["Lig. nuchae","Ense bağı"], "intervertebral disc":["Discus intervertebralis","Omurlar arası disk"],
  "iliofemoral ligament":["Lig. iliofemorale",""], "pubofemoral ligament":["Lig. pubofemorale",""], "ischiofemoral ligament":["Lig. ischiofemorale",""],
  "acetabular labrum":["Labrum acetabuli","Asetabulum labrumu"], "glenoid labrum":["Labrum glenoidale","Glenoid labrum"],
  "coracoacromial ligament":["Lig. coracoacromiale",""], "coracoclavicular ligament":["Lig. coracoclaviculare",""], "acromioclavicular ligament":["Lig. acromioclaviculare",""],
  "anterior talofibular ligament":["Lig. talofibulare anterius","Ön talofibular bağ"], "posterior talofibular ligament":["Lig. talofibulare posterius","Arka talofibular bağ"],
  "calcaneofibular ligament":["Lig. calcaneofibulare","Kalkaneofibular bağ"], "deltoid ligament":["Lig. deltoideum","Deltoid bağ"],
  "inguinal ligament":["Lig. inguinale","Kasık bağı"], "sacrotuberous ligament":["Lig. sacrotuberale",""], "sacrospinous ligament":["Lig. sacrospinale",""],
  "annular ligament of radius":["Lig. anulare radii","Radiusun halka bağı"], "ulnar collateral ligament":["Lig. collaterale ulnare",""], "radial collateral ligament":["Lig. collaterale radiale",""],
  "flexor retinaculum":["Retinaculum flexorum","Fleksör retinakulum"], "extensor retinaculum":["Retinaculum extensorum","Ekstansör retinakulum"],
  "plantar aponeurosis":["Aponeurosis plantaris","Plantar fasya"], "palmar aponeurosis":["Aponeurosis palmaris","Palmar aponevroz"],
  "fascia lata":["Fascia lata",""], "thoracolumbar fascia":["Fascia thoracolumbalis","Torakolomber fasya"], "iliotibial tract":["Tractus iliotibialis","İliotibial bant"],
  "subacromial bursa":["Bursa subacromialis","Subakromiyal bursa"], "subdeltoid bursa":["Bursa subdeltoidea","Subdeltoid bursa"],
  "prepatellar bursa":["Bursa prepatellaris","Prepatellar bursa"], "suprapatellar bursa":["Bursa suprapatellaris","Suprapatellar bursa"],
  "olecranon bursa":["Bursa olecrani","Olekranon bursası"], "trochanteric bursa":["Bursa trochanterica","Trokanterik bursa"]
};
const PARTS = {"long head":"caput longum","short head":"caput breve","lateral head":"caput laterale","medial head":"caput mediale",
  "acromial part":"pars acromialis","clavicular part":"pars clavicularis","spinal part":"pars spinalis","sternocostal part":"pars sternocostalis",
  "abdominal part":"pars abdominalis","descending part":"pars descendens","transverse part":"pars transversa","ascending part":"pars ascendens",
  "humeral head":"caput humerale","ulnar head":"caput ulnare"};
const DIGITS = {"thumb":"el başparmağı","index finger":"işaret parmağı","middle finger":"orta parmak","ring finger":"yüzük parmağı","little finger":"el serçe parmağı",
  "big toe":"ayak başparmağı","second toe":"2. ayak parmağı","third toe":"3. ayak parmağı","fourth toe":"4. ayak parmağı","little toe":"ayak serçe parmağı"};
const VREG = {cervical:["cervicalis","C"],thoracic:["thoracica","T"],lumbar:["lumbalis","L"]};

let NAMES = {};
const cap = t => t.charAt(0).toUpperCase() + t.slice(1);
const esc = t => String(t).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const sideOf = n => { const m = n.match(/\b(left|right)\b/); return m ? (m[1]==="left" ? "Sol" : "Sağ") : ""; };
const nameKey = n => n.toLowerCase().replace(/\b(left|right)\b\s*/,"").replace(/\s+/g," ").trim();
/* names.json lookup tolerant to the optional " muscle" suffix of English muscle names */
const nmGet = en => { if(!en) return null; const a = en.toLowerCase().trim(), k = nameKey(en), m = k.replace(/ muscle$/,"");
  return NAMES[a] || NAMES[k] || NAMES[m] || NAMES[m + " muscle"] || null; };
/* dictionary lookup on an atlas-convention name; `hit` is false when only the generic fallback applied */
function baseLabel(raw, system){
  const side = sideOf(raw.toLowerCase()), n = nameKey(raw);
  let title = "", tr = "", r, hit = true;
  if(BONES[n]){ [title,tr] = BONES[n]; }
  else if(NERVES[n]){ [title,tr] = NERVES[n]; }
  else if(JOINTS[n]){ [title,tr] = JOINTS[n]; }
  else if((r = n.match(/^(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|eleventh|twelfth) (cervical|thoracic|lumbar) vertebra$/))){
    const k = ORD[r[1]], v = VREG[r[2]]; title = `Vertebra ${v[0]} ${ROMAN[k]} (${v[1]}${k})`; tr = `${v[1]}${k} omuru`;
  }
  else if((r = n.match(/^intervertebral disk of (?:(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|eleventh|twelfth) (cervical|thoracic|lumbar) vertebra|axis)$/))){
    title = "Discus intervertebralis"; tr = r[2] ? `${VREG[r[2]][1]}${ORD[r[1]]} omuru intervertebral diski` : "C2 omuru intervertebral diski";
  }
  else if((r = n.match(/^(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|eleventh|twelfth) rib$/))){
    title = `Costa ${ROMAN[ORD[r[1]]]}`; tr = `${ORD[r[1]]}. kaburga`;
  }
  else if((r = n.match(/^(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth) costal cartilage$/))){
    title = `Cartilago costalis ${ROMAN[ORD[r[1]]]}`; tr = `${ORD[r[1]]}. kosta kıkırdağı`;
  }
  else if((r = n.match(/^(first|second|third|fourth|fifth) (metacarpal|metatarsal) bone$/))){
    title = `Os ${r[2]==="metacarpal"?"metacarpale":"metatarsale"} ${ROMAN[ORD[r[1]]]}`; tr = `${ORD[r[1]]}. ${r[2]==="metacarpal"?"el tarak":"ayak tarak"} kemiği`;
  }
  else if((r = n.match(/^(distal|middle|proximal) phalanx of (thumb|index finger|middle finger|ring finger|little finger|big toe|second toe|third toe|fourth toe|little toe)$/))){
    title = `Phalanx ${r[1]==="distal"?"distalis":r[1]==="middle"?"media":"proximalis"}`; tr = DIGITS[r[2]];
  }
  else {
    let part = "", base = n;
    for(const k in PARTS){ if(n.startsWith(k+" of ")){ part = PARTS[k]; base = n.slice(k.length+4).trim(); break; } }
    if(MUSCLES[base]) title = MUSCLES[base] + (part ? " – " + part : "");
    else { hit = false; if(system==="muscular" && !/^set of|muscle of|papillary|part of|head of|lumbrical|interosse/.test(base)) title = "M. " + base; }
  }
  if(!title){ hit = false; title = cap(side ? n : raw); }
  return { title, tr, side, n, hit };
}
/* Base parts: built-in dictionaries first, names.json fills the gaps.
   Pack parts: names.json (la → title, tr → subtitle), then dictionaries, then the pack's English name. */
function label(p){
  const B = baseLabel(p.name, p.system), side = B.side || sideOf((p.en||"").toLowerCase());
  const en = p.en || p.name;
  let title = B.title, tr = B.tr;
  if(p.att && p.muscle){
    const mn = nmGet(p.muscle), MB = baseLabel(p.muscle.replace(/\s+muscle$/i,""), "muscular"), org = /^o/i.test(p.att);
    title = (org ? "Origo: " : "İnsersiyo: ") + ((MB.hit ? MB.title : mn && mn.la) || MB.title);
    const mtr = (MB.hit && MB.tr) || (mn && mn.tr) || "";
    tr = (mtr ? mtr + " · " : "") + (org ? "kasın başlangıç yeri" : "kasın sonlanma yeri");
  } else {
    const nm = nmGet(p.en) || nmGet(B.n);
    if(p.pack){
      /* precedence: the part's own la/tr → built-in dictionaries → names.json → English name */
      if(p.la) title = String(p.la); else if(!B.hit) title = (nm && nm.la) || cap(p.en ? (nameKey(p.en) === p.en.toLowerCase() ? p.en : nameKey(p.en)) : B.n);
      tr = p.tr ? String(p.tr) : (B.hit && B.tr) || (nm && nm.tr) || "";
    } else if(nm){ if(!B.hit && nm.la) title = nm.la; if(!tr && nm.tr) tr = nm.tr; }
  }
  if(side) title = `${title} (${side})`;
  return { title, tr, en, side };
}
/* search folding: Turkish-aware lower case, then strip diacritics so "capraz" finds "çapraz" */
const FOLD = {"ı":"i","ç":"c","ş":"s","ğ":"g","ö":"o","ü":"u","â":"a","î":"i","û":"u","é":"e","æ":"ae","œ":"oe"};
const fold = t => String(t).toLocaleLowerCase("tr").replace(/[ıçşğöüâîûéæœ]/g, c => FOLD[c]).replace(/i̇/g,"i");
async function loadNames(){
  try{
    const el = document.getElementById("ftrAtlasNames");
    if(window.FTR_ATLAS_NAMES) NAMES = window.FTR_ATLAS_NAMES;
    else if(el) NAMES = JSON.parse(el.textContent);
    else if(window.FTR_ATLAS_NAMES_URL){ const r = await fetch(window.FTR_ATLAS_NAMES_URL); if(r.ok) NAMES = await r.json(); }
    if(!NAMES || typeof NAMES!=="object") NAMES = {};
  }catch(e){ NAMES = {}; }
}

/* ---------- state ---------- */
let host, canvasWrap, renderer, scene, camera, controls, started = false, loaded = 0, totalChunks = 0;
let parts = [], meshes = [], bodyCenter = new THREE.Vector3(), bodyBox = new THREE.Box3(), explode = 0, selected = null, isolated = null, isoMesh = null;
const sysOn = Object.fromEntries(SYS.map(s => [s.id, s.on]));
const sysCount = {};
/* optional data packs: manifest loaded up front, geometry chunks only when their system is first shown */
const PACKS = window.FTR_ATLAS_PACKS || ["extra","female","lymphv","regions"];
const packChunks = [], packCredits = [], sysBusy = {}, sysFail = {};
let baseDone = false, hostsDirty = false;
const nameHue = t => { let h = 0; for(let i=0;i<t.length;i++) h = (h*31 + t.charCodeAt(i)) >>> 0; return (h % 360) / 360; };
const partColor = p => p.system==="regions" ? new THREE.Color().setHSL(nameHue(p.en || p.name), .6, .56) : new THREE.Color(p.att && !/^o/i.test(p.att) ? SYSMAP[p.system].color2 || SYSMAP[p.system].color : SYSMAP[p.system].color);
let needsRender = true;
const HL = new THREE.Color("#2DE2C4");

async function getBuffer(url){
  const res = await fetch(url); if(!res.ok) throw new Error(res.status + " " + url);
  let buf;
  if(url.endsWith(".txt")){ const bin = atob((await res.text()).trim()); const u = new Uint8Array(bin.length); for(let i=0;i<bin.length;i++) u[i] = bin.charCodeAt(i); buf = u.buffer; }
  else buf = await res.arrayBuffer();
  const b = new Uint8Array(buf, 0, 2);
  if(b[0]===0x1f && b[1]===0x8b) buf = await new Response(new Blob([buf]).stream().pipeThrough(new DecompressionStream("gzip"))).arrayBuffer();
  return buf;
}
async function fromBases(path, asJson, bases){
  let err;
  for(const base of (bases || window.FTR_ATLAS_BASES || ["models/"])){
    try{ if(asJson){ const r = await fetch(base + path); if(!r.ok) throw new Error(r.status); return await r.json(); } return await getBuffer(base + path); }
    catch(e){ err = e; }
  }
  throw err;
}

/* sheet-like joint parts (capsules, membranes, fat pads) are drawn see-through so ligaments/menisci inside stay visible */
const THIN = /capsul|membrane|fat pad/i;
function makeMaterial(sys, thin){
  const S = SYSMAP[sys], skin = sys==="integumentary", alpha = skin ? .3 : thin ? .32 : S.alpha || 0;
  const mat = new THREE.MeshStandardMaterial({ vertexColors:true, roughness: sys==="skeletal" ? .72 : .55, metalness:0,
    transparent: !!alpha, opacity: alpha || 1, depthWrite: !alpha, side: THREE.DoubleSide });
  /* patches that lie exactly on another surface: pull them towards the camera in depth, plus a hair along the normal */
  if(S.overlay){ mat.polygonOffset = true; mat.polygonOffsetFactor = -2*S.overlay; mat.polygonOffsetUnits = -6*S.overlay; }
  const push = skin ? .006 : S.push || (S.overlay ? .0002*S.overlay : 0);
  if(push){
    mat.onBeforeCompile = sh => { sh.vertexShader = sh.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\n transformed += normalize(objectNormal) * " + push.toFixed(5) + ";"); };
    mat.customProgramCacheKey = () => "push" + push;
  }
  return mat;
}
function buildChunk(buf, chunkIndex, list){
  const bySys = {};
  for(const p of list){ (bySys[p.system + (p.thin ? "~" : "")] ||= []).push(p); }
  for(const key in bySys){
    const sys = key.replace("~",""), thin = key!==sys;
    const ps = bySys[key]; let vTot = 0, iTot = 0;
    for(const p of ps){ vTot += p.vertexCount; iTot += p.indexCount; }
    const pos = new Float32Array(vTot*3), nor = new Int16Array(vTot*3), col = new Uint8Array(vTot*3), idx = new Uint32Array(iTot);
    let vo = 0, io = 0;
    for(const p of ps){
      const c = partColor(p), cr = Math.round(c.r*255), cg = Math.round(c.g*255), cb = Math.round(c.b*255);
      pos.set(new Float32Array(buf, p.positions, p.vertexCount*3), vo*3);
      nor.set(new Int16Array(buf, p.normals, p.vertexCount*3), vo*3);
      const src = new Uint32Array(buf, p.indices, p.indexCount);
      for(let i=0;i<src.length;i++) idx[io+i] = src[i] + vo;
      for(let i=0;i<p.vertexCount;i++){ col[(vo+i)*3]=cr; col[(vo+i)*3+1]=cg; col[(vo+i)*3+2]=cb; }
      p.vStart = vo; p.iStart = io; vo += p.vertexCount; io += p.indexCount;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("normal", new THREE.BufferAttribute(nor, 3, true));
    g.setAttribute("color", new THREE.BufferAttribute(col, 3, true));
    g.setIndex(new THREE.BufferAttribute(idx, 1));
    g.computeBoundingSphere();
    const mesh = new THREE.Mesh(g, makeMaterial(sys, thin));
    if(SYSMAP[sys].overlay) mesh.renderOrder = SYSMAP[sys].overlay;
    mesh.userData = { sys, base: pos.slice(), parts: ps };
    mesh.visible = sysOn[sys] && !isolated;
    for(const p of ps) p.mesh = mesh;
    meshes.push(mesh); scene.add(mesh);
    applyExplode(mesh);
  }
}

const cordR = y => y>1.50 ? .0055 : y>1.42 ? .0065 : y>1.18 ? .0045 : y>1.11 ? .0055 : y>1.09 ? .004 : .002;
function buildNerves(){
  const N = window.FTR_NERVES; if(!N) return null;
  const SEG = 6, geo = [];
  for(const [base, side, splines] of N){
    const P = [], NN = [], I = [], min = [1e9,1e9,1e9], max = [-1e9,-1e9,-1e9], cord = base==="Spinal cord";
    let vb = 0;
    for(const [r10, d] of splines){
      const pts = []; let x = 0, y = 0, z = 0;
      for(let i=0;i<d.length;i+=3){ x+=d[i]; y+=d[i+1]; z+=d[i+2]; const v = new THREE.Vector3(x/1000, y/1000, z/1000); if(!pts.length || v.distanceToSquared(pts[pts.length-1])>1e-9) pts.push(v); }
      if(pts.length<2) continue;
      const rb = Math.min(.005, Math.max(.0011, r10/10000*2.2));
      const nrm = new THREE.Vector3(0,1,0), t = new THREE.Vector3(), bin = new THREE.Vector3();
      for(let i=0;i<pts.length;i++){
        t.copy(pts[Math.min(i+1,pts.length-1)]).sub(pts[Math.max(i-1,0)]).normalize();
        nrm.sub(t.clone().multiplyScalar(nrm.dot(t)));
        if(nrm.lengthSq()<1e-8){ nrm.set(Math.abs(t.y)>.9?1:0, Math.abs(t.y)>.9?0:1, 0); nrm.sub(t.clone().multiplyScalar(nrm.dot(t))); }
        nrm.normalize(); bin.crossVectors(t, nrm);
        const r = cord ? cordR(pts[i].y) : rb*(i===0||i===pts.length-1 ? .8 : 1);
        for(let j=0;j<SEG;j++){
          const a = j/SEG*Math.PI*2, c = Math.cos(a), s = Math.sin(a);
          const dx = nrm.x*c+bin.x*s, dy = nrm.y*c+bin.y*s, dz = nrm.z*c+bin.z*s;
          const px = pts[i].x+dx*r, py = pts[i].y+dy*r, pz = pts[i].z+dz*r;
          P.push(px,py,pz); NN.push(dx,dy,dz);
          if(px<min[0])min[0]=px; if(py<min[1])min[1]=py; if(pz<min[2])min[2]=pz; if(px>max[0])max[0]=px; if(py>max[1])max[1]=py; if(pz>max[2])max[2]=pz;
        }
      }
      for(let i=0;i<pts.length-1;i++) for(let j=0;j<SEG;j++){ const a = vb+i*SEG+j, b = vb+i*SEG+(j+1)%SEG; I.push(a,a+SEG,b, b,a+SEG,b+SEG); }
      vb += pts.length*SEG;
    }
    if(P.length) geo.push({base, side, P, NN, I, min, max});
  }
  let off = 0;
  for(const g of geo){ g.po = off; off += g.P.length*4; g.no = off; off += g.NN.length*2; off = (off+3)&~3; g.io = off; off += g.I.length*4; }
  const buf = new ArrayBuffer(off), list = [];
  for(const g of geo){
    new Float32Array(buf, g.po, g.P.length).set(g.P);
    const ni = new Int16Array(buf, g.no, g.NN.length); for(let i=0;i<g.NN.length;i++) ni[i] = Math.round(g.NN[i]*32767);
    new Uint32Array(buf, g.io, g.I.length).set(g.I);
    const nm = g.side==="L" ? "Left " + g.base.charAt(0).toLowerCase() + g.base.slice(1) : g.side==="R" ? "Right " + g.base.charAt(0).toLowerCase() + g.base.slice(1) : g.base;
    list.push({ id:"ZA"+list.length, name:nm, system:"nervous", chunk:-1, positions:g.po, normals:g.no, indices:g.io, vertexCount:g.P.length/3, indexCount:g.I.length, bounds:[g.min, g.max] });
  }
  return { buf, list };
}

function prepPart(p, pack){
  const q = {...p};
  if(pack){ q.pack = pack; if(q.system==="joints" && THIN.test(q.en || q.name)) q.thin = true; }
  else if(SYS_FIX[q.id]) q.system = SYS_FIX[q.id];
  else if(q.system==="skeletal"){
    const base = q.name.toLowerCase().replace(/\b(left|right)\s*/,"").trim();
    if(MUSCLE_IN_SKELETAL.test(base)) q.system = "muscular";
    if(base==="iliotibial tract") q.system = "connective";
  }
  if(!SYSMAP[q.system]) q.system = "connective";
  const b = q.bounds; q.box = new THREE.Box3(new THREE.Vector3(...b[0]), new THREE.Vector3(...b[1]));
  q.center = q.box.getCenter(new THREE.Vector3()); q.offset = new THREE.Vector3();
  q.label = label(q); q.hay = fold(q.label.title + " " + q.label.tr + " " + q.label.en + (pack ? " " + q.name : ""));
  q.idx = parts.length; parts.push(q);
  sysCount[q.system] = (sysCount[q.system]||0) + 1;
  return q;
}
function prepParts(atlas){
  parts = [];
  for(const p of atlas.parts) prepPart(p, null);
  for(const p of parts) bodyBox.union(p.box);
  bodyBox.getCenter(bodyCenter);
}

/* ---------- data packs ---------- */
const validPart = p => p && typeof p.name==="string" && Array.isArray(p.bounds) && p.bounds.length===2 && p.bounds.flat().length===6 && p.bounds.flat().every(Number.isFinite)
  && [p.positions, p.normals, p.indices, p.vertexCount, p.indexCount, p.chunk].every(Number.isInteger) && p.vertexCount>0 && p.indexCount>0;
async function loadPack(name){
  const bases = window.FTR_ATLAS_EXTRA_BASES || window.FTR_ATLAS_BASES || ["models/"];
  const man = await fromBases(name + ".json", true, bases);
  if(!man || !Array.isArray(man.parts) || !Array.isArray(man.chunks)) throw new Error("pack " + name);
  const sfx = window.FTR_ATLAS_EXTRA_SUFFIX ?? window.FTR_ATLAS_SUFFIX ?? "";
  const chunks = man.chunks.map(c => ({ pack:name, bases, file: String(c.file || c.gzip || c.url || "").split("/").pop() + sfx, parts:[], systems:new Set(), state:0 }));
  for(const raw of man.parts){
    const c = chunks[raw.chunk]; if(!c || !validPart(raw)) continue;
    const q = prepPart(raw, name); q.pc = c; c.parts.push(q); c.systems.add(q.system);
    q.offset.copy(q.center).sub(bodyCenter).multiply(EXPLODE_AXES).multiplyScalar(explode*1.4);
  }
  packChunks.push(...chunks.filter(c => c.parts.length));
  const att = man.attribution || (man.source && typeof man.source==="object" && man.source.attribution);
  if(att) packCredits.push({ text:String(att), license: man.license ? String(man.license) : "" });
}
let chunkJobs = 0; const chunkQueue = [];
function pumpChunks(){
  while(chunkJobs < 3 && chunkQueue.length){
    const c = chunkQueue.shift(); chunkJobs++;
    (async () => {
      try{
        const buf = await fromBases(c.file, false, c.bases);
        for(const p of c.parts){ const end = Math.max(p.positions + p.vertexCount*12, p.normals + p.vertexCount*6, p.indices + p.indexCount*4); if(end > buf.byteLength) throw new Error("chunk " + c.file); }
        buildChunk(buf, c.file, c.parts); c.state = 2;
        if(c.parts.some(p => SYSMAP[p.system].overlay)){ hostsDirty = true; if(explode>0) setExplode(explode); }
        if(selected && selected.pc===c){ if(!isolated) paint(selected, HL); renderInfo(); }
      }catch(e){ c.state = 3; for(const s of c.systems) sysFail[s] = true; console.warn("[atlas] " + c.file + " yüklenemedi", e); }
      for(const s of c.systems) sysBusy[s]--;
      chunkJobs--; renderSystems(); needsRender = true; pumpChunks();
    })();
  }
}
function loadChunk(c, first){
  if(c.state===1 || c.state===2) return;
  c.state = 1; for(const s of c.systems){ sysBusy[s] = (sysBusy[s]||0) + 1; sysFail[s] = false; }
  first ? chunkQueue.unshift(c) : chunkQueue.push(c); pumpChunks();
}
function ensureSystem(sys){
  if(!baseDone) return;                       /* base model first; initPacks() catches up afterwards */
  for(const c of packChunks) if(c.systems.has(sys)) loadChunk(c);
}
function setSystem(id, on){
  sysOn[id] = on;
  const ex = EXCLUSIVE[id];
  if(on && ex && sysOn[ex] && sysCount[id]){ sysOn[ex] = false; if(selected && selected.system===ex) select(null); }
  if(!on && selected && selected.system===id) select(null);
  if(on) ensureSystem(id);
  renderSystems(); updateVisibility();
}
async function initPacks(){
  await Promise.all(PACKS.map(n => loadPack(n).catch(() => {})));   /* a missing or broken pack is simply skipped */
  for(const id in EXCLUSIVE) if(sysOn[id] && sysOn[EXCLUSIVE[id]] && sysCount[id] && sysCount[EXCLUSIVE[id]]) sysOn[id==="reproductive_f" ? id : EXCLUSIVE[id]] = false;
  renderSystems(); renderCredits();
}

/* Patches (landmarks, attachments) should travel with the structure they lie on when the model is exploded.
   Resolved lazily (first explode) from geometry: nearest base part among those whose box contains the patch. */
function resolveHosts(){
  hostsDirty = false;
  const box = new THREE.Box3();
  for(const p of parts){
    if(!p.pack || !p.mesh || p.host!==undefined || !SYSMAP[p.system].overlay) continue;
    p.host = null;
    const pa = p.mesh.userData.base, n = p.vertexCount, sm = [p.vStart, p.vStart + (n>>1), p.vStart + n - 1];
    let best = 2.5e-5 * sm.length;            /* mean distance must be under 5 mm */
    for(const h of parts){
      if(h.pack || !h.mesh || (p.system==="regions" ? h.system!=="integumentary" : h.system==="integumentary") || (p.system==="attachments" && h.system!=="skeletal")) continue;
      box.copy(h.box).expandByScalar(.003); if(!box.containsPoint(p.center)) continue;
      const ha = h.mesh.userData.base, st = Math.max(1, Math.ceil(h.vertexCount/1500)); let sum = 0;
      for(const v of sm){
        const x = pa[v*3], y = pa[v*3+1], z = pa[v*3+2]; let m = 1e9;
        for(let i=h.vStart, e=h.vStart+h.vertexCount; i<e; i+=st){ const dx = ha[i*3]-x, dy = ha[i*3+1]-y, dz = ha[i*3+2]-z, d = dx*dx+dy*dy+dz*dz; if(d<m) m = d; }
        sum += m; if(sum >= best) break;
      }
      if(sum < best){ best = sum; p.host = h; }
    }
  }
}

const EXPLODE_AXES = new THREE.Vector3(1.6, 0.9, 1.6);
function computeOffsets(){
  if(explode>0 && hostsDirty && baseDone) resolveHosts();
  for(const p of parts){
    p.offset.copy((p.host || p).center).sub(bodyCenter).multiply(EXPLODE_AXES).multiplyScalar(explode*1.4);
  }
}
function applyExplode(mesh){
  const pos = mesh.geometry.attributes.position.array, base = mesh.userData.base;
  if(explode===0){ pos.set(base); }
  else for(const p of mesh.userData.parts){
    const o = p.offset, s = p.vStart*3, e = (p.vStart+p.vertexCount)*3;
    for(let i=s;i<e;i+=3){ pos[i]=base[i]+o.x; pos[i+1]=base[i+1]+o.y; pos[i+2]=base[i+2]+o.z; }
  }
  mesh.geometry.attributes.position.needsUpdate = true;
  mesh.geometry.computeBoundingSphere();
}
function setExplode(v){
  explode = v; computeOffsets();
  for(const m of meshes) applyExplode(m);
  if(isolated) buildIso(isolated);
  needsRender = true;
}

function paint(p, color){
  if(!p.mesh) return;
  const col = p.mesh.geometry.attributes.color, a = col.array;
  const c = color || partColor(p);
  const r = Math.round(c.r*255), g = Math.round(c.g*255), b = Math.round(c.b*255);
  for(let i=p.vStart;i<p.vStart+p.vertexCount;i++){ a[i*3]=r; a[i*3+1]=g; a[i*3+2]=b; }
  col.needsUpdate = true;
}

function buildIso(p){
  if(isoMesh){ scene.remove(isoMesh); isoMesh.geometry.dispose(); isoMesh = null; }
  if(!p || !p.mesh) return;
  const src = p.mesh.geometry, pa = p.mesh.userData.base, na = src.attributes.normal.array, ia = src.index.array;
  const pos = pa.slice(p.vStart*3, (p.vStart+p.vertexCount)*3), nor = na.slice(p.vStart*3, (p.vStart+p.vertexCount)*3);
  const idx = new Uint32Array(p.indexCount); for(let i=0;i<p.indexCount;i++) idx[i] = ia[p.iStart+i] - p.vStart;
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos,3)); g.setAttribute("normal", new THREE.BufferAttribute(nor,3,true)); g.setIndex(new THREE.BufferAttribute(idx,1));
  g.computeBoundingSphere();
  isoMesh = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: partColor(p), roughness:.6, side:THREE.DoubleSide }));
  scene.add(isoMesh);
}

function updateVisibility(){
  for(const m of meshes) m.visible = !isolated && sysOn[m.userData.sys];
  needsRender = true;
}

/* ---------- picking ---------- */
const ray = new THREE.Raycaster(), tmpBox = new THREE.Box3(), va = new THREE.Vector3(), vb = new THREE.Vector3(), vc = new THREE.Vector3(), hit = new THREE.Vector3(), boxHit = new THREE.Vector3();
function pick(ndc){
  ray.setFromCamera(ndc, camera);
  const r = ray.ray, cands = [];
  const pool = isolated ? [isolated] : parts.filter(p => p.mesh && p.mesh.visible && p.system!=="integumentary");
  for(const p of pool){
    tmpBox.copy(p.box); if(!isolated) tmpBox.translate(p.offset);
    if(r.intersectBox(tmpBox, boxHit)) cands.push([boxHit.distanceTo(r.origin), p]);
  }
  cands.sort((a,b) => a[0]-b[0]);
  let best = Infinity, bestP = null, bestT = Infinity, bestTP = null;
  for(const [d, p] of cands){
    if(d > best + .004 || d > bestT + .04) break;
    const see = !isolated && p.thin;
    const bias = isolated ? 0 : (SYSMAP[p.system].overlay || 0) * .0012;
    const pa = isolated ? isoMesh.geometry.attributes.position.array : p.mesh.geometry.attributes.position.array;
    const ia = isolated ? isoMesh.geometry.index.array : p.mesh.geometry.index.array;
    const s = isolated ? 0 : p.iStart, e = s + p.indexCount;
    for(let i=s;i<e;i+=3){
      va.fromArray(pa, ia[i]*3); vb.fromArray(pa, ia[i+1]*3); vc.fromArray(pa, ia[i+2]*3);
      if(r.intersectTriangle(va, vb, vc, false, hit)){ const t = hit.distanceTo(r.origin) - bias;
        if(see){ if(t < bestT){ bestT = t; bestTP = p; } } else if(t < best){ best = t; bestP = p; } }
    }
  }
  /* see-through capsules/membranes only win when nothing solid lies within 4 cm behind them (fascia and bursae are switched on deliberately and pick normally) */
  return bestP && best < bestT + .04 ? bestP : bestTP || bestP;
}

/* ---------- camera ---------- */
let anim = null;
function flyTo(target, dir, dist){
  const fromT = controls.target.clone(), fromP = camera.position.clone();
  const toT = target.clone(), toP = target.clone().add(dir.clone().normalize().multiplyScalar(dist));
  const t0 = performance.now(), dur = 650;
  anim = (now) => {
    const k = Math.min(1, (now - t0)/dur), e = 1 - Math.pow(1-k, 3);
    controls.target.lerpVectors(fromT, toT, e); camera.position.lerpVectors(fromP, toP, e);
    controls.update(); needsRender = true;
    if(k>=1) anim = null;
  };
}
function view(name){
  if(!parts.length) return;
  const size = bodyBox.getSize(new THREE.Vector3());
  const spread = 1 + explode*1.6, dist = Math.max(size.y, size.x) * 1.25 * spread;
  const dirs = { front:[0,0.08,1], back:[0,0.08,-1], left:[1,0.08,0], right:[-1,0.08,0], persp:[0.75,0.35,1] };
  flyTo(bodyCenter, new THREE.Vector3(...dirs[name]), dist);
  host.querySelectorAll("[data-view]").forEach(b => b.setAttribute("aria-pressed", b.dataset.view===name));
}
function focusPart(p){
  const c = p.center.clone(); if(!isolated) c.add(p.offset);
  const size = p.box.getSize(new THREE.Vector3()).length();
  const dir = camera.position.clone().sub(controls.target);
  flyTo(c, dir.lengthSq() ? dir : new THREE.Vector3(0,0,1), Math.max(size*2.4, 0.2));
}

/* ---------- UI ---------- */
function select(p, focus){
  if(selected && !isolated) paint(selected, null);
  selected = p;
  if(p){
    if(!sysOn[p.system]) setSystem(p.system, true);
    if(!p.mesh && p.pc) loadChunk(p.pc, true);      /* found by search before its geometry was fetched */
    if(!isolated) paint(p, HL);
    if(focus) focusPart(p);
  }
  renderInfo(); needsRender = true;
}
function renderInfo(){
  const box = host.querySelector(".at-info");
  if(!selected){ box.hidden = true; return; }
  const L = selected.label, s = SYSMAP[selected.system], wait = !selected.mesh;
  box.hidden = false;
  box.innerHTML = `
    <div class="at-info-top"><span class="at-sys" style="--sc:#${partColor(selected).getHexString()}">${s.tr}</span><button class="at-x" data-act="close" aria-label="Kapat">×</button></div>
    <h3>${esc(L.title)}</h3>
    ${L.tr ? `<p class="at-tr">${esc(L.tr)}${L.side ? " · " + L.side.toLowerCase() + " taraf" : ""}</p>` : (L.side ? `<p class="at-tr">${L.side} taraf</p>` : "")}
    <p class="at-en">${esc(L.en)}</p>
    ${wait ? `<p class="at-wait">${selected.pc && selected.pc.state===3 ? "Geometri yüklenemedi." : "Geometri yükleniyor…"}</p>` : ""}
    <div class="at-info-act">
      <button class="at-btn" data-act="iso"${wait ? " disabled" : ""}>${isolated ? "Tümünü göster" : "Sadece bunu göster"}</button>
      <button class="at-btn ghost" data-act="focus">Yakınlaş</button>
    </div>`;
}
function renderSystems(){
  const chip = s => {
    const st = sysBusy[s.id] > 0 ? "loading" : sysFail[s.id] ? "error" : "";
    return `<button class="at-chip" data-sys="${s.id}" aria-pressed="${sysOn[s.id]}"${st ? ` data-state="${st}"` : ""}${st==="loading" ? ` aria-busy="true"` : ""}${st==="error" ? ` title="Yüklenemedi, tekrar denemek için dokun"` : ""} style="--sc:${s.color};--sc2:${s.color2 || s.color}"><i></i><span>${s.tr}</span><small>${sysCount[s.id]}</small></button>`;
  };
  const have = SYS.filter(s => sysCount[s.id]), main = have.filter(s => !s.layer), layers = have.filter(s => s.layer);
  host.querySelector(".at-systems").innerHTML = main.map(chip).join("") + (layers.length ? `<h4 class="at-sub">Ayrıntı katmanları</h4>` + layers.map(chip).join("") : "");
  const note = host.querySelector(".at-note"); if(note) note.hidden = !(sysOn.reproductive_f && sysCount.reproductive_f);
}
function renderCredits(){
  const el = host.querySelector(".at-credit-packs"); if(!el) return;
  el.innerHTML = packCredits.map(c => " " + esc(c.text) + (c.license && !c.text.includes(c.license) ? " (" + esc(c.license) + ")" : "") + (/[.!?]$/.test(c.text) ? "" : ".")).join("");
}
function renderSearch(q){
  const out = host.querySelector(".at-results");
  q = fold(q.trim());
  if(q.length < 2){ out.innerHTML = ""; out.hidden = true; return; }
  const seen = new Set(), res = [], more = [];
  for(const p of parts){
    const i = p.hay.indexOf(q), key = p.label.title + "|" + p.label.tr; if(i < 0 || seen.has(key)) continue;
    seen.add(key);
    (i===0 || /[\s(.:–-]/.test(p.hay[i-1]) ? res : more).push(p);      /* word-start matches first */
    if(res.length >= 40) break;
  }
  for(const p of more){ if(res.length >= 40) break; res.push(p); }
  out.hidden = false;
  out.innerHTML = res.length ? res.map(p => `<button data-pid="${p.idx}"><b>${esc(p.label.title)}</b><span>${esc(p.label.tr || SYSMAP[p.system].tr)}</span></button>`).join("")
    : `<p class="at-empty">Sonuç yok. Latince, İngilizce ya da Türkçe adla dene.</p>`;
}

function markup(){
  return `
  <div class="at-stage">
    <div class="at-canvas"></div>
    <div class="at-load"><div class="at-spin"></div><b>3D model yükleniyor</b><span class="at-pct">%0</span><small>Yaklaşık 35 MB, ilk açılışta biraz sürebilir</small></div>
    <div class="at-top">
      <div class="at-search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg><input id="atSearch" type="search" placeholder="Yapı ara: femur, deltoideus, kalp…" autocomplete="off"><div class="at-results" hidden></div></div>
    </div>
    <div class="at-info" hidden></div>
    <div class="at-bottom">
      <div class="at-views" role="group" aria-label="Görünüm">
        <button data-view="front" aria-pressed="true">Ön</button><button data-view="back">Arka</button><button data-view="left">Sol</button><button data-view="right">Sağ</button><button data-view="persp">3/4</button>
      </div>
      <label class="at-explode"><span>Yapıları ayır</span><input id="atExplode" type="range" min="0" max="100" value="0"><b class="mono" id="atExplodeVal">%0</b></label>
    </div>
  </div>
  <div class="at-side">
    <h3>Sistemler</h3>
    <div class="at-systems"></div>
    <p class="at-note" hidden>Kadın üreme organları farklı bir referans bedenden alınmıştır; konumları yaklaşıktır.</p>
    <p class="at-help">Döndürmek için sürükle, yakınlaştırmak için iki parmakla ya da tekerlekle oyna. Bir yapıya dokununca adı çıkar.</p>
    <p class="at-credit">3D model: <a href="https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html" target="_blank" rel="noopener">BodyParts3D</a>, © The Database Center for Life Science, <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a>. Web için sadeleştirilmiş geometri: <a href="https://github.com/ashemag/human-atlas" target="_blank" rel="noopener">human-atlas</a> (MIT). Çevresel sinirler, sinir kökleri ve omurilik: <a href="https://github.com/Z-Anatomy/Models-of-human-anatomy" target="_blank" rel="noopener">Z-Anatomy</a> (<a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener">CC BY-SA 4.0</a>) verisinden uyarlandı. Eklemler, bağlar, bursalar, fasyalar, kas yapışma yerleri, kemik işaretleri ve diğer ek yapılar da Z-Anatomy (CC BY-SA 4.0) modellerinden uyarlanmıştır; bu katmanlar aynı lisansla paylaşılır. Yetişkin erkek referans anatomisidir; isimler FMA ve Terminologia Anatomica terminolojisinden alınmıştır.<span class="at-credit-packs"></span></p>
  </div>`;
}

async function start(){
  started = true;
  host.innerHTML = markup();
  canvasWrap = host.querySelector(".at-canvas");
  renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1, 1.75));
  canvasWrap.appendChild(renderer.domElement);
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(35, 1, 0.01, 50);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x334455, 1.15));
  const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(1.2, 2, 2.5); camera.add(key); scene.add(camera);
  const rim = new THREE.DirectionalLight(0x9fe8ff, .6); rim.position.set(-2, 1, -2); scene.add(rim);
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.dampingFactor = .08; controls.minDistance = .05; controls.maxDistance = 12;
  controls.addEventListener("change", () => needsRender = true);
  const ro = new ResizeObserver(resize); ro.observe(canvasWrap); resize();

  bindUI();
  renderer.setAnimationLoop(loop);

  try{
    const [atlas] = await Promise.all([fromBases("atlas.json", true), loadNames()]);
    const nerves = buildNerves(); if(nerves) atlas.parts.push(...nerves.list);
    prepParts(atlas); renderSystems(); computeOffsets();
    const packsReady = initPacks();
    if(nerves) buildChunk(nerves.buf, -1, parts.filter(p => p.chunk===-1 && !p.pack));
    camera.position.set(bodyCenter.x, bodyCenter.y + .15, bodyCenter.z + 4.2); controls.target.copy(bodyCenter); controls.update();
    totalChunks = atlas.chunks.length;
    const byChunk = {}; for(const p of parts) if(!p.pack) (byChunk[p.chunk] ||= []).push(p);
    const files = atlas.chunks.map(c => (c.gzip || c.url).split("/").pop() + (window.FTR_ATLAS_SUFFIX || ""));
    let next = 0;
    const worker = async () => {
      while(next < files.length){
        const i = next++;
        const buf = await fromBases(files[i], false);
        buildChunk(buf, i, byChunk[i] || []);
        loaded++; host.querySelector(".at-pct").textContent = "%" + Math.round(loaded/totalChunks*100);
        needsRender = true;
        if(loaded===1) host.querySelector(".at-load").classList.add("partial");
      }
    };
    await Promise.all([worker(), worker(), worker(), worker()]);
    host.querySelector(".at-load").hidden = true;
    baseDone = true;
    packsReady.then(() => { for(const s of SYS) if(sysOn[s.id]) ensureSystem(s.id); if(selected && !selected.mesh && selected.pc) loadChunk(selected.pc, true); });
  }catch(e){
    host.querySelector(".at-load").innerHTML = `<b>Model yüklenemedi</b><small>İnternet bağlantını kontrol edip sayfayı yenile. (${String(e.message||e)})</small>`;
  }
}
function resize(){
  const w = canvasWrap.clientWidth, h = canvasWrap.clientHeight; if(!w || !h) return;
  renderer.setSize(w, h, false); camera.aspect = w/h; camera.updateProjectionMatrix(); needsRender = true;
}
function loop(now){
  if(anim) anim(now);
  const moved = controls.update();
  if(needsRender || moved){ renderer.render(scene, camera); needsRender = false; }
}

function bindUI(){
  let down = null;
  renderer.domElement.addEventListener("pointerdown", e => { down = [e.clientX, e.clientY]; });
  renderer.domElement.addEventListener("pointerup", e => {
    if(!down || Math.hypot(e.clientX-down[0], e.clientY-down[1]) > 6 || !parts.length) return;
    const r = renderer.domElement.getBoundingClientRect();
    const p = pick(new THREE.Vector2(((e.clientX-r.left)/r.width)*2-1, -((e.clientY-r.top)/r.height)*2+1));
    if(isolated) return;
    select(p, false);
  });
  host.addEventListener("click", e => {
    const b = e.target.closest("button"); if(!b) return;
    if(b.dataset.view) view(b.dataset.view);
    else if(b.dataset.sys){ const id = b.dataset.sys; if(sysOn[id] && sysFail[id]) ensureSystem(id); else setSystem(id, !sysOn[id]); }
    else if(b.dataset.pid){ const p = parts[+b.dataset.pid]; host.querySelector(".at-results").hidden = true; host.querySelector("#atSearch").value = ""; if(isolated) toggleIso(); select(p, true); }
    else if(b.dataset.act==="close"){ if(isolated) toggleIso(); select(null); }
    else if(b.dataset.act==="iso") toggleIso();
    else if(b.dataset.act==="focus" && selected) focusPart(selected);
  });
  host.querySelector("#atSearch").addEventListener("input", e => renderSearch(e.target.value));
  let pending = null;
  host.querySelector("#atExplode").addEventListener("input", e => {
    host.querySelector("#atExplodeVal").textContent = "%" + e.target.value;
    pending = e.target.value/100;
    requestAnimationFrame(() => { if(pending!==null){ setExplode(pending); pending = null; } });
  });
}
function toggleIso(){
  if(!selected || !selected.mesh) return;
  if(isolated){ isolated = null; buildIso(null); paint(selected, HL); updateVisibility(); focusPart(selected); }
  else { paint(selected, null); isolated = selected; buildIso(selected); updateVisibility(); focusPart(selected); }
  renderInfo();
}

window.FTRAtlas = {
  show(el){ host = el; if(!started) start(); else { resize(); needsRender = true; } },
  /* read-only diagnostics (used by tests): parts per system, how many have geometry, draw calls */
  stats(){ const o = {}; for(const p of parts){ const s = o[p.system] ||= {parts:0, loaded:0, on:sysOn[p.system]}; s.parts++; if(p.mesh) s.loaded++; }
    return { systems:o, meshes:meshes.length, visibleMeshes:meshes.filter(m => m.visible).length, baseDone, pending:chunkQueue.length + chunkJobs }; }
};
window.dispatchEvent(new Event("ftr-atlas-ready"));
