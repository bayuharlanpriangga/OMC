// ═══════════════════════════════════════════════════════════
//  CITY AUTOCOMPLETE — with lat/lon/timezone
// ═══════════════════════════════════════════════════════════
const CITY_DB = [
  // Indonesia
  {n:'Jakarta, Indonesia',lat:-6.2088,lon:106.8456,tz:7},
  {n:'Surabaya, Indonesia',lat:-7.2575,lon:112.7521,tz:7},
  {n:'Bandung, Indonesia',lat:-6.9175,lon:107.6191,tz:7},
  {n:'Medan, Indonesia',lat:3.5952,lon:98.6722,tz:7},
  {n:'Semarang, Indonesia',lat:-6.9932,lon:110.4203,tz:7},
  {n:'Palembang, Indonesia',lat:-2.9761,lon:104.7754,tz:7},
  {n:'Makassar, Indonesia',lat:-5.1477,lon:119.4327,tz:8},
  {n:'Yogyakarta, Indonesia',lat:-7.7956,lon:110.3695,tz:7},
  {n:'Denpasar, Indonesia',lat:-8.6705,lon:115.2126,tz:8},
  {n:'Bali, Indonesia',lat:-8.4095,lon:115.1889,tz:8},
  {n:'Malang, Indonesia',lat:-7.9797,lon:112.6304,tz:7},
  {n:'Tangerang, Indonesia',lat:-6.1781,lon:106.63,tz:7},
  {n:'Depok, Indonesia',lat:-6.4025,lon:106.7942,tz:7},
  {n:'Bekasi, Indonesia',lat:-6.2349,lon:106.9896,tz:7},
  {n:'Bogor, Indonesia',lat:-6.5971,lon:106.806,tz:7},
  {n:'Cirebon, Indonesia',lat:-6.7063,lon:108.5573,tz:7},
  {n:'Aceh, Indonesia',lat:5.5483,lon:95.3238,tz:7},
  {n:'Padang, Indonesia',lat:-0.9492,lon:100.3543,tz:7},
  {n:'Pekanbaru, Indonesia',lat:0.5071,lon:101.4478,tz:7},
  {n:'Batam, Indonesia',lat:1.0456,lon:104.0305,tz:7},
  {n:'Pontianak, Indonesia',lat:-0.0263,lon:109.3425,tz:7},
  {n:'Banjarmasin, Indonesia',lat:-3.3186,lon:114.5944,tz:8},
  {n:'Balikpapan, Indonesia',lat:1.2654,lon:116.8312,tz:8},
  {n:'Samarinda, Indonesia',lat:-0.5022,lon:117.1536,tz:8},
  {n:'Manado, Indonesia',lat:1.4748,lon:124.8421,tz:8},
  {n:'Jayapura, Indonesia',lat:-2.5337,lon:140.7181,tz:9},
  {n:'Lombok, Indonesia',lat:-8.6529,lon:116.3239,tz:8},
  {n:'Solo, Indonesia',lat:-7.5755,lon:110.8243,tz:7},
  {n:'Palu, Indonesia',lat:-0.8917,lon:119.8707,tz:8},
  {n:'Kupang, Indonesia',lat:-10.1772,lon:123.607,tz:8},
  // Asia
  {n:'Singapore',lat:1.3521,lon:103.8198,tz:8},
  {n:'Kuala Lumpur, Malaysia',lat:3.1390,lon:101.6869,tz:8},
  {n:'Bangkok, Thailand',lat:13.7563,lon:100.5018,tz:7},
  {n:'Manila, Philippines',lat:14.5995,lon:120.9842,tz:8},
  {n:'Ho Chi Minh City, Vietnam',lat:10.8231,lon:106.6297,tz:7},
  {n:'Hanoi, Vietnam',lat:21.0285,lon:105.8542,tz:7},
  {n:'Tokyo, Japan',lat:35.6762,lon:139.6503,tz:9},
  {n:'Seoul, South Korea',lat:37.5665,lon:126.978,tz:9},
  {n:'Beijing, China',lat:39.9042,lon:116.4074,tz:8},
  {n:'Shanghai, China',lat:31.2304,lon:121.4737,tz:8},
  {n:'Hong Kong',lat:22.3193,lon:114.1694,tz:8},
  {n:'Taipei, Taiwan',lat:25.033,lon:121.5654,tz:8},
  {n:'Mumbai, India',lat:19.076,lon:72.8777,tz:5.5},
  {n:'Delhi, India',lat:28.6139,lon:77.209,tz:5.5},
  {n:'Colombo, Sri Lanka',lat:6.9271,lon:79.8612,tz:5.5},
  {n:'Dhaka, Bangladesh',lat:23.8103,lon:90.4125,tz:6},
  {n:'Karachi, Pakistan',lat:24.8607,lon:67.0011,tz:5},
  {n:'Riyadh, Saudi Arabia',lat:24.7136,lon:46.6753,tz:3},
  {n:'Dubai, UAE',lat:25.2048,lon:55.2708,tz:4},
  {n:'Tehran, Iran',lat:35.6892,lon:51.389,tz:3.5},
  {n:'Istanbul, Turkey',lat:41.0082,lon:28.9784,tz:3},
  {n:'Cairo, Egypt',lat:30.0444,lon:31.2357,tz:2},
  // Europe
  {n:'London, UK',lat:51.5074,lon:-0.1278,tz:0},
  {n:'Paris, France',lat:48.8566,lon:2.3522,tz:1},
  {n:'Berlin, Germany',lat:52.52,lon:13.405,tz:1},
  {n:'Amsterdam, Netherlands',lat:52.3676,lon:4.9041,tz:1},
  {n:'Rome, Italy',lat:41.9028,lon:12.4964,tz:1},
  {n:'Madrid, Spain',lat:40.4168,lon:-3.7038,tz:1},
  {n:'Moscow, Russia',lat:55.7558,lon:37.6173,tz:3},
  // Americas
  {n:'New York, USA',lat:40.7128,lon:-74.006,tz:-5},
  {n:'Los Angeles, USA',lat:34.0522,lon:-118.2437,tz:-8},
  {n:'Chicago, USA',lat:41.8781,lon:-87.6298,tz:-6},
  {n:'Houston, USA',lat:29.7604,lon:-95.3698,tz:-6},
  {n:'Toronto, Canada',lat:43.6532,lon:-79.3832,tz:-5},
  {n:'Vancouver, Canada',lat:49.2827,lon:-123.1207,tz:-8},
  {n:'São Paulo, Brazil',lat:-23.5505,lon:-46.6333,tz:-3},
  {n:'Mexico City, Mexico',lat:19.4326,lon:-99.1332,tz:-6},
  // Oceania
  {n:'Sydney, Australia',lat:-33.8688,lon:151.2093,tz:10},
  {n:'Melbourne, Australia',lat:-37.8136,lon:144.9631,tz:10},
  {n:'Auckland, New Zealand',lat:-36.8509,lon:174.7645,tz:12},
];

