// ═══════════════════════════════════════════════════════════
//  CHART RENDERERS
// ═══════════════════════════════════════════════════════════

// SOUL SCORE RING
function drawSoulRing(canvas, score, label) {
  const ctx=canvas.getContext('2d'), W=canvas.width, H=canvas.height, cx=W/2, cy=H/2, R=58;
  ctx.clearRect(0,0,W,H);
  ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2);
  ctx.strokeStyle='rgba(255,255,255,0.06)'; ctx.lineWidth=6; ctx.stroke();
  const ang = (score/100)*Math.PI*2 - Math.PI/2;
  const grad=ctx.createConicalGradient?null:null;
  ctx.beginPath(); ctx.arc(cx,cy,R,-Math.PI/2,ang);
  ctx.strokeStyle='rgba(201,168,76,0.85)'; ctx.lineWidth=3; ctx.lineCap='round'; ctx.stroke();
  ctx.beginPath(); ctx.arc(cx+Math.cos(ang)*R, cy+Math.sin(ang)*R, 4, 0, Math.PI*2);
  ctx.fillStyle='#e8c96a'; ctx.fill();
}

// RADAR
function drawRadar(canvas, traits) {
  const ctx=canvas.getContext('2d'), W=canvas.width, H=canvas.height, cx=W/2, cy=H/2, R=Math.min(W,H)/2-36;
  const N=traits.length;
  ctx.clearRect(0,0,W,H);
  for(let r=1;r<=4;r++){
    ctx.beginPath();
    for(let i=0;i<N;i++){const a=(Math.PI*2*i/N)-Math.PI/2;i===0?ctx.moveTo(cx+Math.cos(a)*R*r/4,cy+Math.sin(a)*R*r/4):ctx.lineTo(cx+Math.cos(a)*R*r/4,cy+Math.sin(a)*R*r/4);}
    ctx.closePath(); ctx.strokeStyle='rgba(255,255,255,0.04)'; ctx.lineWidth=1; ctx.stroke();
  }
  for(let i=0;i<N;i++){
    const a=(Math.PI*2*i/N)-Math.PI/2;
    ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+Math.cos(a)*R,cy+Math.sin(a)*R);
    ctx.strokeStyle='rgba(255,255,255,0.05)'; ctx.stroke();
    const lx=cx+Math.cos(a)*(R+20), ly=cy+Math.sin(a)*(R+20);
    ctx.fillStyle='rgba(237,232,223,0.28)'; ctx.font='8px Syne'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(traits[i].n.split(' ')[0].toUpperCase(),lx,ly);
  }
  ctx.beginPath();
  traits.forEach((t,i)=>{const a=(Math.PI*2*i/N)-Math.PI/2,v=t.s/100;i===0?ctx.moveTo(cx+Math.cos(a)*R*v,cy+Math.sin(a)*R*v):ctx.lineTo(cx+Math.cos(a)*R*v,cy+Math.sin(a)*R*v);});
  ctx.closePath();
  const g=ctx.createRadialGradient(cx,cy,0,cx,cy,R);
  g.addColorStop(0,'rgba(201,168,76,0.22)'); g.addColorStop(1,'rgba(201,168,76,0.04)');
  ctx.fillStyle=g; ctx.fill(); ctx.strokeStyle='rgba(201,168,76,0.75)'; ctx.lineWidth=1.5; ctx.stroke();
  traits.forEach((t,i)=>{const a=(Math.PI*2*i/N)-Math.PI/2,v=t.s/100;ctx.beginPath();ctx.arc(cx+Math.cos(a)*R*v,cy+Math.sin(a)*R*v,3,0,Math.PI*2);ctx.fillStyle='#c9a84c';ctx.fill();});
}

