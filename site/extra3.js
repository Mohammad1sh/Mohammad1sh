(function(){
const ADD = {
noa:[
["N. oculomotorius felcinde gözün pozisyonu nasıldır?","Göz aşağı ve dışa bakar; pitozis ve pupil genişlemesi olur",["Göz yukarı ve içe bakar","Göz tamamen ortada kalır, kapak normaldir","Sadece pupil daralır"]],
["N. abducens felcinde ne görülür?","Göz dışa bakamaz, içe deviye olur",["Göz aşağı bakamaz","Göz kapağı düşer","Pupil genişler"]],
["Pons ile serebellumu bağlayan yapı hangisidir?","Orta serebellar pedünkül",["Üst serebellar pedünkül","Alt serebellar pedünkül","Corpus callosum"]],
["Spinal kordun ön 2/3'ünü besleyen arter hangisidir?","A. spinalis anterior",["A. spinalis posterior","A. basilaris","A. carotis interna"]],
["Dura mater ile vertebral kanal kemik duvarı arasındaki aralığa ne denir?","Epidural aralık",["Subaraknoid aralık","Subdural aralık","Ventrikül"]]
],
bas:[
["Kranioservikal fleksiyon testinde kullanılan basınç biofeedback ünitesi genellikle kaç mmHg'den başlatılır?","20 mmHg",["5 mmHg","60 mmHg","100 mmHg"]],
["M. levator scapulae skapulanın neresine yapışır?","Superior açı ve medial kenarın üst kısmı",["Acromion","Processus coracoideus","Angulus inferior"]],
["M. trapezius üst liflerinin skapula üzerindeki işlevi nedir?","Elevasyon ve yukarı rotasyon",["Depresyon ve aşağı rotasyon","Sadece protraksiyon","Sadece retraksiyon"]]
],
gen:[
["Hemoglobin-oksijen disosiyasyon eğrisini sağa kaydıran durumlar hangileridir?","Isı, CO₂, H⁺ ve 2,3-BPG artışı",["Isının ve CO₂'nin azalması","Alkaloz","Karbonmonoksit zehirlenmesi"]],
["Hiperkaleminin tipik EKG bulgusu nedir?","Sivri (yüksek) T dalgaları",["Belirgin U dalgası","Kısa PR aralığı","Delta dalgası"]],
["Sempatik postganglionik liflerin çoğunun nörotransmitteri hangisidir?","Noradrenalin",["Asetilkolin","Dopamin","GABA"]],
["Hipotiroidide derin tendon reflekslerinde tipik bulgu nedir?","Gevşeme fazının uzaması",["Klonus","Reflekslerin tamamen kaybı","Babinski pozitifliği"]]
],
agr:[
["Santral sensitizasyonun klinik bulgusu nedir?","Uyaranla orantısız, yaygın hiperaljezi ve allodini",["Sadece hasarlı bölgede, hasarla orantılı ağrı","Ağrı duyusunun tamamen kaybı","Sadece mekanik ve lokal ağrı"]],
["Tendon iyileşmesinde kontrollü yüklemenin etkisi nedir?","Kollajen sentezini ve liflerin düzenli dizilimini artırır",["İyileşmeyi tamamen durdurur","Kollajeni yok eder","Damarlanmayı kalıcı olarak keser"]],
["İyileşmiş bir ligamentin özelliği nedir?","Normal dokudan daha zayıf ve daha az düzenli skar dokusudur",["Normal dokudan daha güçlüdür","Tamamen kemik dokusuna dönüşür","Hiç kollajen içermez"]]
],
spr:[
["İzokinetik dinamometre neyi ölçer?","Sabit açısal hızda kas torkunu",["Sadece eklem açıklığını","Kemik yoğunluğunu","Maksimal oksijen tüketimini"]],
["Y-denge testi neyi değerlendirir?","Dinamik dengeyi ve alt ekstremite yaralanma riskini",["Sadece statik dengeyi","Üst ekstremite kuvvetini","Aerobik kapasiteyi"]],
["Sıcak çarpmasında ilk müdahale nedir?","Hızlı soğutma (soğuk suya daldırma) ve acil yardım çağırmak",["Sporcuyu battaniyeyle sarmak","Sıcak içecek vermek","Antrenmana yavaş tempoda devam etmek"]]
],
ger:[
["Yaşlanmayla periferik sinir ileti hızı nasıl değişir?","Azalır",["Artar","Değişmez","Sıfıra iner"]],
["Ortostatik hipotansiyonu olan yaşlıya ne önerilir?","Yavaş ve kademeli kalkmak, kalkmadan önce ayak bileği pompası yapmak",["Yataktan hızla kalkmak","Sıvı alımını tamamen kesmek","Uzun süre sıcak duşta beklemek"]],
["PAR-Q+ ne amaçla kullanılır?","Fiziksel aktiviteye başlamadan önce sağlık taraması için",["Kas kuvvetini ölçmek için","Bilişsel değerlendirme için","Denge testinde puanlama için"]]
],
kad:[
["Pelvik taban kas egzersizinde sık yapılan hata nedir?","Gluteal ve karın kaslarını kasmak, nefes tutmak",["Kasılmadan sonra tam gevşemek","Normal solunuma devam etmek","Kasılmayı birkaç saniye tutmak"]],
["Diastasis recti nasıl değerlendirilir?","Rektus kasları arasındaki mesafe parmak genişliği, kaliper ya da ultrasonla ölçülür",["Gonyometreyle kalça açısı ölçülür","Dinamometreyle kavrama ölçülür","Spirometreyle akciğer hacmi ölçülür"]],
["Gebelikte arka pelvik kuşak ağrısını değerlendirmede kullanılan testler hangileridir?","P4 (posterior pelvik ağrı provokasyon) ve aktif düz bacak kaldırma (ASLR) testleri",["Lachman ve çekmece testleri","Phalen ve Tinel testleri","Neer ve Hawkins testleri"]]
],
elr:[
["Parmaklarda ekstansör tendon kaç zona ayrılır?","8",["3","5","12"]],
["Elde intrinsik minus (pençe) pozisyonu nedir?","MCP hiperekstansiyonu ve IP fleksiyonu",["MCP fleksiyonu ve IP ekstansiyonu","El bileği tam fleksiyonu","Tüm eklemler tam ekstansiyonda"]],
["Dupuytren kontraktürü en sık hangi parmağı etkiler?","Yüzük parmak",["Başparmak","İşaret parmağı","Orta parmak"]]
],
far:[
["Kalsiyum kanal blokörlerinin sık yan etkileri nelerdir?","Periferik ödem ve hipotansiyon",["Kas hipertrofisi","Hipoglisemi","Bronkospazm"]],
["Benzodiazepin kullanan yaşlı hastada fizyoterapide hangi risk artar?","Sedasyon ve düşme",["Kas hipertrofisi","Hipertansif kriz","Taşikardi"]],
["Kemoterapi alan hastada egzersiz öncesi özellikle hangi kan değerleri kontrol edilir?","Trombosit, nötrofil ve hemoglobin değerleri",["Sadece kolesterol","Sadece D vitamini","Sadece tiroid hormonları"]]
],
ars:[
["Randomize kontrollü çalışmada 'intention-to-treat' analizi nedir?","Hastaların randomize edildikleri grupta analiz edilmesi",["Sadece tedaviyi tamamlayanların analiz edilmesi","Hastaların aldıkları tedaviye göre yeniden gruplanması","Bırakanların çalışmadan çıkarılması"]],
["Pozitif prediktif değer nedir?","Test pozitif çıkanlarda gerçekten hasta olma olasılığı",["Hastalarda testin pozitif çıkma oranı","Sağlamlarda testin negatif çıkma oranı","Hastalığın toplumdaki sıklığı"]],
["Cohen d etki büyüklüğü 0,8 ise etki nasıl yorumlanır?","Büyük",["Küçük","Orta","Etki yok"]],
["Seçim yanlılığını önlemek için en önemli yöntem hangisidir?","Randomizasyon ve gizli atama",["Örneklemi küçültmek","Sadece gönüllüleri almak","Sonuçları araştırmacının yorumlaması"]]
],
icf:[
["ICF kodlamasında 'b' harfi hangi bileşeni gösterir?","Vücut fonksiyonları",["Vücut yapıları","Aktivite ve katılım","Çevresel faktörler"]],
["ICF kodlamasında 'e' harfi hangi bileşeni gösterir?","Çevresel faktörler",["Vücut fonksiyonları","Vücut yapıları","Aktivite ve katılım"]],
["Bel ağrısında mavi bayrak neyi ifade eder?","Kişinin işine ilişkin olumsuz algıları (işin zorlayıcı ya da zararlı olduğu inancı)",["Ciddi patoloji belirtilerini","İşyeri politika ve sistem engellerini","Kas kuvveti kaybını"]]
]
};

const VAKA = [
["40 yaşındaki hasta kolunu yana kaldırıp 90°'de tutamıyor, kol aniden düşüyor (drop arm testi pozitif). En olası tanı nedir?","Tam kat rotator cuff (supraspinatus) yırtığı",["Adeziv kapsülit","Akromioklaviküler eklem çıkığı","C7 radikülopatisi"]],
["Diz bükülüyken araç kazasında tibiası arkaya itilen hastada arka çekmece testi pozitif. En olası tanı nedir?","Arka çapraz bağ (PCL) yırtığı",["Ön çapraz bağ (ACL) yırtığı","Medial kollateral bağ yırtığı","Lateral menisküs yırtığı"]],
["Futbolcunun dizine dıştan darbe geliyor; dizin medialinde ağrı var, valgus stres testi 30° fleksiyonda pozitif, tam ekstansiyonda negatif. En olası tanı nedir?","İzole MCL yaralanması",["ACL yırtığı","LCL yırtığı","PCL yırtığı"]],
["Çömelip kalkarken dizi kilitlenen hastada eklem hattında hassasiyet var ve McMurray testi pozitif. En olası tanı nedir?","Menisküs yırtığı",["Patellofemoral ağrı sendromu","Osgood-Schlatter hastalığı","İliotibial bant sendromu"]],
["Koşucuda dizin lateralinde, yaklaşık 30° fleksiyonda artan ağrı var ve Noble testi pozitif. En olası tanı nedir?","İliotibial bant sendromu",["Medial menisküs yırtığı","Pes anserinus bursiti","Patellar tendinopati"]],
["28 yaşında kadın, uzun süre oturunca ve merdiven inerken dizinin önünde ağrı tarif ediyor. En olası tanı nedir?","Patellofemoral ağrı sendromu",["Menisküs yırtığı","PCL yırtığı","Baker kisti"]],
["60 yaşında hastada hareketle artan diz ağrısı, 30 dakikadan kısa sabah tutukluğu, krepitasyon ve grafide medial eklem aralığında daralma var. En olası tanı nedir?","Diz osteoartriti",["Romatoid artrit","Gut artriti","Septik artrit"]],
["45 yaşında kadında el MCP ve PIP eklemlerinde simetrik şişlik, 1 saatten uzun sabah tutukluğu ve anti-CCP pozitifliği var. En olası tanı nedir?","Romatoid artrit",["Osteoartrit","Psoriatik artrit","Gut artriti"]],
["50 yaşında erkek, gece başlayan, ayak başparmağı MTP ekleminde kızarık ve çok ağrılı şişlikle geliyor. En olası tanı nedir?","Gut artriti (podagra)",["Hallux valgus","Morton nöromu","Plantar fasiit"]],
["Bel ve bacak ağrılı hastada tekrarlı lomber ekstansiyon hareketleriyle bacak ağrısı bele doğru çekiliyor (sentralizasyon). Bu bulgu ne anlama gelir?","Olumlu prognoz; ekstansiyon yönlü egzersiz tercih edilir",["Kötü prognoz; acil cerrahi gerekir","Ekstansiyondan kesinlikle kaçınılmalıdır","Klinik olarak anlamsızdır"]],
["70 yaşında hasta yürürken bacaklarında ağrı ve uyuşma tarif ediyor; oturunca ve öne eğilince rahatlıyor, alışveriş arabasına yaslanınca daha uzun yürüyebiliyor. En olası tanı nedir?","Lomber spinal stenoz (nörojenik kladikasyo)",["Periferik arter hastalığı","Piriformis sendromu","Kalça osteoartriti"]],
["65 yaşında sigara içen hastada yürürken baldır ağrısı oluyor, ayakta durup dinlenince geçiyor; ayak nabızları zayıf. En olası tanı nedir?","Periferik arter hastalığı (vasküler kladikasyo)",["Lomber spinal stenoz","Derin ven trombozu","Aşil tendinopatisi"]],
["El üstüne düşen 30 yaşında hastada anatomik enfiye çukurunda hassasiyet var, ilk grafi normal. Ne yapılmalıdır?","Skafoid kırığı şüphesiyle immobilize edilir ve görüntüleme tekrarlanır",["Grafi normal olduğu için tedavi gerekmez","Hemen yoğun mobilizasyona başlanır","Sadece buz uygulanır"]],
["Bisikletten omzunun üzerine düşen hastada omuz ucunda basamaklanma ve akromioklaviküler eklem üzerinde hassasiyet var. En olası tanı nedir?","Akromioklaviküler eklem yaralanması",["Anterior omuz çıkığı","Rotator cuff yırtığı","Humerus cerrahi boyun kırığı"]],
["35 yaşında yeni anne, başparmak tarafında el bileği ağrısı tarif ediyor; Finkelstein testi pozitif. En olası tanı nedir?","De Quervain tenosinoviti",["Karpal tünel sendromu","Tetik parmak","Skafoid kırığı"]],
["55 yaşında diyabetli kadının yüzük parmağı sabahları bükülü kalıyor, açarken 'klik' hissediyor. En olası tanı nedir?","Tetik parmak",["Dupuytren kontraktürü","Mallet parmak","Butonniere deformitesi"]],
["Dirseklerini masaya dayayarak uzun süre çalışan hastada 4. ve 5. parmaklarda uyuşma var, Tinel bulgusu dirsek iç yanında pozitif. Tanı nedir?","Kubital tünel sendromu (n. ulnaris)",["Karpal tünel sendromu","Guyon kanalı sendromu","C6 radikülopatisi"]],
["Boyun ağrılı hastada ağrı sol başparmağa yayılıyor, biceps refleksi azalmış, Spurling testi pozitif. En olası etkilenen kök hangisidir?","C6",["C5","C7","C8"]],
["Kollarını başının üstüne kaldırınca elinde uyuşma ve solukluk olan hastada Roos testi pozitif. En olası tanı nedir?","Torasik çıkış sendromu",["Karpal tünel sendromu","Rotator cuff yırtığı","Servikal miyelopati"]],
["22 yaşında yüzücünün omzu tekrarlayan şekilde çıkıyor; abduksiyon ve dış rotasyonda kaygı (apprehension) testi pozitif. Tanı nedir?","Anterior omuz instabilitesi",["Posterior omuz instabilitesi","Adeziv kapsülit","Subakromiyal sıkışma"]],
["Zor doğum sonrası yenidoğanın kolu iç rotasyonda, dirsek ekstansiyonda, önkol pronasyonda ('garson bahşiş eli'). Tanı nedir?","Erb-Duchenne felci (C5–C6)",["Klumpke felci (C8–T1)","N. radialis felci","Total pleksus felci"]],
["Yenidoğanda el intrinsik kaslarında felç, pençe el ve aynı tarafta Horner sendromu var. Tanı nedir?","Klumpke felci (C8–T1)",["Erb-Duchenne felci (C5–C6)","Spinal müsküler atrofi","Konjenital tortikolis"]],
["Yenidoğanın kalça muayenesinde Ortolani testi pozitif. Tanı ve tedavi nedir?","Gelişimsel kalça displazisi; Pavlik bandajı",["Pes equinovarus; Ponseti alçısı","Konjenital tortikolis; SCM germe","Perthes hastalığı; cerrahi"]],
["3 aylık bebeğin başı sürekli sağa eğik, çenesi sola dönük ve sağ SCM'de kitle var. Tanı ve tedavi nedir?","Sağ konjenital müsküler tortikolis; sağ SCM germe ve pozisyonlama",["Sol konjenital tortikolis; sol SCM germe","Erb felci; omuz ateli","Gelişimsel kalça displazisi; Pavlik bandajı"]],
["2 yaşında çocuk sağ ayağının parmakları üzerinde yürüyor ve sağ elini daha az kullanıyor; sağ kol ve bacakta spastisite var. En olası tanı nedir?","Spastik hemiplejik serebral palsi",["Spastik dipleji","Ataksik serebral palsi","Duchenne müsküler distrofi"]],
["6 yaşında erkek çocukta kalça ve dizde ağrı, topallama, kalça iç rotasyonu ve abduksiyonda kısıtlılık var; grafide femur başında yassılaşma görülüyor. Tanı nedir?","Legg-Calvé-Perthes hastalığı",["Femur başı epifiz kayması","Geçici sinovit","Osgood-Schlatter"]],
["18 yaşında hastada 2 hafta önceki ishalden sonra ayaklardan yukarı ilerleyen simetrik güçsüzlük ve arefleksi gelişiyor. Tanı nedir?","Guillain-Barré sendromu",["Multipl skleroz","ALS","Myastenia gravis"]],
["Guillain-Barré sendromunun akut döneminde fizyoterapide en önemli dikkat noktası nedir?","Aşırı yorgunluktan kaçınmak ve solunum fonksiyonunu (vital kapasite) izlemek",["Maksimal dirençli egzersiz yapmak","Hastayı tamamen hareketsiz bırakmak","Sadece sıcak uygulama yapmak"]],
["60 yaşında hastada kol ve bacaklarda atrofi ve fasikülasyonların yanında hiperrefleksi ve Babinski var; duyu normal. Tanı nedir?","Amiyotrofik lateral skleroz (ALS)",["Guillain-Barré sendromu","Multipl skleroz","Periferik nöropati"]],
["25 yaşında kadında göz kapağı düşmesi, çift görme ve gün sonuna doğru artan kas güçsüzlüğü var. Tanı nedir?","Myastenia gravis",["Multipl skleroz","Bell paralizisi","Guillain-Barré sendromu"]],
["Hasta başını sağa çevirip hızla yatınca 30 saniyeden kısa süren dönme hissi ve nistagmus oluyor (Dix-Hallpike sağda pozitif). Tanı ve tedavi nedir?","Sağ posterior kanal BPPV; Epley manevrası",["Vestibüler nörit; tam yatak istirahati","Meniere hastalığı; Epley gereksiz","Serebellar inme; Brandt-Daroff"]],
["Hastada ani başlangıçlı, sağ tarafta belirgin dismetri, disdiadokokinezi ve geniş tabanlı ataksik yürüyüş var. Lezyon nerededir?","Sağ serebellum",["Sol serebellum","Sağ motor korteks","Sol bazal ganglionlar"]],
["Sağ elini kullanan inmeli hasta söyleneni anlıyor ama konuşması kesik kesik ve kelime bulmakta zorlanıyor. Afazi tipi ve lezyon yeri nedir?","Broca (motor) afazisi; sol frontal lob",["Wernicke afazisi; sol temporal lob","Global afazi; sağ hemisfer","Broca afazisi; sağ frontal lob"]],
["İnmeli hasta akıcı ama anlamsız konuşuyor ve söyleneni anlamıyor. Afazi tipi ve lezyon yeri nedir?","Wernicke (duysal) afazisi; sol temporal lob",["Broca afazisi; sol frontal lob","İletim afazisi; sağ parietal lob","Dizartri; serebellum"]],
["İnmeli hasta tabağının sol yarısındaki yemeği yemiyor, sol tarafındaki kişileri fark etmiyor. Lezyon nerededir?","Sağ parietal lob (sol ihmal)",["Sol parietal lob","Sol oksipital lob","Serebellum"]],
["İnmeli hastanın omzunda akromion ile humerus başı arasında boşluk palpe ediliyor. Tanı ve yaklaşım nedir?","Hemiplejik omuz subluksasyonu; kolu desteklemek ve doğru pozisyonlamak",["Rotator cuff yırtığı; acil cerrahi","Normal bulgu; koltuk altından çekerek kaldırmak","Adeziv kapsülit; agresif pulley egzersizi"]],
["İnmeli hastada dirsek hızlı ekstansiyona getirilince direnç artıyor ve hareketin sonunda aniden azalıyor. Bu bulgu nedir?","Spastisite (çakı bıçağı fenomeni)",["Kurşun boru rijiditesi","Dişli çark rijiditesi","Hipotoni"]],
["MS hastası için egzersiz programı planlanıyor. Hangi öneri doğrudur?","Serin ortamda, orta şiddette, dinlenme aralıklarıyla egzersiz",["Sıcak havuzda (38 °C) uzun süreli egzersiz","Yorgunluk olsa da maksimal şiddet","Egzersizden tamamen kaçınma"]],
["Omurilik yaralı hastanın sakrumunda deri bütün, basmakla solmayan kızarıklık var. Tanı ve yaklaşım nedir?","Evre 1 basınç yaralanması; basıyı kaldırmak ve en az 2 saatte bir pozisyon değiştirmek",["Normal bulgu; tedavi gerekmez","Evre 4 yara; sadece masaj","Enfeksiyon; bölgeye sıcak uygulama"]],
["KOAH hastası merdiven çıkarken nefes darlığı yaşıyor. Önerilecek solunum tekniği hangisidir?","Büzük dudak solunumu",["Hızlı ve yüzeyel solunum","Nefes tutarak çıkmak","Valsalva manevrası"]],
["Abdominal cerrahinin 2. gününde hastada hafif ateş ve akciğer tabanlarında solunum seslerinde azalma var. En olası tablo ve yaklaşım nedir?","Atelektazi; derin solunum egzersizi, insentif spirometre ve erken mobilizasyon",["Pnömotoraks; tam istirahat","Astım; sadece bronkodilatör","Pulmoner fibrozis; uzun süreli yatak istirahati"]],
["Kistik fibrozlu genç bir hastada yoğun ve yapışkan balgam var. Fizyoterapide öncelikli yaklaşım nedir?","Hava yolu temizleme teknikleri (ACBT, otojenik drenaj, PEP)",["Sadece kuvvet egzersizi","Öksürüğü baskılamak","Sadece istirahat"]],
["Egzersiz testinde hastada 2 mm'yi aşan horizontal ST depresyonu gelişiyor. Ne yapılmalıdır?","Test sonlandırılır",["Şiddet artırılır","Test aynen sürdürülür","Hastaya Valsalva yaptırılır"]],
["Artan iş yüküne rağmen hastanın sistolik kan basıncı 10 mmHg'den fazla düşüyor. Ne yapılmalıdır?","Egzersiz durdurulur",["Normal yanıttır, devam edilir","Şiddet artırılır","Sadece kalp hızına bakılır"]],
["Hastanın istirahat kan basıncı 210/115 mmHg. Egzersiz hakkında karar nedir?","Egzersize başlanmaz, hekime bildirilir",["Yüksek şiddetli egzersiz yapılır","İzometrik egzersiz verilir","Normal program uygulanır"]],
["Kalp yetmezliği olan hastada 1–2 gün içinde yaklaşık 2 kg kilo artışı ve bacaklarda ödem var. Ne yapılmalıdır?","Egzersiz ertelenir ve hekime bildirilir",["Egzersiz şiddeti artırılır","Sadece masaj yapılır","Sıvı alımı artırılır"]],
["Diyabetli hasta ayak tabanında 10 g monofilamenti hissetmiyor. Ne anlama gelir ve ne önerilir?","Koruyucu duyu kaybı; ayak bakımı eğitimi, uygun ayakkabı ve çıplak ayak yürümemek",["Normal bulgu; öneri gerekmez","Kas kuvveti kaybı; ağır direnç egzersizi","Vestibüler bozukluk; Epley manevrası"]],
["Anterior yaklaşımla total kalça artroplastisi yapılan hastada genellikle hangi hareket kombinasyonundan kaçınılır?","Kalça ekstansiyonu ve dış rotasyonu",["Kalça fleksiyonu ve iç rotasyonu","Diz fleksiyonu","Ayak bileği dorsifleksiyonu"]],
["Ayak bileği burkulan hasta 4 adım yürüyemiyor ve medial malleolün arka kenarında hassasiyet var. Ottawa kurallarına göre ne yapılır?","Ayak bileği grafisi çekilir",["Grafi gerekmez","Hemen koşuya başlanır","Sadece MR çekilir"]],
["Yürürken hastanın sağ ayağı yere tokat gibi çarpıyor ve sallanma fazında ayak ucu yere sürtünüyor. Neden ve yardımcı cihaz nedir?","Ayak bileği dorsifleksör zayıflığı; AFO",["Quadriceps zayıflığı; KAFO","Gluteus medius zayıflığı; baston sağ elde","Hamstring kısalığı; dizlik"]],
["Hasta sol bacağı üzerine yük verdiği duruş fazında gövdesini sola yatırıyor. Hangi kas zayıftır?","Sol m. gluteus medius (kompanse Trendelenburg yürüyüşü)",["Sağ m. gluteus medius","Sol m. gluteus maximus","Sol m. quadriceps"]],
["Hasta sağ topuk yere değdiğinde gövdesini geriye atıyor. Hangi kas zayıftır?","Sağ m. gluteus maximus",["Sağ m. gluteus medius","Sağ m. iliopsoas","Sağ m. tibialis anterior"]],
["Kanser öyküsü olan 65 yaşında hastada istirahatle geçmeyen gece sırt ağrısı ve açıklanamayan kilo kaybı var. Ne yapılmalıdır?","Kırmızı bayrak; metastaz şüphesiyle hekime yönlendirilir",["Mekanik ağrı; ev egzersizi verilir","Sadece sıcak uygulama yapılır","Manipülasyon uygulanır"]],
["16 yaşında jimnastikçide lomber ekstansiyonla artan bel ağrısı var ve tek bacak hiperekstansiyon (Stork) testi pozitif. En olası tanı nedir?","Spondilolizis",["Lomber disk hernisi","Scheuermann hastalığı","Sakroiliak eklem disfonksiyonu"]],
["Golf oyuncusunun dirseğinin iç yanında ağrı var; dirençli el bileği fleksiyonu ve pronasyonla artıyor. Tanı nedir?","Medial epikondilit",["Lateral epikondilit","Kubital tünel sendromu","Olekranon bursiti"]],
["35 yaşında koşucuda aşil tendonunun yapışma yerinin 2–6 cm proksimalinde ağrı ve sabah tutukluğu var. Tanı ve yaklaşım nedir?","Orta kısım aşil tendinopatisi; eksantrik ya da ağır-yavaş direnç egzersizi",["Aşil rüptürü; acil cerrahi","Plantar fasiit; tam istirahat","Retrokalkaneal bursit; buz ve tam istirahat"]],
["Kalp pili olan hastada ağrı kontrolü için TENS düşünülüyor. Doğru yaklaşım hangisidir?","TENS genellikle kontrendike kabul edilir; hekimle görüşülmeden uygulanmaz",["Göğüs bölgesine yüksek şiddette uygulanır","Kalp pilinin tam üzerine uygulanır","Hiçbir sakıncası yoktur"]],
["Gebeliğinin 20. haftasındaki hastanın bel ağrısı için hangi uygulamadan kaçınılır?","Gebe karın, bel ve pelvis bölgesine terapötik ultrason ve derin ısıtıcılar",["Postür eğitimi","Pelvik taban egzersizleri","Hafif aerobik yürüyüş"]],
["Meme kanseri sonrası kolunda lenfödem olan hastaya hangi öneri yapılır?","Etkilenen kolda sıcak uygulama ve sıkı takılardan kaçınmak",["Kola sauna ve hot pack uygulamak","Kolu tamamen hareketsiz tutmak","Kola sıkı turnike uygulamak"]],
["Kalça kırığı ameliyatından sonra yaşlı hastada ani başlayan, gün içinde dalgalanan dikkat ve bilinç bozukluğu gelişiyor. Ne düşünülür?","Deliryum; hekime bildirilir",["Alzheimer demansı; tedavi gerekmez","Normal yaşlılık; egzersiz artırılır","Depresyon; sadece moral verilir"]],
["Yaşlı hasta yataktan kalkınca baş dönmesi yaşıyor ve sistolik kan basıncı 25 mmHg düşüyor. Tanı ve öneri nedir?","Ortostatik hipotansiyon; yavaş kalkış, ayak bileği pompası, elastik çorap",["BPPV; Epley manevrası","Hipertansiyon; tuz alımını artırmak","Deliryum; tam yatak istirahati"]],
["Bir çalışmada yeni tedavi ağrıyı kontrole göre 0,5 puan azaltıyor (p = 0,03); MCID 2 puan. Sonuç nasıl yorumlanır?","İstatistiksel olarak anlamlı ama klinik olarak anlamlı değil",["Hem istatistiksel hem klinik olarak anlamlı","İstatistiksel olarak anlamsız","Klinik olarak anlamlı ama istatistiksel olarak anlamsız"]],
["Bir ölçümün test-tekrar test ICC değeri 0,95 bulunuyor. Güvenirlik nasıl yorumlanır?","Mükemmel",["Zayıf","Orta","Kabul edilemez"]],
["İki değerlendiricinin kategorik ölçümlerinde kappa değeri 0,85 bulunuyor. Uyum nasıl yorumlanır?","Neredeyse mükemmel uyum",["Zayıf uyum","Uyum yok","Orta düzey uyum"]],
["MS hastası yorgunluk nedeniyle işine gidemiyor; işyerinde asansör yok. ICF'ye göre bu durumlar nasıl sınıflanır?","İşe gidememe katılım kısıtlılığı, asansör olmaması çevresel faktördür",["İkisi de vücut fonksiyonu bozukluğudur","İşe gidememe kişisel faktör, asansör aktivitedir","İkisi de vücut yapısı bozukluğudur"]],
["Varfarin kullanan hastada dizde ani şişlik ve ağrı gelişiyor. Ne düşünülür?","Hemartroz; hekime bildirilir",["Normal kas ağrısı; masaj yapılır","Tendinopati; eksantrik egzersiz verilir","Osteoartrit alevlenmesi; sıcak uygulanır"]],
["İnsülin kullanan hastada egzersiz sırasında titreme, terleme ve çarpıntı başlıyor. Ne yapılmalıdır?","Egzersiz durdurulur, yaklaşık 15 g hızlı emilen karbonhidrat verilir",["Egzersiz şiddeti artırılır","Ek insülin yapılır","Hasta yalnız bırakılır"]],
["Sporcu kafasına darbe aldıktan sonra baş ağrısı, bulantı ve ışığa duyarlılık tarif ediyor; bilinç kaybı yok. Ne yapılmalıdır?","Beyin sarsıntısı şüphesiyle oyundan alınır ve değerlendirilir",["Bilinç kaybı olmadığı için oyuna devam eder","Ağrı kesici verilip oyuna döner","Sadece buz uygulanıp devam eder"]]
];

const S = window.FTR_EXTRA_SECTIONS || [];
for(const s of S){
  if(ADD[s.id]) s.cards.push(...ADD[s.id]);
  if(s.id === "vaka") s.cards.push(...VAKA);
}
})();
