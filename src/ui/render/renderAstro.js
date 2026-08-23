function renderAstroContent(container, D, name, dateStr) {
  container.innerHTML = '';
  
  // Create inner tabs
  const tabsEl = document.getElementById('astro-tabs');
  if(tabsEl) {
    tabsEl.innerHTML = `
      <button class="sit on" onclick="ssit('astro','chart',this)">Natal Chart</button>
      <button class="sit" onclick="ssit('astro','planets',this)">Planets</button>
      <button class="sit" onclick="ssit('astro','aspects',this)">Aspects</button>
      <button class="sit" onclick="ssit('astro','transits',this)">Transits</button>`;
  }
  
  // Inject existing t-astro panel content
  container.innerHTML = `
    <div class="sitp on" id="sitp-astro-chart">
      <div class="g2">
        <div class="panel">
          <div class="plabel">Natal Chart · Wheel</div>
          <div class="natal-wrap" style="display:flex;justify-content:center;padding:16px 0">
            <canvas id="natalC" width="360" height="360"></canvas>
            <div class="natal-tt" id="natalTT"></div>
          </div>
          <div style="margin-top:14px">
            <canvas id="elemC" width="180" height="120" style="display:block;margin:0 auto"></canvas>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:18px">
          <div class="panel"><div class="plabel">Big Three</div>
            <div id="astro-bigthree"></div>
          </div>
          <div class="panel"><div class="plabel">Element & Modality</div>
            <div id="astro-elements"></div>
          </div>
          <div class="panel"><div class="plabel">Dominant Pattern</div>
            <div class="iq" id="astro-pattern-text">—</div>
          </div>
        </div>
      </div>
    </div>
    <div class="sitp" id="sitp-astro-planets">
      <div class="g2">
        <div class="panel"><div class="plabel">Planet Positions</div><div id="astro-planet-table"></div></div>
        <div class="panel"><div class="plabel">House Cusps</div><div id="astro-houses"></div></div>
      </div>
    </div>
    <div class="sitp" id="sitp-astro-aspects">
      <div class="panel">
        <div class="plabel">Aspect Matrix</div>
        <div id="astro-aspect-list"></div>
      </div>
    </div>
    <div class="sitp" id="sitp-astro-transits">
      <div class="g2">
        <div class="panel"><div class="plabel">Current Transits</div><div id="trans-list"></div></div>
        <div class="panel"><div class="plabel">Energy Today</div>
          <div style="display:flex;justify-content:center;margin:16px 0"><canvas id="transRadarC" width="260" height="260"></canvas></div>
          <div class="iq" id="trans-insight">—</div>
        </div>
      </div>
    </div>`;
  
  // Now run the astro renderer
  _D = D; _raw = {name, dateStr, timeStr:'', city:''};
  setTimeout(()=>{
    // Render Big Three
    const bt = document.getElementById('astro-bigthree');
    if(bt) bt.innerHTML = [
      {lbl:'☉ Sun',v:D.sunSign+' '+D.planets?.Sun?.deg+'°'},
      {lbl:'☽ Moon',v:D.moonSign+' '+D.planets?.Moon?.deg+'°'},
      {lbl:'↑ Ascendant',v:D.ascSign}
    ].map(x=>`<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--b1)"><span style="font-family:var(--font-mono);font-size:9px;color:var(--muted)">${x.lbl}</span><span style="font-family:var(--font-serif);font-size:16px;color:var(--text)">${x.v}</span></div>`).join('');
    
    // Elements
    const elEl = document.getElementById('astro-elements');
    if(elEl && D.elCounts) {
      const total = Object.values(D.elCounts).reduce((a,b)=>a+b,0)||1;
      const ELCOLS={Fire:'#c84040',Earth:'#c9a84c',Air:'#6b7fd4',Water:'#4a7ab5'};
      elEl.innerHTML = Object.entries(D.elCounts).map(([el,v])=>`
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
          <div style="font-family:var(--font-mono);font-size:8px;color:var(--muted);width:36px">${el}</div>
          <div style="flex:1;height:4px;background:var(--s3);border-radius:2px;overflow:hidden">
            <div style="height:100%;width:${Math.round(v/total*100)}%;background:${ELCOLS[el]||'var(--gold)'};border-radius:2px"></div>
          </div>
          <div style="font-family:var(--font-mono);font-size:9px;color:var(--muted)">${v}</div>
        </div>`).join('');
    }

    // Pattern text  
    const pt = document.getElementById('astro-pattern-text');
    if(pt) {
      const dom = D.elCounts ? Object.entries(D.elCounts).sort((a,b)=>b[1]-a[1])[0][0] : 'Fire';
      pt.textContent = `Dominasi elemen ${dom} dalam natal chart mencerminkan cara kamu merespons dunia secara natural — ${dom==='Fire'?'dengan semangat, inisiasi, dan keberanian yang langsung':dom==='Earth'?'dengan pragmatisme, keandalan, dan pendekatan yang terukur':dom==='Air'?'dengan analisis, komunikasi, dan pendekatan intelektual':'dengan kepekaan emosional, intuisi, dan koneksi mendalam'}.`;
    }
    
    // Planet table
    const planetTbl = document.getElementById('astro-planet-table');
    if(planetTbl && D.planets) {
      const PLANET_SYM={Sun:'☉',Moon:'☽',Mercury:'☿',Venus:'♀',Mars:'♂',Jupiter:'♃',Saturn:'♄',Uranus:'♅',Neptune:'♆',Pluto:'♇',Ascendant:'↑',MC:'⊕'};
      planetTbl.innerHTML = Object.entries(D.planets).map(([pname,p])=>{
        const h = D.houses ? houseOf(p.lon||D.lons?.[pname]||0, D.houses) : '—';
        const rx = p.retrograde ? '<span style="color:var(--red);font-size:9px;margin-left:4px">Rx</span>' : '';
        return `<div class="prow">
          <div class="pname">${pname}</div>
          <div class="psym">${PLANET_SYM[pname]||p.symbol||''}</div>
          <div class="psign" style="font-family:var(--font-serif);font-size:16px">${p.sign}</div>
          <div class="pdeg">${p.deg}°${rx}</div>
          <div class="phouse" style="font-family:var(--font-mono);font-size:9px;color:rgba(107,127,212,.7)">H${h}</div>
        </div>`;
      }).join('');
    }

    // House cusps
    const houseEl = document.getElementById('astro-houses');
    if(houseEl && D.houses) {
      const SIGNS=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
      const HOUSE_THEMES=['Persona & Tubuh','Harta & Nilai','Komunikasi & Saudara','Rumah & Keluarga','Kreativitas & Romansa','Kesehatan & Rutinitas','Kemitraan & Pernikahan','Transformasi & Seksualitas','Filosofi & Perjalanan','Karier & Status','Pertemanan & Komunitas','Spiritual & Tersembunyi'];
      houseEl.innerHTML = D.houses.map((lon, i)=>{
        const deg = Math.floor(normalizeAngle(lon)) % 30;
        const signIdx = Math.floor(normalizeAngle(lon)/30) % 12;
        const signName = SIGNS[signIdx] || '—';
        return `<div style="display:grid;grid-template-columns:28px 28px 80px 1fr;gap:8px;align-items:center;padding:7px 0;border-bottom:1px solid rgba(201,168,76,.1)">
          <div style="font-family:var(--font-mono);font-size:9px;color:var(--gold)">H${i+1}</div>
          <div style="font-family:var(--font-mono);font-size:9px;color:var(--muted)">${deg}°</div>
          <div style="font-family:var(--font-serif);font-size:13px">${signName}</div>
          <div style="font-family:var(--font-mono);font-size:8px;color:var(--muted)">${HOUSE_THEMES[i]||''}</div>
        </div>`;
      }).join('');
    }
    
    // Aspect list
    const aspList = document.getElementById('astro-aspect-list');
    if(aspList && D.aspects) {
      const ASP_SYM={'Conjunction':'☌','Opposition':'☍','Trine':'△','Square':'□','Sextile':'✶','Quincunx':'⚻'};
      aspList.innerHTML = `<div class="asps">${D.aspects.slice(0,24).map(a=>{
        const p1=a.a||a.p1||'?', p2=a.b||a.p2||'?', type=a.t||a.type||'?', orb=a.orb||a.exactness||0;
        const sym=ASP_SYM[type]||type;
        const col=type==='Trine'||type==='Sextile'?'var(--green)':type==='Square'||type==='Opposition'?'var(--red)':'var(--gold)';
        return `<div class="asp${orb<1?' asp-tight':''}" style="color:${col};border-color:currentColor" onclick="showAspDetail(this,'${p1} ${type} ${p2} (${orb.toFixed(1)}°)')">${p1} ${sym} ${p2}</div>`;
      }).join('')}</div>
      <div class="iq" id="asp-detail" style="margin-top:12px;display:none"></div>`;
    }
    
    // Transits
    const TSYM={Sun:'☉',Moon:'☽',Saturn:'♄',Jupiter:'♃',Mars:'♂'};
    const TDESC={Conjunction:'Energi intensif aktif.',Trine:'Aliran natural.',Square:'Tegangan produktif.',Opposition:'Polaritas untuk diintegrasikan.',Sextile:'Peluang tersedia.'};
    const tl = document.getElementById('trans-list');
    if(tl) {
      if(D.transits?.length>0) {
        tl.innerHTML=D.transits.map(t=>`<div class="tcard"><div class="tsym">${TSYM[t.transit?.split(' ')[1]]||'✦'}</div><div><div class="tname">${t.transit} ${t.type} ${t.natal}</div><div class="tdesc">${TDESC[t.type]||''}</div></div><div class="tintens"><span>${lonToSign(t.transitLon).sign}</span></div></div>`).join('');
      } else {
        tl.innerHTML='<div class="pbody" style="padding:16px 0;color:var(--muted)">Tidak ada transit mayor aktif saat ini.</div>';
      }
    }
    const ti = document.getElementById('trans-insight');
    if(ti) ti.textContent=`Moon transit di ${lonToSign(D.transMoon).sign}, Sun transit di ${lonToSign(D.transSun).sign}.`;
    
    drawNatal(document.getElementById('natalC'),D,document.getElementById('natalTT'));
    setupNatalHover(document.getElementById('natalC'),D,document.getElementById('natalTT'));
    drawElemPie(document.getElementById('elemC'),D.elCounts,null);
    setTimeout(()=>drawRadar(document.getElementById('transRadarC'),D.traits),200);
  },200);
}

