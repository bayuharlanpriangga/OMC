function renderOverviewSection(D) {
  _D=D;
  const lp=D.numerology.lp;
  // Soul score
  document.getElementById('soulNumBig')&&(document.getElementById('soulNumBig').textContent=D.soulScore);
  document.getElementById('soulLabel')&&(document.getElementById('soulLabel').textContent=D.soulLabel.toUpperCase());
  // Overview section
  if(document.getElementById('ov-soul-num')) {
    document.getElementById('ov-soul-num').textContent=D.soulScore;
    document.getElementById('ov-soul-lbl').textContent=D.soulLabel.toUpperCase();
    document.getElementById('ov-soul-desc').textContent=D.soulDesc;
    document.getElementById('ov-soul-dims').innerHTML=D.soulDimensions.map(d=>
      '<div class="soul-dim"><div><div class="soul-dim-label">'+d.label+'</div><div class="soul-dim-source">'+d.source+'</div></div><div class="soul-dim-score">'+d.score+'</div><div class="soul-dim-bar" style="grid-column:1/-1"><div class="soul-dim-fill" data-s="'+d.score+'" style="background:'+d.color+'"></div></div></div>'
    ).join('');
  }
  if(document.getElementById('ov-title')) {
    const LP_MEANING_LOCAL={1:'Pemimpin & Pioneer',2:'Diplomat & Intuisi',3:'Kreator & Ekspresi',4:'Builder & Disiplin',5:'Kebebasan & Perubahan',6:'Pemelihara & Harmoni',7:'Analis & Pencarian',8:'Kekuatan & Ambisi',9:'Humanis & Bijaksana',11:'Master Intuitif',22:'Master Builder',33:'Master Teacher'};
    document.getElementById('ov-title').textContent=D.sunSign+' × '+D.hd.type+' × LP'+lp;
    document.getElementById('ov-sub').textContent=(LP_MEANING_LOCAL[lp]||'—')+' · '+D.hd.auth+' Authority · '+D.bazi.dayMaster;
  }
  if(document.getElementById('ov-traits')) {
    document.getElementById('ov-traits').innerHTML=D.traits.map(t=>
      '<div class="tr-row"><div class="tr-head"><span class="tr-name">'+t.n+'</span><span class="tr-val">'+t.s+'</span></div><div class="tbar"><div class="tfill" data-s="'+t.s+'"></div></div></div>'
    ).join('');
  }
  if(document.getElementById('ov-convergences')) {
    document.getElementById('ov-convergences').innerHTML=D.fusion.convergences.slice(0,3).map(c=>
      '<div class="conv-card">'+
      '<div class="conv-signal">'+c.signal+'</div>'+
      '<div class="conv-systems">'+c.systems.map(s=>'<span class="conv-sys-tag">'+s+'</span>').join('')+'</div>'+
      '<div class="conv-pattern">'+c.pattern+'</div>'+
      '<div class="conv-action">'+c.action+'</div>'+
      '</div>'
    ).join('');
  }
  if(document.getElementById('ov-actions')) {
    document.getElementById('ov-actions').innerHTML=D.fusion.actions.map(a=>
      '<div class="action-block"><div class="action-domain">'+a.domain+'</div><div class="action-text">'+a.text+'</div></div>'
    ).join('');
  }
  setTimeout(()=>{
    document.querySelectorAll('.tfill,.soul-dim-fill').forEach(e=>{const s=e.dataset.s;if(s)e.style.width=s+'%';});
    const nc=document.getElementById('natalC');
    const tt=document.getElementById('natalTT');
    if(nc&&D.lons){ drawNatal(nc,D,tt); setupNatalHover(nc,D,tt); }
    const ec=document.getElementById('elemC'); if(ec) drawElemPie(ec,D.elCounts,null);
    const sr=document.getElementById('soulRingC'); if(sr) drawSoulRing(sr,D.soulScore);
    const rc=document.getElementById('radarC'); if(rc) drawRadar(rc,D.traits);
  },400);
}