// NATAL CHART — interactive
let natalData = null;
function drawNatal(canvas, data, tooltipEl) {
  natalData = {canvas, data, tooltipEl};
  _renderNatal(canvas, data, tooltipEl, null);
}
function _renderNatal(canvas, data, tt, hoverPlanet) {
  const ctx=canvas.getContext('2d'), W=canvas.width, H=canvas.height, cx=W/2, cy=H/2;
  const Ro=cx-8, Ri=cx-34, Rh=cx-62, Rp=cx-88;
  ctx.clearRect(0,0,W,H);

  // Zodiac ring segments
  const SEG_COLS=['rgba(196,96,74,','rgba(107,127,212,','rgba(90,158,120,','rgba(201,168,76,'];
  const EL_COLS={'Fire':'rgba(196,96,74,','Earth':'rgba(201,168,76,','Air':'rgba(107,127,212,','Water':'rgba(74,110,200,'};
  const SIGN_EL_A=['Fire','Earth','Air','Water','Fire','Earth','Air','Water','Fire','Earth','Air','Water'];
  const SIGN_SYM_A=['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];

  for(let i=0;i<12;i++){
    const a1=i*30*RAD-Math.PI/2, a2=(i+1)*30*RAD-Math.PI/2;
    ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,Ro,a1,a2); ctx.closePath();
    ctx.fillStyle=(EL_COLS[SIGN_EL_A[i]]||'rgba(255,255,255,')+`${i%2===0?'0.04':'0.02'})`;
    ctx.fill();
    ctx.beginPath(); ctx.moveTo(cx+Math.cos(a1)*Ri,cy+Math.sin(a1)*Ri);
    ctx.lineTo(cx+Math.cos(a1)*Ro,cy+Math.sin(a1)*Ro);
    ctx.strokeStyle='rgba(201,168,76,0.25)'; ctx.lineWidth=1; ctx.stroke();
    const am=a1+15*RAD, sr=Ri+13;
    ctx.fillStyle='rgba(237,232,223,0.45)'; ctx.font='13px Arial'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(SIGN_SYM_A[i], cx+Math.cos(am)*sr, cy+Math.sin(am)*sr);
  }
  ctx.beginPath(); ctx.arc(cx,cy,Ro,0,Math.PI*2); ctx.strokeStyle='rgba(201,168,76,0.3)'; ctx.lineWidth=1; ctx.stroke();
  ctx.beginPath(); ctx.arc(cx,cy,Ri,0,Math.PI*2); ctx.strokeStyle='rgba(255,255,255,0.06)'; ctx.lineWidth=1; ctx.stroke();
  ctx.beginPath(); ctx.arc(cx,cy,Rh,0,Math.PI*2); ctx.strokeStyle='rgba(255,255,255,0.04)'; ctx.lineWidth=1; ctx.stroke();

  // House lines
  for(let i=0;i<12;i++){
    const a=data.houses[i]*RAD-Math.PI/2;
    ctx.beginPath(); ctx.moveTo(cx+Math.cos(a)*Rh,cy+Math.sin(a)*Rh); ctx.lineTo(cx+Math.cos(a)*Ri,cy+Math.sin(a)*Ri);
    ctx.strokeStyle='rgba(255,255,255,0.05)'; ctx.lineWidth=1; ctx.stroke();
  }

  // Aspect lines
  const aspCols={Conjunction:'rgba(201,168,76,0.35)',Trine:'rgba(90,158,120,0.3)',Square:'rgba(196,96,74,0.3)',Opposition:'rgba(139,111,181,0.28)',Sextile:'rgba(107,127,212,0.25)'};
  const pLonMap={};
  ['Sun','Moon','Mercury','Venus','Mars','Jupiter'].forEach(p=>{ pLonMap[p]=data.lons[p]; });
  data.aspects.forEach(asp=>{
    if(pLonMap[asp.a]===undefined||pLonMap[asp.b]===undefined) return;
    const a1=pLonMap[asp.a]*RAD-Math.PI/2, a2=pLonMap[asp.b]*RAD-Math.PI/2;
    ctx.beginPath(); ctx.moveTo(cx+Math.cos(a1)*Rp,cy+Math.sin(a1)*Rp); ctx.lineTo(cx+Math.cos(a2)*Rp,cy+Math.sin(a2)*Rp);
    ctx.strokeStyle=aspCols[asp.t]||'rgba(255,255,255,0.1)'; ctx.lineWidth=1; ctx.stroke();
  });

  // Ascendant line
  const ascA=data.lons.Ascendant*RAD-Math.PI/2;
  ctx.beginPath(); ctx.moveTo(cx+Math.cos(ascA)*Rh,cy+Math.sin(ascA)*Rh); ctx.lineTo(cx+Math.cos(ascA)*Ro,cy+Math.sin(ascA)*Ro);
  ctx.strokeStyle='rgba(201,168,76,0.8)'; ctx.lineWidth=2; ctx.stroke();
  ctx.fillStyle='rgba(201,168,76,0.9)'; ctx.font='bold 9px Syne'; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText('ASC', cx+Math.cos(ascA)*(Ri+8), cy+Math.sin(ascA)*(Ri+8));

  // Planets
  const PCOLS={Sun:'#e8c96a',Moon:'#9ba8e8',Mercury:'#7dc49a',Venus:'#f0a0a0',Mars:'#e87070',Jupiter:'#c4a060',Saturn:'#8ba0b4',Uranus:'#7ecece',Neptune:'#8b6fb5',Pluto:'#a07080'};
  const pOrder=['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Uranus','Neptune','Pluto'];
  const pAngles={};
  pOrder.forEach((p,i)=>{
    if(!data.lons[p]&&data.lons[p]!==0) return;
    const baseA=data.lons[p]*RAD-Math.PI/2;
    const offset=(i%3-1)*6*RAD;
    const pa=baseA+offset;
    pAngles[p]={angle:pa,lon:data.lons[p]};
    const pr=Rp-(i%2)*5;
    const px=cx+Math.cos(pa)*pr, py=cy+Math.sin(pa)*pr;
    const isHover=p===hoverPlanet;
    ctx.beginPath(); ctx.arc(px,py,isHover?7:5,0,Math.PI*2);
    ctx.fillStyle=(PCOLS[p]||'#fff')+(isHover?'':'cc'); ctx.fill();
    if(isHover){ctx.strokeStyle='#fff';ctx.lineWidth=1;ctx.stroke();}
    ctx.fillStyle='rgba(237,232,223,0.85)'; ctx.font=`${isHover?'bold ':''}10px Arial`; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(data.planets[p]?.sym||p[0], px, py);
  });

  // Center dot
  ctx.beginPath(); ctx.arc(cx,cy,5,0,Math.PI*2);
  ctx.fillStyle='rgba(201,168,76,0.85)'; ctx.fill();

  // Store angles for hover
  canvas._pAngles=pAngles; canvas._cx=cx; canvas._cy=cy; canvas._Rp=Rp;
}

