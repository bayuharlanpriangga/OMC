function renderAnalysisPage(pageId) {
  if(!_globalD) return;
  const D = _globalD;
  const {name,dateStr,timeStr,city} = _globalRaw || {};

  // Hide empty, show output
  document.getElementById(pageId+'-empty').style.display='none';
  const out=document.getElementById(pageId+'-output');
  if(out) {out.classList.add('visible'); out.style.display='block';}

  // Set _D and _raw for legacy renderers
  _D = D; _raw = _globalRaw || {};

  switch(pageId) {
    case 'overview':
      document.getElementById('t-overview-inner').innerHTML = document.getElementById('t-overview')?.innerHTML||'';
      document.getElementById('ov-topbar-name').textContent = name||'';
      setTimeout(()=>renderOverviewSection(D),100);
      break;
    case 'depth':
      document.getElementById('t-depth-inner').innerHTML = document.getElementById('t-depth')?.innerHTML||'';
      setTimeout(()=>renderDepthSection(D),100);
      break;
    case 'tl':
      document.getElementById('t-tl-inner').innerHTML = document.getElementById('t-tl')?.innerHTML||'';
      setTimeout(()=>renderTimelineSection(D),100);
      break;
    case 'transit':
      document.getElementById('t-transit-inner').innerHTML = document.getElementById('t-transit')?.innerHTML||'';
      setTimeout(()=>renderTransitSection(D),100);
      break;
    case 'daily':
      document.getElementById('t-daily-inner').innerHTML = document.getElementById('t-daily')?.innerHTML||'';
      setTimeout(()=>renderDaily(D),100);
      break;
    case 'compat':
      document.getElementById('t-compat-inner').innerHTML = document.getElementById('t-compat')?.innerHTML||'';
      setTimeout(()=>initCompatSection(),100);
      break;
  }
}

// ── INNER TAB SWITCHER ──
function ssit(sysId, tabId, btn) {
  document.querySelectorAll(`#${sysId}-content .sitp`).forEach(p=>p.classList.remove('on'));
  document.querySelectorAll(`#${sysId}-tabs .sit`).forEach(b=>b.classList.remove('on'));
  const target = document.getElementById('sitp-'+sysId+'-'+tabId);
  if(target) target.classList.add('on');
  if(btn) btn.classList.add('on');
}

// ── CANVAS REDRAW ──
function triggerCanvasRedraw(sysId) {
  if(!_globalD) return;
  const D=_globalD;
  if(sysId==='astro') {
    const nc=document.getElementById('natalC');
    const tt=document.getElementById('natalTT');
    if(nc&&D.lons) { drawNatal(nc,D,tt); setupNatalHover(nc,D,tt); }
    const ec=document.getElementById('elemC');
    if(ec) drawElemPie(ec,D.elCounts,null);
  }
  if(sysId==='bazi') {
    const bc=document.getElementById('baziElemC');
    if(bc) drawBaziElem(bc,D.bazi.baziEls,D.bazi.favEl);
  }
  if(sysId==='hd') {
    const allGates=[...new Set([...D.hd.pPlanetData.map(p=>p.gate),...D.hd.dPlanetData.map(p=>p.gate)])];
    renderHDBodygraph(document.getElementById('hdBodgraphSVG'),D.hd.definedCenters,allGates,D.hd.type);
  }
  if(sysId==='ziwei') {
    const zc=document.getElementById('zwC');
    if(zc) drawZiWei(zc,D.zw.life,D.zw.career,D.zw.wealth);
  }
}

// ── SECTION RENDERERS (call existing render() logic per section) ──