function renderDepthSection(D) {
  _D=D;
  if(!document.getElementById('dp-title')) return;
  const s=D.shadows[0];
  document.getElementById('dp-title').textContent=s?.title||'—';
  document.getElementById('dp-sub').textContent=s?.body?.slice(0,80)||'—';
  document.getElementById('dp-giftwound').innerHTML=Object.entries(D.SIGN_SHADOW||{}).slice(0,3).map(([sign,sh])=>
    `<div class="dcard dgift"><div class="dicon">✦</div><div class="dtitle">${sign}</div><div class="dbody">${sh?.gift||''}</div></div>`
  ).join('');
  document.getElementById('dp-cards').innerHTML=D.shadows.map(sh=>
    `<div class="dcard dshadow"><div class="dicon">${sh.icon}</div><div class="dtitle">${sh.title}</div><div class="dbody">${sh.body}</div></div>`
  ).join('');
  document.getElementById('dp-contradictions').innerHTML=(D.fusion.contradictions||[]).map(c=>
    `<div style="padding:18px;background:var(--s2);border:1px solid var(--b1);margin-bottom:12px;border-radius:var(--r)">
      <div style="font-family:var(--font-mono);font-size:9px;color:var(--red);margin-bottom:6px">${c.systemA} ↔ ${c.systemB}</div>
      <div style="font-size:13px;color:var(--dim);margin-bottom:8px">${c.pattern}</div>
      <div style="font-size:12px;color:var(--muted)">${c.resolution}</div>
    </div>`
  ).join('');
}

function renderTimelineSection(D) {
  _D=D;
  if(!document.getElementById('tl-wrap')) return;
  const LP_MEANING_LOCAL={1:'Pemimpin & Pioneer',2:'Diplomat & Intuisi',3:'Kreator & Ekspresi',4:'Builder & Disiplin',5:'Kebebasan & Perubahan',6:'Pemelihara & Harmoni',7:'Analis & Pencarian',8:'Kekuatan & Ambisi',9:'Humanis & Bijaksana',11:'Master Intuitif',22:'Master Builder',33:'Master Teacher'};
  const lp=D.numerology.lp;
  document.getElementById('tl-wrap').innerHTML=D.phases.map(p=>{
    const now=D.curAge>=p.age&&D.curAge<p.age+7;
    return '<div class="tli '+(now?'now':'')+'"><div class="tli-age">'+(now?'AGE '+p.age+' · SEKARANG ('+D.curAge+')':'AGE '+p.age)+'</div><div class="tli-phase">'+p.phase+'</div><div class="tli-desc">'+p.theme+'</div></div>';
  }).join('');
  const nowP=D.phases.find(p=>D.curAge>=p.age&&D.curAge<p.age+7)||D.phases[D.phases.length-1];
  document.getElementById('tl-phase').textContent=nowP.phase;
  document.getElementById('tl-theme').textContent=nowP.theme;
  document.getElementById('tl-detail').textContent=nowP.detail;
  document.getElementById('tl-insight').textContent=`Pada usia ${D.curAge}, dengan ${D.bazi.dayMaster} sebagai Day Master dan ${LP_MEANING_LOCAL[lp]} sebagai Life Path — fase ${nowP.phase} ini mendorong kamu untuk ${D.curAge<28?'membangun fondasi yang otentik':'melewati dan mengintegrasikan pelajaran hidup'}.`;
  document.getElementById('tl-sat').textContent=`Saturn Return pertama: usia ~29. Periode di mana semua yang dibangun di atas fondasi yang salah akan dipertanyakan.`;
}