// NATAL hover — singleton, no leak
function setupNatalHover(canvas, data, tt) {
  if(canvas._mmHandler) canvas.removeEventListener('mousemove', canvas._mmHandler);
  if(canvas._mlHandler) canvas.removeEventListener('mouseleave', canvas._mlHandler);
  canvas._mmHandler = (e)=>{
    const rect=canvas.getBoundingClientRect();
    const mx=(e.clientX-rect.left)*(canvas.width/rect.width);
    const my=(e.clientY-rect.top)*(canvas.height/rect.height);
    const cx=canvas._cx, cy=canvas._cy;
    let closest=null, minD=20;
    if(canvas._pAngles) Object.entries(canvas._pAngles).forEach(([p,v])=>{
      const pr=canvas._Rp;
      const px=cx+Math.cos(v.angle)*pr, py=cy+Math.sin(v.angle)*pr;
      const d=Math.hypot(mx-px,my-py);
      if(d<minD){minD=d;closest=p;}
    });
    if(closest) {
      const pd=data.planets[closest];
      tt.style.display='block';
      tt.style.left=(e.clientX-canvas.getBoundingClientRect().left+12)+'px';
      tt.style.top=(e.clientY-canvas.getBoundingClientRect().top-20)+'px';
      tt.innerHTML=`<strong style="color:var(--gold)">${closest}</strong> ${pd?.sym||''}<br>${pd?.sign||'?'} ${pd?.deg||0}° ${pd?.min||0}'<br><span style="color:var(--muted)">House ${pd?houseOf(pd.lon||0,data.houses):1}</span>`;
      _renderNatal(canvas, data, tt, closest);
    } else {
      tt.style.display='none';
      _renderNatal(canvas, data, tt, null);
    }
  };
  canvas._mlHandler = ()=>{ tt.style.display='none'; _renderNatal(canvas,data,tt,null); };
  canvas.addEventListener('mousemove', canvas._mmHandler);
  canvas.addEventListener('mouseleave', canvas._mlHandler);
}