let _cityConfirmed = false;

function onCityInput() {
  const val = document.getElementById('iCity').value.trim().toLowerCase();
  const drop = document.getElementById('cityDropdown');
  const status = document.getElementById('cityStatus');
  const inp = document.getElementById('iCity');

  // Reset confirmed state when user types
  _cityConfirmed = false;
  document.getElementById('iCityConfirmed').value = '0';
  inp.classList.remove('confirmed','error');
  status.className = 'city-status';
  status.textContent = '';

  if(val.length < 2) { drop.classList.remove('show'); return; }

  const matches = CITY_DB.filter(c => c.n.toLowerCase().includes(val)).slice(0,8);

  if(matches.length === 0) {
    drop.classList.remove('show');
    status.className = 'city-status warn';
    status.textContent = 'Kota tidak ditemukan — ketik lebih lengkap atau coba nama lain';
    return;
  }

  drop.innerHTML = matches.map((c,i) => {
    const tzStr = 'UTC'+(c.tz>=0?'+':'')+c.tz;
    return '<div class="city-opt" onmousedown="selectCity('+i+',event)">' +
      '<span class="city-opt-name">'+c.n+'</span>' +
      '<span class="city-opt-meta">'+tzStr+' · '+c.lat.toFixed(2)+'°, '+c.lon.toFixed(2)+'°</span>' +
      '</div>';
  }).join('');
  drop._matches = matches;
  drop.classList.add('show');
  updateConf();
}

function selectCity(idx, e) {
  if(e) e.preventDefault();
  const drop = document.getElementById('cityDropdown');
  const matches = drop._matches;
  if(!matches || !matches[idx]) return;
  const c = matches[idx];
  const inp = document.getElementById('iCity');

  inp.value = c.n;
  document.getElementById('iCityLat').value = c.lat;
  document.getElementById('iCityLon').value = c.lon;
  document.getElementById('iCityTz').value = c.tz;
  document.getElementById('iCityConfirmed').value = '1';
  _cityConfirmed = true;

  drop.classList.remove('show');
  inp.classList.add('confirmed');
  inp.classList.remove('error');

  const status = document.getElementById('cityStatus');
  status.className='city-status';
  status.textContent = '✓ Koordinat tersimpan: '+c.lat.toFixed(4)+'°, '+c.lon.toFixed(4)+'° · UTC'+(c.tz>=0?'+':'')+c.tz;
  updateConf();
}