function renderTransitSection(D) {
  _D=D;
  if(!document.getElementById('trans-list')) return;
  const TSYM={Sun:'☉',Moon:'☽',Saturn:'♄',Jupiter:'♃',Mars:'♂'};
  const TDESC={Conjunction:'Energi intensif aktif.',Trine:'Aliran yang mudah.',Square:'Tegangan produktif.',Opposition:'Polaritas untuk diintegrasikan.',Sextile:'Peluang tersedia.'};
  if(D.transits?.length>0) {
    document.getElementById('trans-list').innerHTML=D.transits.map(t=>`<div class="tcard"><div class="tsym">${TSYM[t.transit?.split(' ')[1]]||'✦'}</div><div><div class="tname">${t.transit} ${t.type} ${t.natal}</div><div class="tdesc">${TDESC[t.type]||''}</div></div><div class="tintens"><span>${lonToSign(t.transitLon).sign}</span></div></div>`).join('');
  } else {
    document.getElementById('trans-list').innerHTML='<div style="padding:16px 0;color:var(--muted)">Tidak ada transit mayor aktif saat ini.</div>';
  }
  document.getElementById('trans-insight').textContent=`Moon transit di ${lonToSign(D.transMoon).sign}, Sun transit di ${lonToSign(D.transSun).sign}.`;
  setTimeout(()=>drawRadar(document.getElementById('transRadarC'),D.traits),200);
}

function renderHDSectionFull(D) {
  _D=D;
  const {type:hdt,auth,prof,strategy,notSelf,definedCenters,undefinedCenters,pPlanetData,dPlanetData,definedChannels} = D.hd;
  // Run the existing HD renderer code
  if(document.getElementById('hd-type-hero')) {
    // Trigger the full HD render from existing render() flow
    // by calling the renderer functions directly
    const TYPE_DATA_HD = {
      'Generator':{color:'#c84040',emoji:'⚡',core:'Generator adalah 37% populasi dunia — tulang punggung energi Bumi.',strength:'Energi terbarukan untuk hal yang dicintai.',challenge:'Frustrasi saat memulai dari inisiatif sendiri.',aura:'Aura Generator bersifat magnet dan terbuka.'},
      'Manifesting Generator':{color:'#e86040',emoji:'⚡🔥',core:'Hibrida Generator dan Manifestor — sekitar 33% populasi.',strength:'Bergerak cepat dan multitasking.',challenge:'Frustrasi dan amarah saat tidak selaras.',aura:'Aura MG adalah campuran magnetis dan impulsif.'},
      'Projector':{color:'#6b7fd4',emoji:'🎯',core:'Pemimpin alami zaman baru — 22% populasi.',strength:'Membaca sistem dan orang lain secara mendalam.',challenge:'Kepahitan tanpa undangan.',aura:'Aura fokus dan penetratif.'},
      'Manifestor':{color:'#c9a84c',emoji:'🔥',core:'Katalis perubahan — 8% populasi.',strength:'Bisa menginisiasi tanpa menunggu.',challenge:'Amarah saat dikontrol.',aura:'Aura tertutup dan mendorong.'},
      'Reflector':{color:'#8b6fb5',emoji:'🌙',core:'Cermin komunitas — 1% populasi.',strength:'Membaca kesehatan lingkungan.',challenge:'Kekecewaan di lingkungan tidak sehat.',aura:'Aura resistif dan sampling.'}
    };
    const td = TYPE_DATA_HD[hdt]||TYPE_DATA_HD['Generator'];
    document.getElementById('hd-type-hero').innerHTML=`<div class="hd-type-hero"><div style="position:absolute;top:16px;right:20px;font-size:32px;opacity:.25">${td.emoji}</div><div style="font-family:var(--font-mono);font-size:8px;letter-spacing:.35em;color:var(--blue2);margin-bottom:8px">HD TYPE</div><div class="hd-type-name">${hdt}</div><div style="font-size:13px;color:var(--dim);line-height:1.7;margin-bottom:14px">${td.core}</div><div class="hd-type-grid"><div class="hd-type-item"><div class="hd-type-item-label">Kekuatan</div><div class="hd-type-item-val" style="font-size:12px;font-weight:400">${td.strength}</div></div><div class="hd-type-item"><div class="hd-type-item-label">Tantangan</div><div class="hd-type-item-val" style="font-size:12px;font-weight:400">${td.challenge}</div></div></div></div>`;
    document.getElementById('hd-cards').innerHTML=[{l:'Type',v:hdt},{l:'Authority',v:auth},{l:'Profile',v:prof},{l:'Strategy',v:strategy},{l:'Not-Self',v:notSelf},{l:'Defined',v:definedCenters.length+'/9'}].map(c=>`<div class="hdcard"><div class="hdlbl">${c.l}</div><div class="hdval" style="font-size:${c.v.length>14?'11px':c.v.length>10?'12px':'15px'}">${c.v}</div></div>`).join('');
    // Centers
    const HD_CENTERS_LOCAL=['Head','Ajna','Throat','G','Heart','Solar Plexus','Sacral','Spleen','Root'];
    document.getElementById('hd-center-grid').innerHTML=HD_CENTERS_LOCAL.map(c=>{
      const isDef=definedCenters.includes(c);
      return `<div class="hd-center-item ${isDef?'defined':'undefined'}"><div class="hd-center-name">${c}</div><div class="hd-center-status">${isDef?'Defined':'Open'}</div></div>`;
    }).join('');
    // Channels
    document.getElementById('hd-channels').innerHTML=(definedChannels||[]).map(([a,b])=>`<div class="hd-channel-tag active">${a}-${b}</div>`).join('')||'<div style="color:var(--muted);font-size:12px">Tidak ada channel aktif.</div>';
    // Bodygraph
    const allGates=[...new Set([...pPlanetData.map(p=>p.gate),...dPlanetData.map(p=>p.gate)])];
    renderHDBodygraph(document.getElementById('hdBodgraphSVG'),definedCenters,allGates,hdt);
  }
}