// ELEMENT PIE
function drawElemPie(canvas, counts, highlight) {
  const ctx=canvas.getContext('2d'), W=canvas.width, H=canvas.height, cx=W/2, cy=H/2, R=Math.min(W,H)/2-20;
  const els=Object.keys(counts), total=Object.values(counts).reduce((a,b)=>a+b,0)||1;
  const COLS={Fire:'#c84040',Earth:'#c9a84c',Air:'#6b7fd4',Water:'#4a7ab5',Wood:'#5a9e78',Metal:'#8ba0b4'};
  ctx.clearRect(0,0,W,H);
  let ang=-Math.PI/2;
  els.forEach(el=>{
    const v=(counts[el]||0.2)/total, slice=v*Math.PI*2;
    const isH=el===highlight;
    ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,R+(isH?6:0),ang,ang+slice); ctx.closePath();
    ctx.fillStyle=(COLS[el]||'#888')+(isH?'ee':'88'); ctx.fill();
    ctx.strokeStyle='rgba(5,5,10,0.8)'; ctx.lineWidth=2; ctx.stroke();
    if(v>0.1){const m=ang+slice/2;ctx.fillStyle='rgba(237,232,223,0.9)';ctx.font='bold 10px Syne';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(el[0],cx+Math.cos(m)*R*.65,cy+Math.sin(m)*R*.65);}
    ang+=slice;
  });
  ctx.beginPath(); ctx.arc(cx,cy,R*.38,0,Math.PI*2);
  ctx.fillStyle='#05050a'; ctx.fill();
  ctx.fillStyle='rgba(201,168,76,0.7)'; ctx.font='11px DM Mono'; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText('元素',cx,cy);
}

// BAZI ELEMENT (5 elements)
function drawBaziElem(canvas, baziEls, favEl) {
  drawElemPie(canvas, baziEls, favEl);
}