function onCityBlur() {
  setTimeout(() => {
    document.getElementById('cityDropdown').classList.remove('show');
    if(!_cityConfirmed && document.getElementById('iCity').value.trim()) {
      const inp = document.getElementById('iCity');
      inp.classList.add('error');
      const status = document.getElementById('cityStatus');
      status.className = 'city-status err';
      status.textContent = '⚠ Pilih kota dari daftar agar koordinat akurat';
    }
  }, 200);
}

// Override getLatLon to use confirmed city data
const _origGetLatLon = getLatLon;
function getLatLonFromInput() {
  if(_cityConfirmed) {
    const lat = parseFloat(document.getElementById('iCityLat').value);
    const lon = parseFloat(document.getElementById('iCityLon').value);
    const tz = parseFloat(document.getElementById('iCityTz').value);
    if(!isNaN(lat)) return [lat, lon, tz];
  }
  return null;
}

// ── Custom Select ──
function toggleCS(id) {
  const el = document.getElementById(id);
  const isOpen = el.classList.contains('open');
  const insideDatePicker = el.closest('.custom-date');

  if(insideDatePicker) {
    // Close other selects inside date picker, keep date picker itself open
    document.querySelectorAll('.custom-select.open').forEach(e=>{
      if(e !== el) e.classList.remove('open');
    });
  } else {
    // Close everything except this one
    document.querySelectorAll('.custom-select.open,.custom-date.open').forEach(e=>{
      if(e !== el) e.classList.remove('open');
    });
    document.querySelectorAll('.tw-wrap.open').forEach(e=>e.classList.remove('open'));
  }

  // Toggle this element — if was open, close it; if was closed, open it
  el.classList.toggle('open', !isOpen);
}
function selectCS(selectId, valId, hiddenId, value, label) {
  document.getElementById(valId).textContent = label;
  document.getElementById(valId).classList.remove('placeholder');
  if(hiddenId) document.getElementById(hiddenId).value = value;
  document.getElementById(selectId).classList.remove('open');
  // Mark selected
  document.querySelectorAll('#'+selectId+' .cs-opt').forEach(o=>o.classList.remove('selected'));
  event.target.classList.add('selected');
  updateConf();
}

// ── Custom Date Picker ──
let _cdYear = 1995, _cdMonth = 7, _cdDay = 17; // Aug = 7 (0-indexed)

const MONTHS_ID = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];

function initDatePicker() {
  // Guard: these elements only exist on the landing/legacy form
  if(!document.getElementById('monthSelDropdown')) return;
  // Populate month dropdown — full names
  const mDrop = document.getElementById('monthSelDropdown');
  MONTHS_ID.forEach((m,i)=>{
    const d = document.createElement('div');
    d.className = 'cs-opt' + (i===_cdMonth?' selected':'');
    d.textContent = m;
    d.onclick = ()=>{
      _cdMonth=i;
      document.getElementById('monthVal').textContent=MONTHS_SHORT[i];
      document.getElementById('monthSel').classList.remove('open');
      mDrop.querySelectorAll('.cs-opt').forEach(o=>o.classList.remove('selected'));
      d.classList.add('selected');
      renderCdGrid();
    };
    mDrop.appendChild(d);
  });

  // Populate year dropdown (2015–1920 descending) — auto scroll to selected
  const yDrop = document.getElementById('yearSelDropdown');
  const currentYear = new Date().getFullYear();
  for(let y=currentYear;y>=1920;y--) {
    const d = document.createElement('div');
    d.id = 'yd-'+y;
    d.className = 'cs-opt' + (y===_cdYear?' selected':'');
    d.textContent = y;
    d.onclick = (()=>{ const yr=y; return ()=>{
      _cdYear=yr;
      document.getElementById('yearVal').textContent=yr;
      document.getElementById('yearSel').classList.remove('open');
      yDrop.querySelectorAll('.cs-opt').forEach(o=>o.classList.remove('selected'));
      d.classList.add('selected');
      renderCdGrid();
    }; })();
    yDrop.appendChild(d);
  }

  // Auto-scroll year dropdown to selected on open
  document.getElementById('yearSel').querySelector('.cs-display').addEventListener('click', ()=>{
    setTimeout(()=>{
      const sel = yDrop.querySelector('.selected');
      if(sel) sel.scrollIntoView({block:'center',behavior:'instant'});
    }, 20);
  });
  document.getElementById('monthVal').textContent = MONTHS_SHORT[_cdMonth];
  document.getElementById('yearVal').textContent = _cdYear;
  renderCdGrid();
  updateDateDisplay();
}