function renderBaziSectionFull(D) {
  _D=D;
  if(!document.getElementById('bz-pillars')) return;
  const {year:by,month:bm,day:bd,hour:bh,dayMaster,favEl,unfavEl,luckPillars,baziEls,pillars10Gods,symbolicStars,kuaNum,kuaDirs,isFemale,luckStartAge}=D.bazi;
  const EL_COLOR_L={'Wood':'#5a9e78','Fire':'#c84040','Earth':'#c9a84c','Metal':'#8ba0b4','Water':'#4a7ab5'};
  // Re-run full bazi render — minimal version
  const pillarData=[
    {p:by,lbl:'Year · 年',hidden:D.bazi.byearHidden,cls:'year'},
    {p:bm,lbl:'Month · 月',hidden:D.bazi.bmonthHidden,cls:'month'},
    {p:bd,lbl:'Day · 日',hidden:D.bazi.bdayHidden,cls:'day'},
    {p:bh,lbl:'Hour · 時',hidden:D.bazi.bhourHidden,cls:'hour'},
  ];
  document.getElementById('bz-pillars').innerHTML=pillarData.map(({p,lbl,hidden,cls})=>{
    if(!p||p.stem==='—') return `<div class="bpillar ${cls}"><div class="bplbl">${lbl}</div><div style="font-family:var(--font-serif);font-size:36px;color:var(--muted)">—</div></div>`;
    const sp=p.stem.split(' '); const bp=p.branch.split(' '); const elBase=p.el.split(' ')[1]; const col=EL_COLOR_L[elBase]||'var(--gold)';
    const hHTML=hidden?.length?`<div class="bphidden"><div class="bphidden-lbl">藏干</div>${hidden.map(h=>`<div class="bphidden-stem" style="color:${EL_COLOR_L[h.el.split(' ')[1]]||'var(--muted)'}">${h.stem.split(' ')[0]} ${h.weight}</div>`).join('')}</div>`:'';
    return `<div class="bpillar ${cls}"><div class="bplbl">${lbl}</div><span class="bpstem-char" style="color:${col}">${sp[0]}</span><div class="bpstem-pinyin">${sp.slice(1).join(' ')}</div><div class="bpbranch"><span class="bpbranch-char">${bp[0]}</span><span class="bpbranch-name">${bp.slice(1).join(' ')}</span></div><div class="bpel">${p.el}</div>${hHTML}</div>`;
  }).join('');
  
  // Element bars
  const elMax=Math.max(...Object.values(baziEls),1);
  if(document.getElementById('bz-el-bars')) {
    document.getElementById('bz-el-bars').innerHTML=Object.entries(baziEls).map(([el,v])=>`<div class="bz-el-bar-row"><div class="bz-el-bar-name">${el}</div><div class="bz-el-bar-wrap"><div class="bz-el-bar-fill" style="width:${Math.round(v/elMax*100)}%;background:${EL_COLOR_L[el]||'var(--gold)'}"></div></div><div class="bz-el-bar-val">${v}</div>${el===favEl?'<span style="font-family:var(--font-mono);font-size:7px;color:var(--green)">✦</span>':''}</div>`).join('');
  }
  document.getElementById('bz-epills').innerHTML=Object.entries(baziEls).map(([el,v])=>`<span class="epill" style="border-color:${el===favEl?'rgba(90,158,120,.4)':el===unfavEl?'rgba(196,96,74,.35)':'rgba(255,255,255,.06)'};color:${el===favEl?'var(--green)':el===unfavEl?'#da8070':'var(--muted)'}">${el} ${v}</span>`).join('');
  
  // Stars
  if(document.getElementById('bz-stars')) {
    document.getElementById('bz-stars').innerHTML=symbolicStars?.length
      ?`<div class="bz-star-grid">${symbolicStars.map(s=>`<div class="bz-star-card"><div class="bz-star-icon">${s.icon}</div><div class="bz-star-name">${s.name}</div><div class="bz-star-desc">${s.desc}</div></div>`).join('')}</div>`
      :'<div style="color:var(--muted);font-size:12px">Tidak ada Symbolic Stars aktif.</div>';
  }
  
  // Luck pillars
  if(document.getElementById('bz-luck')) {
    document.getElementById('bz-luck').innerHTML=luckPillars.map(lkp=>{
      const now=D.curAge>=lkp.age&&D.curAge<lkp.age+10;
      const elBase=lkp.el.split(' ')[1]; const col=EL_COLOR_L[elBase]||'var(--muted)';
      const sp=lkp.stem.split(' '); const bp=lkp.branch.split(' ');
      return `<div class="bz-luck-pillar" style="${now?'background:rgba(201,168,76,.04)':''}"><div class="bz-luck-age" style="color:${now?'var(--gold)':'var(--muted)'}">${lkp.age}–${lkp.age+9}${now?'<div style="font-size:6px;color:var(--gold)">SEKARANG</div>':''}</div><div><div class="bz-luck-stem" style="color:${col}">${sp[0]}</div><div style="font-family:var(--font-mono);font-size:8px;color:var(--muted)">${sp.slice(1).join(' ')}</div></div><div><div class="bz-luck-branch">${bp[0]} ${bp.slice(1).join(' ')}</div><div style="font-family:var(--font-mono);font-size:8px;color:${col}">${lkp.el}</div></div><div class="bz-luck-el" style="color:${lkp.el.split(' ')[1]===favEl?'var(--green)':lkp.el.split(' ')[1]===unfavEl?'var(--red)':'var(--muted)'}">  ${lkp.el.split(' ')[1]===favEl?'✦':lkp.el.split(' ')[1]===unfavEl?'✗':'—'}</div></div>`;
    }).join('');
  }

  // Kua
  if(document.getElementById('bz-kua')&&kuaDirs) {
    const KUA_DIR_COMPASS_L={N:'↑ Utara',NE:'↗ Timur Laut',E:'→ Timur',SE:'↘ Tenggara',S:'↓ Selatan',SW:'↙ Barat Daya',W:'← Barat',NW:'↖ Barat Laut'};
    const GL=['Sukses','Kesehatan','Cinta','Belajar']; const BL=['Sial','5 Hantu','6 Pembunuh','Rugi'];
    document.getElementById('bz-kua').innerHTML=`<div style="display:flex;align-items:center;gap:14px;margin-bottom:14px"><div style="font-family:var(--font-serif);font-size:48px;color:var(--gold)">${kuaNum}</div><div><div style="font-size:13px;font-weight:600">${kuaDirs.group}</div><div style="font-size:11px;color:var(--muted)">Kua Number ${kuaNum}</div></div></div><div style="margin-bottom:10px"><div style="font-family:var(--font-mono);font-size:7px;color:var(--green);letter-spacing:.2em;text-transform:uppercase;margin-bottom:6px">✦ Arah Baik</div><div class="bz-dir-grid">${kuaDirs.good.map((d,i)=>`<div class="bz-dir-card good"><div class="bz-dir-compass">${KUA_DIR_COMPASS_L[d]?.split(' ')[0]||d}</div><div class="bz-dir-name">${KUA_DIR_COMPASS_L[d]?.split(' ')[1]||d}</div><div class="bz-dir-label">${GL[i]||d}</div></div>`).join('')}</div></div><div><div style="font-family:var(--font-mono);font-size:7px;color:var(--red);letter-spacing:.2em;text-transform:uppercase;margin-bottom:6px">✗ Arah Buruk</div><div class="bz-dir-grid">${kuaDirs.bad.map((d,i)=>`<div class="bz-dir-card bad"><div class="bz-dir-compass">${KUA_DIR_COMPASS_L[d]?.split(' ')[0]||d}</div><div class="bz-dir-name">${KUA_DIR_COMPASS_L[d]?.split(' ')[1]||d}</div><div class="bz-dir-label">${BL[i]||d}</div></div>`).join('')}</div></div>`;
  }

  // Insight & shadow
  if(document.getElementById('bz-insight')) document.getElementById('bz-insight').textContent=`Year Pillar ${by.stem.split(' ')[0]}/${by.branch.split(' ')[0]} mencerminkan warisan leluhur. Day Pillar ${bd.stem.split(' ')[0]}/${bd.branch.split(' ')[0]} adalah inti kepribadianmu. Sebagai ${dayMaster}, elemen favorit ${favEl} adalah sumber kekuatanmu.`;
  if(document.getElementById('bz-shadow')) document.getElementById('bz-shadow').textContent=`Elemen ${unfavEl} dalam excess menciptakan tekanan internal. Kurangi paparan ${unfavEl} dan perkuat ${favEl}.`;
  
  setTimeout(()=>drawBaziElem(document.getElementById('baziElemC'),baziEls,favEl),200);
}