// HD BODYGRAPH — proper SVG with gates & channels
function renderHDBodygraph(container, defined, gates, hdType) {
  // 9 centers with proper HD positions
  const cx = 170;
  const C = {
    Head:        { x:cx,   y:28,  w:44, h:44, shape:'tri',  col:'#8b6fb5', key:'Head' },
    Ajna:        { x:cx,   y:90,  w:44, h:44, shape:'tri',  col:'#6b7fd4', key:'Ajna' },
    Throat:      { x:cx,   y:152, w:48, h:36, shape:'rect', col:'#5a9e78', key:'Throat' },
    G:           { x:cx,   y:210, w:52, h:52, shape:'dia',  col:'#c9a84c', key:'G' },
    Heart:       { x:cx-62,y:188, w:40, h:40, shape:'rect', col:'#c84040', key:'Heart' },
    SolarPlexus: { x:cx+62,y:230, w:44, h:40, shape:'rect', col:'#e8a050', key:'Solar Plexus' },
    Sacral:      { x:cx,   y:282, w:52, h:44, shape:'rect', col:'#c84040', key:'Sacral' },
    Spleen:      { x:cx-72,y:256, w:44, h:44, shape:'rect', col:'#5a9e78', key:'Spleen' },
    Root:        { x:cx,   y:362, w:52, h:44, shape:'rect', col:'#8b6fb5', key:'Root' },
  };
  // Channels (center-to-center)
  const CHANNELS = [
    {a:'Head',b:'Ajna',gates:[64,61,63]},
    {a:'Ajna',b:'Throat',gates:[17,43,11,62,23,56]},
    {a:'Throat',b:'G',gates:[31,7,33,13,8,1,45,2]},
    {a:'Throat',b:'Heart',gates:[16,48,20,34]},
    {a:'G',b:'Sacral',gates:[15,5,2,14]},
    {a:'G',b:'Heart',gates:[25,51,10,26]},
    {a:'Throat',b:'SolarPlexus',gates:[35,36]},
    {a:'SolarPlexus',b:'Sacral',gates:[6,59]},
    {a:'Sacral',b:'Spleen',gates:[27,50]},
    {a:'Sacral',b:'Root',gates:[53,42,60,3,9,52]},
    {a:'Spleen',b:'Root',gates:[58,18,28,32]},
    {a:'Spleen',b:'Heart',gates:[54,44]},
  ];

  const isDef = (key) => defined.includes(key) || defined.includes(key.replace('SolarPlexus','Solar Plexus'));
  const gateSet = new Set(gates);

  // Build SVG
  let svg = `<svg viewBox="0 0 340 430" width="100%" style="max-width:340px;display:block;margin:0 auto" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="glow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>`;

  // Draw channels first (behind centers)
  CHANNELS.forEach(ch => {
    const ca = C[ch.a], cb = C[ch.b];
    if(!ca||!cb) return;
    const da = isDef(ch.a), db = isDef(ch.b);
    const active = da && db;
    svg += `<line x1="${ca.x}" y1="${ca.y}" x2="${cb.x}" y2="${cb.y}"
      stroke="${active?ca.col:'rgba(255,255,255,0.07)'}"
      stroke-width="${active?3:1.5}"
      ${active?'filter="url(#glow)"':''}
      stroke-linecap="round"/>`;
    // Gate numbers along channel
    if(active && ch.gates.length) {
      const gx = (ca.x+cb.x)/2 + (cb.y-ca.y)/8;
      const gy = (ca.y+cb.y)/2 - (cb.x-ca.x)/8;
      svg += `<text x="${gx}" y="${gy}" font-family="DM Mono" font-size="7" fill="rgba(201,168,76,0.7)" text-anchor="middle">${ch.gates[0]}</text>`;
    }
  });

  // Draw centers
  Object.entries(C).forEach(([key, c]) => {
    const def = isDef(key);
    const col = def ? c.col : 'rgba(255,255,255,0)';
    const stroke = def ? c.col : 'rgba(255,255,255,0.12)';
    const hw = c.w/2, hh = c.h/2;
    const label = key === 'SolarPlexus' ? 'SP' : key === 'Sacral' ? 'SACRAL' : key.toUpperCase().slice(0,6);

    let shape = '';
    if(c.shape === 'tri') {
      // Triangle (Head, Ajna)
      shape = `<polygon points="${c.x},${c.y-hh} ${c.x+hw},${c.y+hh} ${c.x-hw},${c.y+hh}"
        fill="${col}cc" stroke="${stroke}" stroke-width="${def?2:1}"
        ${def?'filter="url(#glow)"':''}/>`;
    } else if(c.shape === 'dia') {
      // Diamond (G center)
      shape = `<polygon points="${c.x},${c.y-hh} ${c.x+hw},${c.y} ${c.x},${c.y+hh} ${c.x-hw},${c.y}"
        fill="${col}cc" stroke="${stroke}" stroke-width="${def?2:1}"
        ${def?'filter="url(#glow)"':''}/>`;
    } else {
      // Rectangle
      shape = `<rect x="${c.x-hw}" y="${c.y-hh}" width="${c.w}" height="${c.h}"
        rx="2" fill="${col}cc" stroke="${stroke}" stroke-width="${def?2:1}"
        ${def?'filter="url(#glow)"':''}/>`;
    }
    svg += shape;
    svg += `<text x="${c.x}" y="${c.y+1}" font-family="Syne" font-size="${label.length>5?6:7}" font-weight="bold"
      fill="${def?'rgba(237,232,223,0.95)':'rgba(237,232,223,0.28)'}"
      text-anchor="middle" dominant-baseline="middle">${label}</text>`;
  });

  // Active gates ring around sacral
  const sacral = C.Sacral;
  gates.slice(0,4).forEach((g,i) => {
    const a = (i/4)*Math.PI*2 - Math.PI/2;
    const gx = sacral.x + Math.cos(a)*38, gy = sacral.y + Math.sin(a)*38;
    svg += `<circle cx="${gx}" cy="${gy}" r="8" fill="rgba(201,168,76,0.12)" stroke="rgba(201,168,76,0.4)" stroke-width="1"/>
    <text x="${gx}" y="${gy}" font-family="DM Mono" font-size="7" fill="rgba(201,168,76,0.8)" text-anchor="middle" dominant-baseline="middle">${g}</text>`;
  });

  // Type label
  svg += `<text x="${cx}" y="418" font-family="DM Mono" font-size="9" letter-spacing="3"
    fill="rgba(201,168,76,0.6)" text-anchor="middle">${hdType.toUpperCase()}</text>`;

  svg += '</svg>';
  container.innerHTML = svg;
}

