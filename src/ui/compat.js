// ═══════════════════════════════════════════════════════════
//  COMPATIBILITY
// ═══════════════════════════════════════════════════════════
// ── Compat form state ──
let _c2Year=2000, _c2Month=0, _c2Day=1, _c2Confirmed=false;
let _c2TimeSet=false, _c2H=12, _c2M=0;
let _c2CityConfirmed=false;

// Date picker 2
function initDatePicker2() {
  const mDrop=document.getElementById('cMonthSelDropdown');
  if(mDrop.children.length) return; // already inited
  MONTHS_ID.forEach((m,i)=>{
    const d=document.createElement('div');
    d.className='cs-opt'+(i===_c2Month?' selected':'');
    d.textContent=m;
    d.onclick=()=>{
      _c2Month=i;
      document.getElementById('cMonthVal').textContent=MONTHS_SHORT[i];
      document.getElementById('cMonthSel').classList.remove('open');
      mDrop.querySelectorAll('.cs-opt').forEach(o=>o.classList.remove('selected'));
      d.classList.add('selected');
      renderCdGrid2();
    };
    mDrop.appendChild(d);
  });
  const yDrop=document.getElementById('cYearSelDropdown');
  yDrop.style.maxHeight='200px'; yDrop.style.overflowY='auto';
  const curY=new Date().getFullYear();
  for(let y=curY;y>=1920;y--){
    const d=document.createElement('div');
    d.id='cyd-'+y;
    d.className='cs-opt'+(y===_c2Year?' selected':'');
    d.textContent=y;
    d.onclick=(()=>{const yr=y;return ()=>{
      _c2Year=yr;
      document.getElementById('cYearVal').textContent=yr;
      document.getElementById('cYearSel').classList.remove('open');
      yDrop.querySelectorAll('.cs-opt').forEach(o=>o.classList.remove('selected'));
      d.classList.add('selected');
      renderCdGrid2();
    };})();
    yDrop.appendChild(d);
  }
  document.getElementById('cYearSel').querySelector('.cs-display').addEventListener('click',()=>{
    setTimeout(()=>{const s=yDrop.querySelector('.selected');if(s)s.scrollIntoView({block:'center',behavior:'instant'});},20);
  });
  document.getElementById('cMonthVal').textContent=MONTHS_SHORT[_c2Month];
  document.getElementById('cYearVal').textContent=_c2Year;
  renderCdGrid2();
}

function toggleDatePicker2() {
  const dp=document.getElementById('cdatePicker2');
  const isOpen=dp.classList.contains('open');
  document.querySelectorAll('.custom-select.open,.custom-date.open,.tw-wrap.open').forEach(e=>e.classList.remove('open'));
  if(!isOpen){ initDatePicker2(); dp.classList.add('open'); }
}

function cdNavYear2(dir){
  _c2Month+=dir;
  if(_c2Month>11){_c2Month=0;_c2Year++;}
  if(_c2Month<0){_c2Month=11;_c2Year--;}
  document.getElementById('cMonthVal').textContent=MONTHS_SHORT[_c2Month];
  document.getElementById('cYearVal').textContent=_c2Year;
  document.querySelectorAll('#cYearSelDropdown .cs-opt').forEach(o=>o.classList.toggle('selected',parseInt(o.textContent)===_c2Year));
  document.querySelectorAll('#cMonthSelDropdown .cs-opt').forEach((o,i)=>o.classList.toggle('selected',i===_c2Month));
  renderCdGrid2();
}

