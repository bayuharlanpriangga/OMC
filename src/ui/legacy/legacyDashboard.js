// ═══════════════════════════════════════════════════════════
//  RENDER DASHBOARD
// ═══════════════════════════════════════════════════════════
let _D={}, _raw={};
const LP_MEANING={1:'Pemimpin & Pioneer',2:'Diplomat & Intuisi',3:'Kreator & Ekspresi',4:'Builder & Disiplin',5:'Kebebasan & Perubahan',6:'Pemelihara & Harmoni',7:'Analis & Pencarian',8:'Kekuatan & Ambisi',9:'Humanis & Bijaksana',11:'Master Intuitif',22:'Master Builder',33:'Master Teacher'};

function render(name,dateStr,timeStr,city,D) {
  try {
  _D=D; _raw={name,dateStr,timeStr,city};
  const dd=new Date(dateStr);
  const dateFmt=dd.toLocaleDateString('id-ID',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
  const lp=D.numerology.lp;

  // TOPBAR + HERO
  document.getElementById('tbName').textContent=name.toUpperCase();
  document.getElementById('hName').textContent=name;
  document.getElementById('hDob').textContent=`${dateFmt} · ${timeStr||'—'} · ${city}`;
  document.getElementById('hBadges').innerHTML=[
    {t:`${D.sunSign} ☉`,c:'bg'},{t:D.hd.type,c:'bb'},{t:`LP ${lp}`,c:'bp'},
    {t:D.bazi.dayMaster,c:'br'},{t:D.hd.prof,c:'bt'},{t:`Gate ${D.sunGate}`,c:'bt'}
  ].map(b=>`<span class="badge ${b.c}">${b.t}</span>`).join('');

  const confMap={high:{col:'var(--green)',t:'Presisi tinggi'},medium:{col:'var(--gold)',t:'Medium'},low:{col:'var(--red)',t:'Rendah'}};
  document.getElementById('hConf').innerHTML =
    [{l:'Astrology',v:D.confidence.astro},{l:'BaZi',v:D.confidence.bazi},{l:'HD',v:D.confidence.hd}]
    .map(c=>'<div class="ci"><div class="ci-dot" style="background:'+confMap[c.v].col+'"></div><div class="ci-lbl">'+c.l+': '+confMap[c.v].t+'</div></div>').join('')
    + '<div style="width:100%;margin-top:6px;font-family:var(--font-mono);font-size:8px;color:var(--muted);letter-spacing:.1em;line-height:1.6">'
    + (D.errorTolerance ? D.errorTolerance.note : D.confidence.note)
    + '</div>';



  // Soul Score
  document.getElementById('soulNumBig').textContent=D.soulScore;
  document.getElementById('soulLabel').textContent=D.soulLabel.toUpperCase();
  setTimeout(()=>drawSoulRing(document.getElementById('soulRingC'),D.soulScore),150);

  // OVERVIEW — Soul Score Anatomy
  document.getElementById('ov-soul-num').textContent = D.soulScore;
  document.getElementById('ov-soul-lbl').textContent = D.soulLabel.toUpperCase();
  document.getElementById('ov-soul-desc').textContent = D.soulDesc;
  document.getElementById('ov-soul-dims').innerHTML = D.soulDimensions.map(d=>
    '<div class="soul-dim">' +
      '<div><div class="soul-dim-label">'+d.label+'</div><div class="soul-dim-source">'+d.source+'</div></div>' +
      '<div class="soul-dim-score">'+d.score+'</div>' +
      '<div class="soul-dim-bar" style="grid-column:1/-1"><div class="soul-dim-fill" data-s="'+d.score+'" style="background:'+d.color+'"></div></div>' +
    '</div>'
  ).join('');

  // OVERVIEW — Emotional Architecture
  document.getElementById('ov-emot-arch').textContent = D.fusion.emotArch;
  document.getElementById('ov-emot-desc').textContent = D.fusion.emotArchDesc;

  // OVERVIEW — behavioral layer (not archetypal)
  document.getElementById('ov-title').textContent = D.sunSign+' × '+D.hd.type+' × LP'+lp;
  document.getElementById('ov-sub').textContent = D.ascSign+' Ascendant · '+D.bazi.dayMaster+' ('+D.fusion.dmStrength+') · Month: '+D.bazi.month.branch;
  document.getElementById('ov-traits').innerHTML = D.traits.map(t=>
    '<div class="tr-row"><div class="tr-head"><span class="tr-name">'+t.n+'</span><span class="tr-val">'+t.s+'</span></div><div class="tbar"><div class="tfill" data-s="'+t.s+'"></div></div></div>'
  ).join('');

  // Convergences with behavioral reads
  document.getElementById('ov-convergences').innerHTML = D.fusion.convergences.map(c=>
    '<div class="conv-card">' +
      '<div class="conv-signal">'+c.signal+'</div>' +
      '<div class="conv-systems">'+c.systems.map(s=>'<span class="conv-sys-tag">'+s+'</span>').join('')+'</div>' +
      (c.reads ? '<div style="margin-bottom:10px">'+c.reads.map(r=>'<div style="font-family:var(--font-mono);font-size:9px;letter-spacing:.12em;color:var(--muted);padding:3px 0;display:flex;gap:8px"><span style="color:rgba(201,168,76,0.4)">→</span>'+r+'</div>').join('')+'</div>' : '') +
      '<div class="conv-pattern">'+(c.convergence||c.pattern)+'</div>' +
      '<div class="conv-action">'+(c.action)+'</div>' +
    '</div>'
  ).join('');

  // Behavioral layer — what you DO
  const bl = D.fusion.behavioralLabel;
  const hb = D.fusion.hdBehavioral;
  const bs = D.fusion.baziStress;
  document.getElementById('ov-actions').innerHTML =
    '<div class="action-block"><div class="action-domain">Tendensi Perilaku Utama (Sun ' + D.sunSign + ')</div><div class="action-text">Kamu ' + bl + '. Ini bukan kepribadian — ini pola yang bisa dikenali.</div></div>' +
    '<div class="action-block"><div class="action-domain">Mekanisme HD (' + D.hd.type + ')</div><div class="action-text">Kamu ' + hb + '</div></div>' +
    '<div class="action-block"><div class="action-domain">Pola Stres BaZi (' + D.bazi.dayMaster + ' — ' + D.fusion.dmStrength + ')</div><div class="action-text">Kamu ' + bs + '</div></div>';

  // Shadow
  document.getElementById('ov-shadow').textContent = D.shadows[0].body;

  // Natal + Element charts
  setTimeout(()=>{
    const nc=document.getElementById('natalC');
    const tt=document.getElementById('natalTT');
    drawNatal(nc, D, tt);
    setupNatalHover(nc, D, tt);
    drawElemPie(document.getElementById('elemC'), D.elCounts, null);
  },200);

  const elKeys=Object.keys(D.elCounts);
  document.getElementById('elPills').innerHTML=elKeys.map(el=>{
    const v=D.elCounts[el];
    return '<span class="epill" style="border-color:rgba(255,255,255,0.1);color:var(--dim)">'+el+' <span style="color:var(--gold)">'+v+'</span></span>';
  }).join('');

  // ASTROLOGY
  const sun=D.planets.Sun, asc=D.planets.Ascendant, moon=D.planets.Moon;
  document.getElementById('as-title').textContent=`Sun ${sun.deg}° ${D.sunSign} · Asc ${D.ascSign}`;
  document.getElementById('as-sub').textContent=`Moon ${D.moonSign} · Tropical Zodiac · ${timeStr?'Full chart':'No time — Ascendant approximate'}`;
  document.getElementById('as-body').textContent=`Sun in ${D.sunSign} pada ${sun.deg}° mendefinisikan inti identitasmu. Ascendant ${D.ascSign} adalah bagaimana dunia pertama kali membacamu sebelum mengenalmu lebih dalam. Moon in ${D.moonSign} pada ${moon.deg}° mengatur lanskap emosional yang lebih dalam — kebutuhanmu untuk merasa aman dan cara kamu memproses pengalaman.`;
  document.getElementById('as-planets').innerHTML=['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Uranus','Neptune','Pluto'].map(p=>{
    const pd=D.planets[p]; if(!pd) return '';
    const h=houseOf(D.lons[p]||0, D.houses);
    const rx = pd.retrograde ? '<span style="font-family:var(--font-mono);font-size:8px;color:var(--red);margin-left:4px">Rx</span>' : '';
    const dignityMap = {domicile:'◉',exaltation:'▲',detriment:'▽',fall:'◎'};
    const dig = pd.dignity ? '<span style="font-size:10px;opacity:.7;margin-left:3px" title="'+pd.dignity+'">'+(dignityMap[pd.dignity]||'')+'</span>' : '';
    return '<div class="prow"><span class="pname">'+p+'</span><span class="psym">'+pd.sym+'</span><span class="psign">'+pd.sign+' '+pd.deg+'°'+rx+dig+'</span><span class="phouse">H'+h+'</span></div>';
  }).join('');

  const aspCls={Conjunction:'ac',Trine:'at',Square:'as2',Opposition:'ao',Sextile:'ax'};
  document.getElementById('as-asps').innerHTML=D.aspects.map(a=>{
    const orbLabel = a.tight ? '★' : a.exactness+'°';
    const appSep = a.applying === true ? '↑' : a.applying === false ? '↓' : '';
    const title = a.a+' '+a.t+' '+a.b+' | orb '+a.exactness+'° | strength '+a.strength+'% | '+(a.applying===true?'applying':a.applying===false?'separating':'');
    return '<span class="asp '+(aspCls[a.t]||'ac')+(a.tight?' asp-tight':'')+'" onclick="showAspDetail(this,\''+title+'\')" title="'+title+'">'+
      a.a+' '+a.t+' '+a.b+' <small style="opacity:.6">'+orbLabel+appSep+'</small></span>';
  }).join('');
  document.getElementById('as-deep').textContent = D.sunSign+' diatur oleh '+({'Aries':'Mars','Taurus':'Venus','Gemini':'Mercury','Cancer':'Moon','Leo':'Sun','Virgo':'Mercury','Libra':'Venus','Scorpio':'Pluto','Sagittarius':'Jupiter','Capricorn':'Saturn','Aquarius':'Uranus','Pisces':'Neptune'}[D.sunSign]||'?')+'. Sun di '+sun.deg+'° memberikan nuansa yang '+(sun.deg<15?'lebih langsung dari tanda ini':'lebih matang dan reflektif dari tanda ini')+'.';
  document.getElementById('as-shadow').textContent=D.SIGN_SHADOW[D.sunSign]||'—';
  const mcText = D.mcSign ? ' MC ('+D.mcSign.sign+' '+D.mcSign.deg+'°) = Karier & reputasi publik.' : '';
  document.getElementById('as-houses').innerHTML='Sistem: <strong style="color:var(--gold)">Whole Sign</strong>. H1 ('+D.ascSign+'): Persona. H7 ('+SIGNS[(D.planets.Ascendant.idx+6)%12]+'): Partnership. H10 ('+SIGNS[(D.planets.Ascendant.idx+9)%12]+'): Karier.'+mcText+' Sun H'+houseOf(D.lons.Sun,D.houses)+', Moon H'+houseOf(D.lons.Moon,D.houses)+'.';

  // ═══ BAZI RENDERER ═══
  const {year:by,month:bm,day:bd,hour:bh,dayMaster,favEl,unfavEl,luckPillars,baziEls,
         byearHidden,bmonthHidden,bdayHidden,bhourHidden,
         pillars10Gods,symbolicStars,kuaNum,kuaDirs,isFemale,luckStartAge}=D.bazi;

  const EL_COLOR={'Wood':'#5a9e78','Fire':'#c84040','Earth':'#c9a84c','Metal':'#8ba0b4','Water':'#4a7ab5'};
  const EL_EMOJI={'Wood':'🌳','Fire':'🔥','Earth':'🌍','Metal':'⚔️','Water':'💧'};
  const PILLAR_CLASSES=['year','month','day','hour'];

  // ── FOUR PILLARS with Hidden Stems ──
  const pillarData = [
    {p:by,lbl:'Year · 年',hidden:byearHidden,cls:'year',god:pillars10Gods[0]?.god},
    {p:bm,lbl:'Month · 月',hidden:bmonthHidden,cls:'month',god:pillars10Gods[1]?.god},
    {p:bd,lbl:'Day · 日',hidden:bdayHidden,cls:'day',god:pillars10Gods[2]?.god},
    {p:bh,lbl:'Hour · 時',hidden:bhourHidden,cls:'hour',god:pillars10Gods[3]?.god},
  ];

  document.getElementById('bz-pillars').innerHTML = pillarData.map(({p,lbl,hidden,cls,god}) => {
    if(!p||p.stem==='—') return `<div class="bpillar ${cls}"><div class="bplbl">${lbl}</div><div class="bpstem-char" style="font-size:36px;color:var(--muted)">—</div></div>`;
    const stemParts = p.stem.split(' '); // ['甲','Jiǎ']
    const branchParts = p.branch.split(' '); // ['子','Rat']
    const elBase = p.el.split(' ')[1]; // 'Wood'
    const col = EL_COLOR[elBase]||'var(--gold)';
    const godBadge = god && god!=='日主 Day Master' ? `<div class="bpgod" style="background:${col}22;color:${col};border:1px solid ${col}44">${god.split(' ').slice(0,2).join(' ')}</div>` : '';
    const hiddenHTML = hidden.length ? `<div class="bphidden"><div class="bphidden-lbl">Hidden 藏干</div>${hidden.map(h=>`<div class="bphidden-stem" style="color:${EL_COLOR[h.el.split(' ')[1]]||'var(--muted)'}; ">${h.stem.split(' ')[0]} ${h.weight}</div>`).join('')}</div>` : '';
    return `<div class="bpillar ${cls}">
      <div class="bplbl">${lbl}</div>
      <div><span class="bpstem-char" style="color:${col}">${stemParts[0]}</span></div>
      <div class="bpstem-pinyin">${stemParts.slice(1).join(' ')}</div>
      <div class="bpbranch">
        <span class="bpbranch-char">${branchParts[0]}</span>
        <span class="bpbranch-name">${branchParts.slice(1).join(' ')}</span>
      </div>
      <div class="bpel">${p.el}</div>
      ${godBadge}
      ${hiddenHTML}
    </div>`;
  }).join('');

  // ── DAY MASTER HERO ──
  const dmEl = dayMaster.split(' ')[1]; // 'Wood'
  const dmYin = dayMaster.startsWith('Yin');
  const dmStemIdx = ['Yang Wood','Yin Wood','Yang Fire','Yin Fire','Yang Earth','Yin Earth','Yang Metal','Yin Metal','Yang Water','Yin Water'].indexOf(dayMaster);
  const dmStemChar = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'][dmStemIdx] || '—';
  const dmColor = EL_COLOR[dmEl] || 'var(--gold)';

  const DM_PROFILE = {
    'Yang Wood':{char:'甲',nature:'Yang Wood — Jiǎ',title:'Pohon Besar yang Kokoh',traits:['Visioner & ambisius','Kepemimpinan natural','Pantang menyerah','Selalu berkembang'],core:'甲木 ibarat pohon besar yang terus tumbuh ke atas. Kamu memiliki energi ekspansi yang kuat — selalu mencari pertumbuhan, kemungkinan baru, dan potensi yang belum terjamah.',strength:'Kepemimpinan, visi jangka panjang, daya tahan, kemampuan memimpin kelompok besar.',challenge:'Terlalu kaku dalam pendirian, sulit kompromi, dan mungkin mengabaikan detail kecil yang penting.',career:'Kepemimpinan, manajemen, wirausaha, pendidikan, hukum, kehutanan, industri kayu.'},
    'Yin Wood':{char:'乙',nature:'Yin Wood — Yǐ',title:'Tanaman Merambat yang Lentur',traits:['Adaptif & fleksibel','Diplomatis','Kreatif & artistik','Persisten diam-diam'],core:'乙木 ibarat tanaman merambat yang melilit dengan lembut namun kuat. Kamu adalah orang yang bertahan dan mencapai tujuan dengan cara yang halus dan tidak langsung, penuh kreativitas dan kelenturan.',strength:'Adaptasi, kreativitas, diplomasi, kemampuan menemukan jalan di berbagai kondisi.',challenge:'Kadang terlalu bergantung pada orang lain, sulit mengambil keputusan cepat dalam tekanan.',career:'Seni, desain, konseling, hubungan masyarakat, diplomasi, perawatan tanaman, fashion.'},
    'Yang Fire':{char:'丙',nature:'Yang Fire — Bǐng',title:'Matahari yang Bersinar',traits:['Karismatik & ekspresif','Optimis','Penuh semangat','Pengaruh luas'],core:'丙火 ibarat matahari — bersinar terang, memberi cahaya dan kehangatan kepada semua orang tanpa memilih. Kehadiranmu menerangi ruangan dan memberi motivasi kepada orang di sekitarmu.',strength:'Karisma, kepemimpinan publik, semangat yang menular, visibilitas tinggi, kemampuan menginspirasi.',challenge:'Mudah kehabisan energi jika terlalu banyak memberi, dan mungkin terlalu egois dalam ekspresi diri.',career:'Hiburan, media, kepemimpinan publik, marketing, pendidikan, politik, teknologi.'},
    'Yin Fire':{char:'丁',nature:'Yin Fire — Dīng',title:'Cahaya Lilin yang Hangat',traits:['Intuitif & sensitif','Hangat & peduli','Detail-oriented','Kepemimpinan personal'],core:'丁火 ibarat nyala lilin — bersinar dengan hangat dalam kegelapan, menerangi secara personal dan mendalam. Kamu memiliki kehangatan yang genuine dan kemampuan intuitif yang kuat.',strength:'Intuisi, kehangatan dalam relasi personal, perhatian pada detail, kebijaksanaan emosional.',challenge:'Lebih efektif dalam skala kecil daripada publik besar, mudah terpengaruh energi negatif sekitar.',career:'Konseling, psikologi, kesehatan, seni halus, spiritual, penelitian, pendidikan personal.'},
    'Yang Earth':{char:'戊',nature:'Yang Earth — Wù',title:'Gunung yang Stabil',traits:['Dapat diandalkan','Sabar & stabil','Adil & netral','Fondasi yang kuat'],core:'戊土 ibarat gunung — besar, stabil, dan dapat diandalkan. Kamu adalah fondasi yang membuat orang lain bisa berdiri dengan kokoh. Sabar, adil, dan tidak mudah goyah.',strength:'Keandalan, stabilitas, kemampuan memfasilitasi, kesabaran luar biasa, rasa keadilan yang kuat.',challenge:'Dapat terlalu lambat dalam mengambil keputusan dan terkadang keras kepala.',career:'Real estate, konstruksi, pertanian, keuangan, manajemen, administrasi, pemerintahan.'},
    'Yin Earth':{char:'己',nature:'Yin Earth — Jǐ',title:'Tanah Subur yang Memelihara',traits:['Pemelihara & nurturing','Detail & praktis','Dapat dipercaya','Kemampuan menyerap'],core:'己土 ibarat tanah subur — memelihara, menyerap, dan memberi nutrisi pada semua yang tumbuh di atasnya. Kamu adalah pendukung yang handal dengan kemampuan praktis yang kuat.',strength:'Kemampuan memelihara, praktikalitas, kepercayaan, detail dalam pekerjaan, mendukung orang lain.',challenge:'Terlalu banyak menyerap masalah orang lain, sulit menetapkan batasan yang sehat.',career:'Nutrisi, kesehatan, konseling, keuangan, akuntansi, pertanian, kuliner, perawatan.'},
    'Yang Metal':{char:'庚',nature:'Yang Metal — Gēng',title:'Pedang Tajam yang Tegas',traits:['Tegas & berprinsip','Disiplin tinggi','Berani & determinasi','Standar tinggi'],core:'庚金 ibarat pedang — tajam, tegas, dan tidak berkompromi terhadap prinsip. Kamu memiliki integritas yang kuat dan kemampuan untuk memotong melalui kebingungan untuk menemukan kebenaran.',strength:'Integritas, ketegasan, disiplin, kemampuan membuat keputusan sulit, standar kualitas tinggi.',challenge:'Terlalu kritis terhadap diri sendiri dan orang lain, mungkin tampak dingin atau terlalu rigid.',career:'Militer, hukum, keuangan, teknik, bedah, manajemen kualitas, penelitian.'},
    'Yin Metal':{char:'辛',nature:'Yin Metal — Xīn',title:'Perhiasan yang Bersinar',traits:['Estetis & perfeksionis','Analitis & kritis','Karisma halus','Keindahan dalam detail'],core:'辛金 ibarat perhiasan berharga — halus, indah, dan sempurna dalam detail. Kamu memiliki sense estetika yang tajam dan kemampuan analitis yang sangat detail-oriented.',strength:'Estetika, perfeksionisme yang produktif, analisis mendalam, charm yang halus dan menawan.',challenge:'Terlalu perfeksionis bisa membuat paralisis, dan sensitif terhadap kritik.',career:'Seni, desain, fashion, kecantikan, analisis keuangan, perhiasan, jurnalisme, penelitian.'},
    'Yang Water':{char:'壬',nature:'Yang Water — Rén',title:'Samudra Luas yang Dalam',traits:['Cerdas & adaptif','Visi luas','Bijaksana intuitif','Fleksibilitas ekstrem'],core:'壬水 ibarat lautan luas — dalam, adaptif, dan mengalir ke mana pun dibutuhkan. Kamu memiliki kecerdasan yang luar biasa, kemampuan adaptasi tinggi, dan visi yang melampaui batas.',strength:'Kecerdasan, adaptasi, visi strategis, kebijaksanaan intuitif, kemampuan melihat gambaran besar.',challenge:'Dapat menjadi terlalu fleksibel sehingga kehilangan arah, dan mungkin menghindari komitmen.',career:'Teknologi, penelitian, filosofi, hubungan internasional, maritim, psikologi, spiritualitas.'},
    'Yin Water':{char:'癸',nature:'Yin Water — Guǐ',title:'Embun Pagi yang Misterius',traits:['Intuitif & perseptif','Misterius & dalam','Empati tinggi','Kebijaksanaan batin'],core:'癸水 ibarat embun pagi — lembut, halus, dan misterius namun sangat esensial. Kamu memiliki intuisi yang sangat tajam, empati yang dalam, dan kemampuan untuk memahami hal-hal yang tersembunyi.',strength:'Intuisi mistis, empati mendalam, persepsi halus, kemampuan menyembuhkan dan membantu.',challenge:'Dapat terlalu sensitif terhadap energi sekitar dan mungkin sulit menetapkan batasan emosional.',career:'Kesehatan, psikologi, spiritual, seni, musik, penelitian, pengobatan, konseling.'},
  };

  const dmProfile = DM_PROFILE[dayMaster] || DM_PROFILE['Yang Wood'];
  document.getElementById('bz-dm-hero').innerHTML = `
    <div class="bz-dm-hero">
      <div style="position:absolute;top:12px;right:16px;font-size:48px;opacity:.1">${EL_EMOJI[dmEl]||''}</div>
      <div class="bz-dm-char" style="color:${dmColor}">${dmStemChar}</div>
      <div class="bz-dm-name">${dmProfile.title}</div>
      <div class="bz-dm-nature">${dmProfile.nature} · ${isFemale?'Wanita':'Pria'} · ${D.bazi.byearData?.baziYr||''}</div>
      <div style="font-size:13px;color:var(--dim);line-height:1.8;margin-bottom:14px">${dmProfile.core}</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px">
        ${dmProfile.traits.map(t=>`<span style="font-family:var(--font-mono);font-size:8px;letter-spacing:.12em;padding:3px 10px;border:1px solid ${dmColor}44;color:${dmColor};border-radius:2px">${t}</span>`).join('')}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        <div style="background:rgba(0,0,0,.2);border-radius:var(--r);padding:10px 12px">
          <div style="font-family:var(--font-mono);font-size:7px;letter-spacing:.22em;color:${dmColor};text-transform:uppercase;margin-bottom:4px">KEKUATAN</div>
          <div style="font-size:11px;color:var(--dim);line-height:1.55">${dmProfile.strength}</div>
        </div>
        <div style="background:rgba(0,0,0,.2);border-radius:var(--r);padding:10px 12px">
          <div style="font-family:var(--font-mono);font-size:7px;letter-spacing:.22em;color:var(--red);text-transform:uppercase;margin-bottom:4px">TANTANGAN</div>
          <div style="font-size:11px;color:var(--dim);line-height:1.55">${dmProfile.challenge}</div>
        </div>
      </div>
      <div style="margin-top:10px;padding:10px 12px;background:rgba(0,0,0,.2);border-radius:var(--r)">
        <div style="font-family:var(--font-mono);font-size:7px;letter-spacing:.22em;color:var(--green);text-transform:uppercase;margin-bottom:4px">KARIR IDEAL</div>
        <div style="font-size:11px;color:var(--dim);line-height:1.55">${dmProfile.career}</div>
      </div>
    </div>`;

  // ── 10 GODS TABLE ──
  document.getElementById('bz-10gods').innerHTML = `
    <div style="font-family:var(--font-mono);font-size:8px;letter-spacing:.28em;color:var(--gold);text-transform:uppercase;margin-bottom:10px;margin-top:4px">10 Gods · 十神 Analisis</div>
    <div>${pillars10Gods.map(pg=>{
      if(!pg.god||pg.stem==='—') return '';
      const elBase = pg.el.split(' ')[1];
      const col = EL_COLOR[elBase]||'var(--muted)';
      const isDay = pg.pillar==='Day';
      return `<div class="bz-god-row">
        <div class="bz-god-name">${pg.pillar} 柱</div>
        <div class="bz-god-el" style="color:${col}">${pg.stem.split(' ')[0]} <span style="font-size:9px;color:var(--muted)">${pg.el}</span></div>
        <div class="bz-god-trait" style="${isDay?'color:var(--gold);font-weight:600':''}">
          ${pg.god.split(' ').slice(0,2).join(' ')}
          ${pg.god.includes('Officer')||pg.god.includes('Wealth')||pg.god.includes('Resource')?
            `<span style="font-size:9px;opacity:.6;margin-left:4px">${pg.god.split(' ').slice(2).join(' ')}</span>`:
            `<span style="font-size:9px;opacity:.6;margin-left:4px">${pg.god.split(' ').slice(2).join(' ')}</span>`}
        </div>
      </div>`;
    }).join('')}</div>
    <div style="font-family:var(--font-mono);font-size:8px;color:var(--muted);line-height:1.6;margin-top:8px;padding:8px 10px;background:var(--s2);border-radius:var(--r)">
      Elemen Favorit: <span style="color:${EL_COLOR[favEl]||'var(--gold)'}">${favEl} ${EL_EMOJI[favEl]||''}</span> &nbsp;·&nbsp; 
      Tidak Favorit: <span style="color:var(--red)">${unfavEl} ${EL_EMOJI[unfavEl]||''}</span> &nbsp;·&nbsp;
      Day Master: <span style="color:var(--gold)">${dmStemChar} ${dayMaster}</span>
    </div>`;

  // ── ELEMENT BARS ──
  const elMax = Math.max(...Object.values(baziEls), 1);
  document.getElementById('bz-el-bars').innerHTML = Object.entries(baziEls).map(([el,v])=>`
    <div class="bz-el-bar-row">
      <div class="bz-el-bar-name">${el}</div>
      <div class="bz-el-bar-wrap">
        <div class="bz-el-bar-fill" style="width:${Math.round(v/elMax*100)}%;background:${EL_COLOR[el]||'var(--gold)'}"></div>
      </div>
      <div class="bz-el-bar-val">${v}</div>
      ${el===favEl?`<span style="font-family:var(--font-mono);font-size:7px;color:var(--green)">✦ Fav</span>`:''}
      ${el===unfavEl?`<span style="font-family:var(--font-mono);font-size:7px;color:var(--red)">✗ Unf</span>`:''}
    </div>`).join('');

  document.getElementById('bz-epills').innerHTML=Object.entries(baziEls).map(([el,v])=>`
    <span class="epill" style="border-color:${el===favEl?'rgba(90,158,120,.4)':el===unfavEl?'rgba(196,96,74,.35)':'rgba(255,255,255,.06)'};color:${el===favEl?'var(--green)':el===unfavEl?'#da8070':'var(--muted)'}">
      ${EL_EMOJI[el]||''} ${el} ${v}
    </span>`).join('');

  setTimeout(()=>drawBaziElem(document.getElementById('baziElemC'), baziEls, favEl), 200);

  // ── KUA NUMBER + DIRECTIONS ──
  const goodDirLabels = KUA_GOOD_LABELS??['Success','Health','Love','Study'];
  const badDirLabels  = KUA_BAD_LABELS??['Bad Luck','5 Ghosts','6 Killings','Total Loss'];
  const KUA_GOOD_LABELS=['Success','Health','Love','Study'];
  const KUA_BAD_LABELS=['Bad Luck','Five Ghosts','Six Killings','Total Loss'];
  const KUA_BAD_LABELS_LOCAL=['Sial','5 Hantu','6 Pembunuh','Rugi Total'];
  const KUA_DIR_COMPASS_LOCAL={N:'↑ Utara',NE:'↗ Timur Laut',E:'→ Timur',SE:'↘ Tenggara',S:'↓ Selatan',SW:'↙ Barat Daya',W:'← Barat',NW:'↖ Barat Laut'};
  const kuaDirsData = kuaDirs || {good:['SE','E','S','N'],bad:['W','NE','NW','SW'],group:'East Group'};

  document.getElementById('bz-kua').innerHTML = `
    <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px">
      <div style="text-align:center">
        <div style="font-family:var(--font-serif);font-size:52px;color:var(--gold);line-height:1">${kuaNum}</div>
        <div style="font-family:var(--font-mono);font-size:7px;letter-spacing:.2em;color:var(--muted);margin-top:2px">KUA ${kuaNum}</div>
      </div>
      <div>
        <div style="font-family:var(--font-sans);font-size:14px;font-weight:600;margin-bottom:2px">${kuaDirsData.group}</div>
        <div style="font-size:12px;color:var(--dim)">Kua Number ${kuaNum} — berdasarkan tahun lahir BaZi (${D.bazi.byearData?.baziYr}) ${isFemale?'wanita':'pria'}</div>
      </div>
    </div>
    <div style="margin-bottom:10px">
      <div style="font-family:var(--font-mono);font-size:8px;letter-spacing:.25em;color:var(--green);text-transform:uppercase;margin-bottom:8px">✦ Arah Baik (Hadap saat bekerja & tidur)</div>
      <div class="bz-dir-grid">
        ${kuaDirsData.good.map((dir,i)=>`<div class="bz-dir-card good">
          <div class="bz-dir-compass">${KUA_DIR_COMPASS_LOCAL[dir]?.split(' ')[0]||dir}</div>
          <div class="bz-dir-name">${KUA_DIR_COMPASS_LOCAL[dir]?.split(' ')[1]||dir}</div>
          <div class="bz-dir-label">${KUA_GOOD_LABELS_LOCAL[i]||dir}</div>
        </div>`).join('')}
      </div>
    </div>
    <div>
      <div style="font-family:var(--font-mono);font-size:8px;letter-spacing:.25em;color:var(--red);text-transform:uppercase;margin-bottom:8px">✗ Arah Buruk (Hindari menghadap ini)</div>
      <div class="bz-dir-grid">
        ${kuaDirsData.bad.map((dir,i)=>`<div class="bz-dir-card bad">
          <div class="bz-dir-compass">${KUA_DIR_COMPASS_LOCAL[dir]?.split(' ')[0]||dir}</div>
          <div class="bz-dir-name">${KUA_DIR_COMPASS_LOCAL[dir]?.split(' ')[1]||dir}</div>
          <div class="bz-dir-label">${KUA_BAD_LABELS_LOCAL[i]||dir}</div>
        </div>`).join('')}
      </div>
    </div>`;

  // ── SYMBOLIC STARS ──
  document.getElementById('bz-stars').innerHTML = symbolicStars.length
    ? `<div class="bz-star-grid">${symbolicStars.map(s=>`
        <div class="bz-star-card">
          <div class="bz-star-icon">${s.icon}</div>
          <div class="bz-star-name">${s.name}</div>
          <div class="bz-star-desc">${s.desc}</div>
          <div class="bz-star-loc">Aktif di: ${s.loc}</div>
        </div>`).join('')}</div>`
    : `<div style="font-size:13px;color:var(--muted);padding:8px 0">Tidak ada Symbolic Stars yang aktif berdasarkan pilar kelahiran ini. Ini bukan hal yang buruk — chart yang bersih dapat menunjukkan perjalanan hidup yang lebih mandiri dan langsung.</div>`;

  // ── LUCK PILLARS enhanced ──
  document.getElementById('bz-luck').innerHTML = `
    <div style="font-family:var(--font-mono);font-size:8px;color:var(--muted);letter-spacing:.15em;margin-bottom:12px">
      Da Yun dimulai usia ${luckStartAge||'?'} · ${D.bazi.isFemale?'Wanita':'Pria'} · Aliran ${D.bazi.byearData?.si%2===0?'順 Forward (顺)':'逆 Backward (逆)'}
    </div>
    ${luckPillars.map(lp=>{
      const now=D.curAge>=lp.age&&D.curAge<lp.age+10;
      const elBase=lp.el.split(' ')[1];
      const col=EL_COLOR[elBase]||'var(--muted)';
      const stemParts=lp.stem.split(' ');
      const branchParts=lp.branch.split(' ');
      return `<div class="bz-luck-pillar" style="${now?'background:rgba(201,168,76,.04)':''}">
        <div class="bz-luck-age" style="color:${now?'var(--gold)':'var(--muted)'}">
          ${lp.age}–${lp.age+9}
          ${now?`<div style="font-size:6px;color:var(--gold);letter-spacing:.15em;margin-top:1px">SEKARANG</div>`:''}
        </div>
        <div>
          <div class="bz-luck-stem" style="color:${col}">${stemParts[0]}</div>
          <div style="font-family:var(--font-mono);font-size:8px;color:var(--muted)">${stemParts.slice(1).join(' ')}</div>
        </div>
        <div>
          <div class="bz-luck-branch" style="${now?'color:var(--text)':''}">${branchParts[0]} ${branchParts.slice(1).join(' ')}</div>
          <div style="font-family:var(--font-mono);font-size:8px;color:${col}">${lp.el}</div>
        </div>
        <div class="bz-luck-el">
          <div style="font-family:var(--font-mono);font-size:7px;color:${lp.el.split(' ')[1]===favEl?'var(--green)':lp.el.split(' ')[1]===unfavEl?'var(--red)':'var(--muted)'}">
            ${lp.el.split(' ')[1]===favEl?'✦ Fav':lp.el.split(' ')[1]===unfavEl?'✗ Unf':'—'}
          </div>
        </div>
      </div>`;
    }).join('')}`;

  // ── READING INSIGHT ──
  document.getElementById('bz-insight').textContent=`Year Pillar ${by.stem.split(' ')[0]}/${by.branch.split(' ')[0]} mencerminkan warisan leluhur dan lingkungan kelahiran. Month Pillar ${bm.stem.split(' ')[0]}/${bm.branch.split(' ')[0]} menggambarkan orangtua dan perkembangan karir di usia produktif. Day Pillar ${bd.stem.split(' ')[0]}/${bd.branch.split(' ')[0]} adalah inti kepribadianmu dan kualitas pasangan ideal. ${bh.stem!=='—'?`Hour Pillar ${bh.stem.split(' ')[0]}/${bh.branch.split(' ')[0]} menggambarkan anak-anak dan visi masa depanmu. `:''}Sebagai ${dayMaster}, kamu paling kuat ketika berada dalam lingkungan yang memperkuat elemen ${favEl}.`;

  document.getElementById('bz-shadow').textContent=`Elemen ${unfavEl} dalam excess menciptakan tekanan internal. Terlalu banyak ${unfavEl} di lingkungan hidup atau pekerjaanmu cenderung membuat kamu ${unfavEl==='Water'?'tenggelam dalam overthinking, sulit bertindak, dan energi terasa mengalir sia-sia':unfavEl==='Fire'?'burnout tanpa peringatan — api yang terlalu besar membakar diri sendiri':unfavEl==='Earth'?'stuck, sulit bergerak maju, terjebak dalam rutinitas yang menguras':unfavEl==='Metal'?'menjadi terlalu rigid, kritis berlebihan, dan menutup diri dari perubahan':'kehilangan identitas, mudah terombang-ambing tanpa arah yang jelas'}. Kurangi paparan ${unfavEl} dan perkuat ${favEl}.`;

  // ═══ HUMAN DESIGN RENDERER ═══
  const {type:hdt,auth,prof,strategy,notSelf,definedCenters,undefinedCenters,
         sunGate:sg,moonGate:mg,ascGate:ag,earthGate:eg,designGate:dg,
         pPlanetData,dPlanetData,definedChannels} = D.hd;

  // ── GATE DATA — 64 gates complete ──
  const GATE_DATA = {
    1:{name:'Kreativitas & Ekspresi Diri',kw:'Kreativitas, Kontribusi',siddhi:'Keindahan',talent:'Kesegaran',shadow:'Ketidakteraturan',center:'G',desc:'Gate ekspresi diri yang paling murni. Energi untuk mewujudkan inspirasi dan kreativitas tanpa batas.'},
    2:{name:'Reseptor / Arah Diri',kw:'Intuisi, Arah Hidup',siddhi:'Persatuan',talent:'Orientasi',shadow:'Ketidaktahuan Arah',center:'G',desc:'Gate yang menerima arah dari Higher Self. Berkaitan dengan kemampuan menavigasi hidup secara intuitif.'},
    3:{name:'Kesulitan di Awal',kw:'Mutasi, Inovasi',siddhi:'Kepolosan',talent:'Inovasi',shadow:'Kekacauan',center:'Sacral',desc:'Gate mutasi dan inovasi. Energi untuk memulai hal baru meski penuh dengan kesulitan di awal.'},
    4:{name:'Jawaban & Solusi',kw:'Formulasi, Logika',siddhi:'Pengertian',talent:'Pemahaman',shadow:'Ketidaktahuan',center:'Ajna',desc:'Gate yang mengandung potensi jawaban dan solusi logis. Kemampuan memformulasikan ide menjadi jawaban konkret.'},
    5:{name:'Pola & Aliran Alami',kw:'Ritme, Waktu',siddhi:'Omnisains',talent:'Pengulangan',shadow:'Stagnasi',center:'Sacral',desc:'Gate pola universal dan ritme alami. Berkaitan dengan kemampuan menemukan dan mengikuti alur hidup yang tepat.'},
    6:{name:'Gesekan & Kedamaian',kw:'Koneksi, Keintiman',siddhi:'Empati',talent:'Diplomasi',shadow:'Konflik',center:'Solar Plexus',desc:'Gate yang menentukan bagaimana kamu terhubung dengan orang lain secara intim dan bermakna.'},
    7:{name:'Peran Pemimpin',kw:'Kepemimpinan, Arah',siddhi:'Kebajikan',talent:'Kepemimpinan',shadow:'Otoritarianisme',center:'G',desc:'Gate kepemimpinan yang sesungguhnya. Kemampuan memimpin melalui keberanian untuk menunjukkan arah.'},
    8:{name:'Kontribusi ke Dunia',kw:'Kontribusi, Ekspresi',siddhi:'Transparansi',talent:'Gaya',shadow:'Ketidakberartian',center:'Throat',desc:'Gate ekspresi yang membawa kontribusi unik ke dunia. Tentang menemukan suara dan cara komunikasi otentikmu.'},
    9:{name:'Fokus & Detail',kw:'Determinasi, Konsentrasi',siddhi:'Empati Universal',talent:'Determinasi',shadow:'Ketidakpedulian',center:'Sacral',desc:'Gate konsentrasi dan fokus mendalam. Kemampuan untuk menyelami detail dan mempersembahkan keahlian.'},
    10:{name:'Perilaku Diri Sendiri',kw:'Cinta Diri, Identitas',siddhi:'Menjadi',talent:'Kewajaran',shadow:'Perbudakan Diri',center:'G',desc:'Gate yang paling berhubungan dengan self-love dan bagaimana kamu memperlakukan dirimu sendiri.'},
    11:{name:'Kedamaian & Gagasan',kw:'Ide, Imajinasi',siddhi:'Terang',talent:'Idealisme',shadow:'Kekosongan',center:'Ajna',desc:'Gate melimpahnya ide dan gagasan. Sumber imajinasi yang tidak pernah kering.'},
    12:{name:'Hati-hati & Perubahan',kw:'Ekspresi, Cautious',siddhi:'Kemurnian',talent:'Diskriminasi',shadow:'Kesombongan',center:'Throat',desc:'Gate yang memberi kehati-hatian dalam ekspresi. Tentang mengetahui kapan waktu tepat untuk berbicara.'},
    13:{name:'Pendengar & Saksi',kw:'Mendengarkan, Cerita',siddhi:'Empati',talent:'Persahabatan',shadow:'Masa Lalu',center:'G',desc:'Gate mendengarkan yang dalam. Kemampuan menjadi saksi dan penjaga cerita orang lain.'},
    14:{name:'Kekuatan & Kapasitas',kw:'Sumber Daya, Kemampuan',siddhi:'Kompetensi',talent:'Kompetensi',shadow:'Kompetensi',center:'Sacral',desc:'Gate kekuatan dan kapasitas. Berkaitan dengan kemampuan menggunakan sumber daya secara efektif.'},
    15:{name:'Kerendahan Hati',kw:'Ekstrem, Ritme',siddhi:'Cinta Tanpa Syarat',talent:'Magnetisme',shadow:'Kelambanan',center:'G',desc:'Gate ritme alami manusia dan aura magnetis. Tentang cinta yang mencakup semua ekstrem kehidupan.'},
    16:{name:'Keterampilan & Antusiasme',kw:'Kemampuan, Antusiasme',siddhi:'Ketidakberhinggaan',talent:'Keahlian',shadow:'Acuh Tak Acuh',center:'Throat',desc:'Gate antusiasme dan ekspresi kemampuan. Energi untuk menampilkan keahlian dengan semangat.'},
    17:{name:'Opini & Pandangan',kw:'Organis, Pendapat',siddhi:'Kemahakuasaan',talent:'Pendapat',shadow:'Ketidaktoleransian',center:'Ajna',desc:'Gate opini dan cara pandang yang terorganisir. Kemampuan untuk berpendapat secara logis.'},
    18:{name:'Koreksi & Perfeksi',kw:'Koreksi, Penilaian',siddhi:'Kesempurnaan',talent:'Integritas',shadow:'Penghakiman',center:'Spleen',desc:'Gate penilaian dan koreksi. Kemampuan melihat apa yang perlu diperbaiki untuk mencapai kesempurnaan.'},
    19:{name:'Keinginan & Keperluan',kw:'Kepekaan, Kebutuhan',siddhi:'Pengorbanan',talent:'Sensitivitas',shadow:'Kebutuhan',center:'Root',desc:'Gate kepekaan terhadap kebutuhan. Berkaitan dengan kemampuan merasakan apa yang diperlukan.'},
    20:{name:'Kontemplasi & Sekarang',kw:'Sekarang, Wawasan',siddhi:'Kehadiran',talent:'Diam',shadow:'Kekosongan',center:'Throat',desc:'Gate kehadiran di saat ini. Kemampuan untuk hidup sepenuhnya di momen sekarang.'},
    21:{name:'Kontrol Diri',kw:'Kontrol, Kekuatan',siddhi:'Penyerahan',talent:'Manajemen Diri',shadow:'Kontrol',center:'Heart',desc:'Gate kontrol dan manajemen. Kemampuan untuk mengatur dan mengarahkan sumber daya secara efisien.'},
    22:{name:'Anugerah & Kemurahan',kw:'Kasih, Keterbukaan',siddhi:'Anugerah',talent:'Kemurahan',shadow:'Kemurungan',center:'Solar Plexus',desc:'Gate keterbukaan emosional dan kemurahan hati. Kualitas yang menarik cinta dan dukungan.'},
    23:{name:'Asimilasi & Keunikan',kw:'Penjelasan, Ekspresi',siddhi:'Semua atau Tidak',talent:'Asimilasi',shadow:'Berbicara Terlalu Banyak',center:'Throat',desc:'Gate ekspresi keunikan dan perbedaan. Kemampuan untuk mengkomunikasikan ide-ide yang benar-benar berbeda.'},
    24:{name:'Rasionalisasi & Pengulangan',kw:'Pengulangan, Reformasi',siddhi:'Keheningan',talent:'Penemuan Kembali',shadow:'Keengganan',center:'Ajna',desc:'Gate pemikiran yang berulang menuju pencerahan. Proses rasionalisasi yang membawa transformasi.'},
    25:{name:'Cinta Diri Universal',kw:'Kepolosan, Semangat',siddhi:'Keuniversalan',talent:'Penerimaan',shadow:'Keegoisan',center:'G',desc:'Gate cinta universal dan kepolosan spiritual. Berkaitan dengan cinta tanpa syarat yang melampaui batas personal.'},
    26:{name:'Sang Egois & Penguat',kw:'Integritas, Memori',siddhi:'Ketidakberbentukan',talent:'Trik',shadow:'Kebanggaan',center:'Heart',desc:'Gate integritas dan kemampuan mempengaruhi. Tentang menggunakan daya pikat untuk mendapatkan apa yang diinginkan.'},
    27:{name:'Pemeliharaan & Makanan',kw:'Pemeliharaan, Altruisme',siddhi:'Kemurahan Hati',talent:'Altruisme',shadow:'Keegoisan',center:'Sacral',desc:'Gate pemeliharaan dan merawat. Energi untuk menyediakan dan merawat orang lain.'},
    28:{name:'Permainan Kehidupan',kw:'Perjuangan, Ketahanan',siddhi:'Ketanpabatasaan',talent:'Ketangguhan',shadow:'Kesia-siaan',center:'Spleen',desc:'Gate perjuangan dan ketahanan hidup. Tentang menemukan makna dalam tantangan eksistensial.'},
    29:{name:'Komitmen & Keteguhan',kw:'Komitmen, Ketekunan',siddhi:'Pengabdian',talent:'Ketekunan',shadow:'Ketidakkomitmen',center:'Sacral',desc:'Gate komitmen dan ketekunan. Energi untuk menyerahkan diri sepenuhnya pada sesuatu yang bermakna.'},
    30:{name:'Api & Perasaan',kw:'Hasrat, Perasaan',siddhi:'Keringanan',talent:'Hasrat',shadow:'Keinginan',center:'Solar Plexus',desc:'Gate hasrat dan perasaan yang menggerakkan. Tentang menghidupkan mimpi melalui api emosional.'},
    31:{name:'Pengaruh Pemimpin',kw:'Kepemimpinan, Pengaruh',siddhi:'Humilitas',talent:'Kepemimpinan',shadow:'Sombong',center:'Throat',desc:'Gate kepemimpinan demokratis. Kemampuan memimpin melalui pengaruh dan kemampuan menginspirasi.'},
    32:{name:'Kelanjutan & Perubahan',kw:'Konservasi, Transformasi',siddhi:'Keberanian',talent:'Discernment',shadow:'Ketakutan Gagal',center:'Spleen',desc:'Gate kelangsungan dan perubahan yang bijak. Tentang mengetahui apa yang perlu dipertahankan dan dilepas.'},
    33:{name:'Privasi & Ingatan',kw:'Privasi, Refleksi',siddhi:'Wahyu',talent:'Ingatan',shadow:'Penyangkalan',center:'Throat',desc:'Gate privasi dan penyimpanan ingatan. Tentang kapan waktu tepat untuk berbagi dan menarik diri.'},
    34:{name:'Kekuatan & Kesibukan',kw:'Kekuatan, Kesibukan',siddhi:'Kemahakuasaan',talent:'Kekuatan',shadow:'Kekuatan Brute',center:'Sacral',desc:'Gate kekuatan murni Sacral. Energi yang kuat namun membutuhkan respons yang tepat untuk diaktualisasikan.'},
    35:{name:'Perubahan & Kemajuan',kw:'Perubahan, Pengalaman',siddhi:'Ketanpabatasaan',talent:'Pengalaman',shadow:'Kekosongan',center:'Throat',desc:'Gate kemajuan dan hasrat akan pengalaman baru. Energi untuk terus bergerak dan berkembang.'},
    36:{name:'Kegelapan Krisis',kw:'Krisis, Kematangan',siddhi:'Welas Asih',talent:'Ketahanan Emosi',shadow:'Ketidakmampuan Emosi',center:'Solar Plexus',desc:'Gate krisis dan pematangan emosional. Tentang menemukan kebijaksanaan melalui pengalaman gelap.'},
    37:{name:'Persahabatan & Keluarga',kw:'Keakraban, Ikatan',siddhi:'Kelembutan',talent:'Kesetaraan',shadow:'Ketidaksetaraan',center:'Solar Plexus',desc:'Gate persahabatan dan ikatan keluarga. Tentang menciptakan komunitas yang didasarkan pada nilai-nilai bersama.'},
    38:{name:'Oposisi & Pejuang',kw:'Perjuangan, Determinasi',siddhi:'Honor',talent:'Determinasi',shadow:'Ketidakberhargaan',center:'Root',desc:'Gate perjuangan untuk sesuatu yang bermakna. Energi untuk melawan demi tujuan yang lebih besar.'},
    39:{name:'Provokasi & Semangat',kw:'Provokasi, Semangat',siddhi:'Kebebasan',talent:'Provokasi',shadow:'Frustrasi',center:'Root',desc:'Gate provokasi yang memicu semangat. Kemampuan untuk membangkitkan antusiasme dan gairah hidup.'},
    40:{name:'Sendirian & Penolakan',kw:'Kebebasan, Integritas',siddhi:'Ketanpabatasaan',talent:'Tekad',shadow:'Kelelahan',center:'Heart',desc:'Gate kebutuhan akan ruang dan waktu sendiri. Tentang integritas dan kemampuan mengatakan tidak.'},
    41:{name:'Fantasi & Penurunan',kw:'Imajinasi, Batas',siddhi:'Kepekaan',talent:'Antisipatif',shadow:'Fantasi',center:'Root',desc:'Gate imajinasi dan awal siklus. Energi yang mewakili potensi dan ekspektasi akan pengalaman baru.'},
    42:{name:'Pertumbuhan & Peningkatan',kw:'Penyelesaian, Pertumbuhan',siddhi:'Perayaan',talent:'Komitmen',shadow:'Setengah Hati',center:'Sacral',desc:'Gate penyelesaian dan pertumbuhan. Energi untuk membawa sesuatu ke kesimpulan yang bermakna.'},
    43:{name:'Terobosan & Kemajuan',kw:'Wawasan, Terobosan',siddhi:'Genius',talent:'Insight',shadow:'Ketidakpedulian',center:'Ajna',desc:'Gate wawasan mendalam dan terobosan. Kemampuan untuk mendapatkan pemahaman yang melompati logika biasa.'},
    44:{name:'Alarm & Pola Masa Lalu',kw:'Pola, Insting',siddhi:'Keindahan',talent:'Ketangkasan',shadow:'Ketakutan',center:'Spleen',desc:'Gate insting dan ingatan pola. Kemampuan mengenali pola yang berulang dari masa lalu.'},
    45:{name:'Raja/Ratu Berkumpul',kw:'Sinergi, Kemakmuran',siddhi:'Kemurahan Hati',talent:'Pengajaran',shadow:'Keinginan',center:'Throat',desc:'Gate kepemimpinan yang mengumpulkan dan menyinergikan. Tentang menciptakan kemakmuran bersama.'},
    46:{name:'Penentuan Diri',kw:'Cinta Tubuh, Keberuntungan',siddhi:'Ekstase',talent:'Cinta Tubuh',shadow:'Keseriusan',center:'G',desc:'Gate cinta terhadap tubuh fisik. Tentang menghargai tubuh sebagai kendaraan pengalaman hidup.'},
    47:{name:'Perwujudan & Realisasi',kw:'Transformasi, Pemahaman',siddhi:'Transfigurasi',talent:'Realisasi',shadow:'Tekanan',center:'Ajna',desc:'Gate transformasi melalui pemahaman. Tentang menemukan makna di balik pengalaman yang sulit.'},
    48:{name:'Kedalaman & Keahlian',kw:'Kedalaman, Kesiapan',siddhi:'Kebijaksanaan',talent:'Kecukupan',shadow:'Ketidakcukupan',center:'Spleen',desc:'Gate kedalaman dan keahlian. Tentang rasa takut tidak cukup siap yang mendorong penguasaan mendalam.'},
    49:{name:'Revolusi & Prinsip',kw:'Revolusi, Prinsip',siddhi:'Kelembutan',talent:'Revolusioner',shadow:'Penolakan',center:'Solar Plexus',desc:'Gate revolusi dan prinsip. Kemampuan untuk merombak yang lama demi yang lebih adil dan bermakna.'},
    50:{name:'Nilai & Tanggung Jawab',kw:'Nilai, Hukum',siddhi:'Harmoni',talent:'Tanggung Jawab',shadow:'Korupsi',center:'Spleen',desc:'Gate nilai dan hukum moral. Tentang tanggung jawab untuk menjaga standar etis yang tinggi.'},
    51:{name:'Kejutan & Inisiatif',kw:'Kejutan, Inisiatif',siddhi:'Kebangkitan',talent:'Ketangkasan',shadow:'Agresi',center:'Heart',desc:'Gate kejutan dan inisiatif. Kemampuan untuk mengambil tindakan mendadak yang mengubah situasi.'},
    52:{name:'Diam & Akumulasi',kw:'Diam, Konsentrasi',siddhi:'Keadaan Tanpa Pikiran',talent:'Pengekangan',shadow:'Kecemasan',center:'Root',desc:'Gate ketenangan dan akumulasi kekuatan. Tentang kekuatan dalam diam dan kemampuan menunggu momen tepat.'},
    53:{name:'Awal & Permulaan',kw:'Permulaan, Pengembangan',siddhi:'Kebebasan',talent:'Permulaan',shadow:'Stagnasi',center:'Root',desc:'Gate memulai siklus baru. Energi inisiasi yang membawa proyek dan fase kehidupan baru.'},
    54:{name:'Ambisi & Semangat',kw:'Ambisi, Transformasi',siddhi:'Kenaikan',talent:'Ambisi',shadow:'Ambisi',center:'Root',desc:'Gate ambisi dan dorongan material. Tentang transformasi melalui usaha keras dan keinginan untuk berkembang.'},
    55:{name:'Kelimpahan & Emosi',kw:'Emosi, Semangat',siddhi:'Kebebasan',talent:'Semangat',shadow:'Kekosongan',center:'Solar Plexus',desc:'Gate kelimpahan emosional dan spiritual. Tentang menciptakan kelimpahan melalui hubungan yang bermakna.'},
    56:{name:'Perangsang & Cerita',kw:'Stimulasi, Cerita',siddhi:'Ketenangan',talent:'Bercerita',shadow:'Kecemasan',center:'Throat',desc:'Gate stimulasi dan bercerita. Kemampuan menyampaikan cerita dan ide yang menginspirasi orang lain.'},
    57:{name:'Intuisi Lembut',kw:'Intuisi, Penembus',siddhi:'Kepahaman',talent:'Intuisi',shadow:'Ketakutan',center:'Spleen',desc:'Gate intuisi halus yang paling tajam. Kemampuan mendengarkan bisikan batin yang selalu tepat pada waktunya.'},
    58:{name:'Sukacita & Vitalitas',kw:'Vitalitas, Perbaikan',siddhi:'Kesenangan',talent:'Kegembiraan',shadow:'Ketidakbahagiaan',center:'Root',desc:'Gate vitalitas dan sukacita hidup. Energi yang membawa kegembiraan dan dorongan untuk memperbaiki.'},
    59:{name:'Seksualitas & Keintiman',kw:'Keintiman, Transparansi',siddhi:'Transparansi',talent:'Fusi',shadow:'Ketidakjujuran',center:'Sacral',desc:'Gate keintiman dan seksualitas. Kemampuan untuk menghancurkan batas-batas demi koneksi yang mendalam.'},
    60:{name:'Penerimaan & Mutasi',kw:'Batasan, Mutasi',siddhi:'Keadilan',talent:'Realisme',shadow:'Ketidakmampuan',center:'Root',desc:'Gate batasan yang mendorong mutasi. Tentang menerima keterbatasan sebagai katalis transformasi.'},
    61:{name:'Misteri & Pengetahuan',kw:'Misteri, Inspirasi',siddhi:'Keselarasan',talent:'Inspirasi',shadow:'Tekanan Mental',center:'Head',desc:'Gate misteri dan pengetahuan batin. Tentang dorongan untuk memahami hal-hal yang di luar logika.'},
    62:{name:'Detail & Pencapaian',kw:'Detail, Fakta',siddhi:'Tak Terucapkan',talent:'Presisi',shadow:'Intelektualisme',center:'Throat',desc:'Gate detail dan fakta yang presisi. Kemampuan mengekspresikan pengetahuan melalui detail yang akurat.'},
    63:{name:'Keraguan & Pertanyaan',kw:'Keraguan, Logika',siddhi:'Kebenaran',talent:'Logika',shadow:'Keraguan',center:'Head',desc:'Gate pertanyaan dan keraguan yang sehat. Kemampuan untuk mempertanyakan status quo secara logis.'},
    64:{name:'Kebingungan & Inspirasi',kw:'Kebingungan, Imajinasi',siddhi:'Iluminasi',talent:'Imajinasi',shadow:'Kebingungan',center:'Head',desc:'Gate kebingungan kreatif yang membawa inspirasi. Tentang menemukan pencerahan di balik kebingungan.'},
  };

  // ── PROFILE DATA ──
  const PROFILE_DATA = {
    '1/3':{name:'Investigator / Martyr',archetype:'Penyidik & Martir',
      desc:'Profil 1/3 adalah orang yang membangun fondasi pengetahuan yang kuat (1) melalui trial-and-error dan pengalaman langsung (3). Kamu perlu meneliti sebelum merasa aman, dan belajar paling baik dari kesalahan nyata — bukan teori.',
      line1:'Garis 1 (Investigator): Kebutuhan mendalam untuk memiliki fondasi yang solid. Kamu merasa tidak aman ketika tidak memiliki cukup informasi.',
      line2:'Garis 3 (Martyr): Belajar melalui pengalaman langsung — apa yang bekerja dan apa yang tidak. Hidupmu adalah serangkaian percobaan yang berharga.'},
    '1/4':{name:'Investigator / Opportunist',archetype:'Penyidik & Oportunis',
      desc:'Profil 1/4 menggabungkan kebutuhan akan fondasi pengetahuan (1) dengan pengaruh melalui jaringan sosial (4). Peluangmu datang melalui orang-orang yang sudah mengenalmu.',
      line1:'Garis 1 (Investigator): Fondasi pengetahuan yang kuat sebelum bertindak.',
      line2:'Garis 4 (Opportunist): Pengaruh dan peluang datang melalui jaringan pribadi yang dipercaya.'},
    '2/4':{name:'Hermit / Opportunist',archetype:'Pertapa & Oportunis',
      desc:'Profil 2/4 adalah orang yang membutuhkan waktu menyendiri (2) namun pengaruhnya datang melalui relasi (4). Kamu memiliki bakat alami yang orang lain lihat dalam dirimu sebelum kamu sendiri menyadarinya.',
      line1:'Garis 2 (Hermit): Kebutuhan akan kesendirian untuk mengisi ulang energi dan mengakses bakat alami.',
      line2:'Garis 4 (Opportunist): Pengaruh dan peluang datang dari lingkaran orang yang kamu kenal.'},
    '2/5':{name:'Hermit / Heretic',archetype:'Pertapa & Penyimpang',
      desc:'Profil 2/5 memadukan kebutuhan akan kesendirian (2) dengan proyeksi orang lain bahwa kamu adalah penyelamat (5). Ini bisa menjadi beban besar atau anugerah tergantung bagaimana kamu mengelolanya.',
      line1:'Garis 2 (Hermit): Bakat alami yang tidak selalu disadari sendiri.',
      line2:'Garis 5 (Heretic): Orang-orang memproyeksikan harapan dan solusi kepadamu — ini bisa menjadi berkah dan beban.'},
    '3/5':{name:'Martyr / Heretic',archetype:'Martir & Penyimpang',
      desc:'Profil 3/5 adalah orang yang belajar dari pengalaman nyata (3) dan memiliki kemampuan untuk menemukan solusi praktis yang bisa diterapkan secara luas (5).',
      line1:'Garis 3 (Martyr): Belajar melalui trial-and-error — hidupmu adalah laboratorium.',
      line2:'Garis 5 (Heretic): Orang melihatmu sebagai pemecah masalah dan penyelamat situasi.'},
    '3/6':{name:'Martyr / Role Model',archetype:'Martir & Teladan',
      desc:'Profil 3/6 memiliki tiga fase hidup yang jelas. Fase 1 (0-30): belajar melalui kesalahan. Fase 2 (30-50): observasi dari kejauhan. Fase 3 (50+): menjadi teladan nyata.',
      line1:'Garis 3 (Martyr): Belajar dari kesalahan nyata di awal kehidupan.',
      line2:'Garis 6 (Role Model): Pada akhirnya menjadi teladan dan contoh hidup yang otentik.'},
    '4/6':{name:'Opportunist / Role Model',archetype:'Oportunis & Teladan',
      desc:'Profil 4/6 menggabungkan pengaruh melalui jaringan (4) dengan menjadi teladan di usia matang (6). Kamu membutuhkan fondasi relasi yang kuat sebelum bisa sepenuhnya menjalankan peranmu.',
      line1:'Garis 4 (Opportunist): Semua peluang datang melalui relasi dan jaringan pribadi.',
      line2:'Garis 6 (Role Model): Pada usia matang, kamu menjadi teladan yang hidupnya berdampak luas.'},
    '4/1':{name:'Opportunist / Investigator',archetype:'Oportunis & Penyidik',
      desc:'Profil 4/1 menggabungkan pengaruh melalui relasi (4) dengan fondasi pengetahuan (1). Pengaruhmu paling kuat dalam lingkaran terdekatmu.',
      line1:'Garis 4 (Opportunist): Pengaruh melalui jaringan dan orang yang dipercaya.',
      line2:'Garis 1 (Investigator): Kebutuhan memiliki pengetahuan yang kuat sebelum bertindak.'},
    '5/1':{name:'Heretic / Investigator',archetype:'Penyimpang & Penyidik',
      desc:'Profil 5/1 adalah orang yang diproyeksikan sebagai penyelamat (5) dan memiliki fondasi pengetahuan yang kuat (1). Kamu sering dilihat sebagai praktisi yang ahli dan bisa diandalkan.',
      line1:'Garis 5 (Heretic): Orang melihatmu sebagai pemecah masalah — ekspektasi bisa sangat tinggi.',
      line2:'Garis 1 (Investigator): Fondasi pengetahuan yang kuat memberi kepercayaan diri dalam bertindak.'},
    '5/2':{name:'Heretic / Hermit',archetype:'Penyimpang & Pertapa',
      desc:'Profil 5/2 memadukan proyeksi sebagai penyelamat (5) dengan kebutuhan menyendiri (2). Kamu butuh waktu sendiri untuk mengakses bakat alami yang orang lain butuhkan dari kamu.',
      line1:'Garis 5 (Heretic): Ekspektasi tinggi dari orang lain.',
      line2:'Garis 2 (Hermit): Kebutuhan akan kesendirian untuk regenerasi dan akses bakat alami.'},
    '6/2':{name:'Role Model / Hermit',archetype:'Teladan & Pertapa',
      desc:'Profil 6/2 mengalami tiga fase: belajar (0-30), observasi (30-50), menjadi teladan (50+). Kamu membutuhkan waktu sendiri yang cukup untuk mengintegrasikan pengalaman.',
      line1:'Garis 6 (Role Model): Perjalanan menuju menjadi teladan yang otentik.',
      line2:'Garis 2 (Hermit): Kebutuhan menyendiri untuk mengakses kebijaksanaan batin.'},
    '6/3':{name:'Role Model / Martyr',archetype:'Teladan & Martir',
      desc:'Profil 6/3 belajar melalui kesalahan di awal (3), kemudian menarik diri untuk refleksi (6), lalu menjadi teladan nyata. Pengalamanmu yang kaya adalah fondasinya.',
      line1:'Garis 6 (Role Model): Potensi menjadi role model sejati setelah melewati banyak pengalaman.',
      line2:'Garis 3 (Martyr): Fondasi pengalaman nyata yang kaya melalui trial-and-error.'},
  };

  // ── AUTHORITY DATA ──
  const AUTH_DETAIL = {
    'Emotional':{icon:'🌊',name:'Emotional / Solar Plexus Authority',
      how:'Kamu membutuhkan waktu untuk membiarkan gelombang emosional berlalu sebelum membuat keputusan besar. Tidak ada kejelasan dalam saat itu juga.',
      process:'Ketika ada peluang atau keputusan penting: rasakan dulu, tidur dulu, rasakan lagi. Kejelasan datang setelah gelombang emosi naik dan turun beberapa kali.',
      mantra:'"Tidak ada kejelasan dalam saat itu juga. Aku memberi waktu untuk rasanya menetap."',
      tips:['Jangan pernah memutuskan sesuatu saat sedang emosi tinggi atau rendah','Minta waktu 24-48 jam untuk semua keputusan besar','Perhatikan: apakah kamu masih antusias setelah beberapa hari?']},
    'Sacral':{icon:'⚡',name:'Sacral Authority',
      how:'Respons Sacral-mu adalah suara kebenaran — bunyi "uh-huh" (ya) atau "unh-uh" (tidak) yang muncul dari perut, bukan dari pikiran.',
      process:'Ketika ada pertanyaan atau peluang, perhatikan respons pertama yang muncul dari tubuhmu sebelum pikiranmu mulai bekerja. Itu adalah jawaban sejatimu.',
      mantra:'"Aku percaya pada respons tubuhku — bukan analisis pikiranku."',
      tips:['Minta orang lain bertanya kepadamu dengan pertanyaan ya/tidak untuk keputusan penting','Perhatikan respons fisik spontan sebelum pikiran mengambil alih','Jika tidak ada respons Sacral, itu bukan "tidak" — mungkin belum waktunya']},
    'Splenic':{icon:'✨',name:'Splenic / Intuitive Authority',
      how:'Intuisimu bekerja dalam momen sekarang — bisikan tipis yang datang sekali dan langsung pergi. Kamu harus belajar mendengarkan dan mempercayainya.',
      process:'Bisikan Splenic tidak berulang. Ketika ada sesuatu yang tidak terasa benar atau terasa tepat secara instingtif, percayai itu — meski tidak ada alasan logis.',
      mantra:'"Aku mempercayai intuisi pertama — yang datang sebelum pikiran mengambil alih."',
      tips:['Jangan mengabaikan perasaan tidak nyaman yang muncul tiba-tiba','Intuisi Splenic beroperasi di detik ini — tidak di masa depan','Latih diri untuk bertindak atas bisikan pertama, bahkan ketika itu terasa tidak logis']},
    'Self-Projected':{icon:'💫',name:'Self-Projected / G Center Authority',
      how:'Kamu menemukan kebenaran dengan cara berbicara. Dengan mendengar dirimu sendiri berbicara tentang sesuatu, kamu menemukan apa yang benar-benar kamu rasakan.',
      process:'Bicarakan keputusan besarmu dengan orang yang kamu percaya — bukan untuk mendapat saran, tapi untuk mendengar dirimu sendiri. Kebenaran muncul dari mulutmu sendiri.',
      mantra:'"Aku menemukan kebenaranku sendiri saat aku berbicara."',
      tips:['Cari pendengar yang bisa kamu percaya dan tidak akan menghakimi','Perhatikan nada suaramu — itu mencerminkan apa yang benar-benar kamu rasakan','Jangan biarkan orang lain memberitahumu apa yang harus kamu rasakan']},
    'Ego':{icon:'💎',name:'Ego / Heart Authority',
      how:'Kamu membuat keputusan berdasarkan apa yang benar-benar kamu inginkan — bukan kewajiban atau rasa bersalah. Keinginan egomu adalah panduan yang valid.',
      process:'Tanyakan: "Apakah aku benar-benar menginginkan ini untuk diriku sendiri?" Bukan karena orang lain, bukan karena seharusnya — tapi karena kamu mau.',
      mantra:'"Apa yang sungguh-sungguh aku inginkan? Hanya itu yang penting."',
      tips:['Bedakan antara keinginan ego (valid) dan tekanan sosial (kondisioning)','Kamu tidak perlu membenarkan keinginanmu kepada siapapun','Ikuti apa yang memberimu semangat nyata, bukan apa yang seharusnya']},
    'Mental':{icon:'🔮',name:'Mental / Environmental Authority',
      how:'Tidak ada otoritas batin yang tetap — kamu membutuhkan lingkungan dan orang yang tepat untuk membuat keputusan. Lingkungan adalah pandangan aura-mu.',
      process:'Bicarakan keputusan dengan berbagai orang yang kamu percaya di berbagai lingkungan. Perhatikan di mana dan bersama siapa jawaban menjadi jernih.',
      mantra:'"Lingkungan yang tepat membawa kejelasan. Aku tidak terburu-buru."',
      tips:['Jangan membuat keputusan besar seorang diri','Perhatikan apa yang kamu katakan berulang kali kepada orang berbeda','Amati di lingkungan mana kamu merasa paling jelas dan hidup']},
    'Lunar':{icon:'🌙',name:'Lunar Authority',
      how:'Kamu butuh satu siklus bulan penuh (28-29 hari) untuk membuat keputusan besar. Setiap hari dalam siklus memberikan perspektif yang berbeda.',
      process:'Untuk setiap keputusan besar, beri waktu satu bulan. Perhatikan bagaimana perasaanmu berubah setiap hari. Keputusan yang benar akan tetap konsisten di akhir siklus.',
      mantra:'"Aku adalah cermin dari lingkunganku. Aku butuh satu bulan untuk kejelasan sejati."',
      tips:['Jangan pernah terburu-buru dalam keputusan besar','Catat bagaimana perasaanmu berubah setiap hari','Keputusan yang bertahan setelah satu siklus bulan adalah keputusan yang tepat']},
  };

  // ── TYPE DATA ──
  const TYPE_DATA = {
    'Generator':{color:'#c84040',emoji:'⚡',
      core:'Generator adalah 37% populasi dunia — tulang punggung energi Bumi. Kamu memiliki energi Sacral yang terbarukan setiap hari, tapi hanya ketika digunakan untuk hal yang benar-benar merespons.',
      strength:'Kamu bisa bekerja dalam waktu lama pada hal yang kamu cintai tanpa kelelahan. Energimu adalah hadiah terbesar untuk dunia.',
      challenge:'Memulai sesuatu dari inisiatif sendiri (bukan respons) sering menguras energi dan berujung frustrasi.',
      aura:'Aura Generator bersifat magnet dan terbuka — menarik situasi, orang, dan peluang yang tepat kepadamu.'},
    'Manifesting Generator':{color:'#e86040',emoji:'⚡🔥',
      core:'Manifesting Generator (MG) adalah hibrida Generator dan Manifestor — sekitar 33% populasi. Kamu memiliki energi Sacral yang kuat DAN kemampuan untuk langsung bergerak dari respons.',
      strength:'Kamu bisa bergerak cepat, multitasking, dan mengerjakan banyak hal sekaligus dengan efisiensi yang membuat orang lain kagum.',
      challenge:'Melewati langkah karena terlalu cepat, dan frustrasi ketika energi tidak terpakai dengan benar.',
      aura:'Aura MG adalah campuran magnetis dan impulsif — kamu menarik banyak peluang sekaligus.'},
    'Projector':{color:'#6b7fd4',emoji:'🎯',
      core:'Projector adalah 22% populasi — pemimpin alami zaman baru yang bekerja bukan dengan energi massal, tapi dengan wawasan dan pengarahan.',
      strength:'Kemampuanmu untuk melihat, membaca, dan memahami sistem dan orang lain adalah hadiah yang tidak dimiliki type lain.',
      challenge:'Kamu bukan energi being — memaksakan diri seperti Generator akan menguras dan mengecewakan.',
      aura:'Aura Projector bersifat fokus dan penetratif — masuk langsung ke inti seseorang, membuat mereka merasa benar-benar dikenal.'},
    'Manifestor':{color:'#c9a84c',emoji:'🔥',
      core:'Manifestor adalah 8% populasi — satu-satunya type yang bisa menginisiasi tanpa menunggu. Kamu adalah katalis perubahan yang sesungguhnya.',
      strength:'Kemampuan untuk memulai dan menggerakkan hal baru yang bahkan belum terpikirkan oleh orang lain.',
      challenge:'Marah ketika merasa dikontrol atau dibatasi — padahal itu biasanya respons orang terhadap aura tertutupmu.',
      aura:'Aura Manifestor bersifat tertutup dan mendorong — orang lain merasakanmu sebelum mengenalmu, yang bisa menimbulkan resistensi.'},
    'Reflector':{color:'#8b6fb5',emoji:'🌙',
      core:'Reflector adalah 1% populasi — cermin sejati komunitas dan lingkungannya. Kamu tidak memiliki center yang terdefinisi sendiri, melainkan sampel dan merefleksikan energi sekitarmu.',
      strength:'Kemampuanmu membaca lingkungan dan merasakan kesehatan komunitas adalah unik dan sangat berharga.',
      challenge:'Mudah kehilangan diri sendiri dalam energi orang lain jika tidak sadar.',
      aura:'Aura Reflector bersifat resistif dan sampling — kamu merasakan semua orang tapi tidak mudah dirasakan.'},
  };

  // ── DEFINITION DATA ──
  function getDefinitionType(definedChannels, definedCenters) {
    if(definedCenters.length === 0) return {name:'No Definition', desc:'Tidak ada center yang terdefinisi. Sangat langka.'};
    // Count connected components of defined centers
    const adj = {};
    definedCenters.forEach(c => adj[c]=[]);
    definedChannels.forEach(([,,cA,cB]) => {
      if(adj[cA] && adj[cB]) { adj[cA].push(cB); adj[cB].push(cA); }
    });
    const visited = new Set();
    let components = 0;
    definedCenters.forEach(c => {
      if(!visited.has(c)) {
        components++;
        const q=[c]; while(q.length){const n=q.pop();if(!visited.has(n)){visited.add(n);(adj[n]||[]).forEach(nb=>q.push(nb));}}
      }
    });
    if(components===1) return {name:'Single Definition',desc:'Semua center terdefinisi terhubung dalam satu jaringan. Kamu konsisten, mandiri, dan mudah dipahami energinya.'};
    if(components===2) return {name:'Split Definition',desc:'Dua jaringan center yang terpisah. Kamu mencari orang atau lingkungan yang menjembatani dua bagian ini — partner, sahabat, atau komunitas.'};
    if(components===3) return {name:'Triple Split',desc:'Tiga jaringan terpisah. Kamu sangat fleksibel dan membutuhkan berbagai tipe orang dalam hidupmu untuk merasa lengkap.'};
    return {name:'Quadruple Split',desc:'Empat jaringan terpisah. Kamu perlu waktu sendiri untuk mengintegrasikan energi yang berbeda-beda.'};
  }
  const defType = getDefinitionType(definedChannels||[], definedCenters);

  // ── CENTER DESCRIPTIONS ──
  const CENTER_DESC = {
    'Head':     {role:'Inspirasi & Tekanan Mental',desc:'Pusat inspirasi dan pertanyaan. Didefinisikan: dorongan mental konsisten. Tidak didefinisikan: mudah terpengaruh tekanan pikiran orang lain.'},
    'Ajna':     {role:'Pemrosesan Mental',desc:'Pusat pemikiran dan analisis. Didefinisikan: cara berpikir konsisten. Tidak didefinisikan: fleksibel namun tidak perlu berpikir dengan cara tertentu.'},
    'Throat':   {role:'Manifestasi & Ekspresi',desc:'Pusat ekspresi dan manifestasi. Didefinisikan: suara dan cara bicara konsisten. Tidak didefinisikan: ekspresi bervariasi berdasarkan konteks.'},
    'G':        {role:'Identitas & Arah',desc:'Pusat self-love, identitas, dan arah hidup. Didefinisikan: identitas stabil. Tidak didefinisikan: identitas fleksibel, mencari diri melalui pengalaman.'},
    'Heart':    {role:'Ego & Kemauan',desc:'Pusat kemauan dan ego. Didefinisikan: kemauan dan kapasitas berjanji yang kuat. Tidak didefinisikan: jangan berkomitmen dari tempat ego.'},
    'Solar Plexus':{role:'Emosi & Keintiman',desc:'Pusat emosi dan keintiman. Didefinisikan: sumber otoritas emosional. Tidak didefinisikan: sensitif terhadap emosi orang lain.'},
    'Sacral':   {role:'Energi Vital & Seksualitas',desc:'Pusat energi hidup. Didefinisikan: Generator — energi terbarukan. Tidak didefinisikan: Manifestor/Projector/Reflector — perlu istirahat lebih.'},
    'Spleen':   {role:'Intuisi & Kesehatan',desc:'Pusat intuisi instan dan kesehatan. Didefinisikan: intuisi kuat dan konsisten. Tidak didefinisikan: sensitif terhadap rasa sakit dan tidak nyaman.'},
    'Root':     {role:'Tekanan & Adrenalin',desc:'Pusat tekanan dan adrenalin. Didefinisikan: tekanan internal yang mendorong. Tidak didefinisikan: mudah merasakan stres dari sekitar.'},
  };
  const HD_CENTERS = ['Head','Ajna','Throat','G','Heart','Solar Plexus','Sacral','Spleen','Root'];

  // ═══ RENDER HD ═══
  const typeData = TYPE_DATA[hdt] || TYPE_DATA['Generator'];
  const profData = PROFILE_DATA[prof] || {name:prof,archetype:prof,desc:'Profil unik dengan kombinasi garis '+prof,line1:'',line2:''};
  const authData = AUTH_DETAIL[auth] || AUTH_DETAIL['Sacral'];

  // Type Hero
  document.getElementById('hd-type-hero').innerHTML = `
    <div class="hd-type-hero">
      <div style="position:absolute;top:16px;right:20px;font-size:32px;opacity:.25">${typeData.emoji}</div>
      <div style="font-family:var(--font-mono);font-size:8px;letter-spacing:.35em;color:var(--blue2);text-transform:uppercase;margin-bottom:8px">Human Design Type</div>
      <div class="hd-type-name">${hdt}</div>
      <div style="font-size:13px;color:var(--dim);line-height:1.7;margin-bottom:16px">${typeData.core}</div>
      <div class="hd-type-grid">
        <div class="hd-type-item"><div class="hd-type-item-label">Kekuatan</div><div class="hd-type-item-val" style="font-size:12px;font-weight:400;color:var(--dim)">${typeData.strength}</div></div>
        <div class="hd-type-item"><div class="hd-type-item-label">Tantangan</div><div class="hd-type-item-val" style="font-size:12px;font-weight:400;color:var(--dim)">${typeData.challenge}</div></div>
      </div>
    </div>`;

  // Core cards
  document.getElementById('hd-cards').innerHTML=[
    {l:'Type',v:hdt},{l:'Authority',v:auth},{l:'Profile',v:prof},
    {l:'Strategy',v:strategy},{l:'Not-Self',v:notSelf},{l:'Definition',v:defType.name}
  ].map(c=>`<div class="hdcard"><div class="hdlbl">${c.l}</div><div class="hdval" style="font-size:${c.v.length>14?'11px':c.v.length>10?'12px':'15px'}">${c.v}</div></div>`).join('');

  // Profile Detail
  document.getElementById('hd-profile-detail').innerHTML = `
    <div class="hd-profile-box">
      <div class="hd-profile-num">${prof}</div>
      <div class="hd-profile-name">${profData.name}</div>
      <div class="hd-profile-archetype">${profData.archetype}</div>
      <div class="hd-profile-desc">${profData.desc}</div>
    </div>
    ${profData.line1?`
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
      <div style="background:rgba(107,127,212,.08);border:1px solid rgba(107,127,212,.2);border-radius:var(--r);padding:12px">
        <div style="font-family:var(--font-mono);font-size:7px;letter-spacing:.2em;color:var(--blue2);text-transform:uppercase;margin-bottom:6px">CONSCIOUS LINE</div>
        <div style="font-size:12px;color:var(--dim);line-height:1.6">${profData.line1}</div>
      </div>
      <div style="background:rgba(107,127,212,.04);border:1px solid rgba(107,127,212,.1);border-radius:var(--r);padding:12px">
        <div style="font-family:var(--font-mono);font-size:7px;letter-spacing:.2em;color:rgba(107,127,212,.5);text-transform:uppercase;margin-bottom:6px">UNCONSCIOUS LINE</div>
        <div style="font-size:12px;color:var(--dim);line-height:1.6">${profData.line2}</div>
      </div>
    </div>`:''}`;

  // Center Grid
  document.getElementById('hd-center-grid').innerHTML = HD_CENTERS.map(c => {
    const isDef = definedCenters.includes(c);
    const cd = CENTER_DESC[c] || {role:c,desc:''};
    return `<div class="hd-center-item ${isDef?'defined':'undefined'}" title="${cd.desc}">
      <div class="hd-center-name">${c}</div>
      <div class="hd-center-status">${isDef?'Defined':'Open'}</div>
      <div style="font-size:9px;color:var(--muted);margin-top:2px;line-height:1.3">${cd.role}</div>
    </div>`;
  }).join('');

  // Channels
  const chanLabels = (definedChannels||[]).map(([a,b,cA,cB]) => {
    const ga = GATE_DATA[a]?.name.split(' ')[0]||a;
    const gb = GATE_DATA[b]?.name.split(' ')[0]||b;
    return `<div class="hd-channel-tag active">${a}-${b} <span style="opacity:.5;font-size:7px">${ga}↔${gb}</span></div>`;
  });
  document.getElementById('hd-channels').innerHTML = chanLabels.length
    ? chanLabels.join('')
    : `<div style="font-size:12px;color:var(--muted)">Tidak ada channel yang aktif dengan data yang tersedia.</div>`;

  // Definition Type
  document.getElementById('hd-definition').innerHTML = `
    <div class="hd-def-badge">${defType.name}</div>
    <div style="font-size:13px;color:var(--dim);line-height:1.75">${defType.desc}</div>`;

  // Authority Detail
  document.getElementById('hd-authority-detail').innerHTML = `
    <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px">
      <div style="font-size:36px">${authData.icon}</div>
      <div>
        <div style="font-family:var(--font-sans);font-size:16px;font-weight:600;margin-bottom:2px">${auth} Authority</div>
        <div style="font-family:var(--font-mono);font-size:8px;letter-spacing:.18em;color:var(--muted)">${authData.name}</div>
      </div>
    </div>
    <div style="font-size:13px;color:var(--dim);line-height:1.8;margin-bottom:12px">${authData.how}</div>
    <div style="background:rgba(107,127,212,.06);border:1px solid rgba(107,127,212,.2);border-radius:var(--r);padding:14px 16px;margin-bottom:12px">
      <div style="font-family:var(--font-mono);font-size:8px;letter-spacing:.25em;color:var(--blue2);text-transform:uppercase;margin-bottom:6px">CARA PROSESNYA</div>
      <div style="font-size:13px;color:var(--dim);line-height:1.75">${authData.process}</div>
    </div>
    <div style="font-family:var(--font-serif);font-size:15px;font-style:italic;color:var(--gold);margin-bottom:12px;padding-left:12px;border-left:2px solid var(--gold)">${authData.mantra}</div>
    <div style="display:flex;flex-direction:column;gap:6px">
      ${authData.tips.map(t=>`<div style="display:flex;align-items:flex-start;gap:8px;font-size:12px;color:var(--muted)"><span style="color:var(--gold);margin-top:1px">✦</span>${t}</div>`).join('')}
    </div>`;

  // Not-Self Detail
  const notSelfDesc = {
    'Frustration':'Ketika kamu bekerja pada hal-hal yang tidak merespons dalam dirimu — kamu berakhir dalam frustrasi kronis. Ini sinyal bahwa kamu keluar dari strategi.',
    'Frustration & Anger':'Frustrasi muncul dari kerja yang tidak direspons, amarah dari tidak menginformasikan orang tentang gerakanmu.',
    'Bitterness':'Kepahitan muncul ketika Projector bekerja tanpa undangan dan tidak diakui kemampuannya.',
    'Anger':'Amarah Manifestor datang dari merasa dikontrol atau dibatasi dalam inisiasinya.',
    'Disappointment':'Kekecewaan Reflector datang dari lingkungan yang tidak sehat atau harapan yang tidak realistis.'
  };
  const shadowText = D.HD_SHADOW[hdt] || '';
  document.getElementById('hd-notself-detail').innerHTML = `
    <div style="background:rgba(196,96,74,.05);border:1px solid rgba(196,96,74,.2);border-radius:var(--r);padding:16px;margin-bottom:14px">
      <div style="font-family:var(--font-mono);font-size:8px;letter-spacing:.25em;color:var(--red);text-transform:uppercase;margin-bottom:8px">NOT-SELF THEME</div>
      <div style="font-family:var(--font-serif);font-size:22px;color:var(--red);margin-bottom:8px">${notSelf}</div>
      <div style="font-size:13px;color:rgba(237,232,223,.55);line-height:1.75">${notSelfDesc[notSelf]||''}</div>
    </div>
    <div style="margin-bottom:14px">
      <div style="font-family:var(--font-mono);font-size:8px;letter-spacing:.25em;color:var(--gold);text-transform:uppercase;margin-bottom:8px">AURA TYPE</div>
      <div style="font-size:13px;color:var(--dim);line-height:1.75">${typeData.aura}</div>
    </div>
    ${shadowText?`<div style="background:rgba(196,96,74,.04);border:1px solid rgba(196,96,74,.15);border-radius:var(--r);padding:14px">
      <div style="font-family:var(--font-mono);font-size:8px;letter-spacing:.2em;color:var(--red);text-transform:uppercase;margin-bottom:6px">SHADOW PATTERN</div>
      <div style="font-size:13px;color:rgba(237,232,223,.5);line-height:1.8">${shadowText}</div>
    </div>`:''}`;

  // Planet Gate Tables
  function renderPlanetTable(planets, containerId) {
    document.getElementById(containerId).innerHTML = `
      <div>${planets.map(p => {
        const gd = GATE_DATA[p.gate];
        const isActive = (definedChannels||[]).some(([a,b])=>a===p.gate||b===p.gate);
        return `<div class="hd-planet-row">
          <div class="hd-planet-sym">${p.sym}</div>
          <div class="hd-planet-name">${p.name}</div>
          <div style="display:flex;align-items:center;gap:6px">
            <div class="hd-planet-gate" style="color:${p.type==='conscious'?'var(--blue2)':'rgba(107,127,212,.5)'}">${p.gate}</div>
            <div style="font-size:11px;color:${isActive?'var(--gold)':'var(--muted)'}">
              ${gd?gd.name:'—'}
              ${isActive?'<span style="font-family:var(--font-mono);font-size:7px;background:rgba(201,168,76,.15);color:var(--gold);padding:1px 5px;border-radius:2px;margin-left:4px">ACTIVE</span>':''}
            </div>
          </div>
          <div class="hd-planet-line">L${p.line}</div>
          <div class="hd-planet-col">C${p.col}</div>
        </div>`;
      }).join('')}</div>`;
  }
  renderPlanetTable(pPlanetData, 'hd-pgates');
  renderPlanetTable(dPlanetData, 'hd-dgates');

  // Gate Detail Cards — unique active gates
  const activeGates = [...new Set([
    ...pPlanetData.map(p=>({gate:p.gate,line:p.line,col:p.col,type:'conscious',sym:p.sym,planet:p.name})),
    ...dPlanetData.map(p=>({gate:p.gate,line:p.line,col:p.col,type:'unconscious',sym:p.sym,planet:p.name}))
  ].sort((a,b)=>a.gate-b.gate))];
  // deduplicate by gate
  const seenGates = new Set();
  const uniqueGates = activeGates.filter(g => { if(seenGates.has(g.gate)) return false; seenGates.add(g.gate); return true; });

  document.getElementById('hd-gate-detail-cards').innerHTML = uniqueGates.map(g => {
    const gd = GATE_DATA[g.gate] || {name:`Gate ${g.gate}`,kw:'',siddhi:'',talent:'',shadow:'',desc:'',center:''};
    const isConscious = pPlanetData.some(p=>p.gate===g.gate);
    const isUnconscious = dPlanetData.some(p=>p.gate===g.gate);
    const isActive = (definedChannels||[]).some(([a,b])=>a===g.gate||b===g.gate);
    return `<div class="hd-gate-card" id="hdgate-${g.gate}">
      <div class="hd-gate-card-header" onclick="toggleHDGate(${g.gate})">
        <div class="hd-gate-num ${isConscious?'conscious':'unconscious'}">${g.gate}</div>
        <div class="hd-gate-info">
          <div class="hd-gate-name">${gd.name}
            ${isActive?'<span style="font-family:var(--font-mono);font-size:7px;background:rgba(107,127,212,.2);color:var(--blue2);padding:1px 6px;border-radius:2px;margin-left:6px">CHANNEL</span>':''}
          </div>
          <div class="hd-gate-keywords">${gd.kw||''} · Center: ${gd.center||'—'}</div>
        </div>
        <div class="hd-gate-planet">
          <div style="font-size:14px;opacity:.7">${isConscious?'●':'○'} ${isUnconscious?'◗':''}</div>
          <div style="font-size:9px;margin-top:2px">L${g.line}.C${g.col}</div>
        </div>
      </div>
      <div class="hd-gate-body">
        <div class="hd-gate-line-badge">Line ${g.line} · Column ${g.col}</div>
        <div style="font-size:13px;color:var(--dim);line-height:1.8;margin-bottom:12px">${gd.desc}</div>
        <div class="hd-gate-siddhi-row">
          <div class="hd-gate-siddhi-item"><div class="hd-gate-siddhi-lbl">Siddhi</div><div class="hd-gate-siddhi-val" style="color:var(--gold)">${gd.siddhi||'—'}</div></div>
          <div class="hd-gate-siddhi-item"><div class="hd-gate-siddhi-lbl">Talent / Gift</div><div class="hd-gate-siddhi-val" style="color:var(--green)">${gd.talent||'—'}</div></div>
          <div class="hd-gate-siddhi-item"><div class="hd-gate-siddhi-lbl">Shadow</div><div class="hd-gate-siddhi-val" style="color:var(--red)">${gd.shadow||'—'}</div></div>
        </div>
        <div style="margin-top:10px;padding:10px 12px;background:var(--s1);border-radius:var(--r);font-family:var(--font-mono);font-size:8px;color:var(--muted);line-height:1.6">
          ${isConscious?`<div>● <span style="color:var(--blue2)">Conscious</span> — kamu SADAR memiliki energi ini</div>`:''}
          ${isUnconscious?`<div>◗ <span style="color:rgba(107,127,212,.5)">Unconscious</span> — energi ini bekerja di balik kesadaranmu</div>`:''}
          ${isActive?`<div style="margin-top:4px;color:var(--gold)">✦ Gate ini membentuk Channel aktif</div>`:''}
        </div>
      </div>
    </div>`;
  }).join('');

  window.toggleHDGate = function(n) {
    const card = document.getElementById('hdgate-'+n);
    if(card) card.classList.toggle('open');
  };

  const allHDGatesForBodygraph = [...new Set([...pPlanetData.map(p=>p.gate),...dPlanetData.map(p=>p.gate)])];
  setTimeout(()=>renderHDBodygraph(document.getElementById('hdBodgraphSVG'), definedCenters, allHDGatesForBodygraph, hdt), 200);

  // ZI WEI
  const {main:zwMain,life:zwLife,career:zwCar,wealth:zwWlt}=D.zw;
  document.getElementById('zw-title').textContent=zwMain.split(' ').slice(1).join(' ');
  document.getElementById('zw-sub').textContent=`${zwMain} · Life Palace ${zwLife+1}`;
  document.getElementById('zw-palaces').innerHTML=ZW_PAL.map((p,i)=>{
    const isL=i===zwLife,isC=i===zwCar,isW=i===zwWlt;
    const zStar = isL ? ('<div class="zwps">'+zwMain.split(' ').slice(1).join(' ')+'</div>') : '';
    const zIcon = isL?'★ ':isC?'◆ ':isW?'● ':'';
    const zStyle = isC?'color:var(--blue2)':isW?'color:var(--green)':'';
    return '<div class="zwp '+(isL?'main':'')+'" onclick="zwClick('+i+')"><div class="zwpn" style="'+zStyle+'">'+zIcon+p+'</div>'+zStar+'</div>';
  }).join('');
  document.getElementById('zw-desc').textContent=`Zi Wei Dou Shu menempatkan ${zwMain} dalam Life Palace ${zwLife+1}. Ini mendefinisikan aura dan energi inti yang kamu bawa dalam perjalanan hidup. Career Palace (${ZW_PAL[zwCar]}) di posisi ${zwCar+1} menentukan area kerja dan ambisi. Wealth Palace (${ZW_PAL[zwWlt]}) di posisi ${zwWlt+1} mengatur bagaimana kamu berhubungan dengan materi dan resources.`;
  document.getElementById('zw-insight').textContent=`Bintang ${zwMain.split(' ')[1]} dalam Life Palace mengindikasikan seseorang yang hidupnya ditandai oleh ${zwMain.includes('Purple')?'kehadiran natural dalam posisi authority dan leadership':zwMain.includes('Sun')?'visibilitas tinggi, pengaruh yang meluas, menjadi sumber cahaya bagi sekitarnya':zwMain.includes('Moon')?'intuisi kuat dan kemampuan memengaruhi secara emosional yang dalam':zwMain.includes('Wolf')?'kemampuan menarik dan daya pikat yang sangat kuat dan sulit diabaikan':zwMain.includes('Vault')?'keberuntungan material yang datang melalui kombinasi usaha tepat dan timing':'kemampuan unik yang menjadi signature tak tergantikan di dunia'}.`;
  setTimeout(()=>drawZiWei(document.getElementById('zwC'), zwLife, zwCar, zwWlt), 200);

  // ═══ NUMEROLOGY RENDERER ═══
  const N = D.numerology;
  const {lp:nlp,dest:ndest,soul:nsoul,pers:npers,birthday:nbday,attitude:natt,
         personalYear:npy,personalMonth:npm,
         pin1:np1,pin2:np2,pin3:np3,pin4:np4,pinAge1:na1,pinAge2:na2,pinAge3:na3,
         ch1:nc1,ch2:nc2,ch3:nc3,ch4:nc4,karmicLessons:nkl,
         lpMonth:nlpm,lpDay:nlpd,lpYear:nlpy,lpRawSum:nlpraw,lpKarmic,lpIsMaster,
         destObj,soulObj,persObj,destKarmic,soulKarmic,
         nameFirst,nameMiddle,nameLast,nFirst,nMiddle,nLast,
         LP_MEANING,DEST_MEANING,SOUL_MEANING,PERS_MEANING,PY_MEANING,BIRTHDAY_DESC,LP_SHADOW} = N;

  function numLabel(n) {
    return (n===11||n===22||n===33)?`<span class="nx-master">MASTER</span>`:'';
  }
  function numKarmic(k) {
    return k?`<span class="nx-karmic">KARMIC ${k}</span>`:'';
  }
  function numRawStr(obj) {
    if(!obj||!obj.parts||obj.parts.length===0) return '';
    const partsStr = obj.parts.join(' + ');
    return `${partsStr} = ${obj.raw}${obj.raw!==obj.n?' → '+obj.n:''}`;
  }

  // ── Detailed LP meaning data ──
  const LP_DETAIL = {
    1:{arch:'The Leader',traits:[{i:'⚡',n:'Kemandirian',d:'Dorongan kuat untuk berdiri sendiri dan memimpin dengan visi unik'},{i:'🎯',n:'Ambisi',d:'Tujuan yang jelas dan tekad untuk mewujudkannya tanpa kompromi'},{i:'💡',n:'Orisinalitas',d:'Cara berpikir yang segar dan berani mencoba hal yang belum pernah ada'},{i:'🔥',n:'Inisiasi',d:'Energi untuk memulai — kamu adalah yang pertama melangkah'}],core:'Hidupmu adalah perjalanan menuju kemandirian sejati. Kamu lahir dengan energi pioneer — kemampuan untuk memulai sesuatu yang belum pernah ada sebelumnya. Tapi ini bukan tentang ego; ini tentang visi yang cukup kuat untuk dibawa sendiri.',gift:'Kamu bisa melihat kemungkinan di mana orang lain melihat jalan buntu. Keberanianmu menginspirasi orang lain untuk percaya pada mimpi mereka sendiri.',challenge:'Kesulitan bekerja dalam tim dan menerima masukan bisa mengisolasidan melemahkan bahkan visi terkuat sekalipun.'},
    2:{arch:'The Diplomat',traits:[{i:'🤝',n:'Empati',d:'Kemampuan merasakan apa yang orang lain rasakan sebelum mereka mengucapkannya'},{i:'⚖️',n:'Keseimbangan',d:'Bakat alami menciptakan harmoni di antara pihak-pihak yang bertentangan'},{i:'👂',n:'Mendengarkan',d:'Kapasitas mendengar yang dalam — orang merasa benar-benar didengar olehmu'},{i:'🌙',n:'Intuisi',d:'Kepekaan batin yang menangkap sinyal halus yang luput dari kebanyakan orang'}],core:'Kekuatanmu bukan dalam ukuran, tapi dalam kedalaman. Di mana orang lain memaksakan, kamu membujuk. Di mana orang lain berbicara, kamu mendengarkan. Ini adalah kekuatan yang sering diremehkan — dan itulah yang membuatnya lebih efektif.',gift:'Kemampuanmu menciptakan ruang aman di mana orang bisa jujur adalah hadiah langka. Relasimulah karya agungmu.',challenge:'Terlalu banyak mengakomodasi kebutuhan orang lain bisa membuatmu kehilangan suaramu sendiri secara perlahan.'},
    3:{arch:'The Creator',traits:[{i:'🎨',n:'Kreativitas',d:'Imajinasi yang mengalir dan kemampuan mengekspresikannya dalam banyak medium'},{i:'✨',n:'Karisma',d:'Kehadiran yang membuat ruangan terasa lebih hidup saat kamu masuk'},{i:'🗣️',n:'Komunikasi',d:'Kata-kata adalah senjata dan obatmu — kamu tahu persis bagaimana mereka bekerja'},{i:'😄',n:'Optimisme',d:'Kemampuan menemukan cahaya bahkan di ruang paling gelap'}],core:'Kamu dilahirkan untuk menciptakan dan menginspirasi. Ekspresimu — dalam seni, kata, atau kehadiran — adalah kontribusi terbesarmu. Dunia menjadi lebih berwarna karena kamu ada di dalamnya.',gift:'Kemampuanmu mengangkat semangat orang lain dan mengekspresikan kebenaran lewat kreativitas adalah kekuatan yang mengubah dunia.',challenge:'Energi yang tersebar dan kesulitan menyelesaikan apa yang sudah dimulai bisa menghalangi potensi besarmu terwujud.'},
    4:{arch:'The Builder',traits:[{i:'🏗️',n:'Struktur',d:'Kemampuan membangun sistem yang bisa bertahan melampaui dirimu sendiri'},{i:'📋',n:'Disiplin',d:'Konsistensi dan ketekunan yang mengubah visi menjadi kenyataan konkret'},{i:'🔍',n:'Detail',d:'Perhatian pada hal kecil yang membuat perbedaan besar dalam hasil akhir'},{i:'🪨',n:'Keandalan',d:'Orang tahu mereka bisa bergantung padamu — kamu adalah batu pijakan mereka'}],core:'Kamu adalah fondasi yang membuat semuanya berdiri. Sementara orang lain bermimpi, kamu membangun. Nilai terbesarmu bukan dalam kecepatan, tapi dalam ketahanan apa yang kamu ciptakan.',gift:'Kemampuanmu mengubah ide abstrak menjadi struktur nyata yang bertahan adalah kontribusi yang tak ternilai.',challenge:'Kekakuan dan resistensi terhadap perubahan bisa menahan potensimu di saat dunia membutuhkan fleksibilitas.'},
    5:{arch:'The Free Spirit',traits:[{i:'🌊',n:'Adaptabilitas',d:'Kemampuan bernavigasi di berbagai situasi dan lingkungan dengan mudah'},{i:'🗺️',n:'Petualangan',d:'Dorongan konstan untuk menjelajahi, menemukan, dan mengalami hal baru'},{i:'🔄',n:'Perubahan',d:'Tidak hanya menerima perubahan — kamu menjadi agen perubahan itu sendiri'},{i:'🎭',n:'Fleksibilitas',d:'Kemampuan melihat banyak sisi dan beradaptasi pada konteks yang berbeda'}],core:'Kamu adalah personifikasi kebebasan dan perubahan. Hidupmu dirancang untuk bergerak, mengalami, dan membawa angin segar ke mana pun kamu pergi. Stagnasi bukan pilihan — itu adalah slow death bagimu.',gift:'Kemampuanmu menggerakkan energi yang macet dan membawa perspektif baru membuat kamu tak tergantikan dalam situasi yang membutuhkan terobosan.',challenge:'Komitmen dan konsistensi jangka panjang bisa terasa seperti penjara — tapi itu justru yang akan membuat impianmu menjadi nyata.'},
    6:{arch:'The Nurturer',traits:[{i:'❤️',n:'Kasih Sayang',d:'Kapasitas cinta yang dalam dan tulus yang menyembuhkan orang di sekitarmu'},{i:'🏠',n:'Tanggung Jawab',d:'Bakat alami mengambil tanggung jawab dan membuat segalanya berjalan'},{i:'🌸',n:'Keindahan',d:'Kepekaan estetis yang menciptakan keindahan dalam setiap ruang yang kamu sentuh'},{i:'🛡️',n:'Proteksi',d:'Insting kuat untuk melindungi mereka yang rentan dan membutuhkan'}],core:'Hidupmu adalah tentang cinta dalam tindakan nyata. Kamu paling bahagia saat orang di sekitarmu baik-baik saja. Tapi ini bukan kelemahan — ini adalah kekuatan terbesar yang seringkali disalahpahami.',gift:'Kemampuanmu menciptakan rumah yang aman — secara fisik dan emosional — di mana orang bisa tumbuh adalah warisan yang tidak ternilai.',challenge:'Kecenderungan mengutamakan semua orang kecuali diri sendiri bisa menjadi sumber kelelahan yang mendalam dan tak terlihat.'},
    7:{arch:'The Seeker',traits:[{i:'🔭',n:'Analisis',d:'Kemampuan berpikir mendalam dan menemukan pola yang tersembunyi di balik permukaan'},{i:'🧘',n:'Spiritualitas',d:'Koneksi alami dengan dimensi yang melampaui yang terlihat mata'},{i:'📚',n:'Pengetahuan',d:'Dorongan tanpa henti untuk memahami — bukan sekadar tahu, tapi sungguh mengerti'},{i:'🌀',n:'Intuisi Dalam',d:'Kebijaksanaan batin yang sering terbukti lebih akurat dari data apapun'}],core:'Kamu adalah pencari kebenaran. Hidupmu adalah perjalanan ke dalam — ke dalam pikiran, ke dalam makna, ke dalam misteri yang membuat eksistensi ini lebih dari sekadar rutinitas.',gift:'Kemampuanmu menembus permukaan dan menyentuh inti dari sesuatu memberi orang di sekitarmu perspektif yang mengubah cara mereka melihat dunia.',challenge:'Isolasi dan ketidakpercayaan pada orang lain bisa membuat kamu memenangkan pertarungan intelektual sambil kehilangan peperangan relasional.'},
    8:{arch:'The Powerhouse',traits:[{i:'💎',n:'Ambisi',d:'Visi besar yang didukung oleh kapasitas eksekusi yang jarang dimiliki orang lain'},{i:'⚡',n:'Kepemimpinan',d:'Kemampuan menggerakkan sumber daya dan orang menuju tujuan yang bermakna'},{i:'🏆',n:'Pencapaian',d:'Dorongan untuk menghasilkan sesuatu yang nyata dan terukur'},{i:'🔑',n:'Otoritas',d:'Kehadiran alami yang membuat orang secara instingtif mempercayai kemampuanmu'}],core:'Kamu datang untuk membangun kekuatan yang nyata — bukan untuk dipamerkan, tapi untuk digunakan. Energimu dirancang untuk menciptakan sesuatu yang berdampak besar di dunia materi.',gift:'Kemampuanmu mengubah visi menjadi realitas yang terukur dan membawa orang lain ke level yang lebih tinggi adalah kekuatan yang langka.',challenge:'Obsesi pada kontrol dan kesuksesan material bisa membuatmu sukses di dunia luar sambil kosong di dalam.'},
    9:{arch:'The Humanitarian',traits:[{i:'🌍',n:'Welas Asih',d:'Kapasitas empati yang melampaui batas personal dan menyentuh kemanusiaan luas'},{i:'🎭',n:'Kebijaksanaan',d:'Pemahaman tentang kompleksitas hidup yang datang dari banyak pengalaman'},{i:'✨',n:'Inspirasi',d:'Kemampuan menyentuh hati dan menggerakkan orang menuju sesuatu yang lebih besar'},{i:'🔄',n:'Pelepasan',d:'Kemampuan melepas dan mengakhiri siklus dengan anggun dan bermakna'}],core:'Kamu adalah puncak dari siklus numerologi — yang paling luas dalam kapasitas empati dan welas asih. Hidupmu adalah tentang memberikan kembali apa yang telah kamu pelajari lewat semua pengalaman.',gift:'Kemampuanmu melihat kemanusiaan dalam setiap orang dan menjembatani perbedaan membuat kamu menjadi kekuatan pemersatu yang kuat.',challenge:'Memberi terlalu banyak tanpa batas bisa membuatmu kehilangan dirimu sendiri dalam upaya menyelamatkan orang lain.'},
    11:{arch:'The Intuitive Master',traits:[{i:'⚡',n:'Intuisi Tinggi',d:'Kepekaan yang melampaui logika — kamu tahu hal-hal sebelum ada alasan untuk mengetahuinya'},{i:'💫',n:'Inspirasi',d:'Kapasitas untuk menyalakan sesuatu dalam diri orang lain yang tidak mereka tahu ada'},{i:'🌙',n:'Sensitivitas',d:'Antenna emosional yang sangat halus terhadap energi, suasana, dan ketidakjujuran'},{i:'🔮',n:'Visi',d:'Kemampuan melihat potensi dan kemungkinan yang jauh melampaui konteks saat ini'}],core:'Angka 11 bukan sekadar 2 yang lebih kuat — ini adalah frekuensi berbeda. Kamu dilahirkan di perbatasan antara manusia biasa dan sesuatu yang lebih. Sensitif, intuitif, dan sering merasa terlalu banyak di dunia ini.',gift:'Kemampuanmu menjadi kanal — menyampaikan kebenaran, inspirasi, dan penyembuhan yang melampaui pemahamanmu sendiri adalah kapasitas master yang langka.',challenge:'Beban intensitas emosional dan ekspektasi tinggi (dari diri sendiri dan orang lain) bisa menjadi sumber kecemasan yang melemahkan.'},
    22:{arch:'The Master Builder',traits:[{i:'🏗️',n:'Visi Besar',d:'Kemampuan melihat dan memahami sistem dalam skala yang jauh melampaui yang lain'},{i:'⚡',n:'Kekuatan Praktis',d:'Tidak hanya bermimpi besar — tapi punya kapasitas untuk mewujudkannya di dunia nyata'},{i:'🌍',n:'Dampak Global',d:'Apa yang kamu bangun berpotensi menyentuh kehidupan banyak orang'},{i:'💎',n:'Disiplin Master',d:'Komitmen pada standar tertinggi yang tidak berkompromi dengan yang biasa-biasa'}],core:'22 adalah angka terkuat dalam numerologi — Master Builder yang mampu mewujudkan impian terbesar menjadi kenyataan yang bertahan. Tapi kekuatan ini datang dengan tanggung jawab yang berat.',gift:'Kapasitasmu untuk membangun sistem, gerakan, atau karya yang melampaui hidup satu manusia adalah hadiah yang sesungguhnya langka.',challenge:'Beban ekspektasi dan skala tanggung jawab yang kamu pikul bisa menjadi sangat berat — belajar meminta bantuan bukan kelemahan, itu kebijaksanaan.'},
    33:{arch:'The Master Teacher',traits:[{i:'❤️‍🔥',n:'Cinta Tanpa Syarat',d:'Kapasitas mencintai yang melampaui kondisi, kesalahan, dan batasan personal'},{i:'✨',n:'Penyembuhan',d:'Kehadiran yang secara alami menyembuhkan luka orang lain hanya dengan ada'},{i:'🎓',n:'Pengajaran',d:'Kemampuan menyampaikan kebenaran mendalam dengan cara yang mudah dimengerti'},{i:'🌟',n:'Pengabdian',d:'Hidup yang diorientasikan pada sesuatu yang lebih besar dari kepentingan pribadi'}],core:'33 adalah angka tertinggi — Master Teacher yang hidupnya adalah pengabdian pada kemanusiaan. Ini bukan tentang kesempurnaan, tapi tentang ketulusan dalam memberi.',gift:'Kemampuanmu menyentuh kehidupan orang di level terdalam dan memandu mereka menuju pemahaman yang lebih tinggi adalah kontribusi yang melampaui kata.',challenge:'Kecenderungan mengabaikan kebutuhan diri sendiri demi melayani semua orang bisa berujung pada kelelahan yang merusak kapasitas utamamu untuk memberi.'}
  };

  const coreCards = [
    {id:'lp', l:'Life Path', n:nlp, raw:`${nlpm} + ${nlpd} + ${nlpy} = ${nlpraw}`, m:LP_MEANING[nlp]||'', karmic:lpKarmic},
    {id:'dest', l:'Expression / Destiny', n:ndest, raw:numRawStr(destObj), m:DEST_MEANING[ndest]||'', karmic:destKarmic},
    {id:'soul', l:'Heart\'s Desire / Soul Urge', n:nsoul, raw:numRawStr(soulObj), m:SOUL_MEANING[nsoul]||'', karmic:soulKarmic},
    {id:'pers', l:'Personality', n:npers, raw:numRawStr(persObj), m:PERS_MEANING[npers]||'', karmic:null},
    {id:'bday', l:'Birthday', n:nbday, raw:`Day ${dy}`, m:BIRTHDAY_DESC[nbday]||'', karmic:null},
    {id:'att', l:'Attitude / Sun', n:natt, raw:`${mo} + ${dy} = ${mo+dy}`, m:'Kesan pertama & pendekatan hidup', karmic:null},
  ];

  document.getElementById('num-cards').innerHTML = coreCards.map(c=>`
    <div class="nxcard" onclick="showNumDetail('${c.id}')" id="nxcard-${c.id}">
      <div class="nxbg">${c.n}</div>
      <div class="nxlbl">${c.l}</div>
      <div class="nxnum">${c.n}${numLabel(c.n)}${numKarmic(c.karmic)}</div>
      <div class="nxnum-raw" style="font-family:var(--font-mono);font-size:8px;color:rgba(201,168,76,.45);margin-bottom:3px">${c.raw}</div>
      <div class="nxm">${c.m}</div>
    </div>`).join('');

  // ── DETAIL DATA ──
  const numDetailData = {
    lp: {
      n: nlp, label:'Life Path Number', subtitle:'Jalur Hidup — Misi Terdalam',
      archetype: LP_DETAIL[nlp]?.arch || LP_MEANING[nlp],
      core: LP_DETAIL[nlp]?.core || `Life Path ${nlp} membentuk cara kamu menavigasi keputusan terbesar hidupmu.`,
      gift: LP_DETAIL[nlp]?.gift || '',
      challenge: LP_DETAIL[nlp]?.challenge || LP_SHADOW[nlp] || '',
      shadow: LP_SHADOW[nlp] || '',
      traits: LP_DETAIL[nlp]?.traits || [],
      calcTitle:'Cara Kalkulasi Life Path (3-Cycle Method)',
      calcHTML:`
        <div class="num-calc-row">
          <span style="color:var(--muted)">Month</span><span class="num-calc-eq">=</span>
          <span style="color:var(--gold)">${mo}</span>
          <span class="num-calc-eq">→</span>
          <span class="num-calc-result">${nlpm}${nlpm===11||nlpm===22||nlpm===33?'<span class="nx-master" style="font-size:6px;padding:1px 4px">M</span>':''}</span>
        </div>
        <div class="num-calc-row">
          <span style="color:var(--muted)">Day</span><span class="num-calc-eq">=</span>
          <span style="color:var(--gold)">${dy}</span>
          <span class="num-calc-eq">→</span>
          <span class="num-calc-result">${nlpd}${nlpd===11||nlpd===22||nlpd===33?'<span class="nx-master" style="font-size:6px;padding:1px 4px">M</span>':''}</span>
        </div>
        <div class="num-calc-row">
          <span style="color:var(--muted)">Year</span><span class="num-calc-eq">=</span>
          <span style="color:var(--gold)">${yr}</span>
          <span class="num-calc-eq">→ ${yr.toString().split('').join('+')} = ${yr.toString().split('').reduce((a,b)=>a+Number(b),0)} →</span>
          <span class="num-calc-result">${nlpy}</span>
        </div>
        <div style="border-top:1px solid var(--b1);margin:8px 0;padding-top:8px" class="num-calc-row">
          <span style="color:var(--dim)">${nlpm} + ${nlpd} + ${nlpy}</span>
          <span class="num-calc-eq">=</span>
          <span style="color:var(--text)">${nlpraw}</span>
          <span class="num-calc-eq">→</span>
          <span class="num-calc-result" style="font-size:24px">${nlp}</span>
          ${lpKarmic?`<span style="font-family:var(--font-mono);font-size:8px;color:var(--red);margin-left:8px">Karmic Debt ${lpKarmic}</span>`:''}
          ${lpIsMaster?`<span class="nx-master" style="margin-left:8px">MASTER NUMBER</span>`:''}
        </div>
        <div style="font-family:var(--font-mono);font-size:9px;color:var(--muted);margin-top:8px;line-height:1.6">Master Numbers 11, 22, dan 33 tidak direduksi lebih lanjut dalam kalkulasi ini mengikuti metode Pythagorean standar.</div>`
    },
    dest: {
      n: ndest, label:'Expression / Destiny Number', subtitle:'Ekspresi Diri — Apa yang Harus Dicapai',
      archetype:'Ekspresi ' + (ndest===11?'Master Intuitif':ndest===22?'Master Builder':ndest===33?'Master Teacher':`Angka ${ndest}`),
      core:`Expression Number ${ndest} menggambarkan bakat alami, kemampuan, dan potensi yang kamu bawa sejak lahir — apa yang seharusnya kamu lakukan dan capai dalam hidup ini. Ini derived dari NAMA LENGKAP lahir menggunakan tabel Pythagorean.`,
      gift: DEST_MEANING[ndest] || '',
      challenge:`Tantangan Expression ${ndest}: memastikan jalur hidupmu selaras dengan ekspresi alami ini, bukan melawannya.`,
      shadow:'',
      traits:[],
      calcTitle:'Kalkulasi Expression Number (Semua Huruf Nama)',
      calcHTML: buildNameCalcHTML(nameFirst,nameMiddle,nameLast,nFirst,nMiddle,nLast,'all',destObj)
    },
    soul: {
      n: nsoul, label:"Heart's Desire / Soul Urge", subtitle:'Dorongan Jiwa — Apa yang Paling Kamu Inginkan',
      archetype:'Soul Urge ' + (nsoul===11?'Master Intuitif':nsoul===22?'Master Builder':nsoul===33?'Master Teacher':`Angka ${nsoul}`),
      core:`Soul Urge ${nsoul} mengungkap motivasi terdalam — apa yang benar-benar menggerakkanmu dari dalam, yang sering tersembunyi dari dunia luar. Ini derived dari VOKAL dalam nama lengkah lahir.`,
      gift: SOUL_MEANING[nsoul] || '',
      challenge:`Saat Soul Urge-mu tidak terpenuhi, kamu akan merasa ada sesuatu yang hilang meski secara luar segalanya terlihat baik.`,
      shadow:'',
      traits:[],
      calcTitle:"Kalkulasi Soul Urge (Vokal Saja: A E I O U)",
      calcHTML: buildNameCalcHTML(nameFirst,nameMiddle,nameLast,nFirst,nMiddle,nLast,'vowels',soulObj)
    },
    pers: {
      n: npers, label:'Personality Number', subtitle:'Kepribadian Publik — Bagaimana Orang Melihatmu',
      archetype:'Personality ' + `Angka ${npers}`,
      core:`Personality Number ${npers} adalah "baju" yang kamu kenakan di dunia — kesan pertama yang kamu tinggalkan dan persona publik yang kamu proyeksikan. Ini derived dari KONSONAN dalam nama lahir.`,
      gift: PERS_MEANING[npers] || '',
      challenge:`Pastikan Personality Number-mu adalah cerminan otentik dirimu, bukan topeng yang kamu pakai untuk memenuhi ekspektasi orang lain.`,
      shadow:'',
      traits:[],
      calcTitle:'Kalkulasi Personality Number (Konsonan Saja)',
      calcHTML: buildNameCalcHTML(nameFirst,nameMiddle,nameLast,nFirst,nMiddle,nLast,'consonants',persObj)
    },
    bday:{
      n:nbday, label:'Birthday Number', subtitle:'Angka Hari Lahir — Bakat Spesifik',
      archetype:`Birthday ${dy} → ${nbday}`,
      core:`Birthday Number ${nbday} adalah hadiah khusus yang dibawa hari kelahiranmu — bakat dan kemampuan spesifik yang paling mudah diakses dan paling alami bagimu.`,
      gift: BIRTHDAY_DESC[nbday]||'',
      challenge:'Birthday Number bukan angka terkuat, tapi sering menjadi yang paling mudah terlihat oleh orang lain.',
      shadow:'',
      traits:[],
      calcTitle:'Kalkulasi Birthday Number',
      calcHTML:`<div class="num-calc-row"><span style="color:var(--muted)">Hari lahir</span><span class="num-calc-eq">=</span><span style="color:var(--gold)">${dy}</span>${dy>9?`<span class="num-calc-eq">→</span><span class="num-calc-result">${nbday}</span>`:''}</div>`
    },
    att:{
      n:natt, label:'Attitude / Sun Number', subtitle:'Angka Sikap — Pendekatan Pertama',
      archetype:`Sun Number ${natt}`,
      core:`Attitude Number ${natt} (juga disebut Sun Number) menggambarkan pendekatan alami pertamamu terhadap situasi baru dan kesan pertama yang kamu tinggalkan. Derived dari bulan + hari lahir.`,
      gift:'Ini adalah "default setting" reaksimu sebelum kamu berpikir panjang.',
      challenge:'Attitude Number yang kuat bisa menutupi kompleksitas dirimu yang sebenarnya.',
      shadow:'',
      traits:[],
      calcTitle:'Kalkulasi Attitude Number',
      calcHTML:`<div class="num-calc-row"><span style="color:var(--muted)">Bulan</span><span class="num-calc-eq">${mo}</span><span style="color:var(--muted)">+ Hari</span><span class="num-calc-eq">${dy}</span><span class="num-calc-eq">=</span><span style="color:var(--text)">${mo+dy}</span><span class="num-calc-eq">→</span><span class="num-calc-result">${natt}</span></div>`
    }
  };

  function buildNameCalcHTML(fn,mn,ln,nf,nm,nl,type,resObj) {
    function renderPart(partName, nObj) {
      if(!nObj||nObj.all.length===0) return '';
      const letters = type==='vowels' ? nObj.vowels : type==='consonants' ? nObj.consonants : nObj.lettersMap;
      if(!letters||letters.length===0) return '';
      const sum = letters.reduce ? letters.reduce((a,b)=>a+(b.val||b),0) : letters.map(l=>l.val).reduce((a,b)=>a+b,0);
      const reduced = (()=>{let s=sum;while(s>9&&s!==11&&s!==22&&s!==33)s=s.toString().split('').reduce((a,b)=>a+Number(b),0);return s;})();
      const letHTML = letters.map(l=>`<span class="num-calc-letter"><span>${(l.c||l).toUpperCase()}</span><span>${l.val||l}</span></span>`).join('<span style="color:rgba(201,168,76,.3);margin:0 1px">+</span>');
      return `<div style="margin-bottom:10px"><div style="font-family:var(--font-mono);font-size:8px;color:var(--muted);margin-bottom:6px">${partName.toUpperCase()}</div><div style="display:flex;align-items:flex-end;flex-wrap:wrap;gap:2px">${letHTML}</div><div style="font-family:var(--font-mono);font-size:10px;color:var(--dim);margin-top:4px">= ${sum}${sum!==reduced?' → '+reduced:''} <span style="color:var(--gold)">[${reduced}]</span>${reduced===11||reduced===22||reduced===33?'<span class="nx-master" style="font-size:6px;margin-left:4px">MASTER</span>':''}</div></div>`;
    }
    let html = renderPart(fn,nf) + (mn?renderPart(mn,nm):'') + renderPart(ln,nl);
    html += `<div style="border-top:1px solid var(--b1);padding-top:8px;margin-top:4px;font-family:var(--font-mono);font-size:10px;color:var(--dim)">`;
    if(resObj.parts&&resObj.parts.length>1) html += `${resObj.parts.join(' + ')} = ${resObj.raw}${resObj.raw!==resObj.n?' → <span style="color:var(--gold);font-size:14px">'+resObj.n+'</span>':'<span style="color:var(--gold);font-size:14px"> '+resObj.n+'</span>'}`;
    else html += `<span style="color:var(--gold);font-size:16px">${resObj.n}</span>`;
    html += `</div>`;
    return html;
  }

  window.showNumDetail = function(id) {
    document.querySelectorAll('.nxcard').forEach(c=>c.classList.remove('active'));
    const card = document.getElementById('nxcard-'+id);
    if(card) card.classList.add('active');
    const d = numDetailData[id];
    if(!d) return;
    const panel = document.getElementById('num-detail-panel');
    panel.style.display='block';
    panel.innerHTML = `
      <div class="num-detail-header">
        <div class="num-detail-top">
          <div class="num-detail-num">${d.n}</div>
          <div class="num-detail-info">
            <div class="num-detail-title">${d.label}</div>
            <div class="num-detail-subtitle">${d.subtitle}</div>
            <div class="num-detail-archetype">${d.archetype}</div>
          </div>
        </div>
      </div>
      <div class="num-detail-body">
        <div class="num-section">
          <div class="num-section-label">Makna Mendalam</div>
          <div class="num-section-text">${d.core}</div>
          ${d.gift?`<div class="num-gift-box"><div class="num-gift-label">Kekuatan / Gift</div><div class="num-gift-text">${d.gift}</div></div>`:''}
          ${d.challenge?`<div class="num-shadow-box"><div class="num-shadow-label">Tantangan</div><div class="num-shadow-text">${d.challenge}</div></div>`:''}
        </div>
        ${d.traits&&d.traits.length>0?`
        <div class="num-section">
          <div class="num-section-label">Ciri Khas</div>
          <div class="num-traits-grid">${d.traits.map(t=>`<div class="num-trait"><div class="num-trait-icon">${t.i}</div><div class="num-trait-name">${t.n}</div><div class="num-trait-desc">${t.d}</div></div>`).join('')}</div>
        </div>`:''}
        ${d.shadow?`
        <div class="num-section">
          <div class="num-section-label">Shadow Pattern</div>
          <div class="num-shadow-box"><div class="num-shadow-label">Shadow</div><div class="num-shadow-text">${d.shadow}</div></div>
        </div>`:''}
        <div class="num-section">
          <div class="num-section-label">${d.calcTitle}</div>
          <div class="num-calc-box">${d.calcHTML}</div>
        </div>
      </div>`;
    panel.scrollIntoView({behavior:'smooth',block:'nearest'});

    // Also update calc breakdown
    document.getElementById('num-calc-breakdown').innerHTML = `<div class="num-calc-box">${d.calcHTML}</div>`;
  };
  // Auto-show Life Path detail on load
  setTimeout(()=>window.showNumDetail('lp'), 100);

  // ── PERSONAL YEAR ──
  document.getElementById('num-personal-year').innerHTML = `
    <div class="py-card">
      <div class="py-num">${npy}</div>
      <div>
        <div class="py-label">Personal Year ${new Date().getFullYear()}</div>
        <div class="py-title">${PY_MEANING[npy]?.split('—')[0]||'—'}</div>
        <div class="py-desc">${PY_MEANING[npy]?.split('—')[1]||''}</div>
      </div>
    </div>
    <div style="margin-top:10px;display:flex;gap:10px;align-items:center">
      <div style="background:var(--s2);border:1px solid var(--b1);padding:10px 16px;border-radius:var(--r);text-align:center;flex:1">
        <div style="font-family:var(--font-mono);font-size:7px;letter-spacing:.2em;color:var(--muted);margin-bottom:4px">PERSONAL MONTH</div>
        <div style="font-family:var(--font-serif);font-size:28px;color:var(--blue2)">${npm}</div>
      </div>
      <div style="background:var(--s2);border:1px solid var(--b1);padding:10px 16px;border-radius:var(--r);text-align:center;flex:1">
        <div style="font-family:var(--font-mono);font-size:7px;letter-spacing:.2em;color:var(--muted);margin-bottom:4px">ATTITUDE NUMBER</div>
        <div style="font-family:var(--font-serif);font-size:28px;color:var(--teal)">${natt}</div>
      </div>
    </div>`;

  // ── KARMIC DEBT & BIRTHDAY ──
  const karmicDebtDesc = {13:'Kerja keras dan disiplin — hutang malas',14:'Penyalahgunaan kebebasan di masa lalu',16:'Ego dan cinta yang tidak sehat',19:'Penyalahgunaan kekuatan dan kemandirian'};
  let kbHTML = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
    <div style="background:var(--s2);border:1px solid var(--b1);padding:14px;border-radius:var(--r)">
      <div style="font-family:var(--font-mono);font-size:7px;letter-spacing:.2em;color:var(--muted);margin-bottom:4px">BIRTHDAY NUMBER</div>
      <div style="font-family:var(--font-serif);font-size:32px;color:var(--gold)">${nbday}</div>
      <div style="font-size:11px;color:var(--muted);line-height:1.5;margin-top:4px">${BIRTHDAY_DESC[nbday]||''}</div>
    </div>
    <div>`;
  const allKarmic = [lpKarmic,destKarmic,soulKarmic].filter(Boolean);
  if(allKarmic.length>0) {
    kbHTML += allKarmic.map(k=>`<div style="background:rgba(196,96,74,.06);border:1px solid rgba(196,96,74,.2);padding:12px;border-radius:var(--r);margin-bottom:8px">
      <div style="font-family:var(--font-mono);font-size:7px;letter-spacing:.2em;color:var(--red);margin-bottom:3px">KARMIC DEBT ${k}</div>
      <div style="font-size:11px;color:rgba(237,232,223,.55);line-height:1.5">${karmicDebtDesc[k]||''}</div>
    </div>`).join('');
  } else {
    kbHTML += `<div style="background:rgba(90,158,120,.05);border:1px solid rgba(90,158,120,.2);padding:14px;border-radius:var(--r)"><div style="font-family:var(--font-mono);font-size:7px;letter-spacing:.2em;color:var(--green);margin-bottom:4px">KARMIC DEBT</div><div style="font-size:12px;color:rgba(237,232,223,.5)">Tidak ada Karmic Debt terdeteksi. Perjalanan hidupmu relatif bebas dari pengulangan karma berat.</div></div>`;
  }
  kbHTML += `</div></div>`;
  if(nkl.length>0) {
    kbHTML += `<div style="margin-top:12px;padding:14px;background:var(--s2);border:1px solid var(--b1);border-radius:var(--r)">
      <div style="font-family:var(--font-mono);font-size:8px;letter-spacing:.28em;color:var(--purple);text-transform:uppercase;margin-bottom:8px">Karmic Lessons — Angka yang Hilang dari Nama</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${nkl.map(n=>`<div style="background:rgba(139,111,181,.1);border:1px solid rgba(139,111,181,.25);padding:8px 14px;border-radius:var(--r);text-align:center"><div style="font-family:var(--font-serif);font-size:22px;color:#b89cd6">${n}</div><div style="font-family:var(--font-mono);font-size:7px;color:var(--muted);margin-top:2px">${['','Kepemimpinan','Kerja Sama','Ekspresi','Kerja Keras','Kebebasan','Tanggung Jawab','Kepercayaan','Kekuatan','Belas Kasih'][n]}</div></div>`).join('')}
      </div>
    </div>`;
  }
  document.getElementById('num-karmic-birthday').innerHTML = kbHTML;

  // ── PINNACLES ──
  const curAge2 = D.curAge;
  const pinnacles = [
    {n:np1,label:'Pinnacle 1',age:`0 – ${na1}`,active:curAge2<na1,desc:'Masa formasi — bakat alami berkembang'},
    {n:np2,label:'Pinnacle 2',age:`${na1} – ${na2}`,active:curAge2>=na1&&curAge2<na2,desc:'Masa produktif — bertemu tanggung jawab dunia'},
    {n:np3,label:'Pinnacle 3',age:`${na2} – ${na3}`,active:curAge2>=na2&&curAge2<na3,desc:'Masa puncak — integrasi pengalaman'},
    {n:np4,label:'Pinnacle 4',age:`${na3}+`,active:curAge2>=na3,desc:'Masa bijaksana — legacy dan penutupan siklus'},
  ];
  document.getElementById('num-pinnacles').innerHTML = pinnacles.map(p=>`
    <div style="background:${p.active?'rgba(201,168,76,.08)':'var(--s2)'};border:1px solid ${p.active?'rgba(201,168,76,.4)':'var(--b1)'};padding:16px;border-radius:var(--r);text-align:center">
      <div style="font-family:var(--font-mono);font-size:7px;letter-spacing:.22em;color:${p.active?'var(--gold)':'var(--muted)'};margin-bottom:6px">${p.label}${p.active?' ← SEKARANG':''}</div>
      <div style="font-family:var(--font-serif);font-size:38px;color:${p.active?'var(--gold)':'var(--dim)'};font-weight:300;line-height:1">${p.n}</div>
      <div style="font-family:var(--font-mono);font-size:8px;color:var(--muted);margin:6px 0">${p.age}</div>
      <div style="font-size:11px;color:var(--muted);line-height:1.5">${p.desc}</div>
    </div>`).join('');

  // ── CHALLENGES ──
  const challengeDesc = {0:'Kebebasan penuh — semua tantangan ada',1:'Ketergantungan vs kemandirian',2:'Sensitivitas berlebih & keragu-raguan',3:'Ekspresi diri & kepercayaan diri',4:'Penolakan terhadap batasan & kerja keras',5:'Kebebasan tanpa tanggung jawab',6:'Perfeksionisme & terlalu kritis',7:'Introversi berlebih & ketidakpercayaan',8:'Kekuasaan & materi disalahgunakan',9:'Kesulitan melepas & terlalu idealis'};
  document.getElementById('num-challenges').innerHTML = [
    {n:nc1,l:'Challenge 1',age:`0 – ${na1}`},{n:nc2,l:'Challenge 2',age:`${na1} – ${na2}`},
    {n:nc3,l:'Main Challenge',age:'Sepanjang Hidup'},{n:nc4,l:'Challenge 4',age:`${na3}+`}
  ].map(c=>`
    <div style="display:flex;align-items:center;gap:14px;padding:10px 0;border-bottom:1px solid var(--b1)">
      <div style="font-family:var(--font-serif);font-size:28px;color:var(--red);font-weight:300;min-width:36px;text-align:center">${c.n}</div>
      <div style="flex:1">
        <div style="font-family:var(--font-mono);font-size:8px;letter-spacing:.15em;color:var(--muted)">${c.l} · ${c.age}</div>
        <div style="font-size:12px;color:var(--dim);margin-top:2px">${challengeDesc[c.n]||''}</div>
      </div>
    </div>`).join('');

  // ── HARMONY ──
  const harmonyPairs = [
    {a:nlp,b:ndest,label:'Life Path ↔ Expression'},
    {a:nlp,b:nsoul,label:'Life Path ↔ Soul Urge'},
    {a:nlp,b:npers,label:'Life Path ↔ Personality'},
    {a:ndest,b:nsoul,label:'Expression ↔ Soul Urge'},
    {a:nsoul,b:npers,label:'Soul Urge ↔ Personality'},
  ];
  const harmonyCalc = (a,b) => {
    const diff = Math.abs(a-b);
    if(diff===0) return {pct:100,label:'Resonansi Sempurna'};
    if(diff<=2) return {pct:80,label:'Harmonis'};
    if(diff<=4) return {pct:60,label:'Dinamis'};
    if(diff<=6) return {pct:40,label:'Tegangan Produktif'};
    return {pct:25,label:'Tantangan'};
  };
  document.getElementById('num-harmony').innerHTML = harmonyPairs.map(p=>{
    const h=harmonyCalc(p.a,p.b);
    const col=h.pct>=80?'var(--green)':h.pct>=60?'var(--gold)':h.pct>=40?'var(--teal)':'var(--red)';
    return `<div class="num-compat-row">
      <div class="num-compat-nums"><span>${p.a}</span><span style="opacity:.4;font-size:10px">↔</span><span>${p.b}</span></div>
      <div style="flex:1">
        <div style="font-family:var(--font-mono);font-size:8px;color:var(--muted);margin-bottom:4px">${p.label}</div>
        <div class="num-compat-bar-wrap"><div class="num-compat-bar" style="width:${h.pct}%;background:${col}"></div></div>
      </div>
      <div class="num-compat-label" style="color:${col}">${h.label}</div>
    </div>`;
  }).join('');

  // SHADOW
  document.getElementById('dp-title').textContent = 'Arsitektur Shadow: '+name.split(' ')[0];
  document.getElementById('dp-sub').textContent = 'Setiap kekuatan punya harga yang setara. Setiap sistem punya perspektif yang berbeda. Ini adalah layer yang paling jujur.';

  // Gift ↔ Wound
  const gw = D.fusion.giftWound;
  document.getElementById('dp-giftwound').innerHTML =
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">' +
      '<div style="background:rgba(90,158,120,.05);border:1px solid rgba(90,158,120,.2);border-radius:var(--r);padding:20px">' +
        '<div style="font-family:var(--font-mono);font-size:8px;letter-spacing:.3em;color:var(--green);text-transform:uppercase;margin-bottom:10px">✦ GIFT</div>' +
        '<div style="font-size:13px;color:var(--dim);line-height:1.8">'+(gw?gw.gift:'—')+'</div>' +
      '</div>' +
      '<div style="background:rgba(196,96,74,.05);border:1px solid rgba(196,96,74,.2);border-radius:var(--r);padding:20px">' +
        '<div style="font-family:var(--font-mono);font-size:8px;letter-spacing:.3em;color:var(--red);text-transform:uppercase;margin-bottom:10px">⚖ WOUND</div>' +
        '<div style="font-size:13px;color:var(--dim);line-height:1.8">'+(gw?gw.wound:'—')+'</div>' +
      '</div>' +
    '</div>';

  // Shadow cards — gift body with newline handling
  document.getElementById('dp-cards').innerHTML = D.shadows.map(s=>{
    const bodyHtml = s.body.split('\n\n').map(p=>'<p style="margin-bottom:10px">'+p+'</p>').join('');
    return '<div class="dcard '+s.type+'"><div class="dicon">'+s.icon+'</div><div class="dtitle">'+s.title+'</div><div class="dbody">'+bodyHtml+'</div></div>';
  }).join('');

  // Contradictions
  document.getElementById('dp-contradictions').innerHTML = D.fusion.contradictions.map(c=>
    '<div style="background:var(--s2);border:1px solid rgba(196,96,74,.15);border-radius:var(--r);padding:22px;margin-bottom:14px">' +
      '<div style="font-family:var(--font-mono);font-size:9px;letter-spacing:.2em;color:rgba(196,96,74,.8);text-transform:uppercase;margin-bottom:12px">'+c.title+'</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px">' +
        '<div style="padding:10px 12px;background:rgba(107,127,212,.06);border:1px solid rgba(107,127,212,.15);border-radius:var(--r)">' +
          '<div style="font-family:var(--font-mono);font-size:8px;letter-spacing:.15em;color:var(--blue2);margin-bottom:5px">'+c.systemA+'</div>' +
          '<div style="font-size:12px;color:var(--muted)">'+c.signalA+'</div>' +
        '</div>' +
        '<div style="padding:10px 12px;background:rgba(139,111,181,.06);border:1px solid rgba(139,111,181,.15);border-radius:var(--r)">' +
          '<div style="font-family:var(--font-mono);font-size:8px;letter-spacing:.15em;color:#b89cd6;margin-bottom:5px">'+c.systemB+'</div>' +
          '<div style="font-size:12px;color:var(--muted)">'+c.signalB+'</div>' +
        '</div>' +
      '</div>' +
      '<div style="font-size:13px;color:var(--dim);line-height:1.8;margin-bottom:12px;padding:12px 14px;background:var(--s1);border-left:2px solid rgba(201,168,76,.3)">'+c.resolution+'</div>' +
      '<div style="font-family:var(--font-mono);font-size:9px;letter-spacing:.12em;color:rgba(196,96,74,.7);padding:8px 0">BIAYA: '+c.cost+'</div>' +
    '</div>'
  ).join('');

  // TIMELINE
  document.getElementById('tl-wrap').innerHTML=D.phases.map(p=>{
    const now=D.curAge>=p.age&&D.curAge<p.age+7;
    const ageLabel = now ? 'AGE '+p.age+' · SEKARANG ('+D.curAge+')' : 'AGE '+p.age;
    return '<div class="tli '+(now?'now':'')+'"><div class="tli-age">'+ageLabel+'</div><div class="tli-phase">'+p.phase+'</div><div class="tli-desc">'+p.theme+'</div></div>';
  }).join('');
  const nowP=D.phases.find(p=>D.curAge>=p.age&&D.curAge<p.age+7)||D.phases[D.phases.length-1];
  document.getElementById('tl-phase').textContent=nowP.phase;
  document.getElementById('tl-theme').textContent=nowP.theme;
  document.getElementById('tl-detail').textContent=nowP.detail;
  document.getElementById('tl-insight').textContent=`Pada usia ${D.curAge}, dengan ${D.bazi.dayMaster} sebagai Day Master dan ${D.numerology.LP_MEANING[lp]} sebagai Life Path — fase ${nowP.phase} ini mendorong kamu untuk ${D.curAge<28?'membangun fondasi yang otentik sebelum Saturn Return':D.curAge<35?'melewati dan mengintegrasikan pelajaran Saturn Return':D.curAge<42?'menegaskan siapa kamu setelah semua layers disingkirkan':'menggunakan kematangan sebagai kekuatan yang tidak perlu dibuktikan lagi'}.`;
  document.getElementById('tl-sat').textContent=`Saturn Return pertama: usia ~${29-(D.curAge%29<29?D.curAge%29:0)+D.curAge} (${29-(D.curAge%29<29?D.curAge%29:0)} tahun ${D.curAge%29===0?'baru lewat':'lagi'}). Ini adalah periode di mana semua yang dibangun di atas fondasi yang salah akan dipertanyakan — bukan sebagai hukuman, tapi sebagai klarifikasi siapa kamu sebenarnya.`;

  // TRANSITS
  const TSYM={Sun:'☉',Moon:'☽',Saturn:'♄',Jupiter:'♃',Mars:'♂'};
  const TDESC={
    Conjunction:'Energi intensif — tema ini sedang sangat aktif dalam hidupmu.',
    Trine:'Aliran yang mudah — ini area di mana hal-hal datang dengan natural saat ini.',
    Square:'Tension yang produktif — ada hambatan yang mendorong pertumbuhan.',
    Opposition:'Polaritas yang perlu diintegrasikan — dua energi berbeda meminta perhatian.',
    Sextile:'Peluang yang tersedia — butuh sedikit usaha untuk mengaktifkan potensinya.'
  };
  if(D.transits.length>0) {
    document.getElementById('trans-list').innerHTML=D.transits.map(t=>`<div class="tcard"><div class="tsym">${TSYM[t.transit.split(' ')[1]]||'✦'}</div><div><div class="tname">${t.transit} ${t.type} ${t.natal}</div><div class="tdesc">${TDESC[t.type]||'Active transit.'}</div></div><div class="tintens"><span>${lonToSign(t.transitLon).sign}</span>${lonToSign(t.transitLon).deg}°</div></div>`).join('');
  } else {
    document.getElementById('trans-list').innerHTML='<div class="pbody" style="padding:16px 0">Tidak ada transit mayor yang signifikan aktif saat ini. Ini bisa menjadi periode konsolidasi dan persiapan.</div>';
  }
  setTimeout(()=>drawRadar(document.getElementById('transRadarC'), D.traits), 200);
  document.getElementById('trans-insight').textContent=`Hari ini, dengan Moon transit di ${lonToSign(D.transMoon).sign} dan Sun transit di ${lonToSign(D.transSun).sign} — energi dominan adalah ${lonToSign(D.transMoon).sign==='Scorpio'||lonToSign(D.transMoon).sign==='Pisces'||lonToSign(D.transMoon).sign==='Cancer'?'emosional dan intuitif':lonToSign(D.transMoon).sign==='Aries'||lonToSign(D.transMoon).sign==='Leo'||lonToSign(D.transMoon).sign==='Sagittarius'?'aktif dan berani':'stabil dan analitis'}. ${D.bazi.dayMaster.includes('Fire')||D.bazi.dayMaster.includes('Wood')?'Energi kamu secara natural cocok dengan kondisi hari ini.':'Butuh sedikit usaha ekstra untuk memanfaatkan energi hari ini.'}`;

  } catch(_renderErr) { console.warn("render() element missing:", _renderErr.message); }
}

// Aspect detail click
function showAspDetail(el, text) {
  const d=document.getElementById('asp-detail');
  d.style.display='block';
  d.textContent=text+' — klik aspek lain untuk detail.';
}

// ZW palace click
function zwClick(i) {
  document.querySelectorAll('.zwp').forEach(e=>e.classList.remove('sel'));
  document.querySelectorAll('.zwp')[i]?.classList.add('sel');
}