// ZI WEI MAP
function drawZiWei(canvas, life, career, wealth) {
  const ctx=canvas.getContext('2d'), W=canvas.width, H=canvas.height;
  ctx.clearRect(0,0,W,H);
  const pad=4, cw=(W-pad*2)/3, ch=(H-pad*2)/4;
  const pos=[{r:0,c:0},{r:0,c:1},{r:0,c:2},{r:1,c:2},{r:2,c:2},{r:3,c:2},{r:3,c:1},{r:3,c:0},{r:2,c:0},{r:1,c:0},{r:1,c:1},{r:2,c:1}];
  ZW_PAL.forEach((pal,i)=>{
    const {r:row,c:col}=pos[i];
    const x=pad+col*cw, y=pad+row*ch;
    const isL=i===life, isC=i===career, isW=i===wealth;
    ctx.fillStyle=isL?'rgba(201,168,76,0.18)':isC?'rgba(107,127,212,0.12)':isW?'rgba(90,158,120,0.12)':'rgba(255,255,255,0.02)';
    ctx.fillRect(x,y,cw-2,ch-2);
    ctx.strokeStyle=isL?'rgba(201,168,76,0.7)':isC?'rgba(107,127,212,0.5)':isW?'rgba(90,158,120,0.5)':'rgba(255,255,255,0.06)';
    ctx.lineWidth=isL||isC||isW?1.5:1; ctx.strokeRect(x,y,cw-2,ch-2);
    ctx.fillStyle=isL?'#e8c96a':isC?'#9ba8e8':isW?'#7dc49a':'rgba(237,232,223,0.3)';
    ctx.font=`${isL||isC||isW?'bold ':''}8px Syne`; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(pal.toUpperCase(),x+cw/2,y+ch/2);
    if(isL){ctx.fillStyle='rgba(201,168,76,0.5)';ctx.font='9px serif';ctx.fillText('★',x+cw/2,y+ch/2+10);}
  });
  ctx.fillStyle='rgba(201,168,76,0.08)'; ctx.fillRect(pad+cw,pad+ch,cw-2,ch*2-2);
  ctx.fillStyle='rgba(201,168,76,0.45)'; ctx.font='13px serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText('紫微',pad+cw+cw/2,pad+ch+ch-8); ctx.fillText('斗數',pad+cw+cw/2,pad+ch+ch+10);
}