function toggleDatePicker() {
  const dp = document.getElementById('datePicker');
  const isOpen = dp.classList.contains('open');
  // Close all other things
  document.querySelectorAll('.custom-select.open,.tw-wrap.open').forEach(e=>e.classList.remove('open'));
  if(isOpen) {
    // Close date picker + any inner open selects
    document.querySelectorAll('#datePicker .custom-select.open').forEach(e=>e.classList.remove('open'));
    dp.classList.remove('open');
  } else {
    dp.classList.add('open');
  }
}

function cdNavYear(dir) {
  _cdMonth += dir;
  if(_cdMonth > 11) { _cdMonth=0; _cdYear++; }
  if(_cdMonth < 0) { _cdMonth=11; _cdYear--; }
  document.getElementById('monthVal').textContent = MONTHS_SHORT[_cdMonth];
  document.getElementById('yearVal').textContent = _cdYear;
  document.querySelectorAll('#yearSelDropdown .cs-opt').forEach(o=>{
    o.classList.toggle('selected', parseInt(o.textContent)===_cdYear);
  });
  document.querySelectorAll('#monthSelDropdown .cs-opt').forEach((o,i)=>{
    o.classList.toggle('selected', i===_cdMonth);
  });
  renderCdGrid();
}

function renderCdGrid() {
  const grid = document.getElementById('cdGrid');
  if(!grid) return; // Guard: element may not exist on this page
  grid.innerHTML = '';
  const firstDay = new Date(_cdYear, _cdMonth, 1).getDay();
  const daysInMonth = new Date(_cdYear, _cdMonth+1, 0).getDate();
  const today = new Date();
  // Empty cells
  for(let i=0;i<firstDay;i++){
    const e=document.createElement('div'); e.className='cd-day empty'; grid.appendChild(e);
  }
  for(let d=1;d<=daysInMonth;d++){
    const el=document.createElement('div');
    el.className='cd-day';
    el.textContent=d;
    if(d===_cdDay && _cdMonth===_cdMonth) el.classList.add('selected');
    if(d===today.getDate() && _cdMonth===today.getMonth() && _cdYear===today.getFullYear()) el.classList.add('today');
    el.onclick=()=>{
      _cdDay=d;
      grid.querySelectorAll('.cd-day').forEach(x=>x.classList.remove('selected'));
      el.classList.add('selected');
      updateDateDisplay();
      setTimeout(()=>document.getElementById('datePicker').classList.remove('open'),200);
    };
    grid.appendChild(el);
  }
}

function updateDateDisplay() {
  const val = document.getElementById('cdVal')||document.querySelector('#datePicker .cd-val');
  const dateStr = _cdYear+'-'+String(_cdMonth+1).padStart(2,'0')+'-'+String(_cdDay).padStart(2,'0');
  const iDateEl = document.getElementById('iDate');
  if(iDateEl) iDateEl.value = dateStr;
  const dispEl = document.getElementById('dateDisplay');
  if(dispEl) { dispEl.textContent = _cdDay+' '+MONTHS_ID[_cdMonth]+' '+_cdYear; dispEl.classList.remove('placeholder'); }
  updateConf();
}

// ── Custom Time Picker ──
// ── Slot Wheel Time Picker ──
function pad2(n){return String(n).padStart(2,'0');}
let _twH=7, _twM=30;

function buildDrum(innerId, count, formatter, current) {
  const inner = document.getElementById(innerId);
  if(!inner) return; // Guard: element may not exist
  inner.innerHTML = '';
  // Build 3 loops of items for infinite feel
  const total = count * 3;
  for(let i=0;i<total;i++){
    const v = i % count;
    const el = document.createElement('div');
    el.className = 'tw-item';
    el.textContent = formatter(v);
    inner.appendChild(el);
  }
  // Set initial position to middle loop
  inner._count = count;
  inner._current = current;
  setDrumPos(inner, current, false);
}

function setDrumPos(inner, value, animate) {
  const count = inner._count;
  inner._current = ((value % count) + count) % count;
  // Middle loop offset
  const idx = count + inner._current;
  const offset = -(idx * 44 - 68); // center item at position 2 (68px = 44*1.5 visible center)
  if(animate) { inner.style.transition = 'transform .2s cubic-bezier(.4,0,.2,1)'; }
  else { inner.style.transition = 'none'; }
  inner.style.transform = 'translateY('+offset+'px)';
  // Style items
  Array.from(inner.children).forEach((el, i) => {
    const v = i % count;
    const isActive = v === inner._current;
    const isNear = Math.abs((i - idx)) === 1;
    el.style.color = isActive ? 'var(--gold)' : isNear ? 'rgba(237,232,223,0.45)' : 'rgba(237,232,223,0.15)';
    el.style.fontSize = isActive ? '34px' : isNear ? '22px' : '16px';
    el.style.fontWeight = isActive ? '400' : '300';
  });
}