function renderZiweiSectionFull(D) {
  _D=D;
  if(!document.getElementById('zw-title')) return;
  const {main:zwMain,life:zwLife,career:zwCar,wealth:zwWlt}=D.zw;
  document.getElementById('zw-title').textContent=zwMain.split(' ').slice(1).join(' ');
  document.getElementById('zw-sub').textContent=`${zwMain} · Life Palace ${zwLife+1}`;
  document.getElementById('zw-palaces').innerHTML=ZW_PAL.map((p,i)=>{
    const isL=i===zwLife,isC=i===zwCar,isW=i===zwWlt;
    return '<div class="zwp '+(isL?'main':'')+'" onclick="zwClick('+i+')"><div class="zwpn" style="'+(isC?'color:var(--blue2)':isW?'color:var(--green)':'')+'">'+( isL?'★ ':isC?'◆ ':isW?'● ':'')+p+'</div>'+(isL?'<div class="zwps">'+zwMain.split(' ').slice(1).join(' ')+'</div>':'')+'</div>';
  }).join('');
  document.getElementById('zw-desc').textContent=`Zi Wei menempatkan ${zwMain} dalam Life Palace ${zwLife+1}.`;
  document.getElementById('zw-insight').textContent=`Bintang ${zwMain.split(' ')[1]} dalam Life Palace mengindikasikan seseorang yang hidupnya ditandai oleh ${zwMain.includes('Purple')?'authority dan leadership':zwMain.includes('Sun')?'visibilitas tinggi':zwMain.includes('Moon')?'intuisi kuat':'kemampuan unik'}.`;
  setTimeout(()=>drawZiWei(document.getElementById('zwC'),zwLife,zwCar,zwWlt),200);
}