function renderCdGrid2(){
  const grid=document.getElementById('cdGrid2');
  if(!grid) return;
  grid.innerHTML='';
  const firstDay=new Date(_c2Year,_c2Month,1).getDay();
  const dim=new Date(_c2Year,_c2Month+1,0).getDate();
  for(let i=0;i<firstDay;i++){const e=document.createElement('div');e.className='cd-day empty';grid.appendChild(e);}
  for(let d=1;d<=dim;d++){
    const el=document.createElement('div');
    el.className='cd-day'+(d===_c2Day&&_c2Confirmed?' selected':'');
    el.textContent=d;
    el.onclick=()=>{
      _c2Day=d; _c2Confirmed=true;
      grid.querySelectorAll('.cd-day').forEach(x=>x.classList.remove('selected'));
      el.classList.add('selected');
      const ds=_c2Year+'-'+String(_c2Month+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
      document.getElementById('cd').value=ds;
      document.getElementById('cDateDisplay').textContent=d+' '+MONTHS_ID[_c2Month]+' '+_c2Year;
      document.getElementById('cDateDisplay').style.color='';
      setTimeout(()=>document.getElementById('cdatePicker2').classList.remove('open'),200);
    };
    grid.appendChild(el);
  }
}

// Time wheel 2
function initWheels2(){
  buildDrum('twHourInner2',24,v=>pad2(v),_c2H);
  buildDrum('twMinInner2',60,v=>pad2(v),_c2M);
  setupDrumDrag('twHourDrum2','twHourInner2',24,v=>{_c2H=v;updateTWDisplay2();});
  setupDrumDrag('twMinDrum2','twMinInner2',60,v=>{_c2M=v;updateTWDisplay2();});
}
function updateTWDisplay2(){
  const t=pad2(_c2H)+' : '+pad2(_c2M);
  document.getElementById('twDisplay2').textContent=t;
  document.getElementById('twDisplay2').style.color='var(--gold)';
  document.getElementById('ct').value=pad2(_c2H)+':'+pad2(_c2M);
  _c2TimeSet=true;
}
function toggleTW2(){
  const el=document.getElementById('twWrap2');
  const isOpen=el.classList.contains('open');
  document.querySelectorAll('.custom-select.open,.custom-date.open,.tw-wrap.open').forEach(e=>e.classList.remove('open'));
  if(!isOpen) el.classList.add('open');
}
function confirmTW2(){ document.getElementById('twWrap2').classList.remove('open'); }

// City autocomplete 2
function onCityInput2(){
  const val=document.getElementById('cc').value.trim().toLowerCase();
  const drop=document.getElementById('cityDropdown2');
  const status=document.getElementById('cityStatus2');
  const inp=document.getElementById('cc');
  _c2CityConfirmed=false;
  document.getElementById('ccConfirmed').value='0';
  inp.classList.remove('confirmed','error');
  status.className='city-status'; status.textContent='';
  if(val.length<2){drop.classList.remove('show');return;}
  const matches=CITY_DB.filter(c=>c.n.toLowerCase().includes(val)).slice(0,8);
  if(!matches.length){drop.classList.remove('show');status.className='city-status warn';status.textContent='Kota tidak ditemukan';return;}
  drop.innerHTML=matches.map((c,i)=>{
    const tzStr='UTC'+(c.tz>=0?'+':'')+c.tz;
    return '<div class="city-opt" onmousedown="selectCity2('+i+',event)"><span class="city-opt-name">'+c.n+'</span><span class="city-opt-meta">'+tzStr+'</span></div>';
  }).join('');
  drop._matches=matches;
  drop.classList.add('show');
}
function selectCity2(idx,e){
  if(e) e.preventDefault();
  const drop=document.getElementById('cityDropdown2');
  const c=drop._matches[idx];
  if(!c) return;
  const inp=document.getElementById('cc');
  inp.value=c.n;
  document.getElementById('ccLat').value=c.lat;
  document.getElementById('ccLon').value=c.lon;
  document.getElementById('ccTz').value=c.tz;
  document.getElementById('ccConfirmed').value='1';
  _c2CityConfirmed=true;
  drop.classList.remove('show');
  inp.classList.add('confirmed');
  const status=document.getElementById('cityStatus2');
  status.className='city-status';
  status.textContent='✓ '+c.lat.toFixed(4)+'°, '+c.lon.toFixed(4)+'° · UTC'+(c.tz>=0?'+':'')+c.tz;
}
function onCityBlur2(){
  setTimeout(()=>{
    document.getElementById('cityDropdown2').classList.remove('show');
    if(!_c2CityConfirmed && document.getElementById('cc').value.trim()){
      document.getElementById('cc').classList.add('error');
      const s=document.getElementById('cityStatus2');
      s.className='city-status err'; s.textContent='⚠ Pilih kota dari daftar';
    }
  },200);
}

// Init wheels on tab open
const _origStab = stab;

function doCompat() {
  const n2=document.getElementById('cn').value.trim();
  const d2=document.getElementById('cd').value;
  const t2=document.getElementById('ct').value||'';
  const cityConfirmed=document.getElementById('ccConfirmed').value==='1';

  if(!n2){ document.getElementById('cn').focus(); return; }
  if(!d2||!_c2Confirmed){
    const s=document.getElementById('cDateDisplay');
    s.style.color='var(--red)'; s.textContent='Pilih tanggal lahir partner terlebih dahulu';
    return;
  }
  if(!cityConfirmed){
    document.getElementById('cc').classList.add('error');
    const s=document.getElementById('cityStatus2');
    s.className='city-status err'; s.textContent='⚠ Pilih kota dari daftar untuk akurasi koordinat';
    document.getElementById('cc').focus();
    return;
  }

  const lat2=parseFloat(document.getElementById('ccLat').value);
  const lon2=parseFloat(document.getElementById('ccLon').value);
  const tz2=parseFloat(document.getElementById('ccTz').value);

  const D2=computeChart(n2,d2,t2,document.getElementById('cc').value,lat2,lon2,tz2);
  const D1=_D;

  const sunDiff=Math.abs(D1.lons.Sun-D2.lons.Sun);
  const moonDiff=Math.abs(D1.lons.Moon-D2.lons.Moon);
  const venDiff=Math.abs(D1.lons.Venus-D2.lons.Venus);
  const marDiff=Math.abs(D1.lons.Mars-D2.lons.Mars);
  function harmScore(diff){const n=diff>180?360-diff:diff;return Math.round(100-Math.min(100,(Math.abs(n-60)<15||Math.abs(n-120)<15||n<8)?15:(Math.abs(n-90)<15||Math.abs(n-180)<15)?35:0));}

  const scores=[
    {n:'Resonansi Emosional', s:harmScore(moonDiff)},
    {n:'Chemistry Romantis', s:harmScore(venDiff+marDiff/2)},
    {n:'Sinergi Intelektual', s:harmScore(Math.abs(D1.lons.Mercury-D2.lons.Mercury))},
    {n:'Keselarasan Life Path', s:Math.max(20,100-Math.abs(D1.numerology.lp-D2.numerology.lp)*9)},
    {n:'Kompatibilitas Energetik', s:harmScore(sunDiff)},
  ];
  const overall=Math.round(scores.reduce((a,b)=>a+b.s,0)/scores.length);
  const lbl=overall>=80?'Deep Resonance':overall>=65?'Strong Affinity':overall>=50?'Complementary Tension':'Complex Dynamic';
  document.getElementById('cs-score').textContent=overall+'%';
  document.getElementById('cs-lbl').textContent=lbl+' · '+_raw.name+' × '+n2;
  document.getElementById('cs-bars').innerHTML=scores.map(s=>
    '<div class="tr-row"><div class="tr-head"><span class="tr-name">'+s.n+'</span><span class="tr-val">'+s.s+'</span></div><div class="tbar"><div class="tfill" style="width:'+s.s+'%"></div></div></div>'
  ).join('');
  document.getElementById('cs-insight').textContent='Pertemuan antara '+_raw.name+' ('+D1.sunSign+' ☉) dan '+n2+' ('+D2.sunSign+' ☉) — kombinasi ini '+(overall>=70?'menciptakan resonansi yang kuat di level chart. Ada sesuatu yang terasa "familiar" secara energetik.':overall>=50?'penuh potensi tapi membutuhkan kesadaran dari keduanya. Tension yang ada bisa jadi bahan bakar atau hambatan.':'mengandung pelajaran besar. Chemistry-nya nyata, tapi biayanya juga nyata.')+' Area terkuat: '+scores.sort((a,b)=>b.s-a.s)[0].n+'.';
  document.getElementById('cs-shadow').textContent='Sun '+_raw.name+' '+(aspectType(D1.lons.Sun,D2.lons.Sun)||'tidak ada aspek mayor dengan')+' Sun '+n2+'. Moon '+_raw.name+' '+(aspectType(D1.lons.Moon,D2.lons.Moon)||'tidak ada aspek mayor dengan')+' Moon '+n2+'. Salah satu dari kalian kemungkinan membawa pola yang akan teraktivasi dalam relasi ini.';
  document.getElementById('compat-res').style.display='block';
  setTimeout(()=>{document.querySelectorAll('#cs-bars .tfill').forEach(e=>{const s=e.style.width;e.style.width='0%';setTimeout(()=>e.style.width=s,100);});},100);
}



function initCompatSection() {
  // Reinitialize compat section pickers
  if(typeof renderCdGrid2==='function') renderCdGrid2();
}