function initWheels() {
  // Guard: these elements only exist on the landing/legacy form
  if(!document.getElementById('twHourInner')) return;
  buildDrum('twHourInner', 24, v=>pad2(v), _twH);
  buildDrum('twMinInner', 60, v=>pad2(v), _twM);
  updateTWDisplay();
  setupDrumDrag('twHourDrum', 'twHourInner', 24, v=>{ _twH=v; updateTWDisplay(); });
  setupDrumDrag('twMinDrum', 'twMinInner', 60, v=>{ _twM=v; updateTWDisplay(); });
}

function setupDrumDrag(drumId, innerId, count, onChange) {
  const drum = document.getElementById(drumId);
  const inner = document.getElementById(innerId);
  if(!drum || !inner) return; // Guard: element may not exist on this page
  let startY=0, startCurrent=0, dragging=false, velocity=0, lastY=0, lastT=0;

  const onStart = (y) => {
    dragging = true;
    startY = y;
    startCurrent = inner._current;
    velocity = 0;
    lastY = y; lastT = Date.now();
    inner.style.transition = 'none';
  };
  const onMove = (y) => {
    if(!dragging) return;
    const now = Date.now();
    velocity = (lastY - y) / (now - lastT + 1);
    lastY=y; lastT=now;
    const delta = Math.round((startY - y) / 44);
    const newVal = ((startCurrent + delta) % count + count) % count;
    setDrumPos(inner, newVal, false);
  };
  const onEnd = () => {
    if(!dragging) return;
    dragging = false;
    let snap = inner._current;
    // Flick
    if(Math.abs(velocity) > 0.3) snap = ((snap + Math.round(velocity*4)) % count + count) % count;
    setDrumPos(inner, snap, true);
    onChange(snap);
  };

  // Touch
  drum.addEventListener('touchstart', e=>{ e.preventDefault(); onStart(e.touches[0].clientY); }, {passive:false});
  drum.addEventListener('touchmove', e=>{ e.preventDefault(); onMove(e.touches[0].clientY); }, {passive:false});
  drum.addEventListener('touchend', ()=>onEnd());
  // Mouse
  drum.addEventListener('mousedown', e=>{ onStart(e.clientY); });
  document.addEventListener('mousemove', e=>{ if(dragging) onMove(e.clientY); });
  document.addEventListener('mouseup', ()=>{ if(dragging) onEnd(); });
  // Mouse wheel support for desktop
  drum.addEventListener('wheel', e=>{
    e.preventDefault();
    const dir = e.deltaY > 0 ? 1 : -1;
    const newVal = (((inner._current||0) + dir) % count + count) % count;
    setDrumPos(inner, newVal, true);
    onChange(newVal);
  }, {passive: false});
  // Click items for quick select
  drum.addEventListener('click', e=>{
    const item = e.target.closest('.tw-item');
    if(!item || dragging) return;
    const items = Array.from(inner.children);
    const idx = items.indexOf(item);
    const val = idx % count;
    setDrumPos(inner, val, true);
    onChange(val);
  });
}

function updateTWDisplay() {
  const t = pad2(_twH)+' : '+pad2(_twM);
  const twDisp = document.getElementById('twDisplay');
  const iTime = document.getElementById('iTime');
  if(twDisp) twDisp.textContent = t;
  if(iTime) iTime.value = pad2(_twH)+':'+pad2(_twM);
}

function toggleTW() {
  const el = document.getElementById('twWrap');
  const isOpen = el.classList.contains('open');
  document.querySelectorAll('.custom-select.open,.custom-date.open').forEach(e=>e.classList.remove('open'));
  document.querySelectorAll('.tw-wrap.open').forEach(e=>e.classList.remove('open'));
  if(!isOpen) { el.classList.add('open'); }
}

function confirmTW() {
  document.getElementById('twWrap').classList.remove('open');
  updateConf();
}

// Close dropdowns on outside click
document.addEventListener('click', e=>{
  if(!e.target.closest('.custom-select')&&!e.target.closest('.custom-date')&&!e.target.closest('.tw-wrap')) {
    document.querySelectorAll('.custom-select.open,.custom-date.open,.tw-wrap.open').forEach(el=>el.classList.remove('open'));
  }
});