function renderNumSectionFull(D) {
  _D=D;
  // Trigger numerology renderer
  if(typeof window.showNumDetail==='function') {
    setTimeout(()=>window.showNumDetail('lp'),100);
  }
  // Render core cards
  const N=D.numerology;
  if(document.getElementById('num-cards')&&N) {
    const cards=[
      {id:'lp',l:'Life Path',n:N.lp,raw:`${N.lpMonth} + ${N.lpDay} + ${N.lpYear}`,m:N.LP_MEANING?.[N.lp]||''},
      {id:'dest',l:'Expression',n:N.dest,raw:'',m:N.DEST_MEANING?.[N.dest]||''},
      {id:'soul',l:"Soul Urge",n:N.soul,raw:'',m:N.SOUL_MEANING?.[N.soul]||''},
      {id:'pers',l:'Personality',n:N.pers,raw:'',m:N.PERS_MEANING?.[N.pers]||''},
      {id:'bday',l:'Birthday',n:N.birthday,raw:'',m:''},
      {id:'att',l:'Attitude',n:N.attitude,raw:'',m:''},
    ];
    document.getElementById('num-cards').innerHTML=cards.map(c=>`<div class="nxcard" onclick="showNumDetail('${c.id}')" id="nxcard-${c.id}"><div class="nxbg">${c.n}</div><div class="nxlbl">${c.l}</div><div class="nxnum">${c.n}</div><div class="nxm">${c.m}</div></div>`).join('');
    // Personal year
    if(document.getElementById('num-personal-year')) {
      document.getElementById('num-personal-year').innerHTML=`<div class="py-card"><div class="py-num">${N.personalYear}</div><div><div class="py-label">Personal Year ${new Date().getFullYear()}</div><div class="py-title">${N.PY_MEANING?.[N.personalYear]?.split('—')[0]||'—'}</div><div class="py-desc">${N.PY_MEANING?.[N.personalYear]?.split('—')[1]||''}</div></div></div>`;
    }
    // Pinnacles
    if(document.getElementById('num-pinnacles')) {
      const pins=[{n:N.pin1,l:'Pinnacle 1',age:`0–${N.pinAge1}`,active:D.curAge<N.pinAge1},{n:N.pin2,l:'Pinnacle 2',age:`${N.pinAge1}–${N.pinAge2}`,active:D.curAge>=N.pinAge1&&D.curAge<N.pinAge2},{n:N.pin3,l:'Pinnacle 3',age:`${N.pinAge2}–${N.pinAge3}`,active:D.curAge>=N.pinAge2&&D.curAge<N.pinAge3},{n:N.pin4,l:'Pinnacle 4',age:`${N.pinAge3}+`,active:D.curAge>=N.pinAge3}];
      document.getElementById('num-pinnacles').innerHTML=pins.map(p=>`<div style="background:${p.active?'rgba(201,168,76,.08)':'var(--s2)'};border:1px solid ${p.active?'rgba(201,168,76,.4)':'var(--b1)'};padding:14px;border-radius:var(--r);text-align:center"><div style="font-family:var(--font-mono);font-size:7px;color:${p.active?'var(--gold)':'var(--muted)'};">${p.l}${p.active?' ← SEKARANG':''}</div><div style="font-family:var(--font-serif);font-size:36px;color:${p.active?'var(--gold)':'var(--dim)'};">${p.n}</div><div style="font-family:var(--font-mono);font-size:8px;color:var(--muted)">${p.age}</div></div>`).join('');
    }
  }
}

