function initSysDatePicker(sysId) {
  const state = _sysPickerState[sysId] = { year: 1995, month: 1, selected: null };
  
  // Populate month dropdown
  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  const mDrop = document.getElementById('monthSel-'+sysId+'Dropdown');
  if(mDrop) mDrop.innerHTML = months.map((m,i)=>
    `<div class="cs-opt" onclick="setSysMonth('${sysId}',${i+1},'${m}')">${m}</div>`).join('');
  
  // Populate year dropdown
  const yDrop = document.getElementById('yearSel-'+sysId+'Dropdown');
  if(yDrop) {
    let yHtml = '';
    for(let y=new Date().getFullYear();y>=1900;y--) {
      yHtml += `<div class="cs-opt" onclick="setSysYear('${sysId}',${y})">${y}</div>`;
    }
    yDrop.innerHTML = yHtml;
    // Ensure scrollable
    yDrop.style.maxHeight = '200px';
    yDrop.style.overflowY = 'auto';
  }
  renderSysCdGrid(sysId);
}

function setSysMonth(sysId, m, label) {
  _sysPickerState[sysId].month = m;
  const v = document.getElementById('monthVal-'+sysId);
  if(v) v.textContent = label;
  renderSysCdGrid(sysId);
  const sel = document.getElementById('monthSel-'+sysId);
  if(sel) sel.classList.remove('open');
}

function setSysYear(sysId, y) {
  _sysPickerState[sysId].year = y;
  const v = document.getElementById('yearVal-'+sysId);
  if(v) v.textContent = y;
  renderSysCdGrid(sysId);
  const sel = document.getElementById('yearSel-'+sysId);
  if(sel) sel.classList.remove('open');
}

function cdNavYearSys(sysId, dir) {
  const s = _sysPickerState[sysId];
  if(!s) return;
  s.year += dir;
  const v = document.getElementById('yearVal-'+sysId);
  if(v) v.textContent = s.year;
  renderSysCdGrid(sysId);
}

function renderSysCdGrid(sysId) {
  const s = _sysPickerState[sysId];
  if(!s) return;
  const grid = document.getElementById('cdGrid-'+sysId);
  if(!grid) return;
  const {year,month,selected} = s;
  const firstDay = new Date(year,month-1,1).getDay();
  const daysInMonth = new Date(year,month,0).getDate();
  const today = new Date();
  let html = '';
  for(let i=0;i<firstDay;i++) html+=`<div class="cd-day empty"></div>`;
  for(let d=1;d<=daysInMonth;d++) {
    const isToday=d===today.getDate()&&month===today.getMonth()+1&&year===today.getFullYear();
    const isSel=selected&&selected===`${year}-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    html+=`<div class="cd-day${isToday?' today':''}${isSel?' selected':''}" onclick="selectSysDay('${sysId}',${d})">${d}</div>`;
  }
  grid.innerHTML = html;
}

function selectSysDay(sysId, d) {
  const s = _sysPickerState[sysId];
  if(!s) return;
  const dateStr = `${s.year}-${String(s.month).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  s.selected = dateStr;
  const disp = document.getElementById('dateDisplay-'+sysId);
  if(disp) { disp.textContent = `${d} ${['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'][s.month-1]} ${s.year}`; disp.style.color=''; }
  const inp = document.getElementById('iDate-'+sysId);
  if(inp) inp.value = dateStr;
  renderSysCdGrid(sysId);
  // Close picker
  const dp = document.getElementById('datePicker-'+sysId);
  if(dp) dp.classList.remove('open');
}


// ── Close ALL open pickers (called before opening any new one) ──
function closeAllSysPickers(exceptId) {
  document.querySelectorAll('.custom-select.open').forEach(el=>{
    if(!exceptId || el.id !== exceptId) el.classList.remove('open');
  });
  document.querySelectorAll('.custom-date.open').forEach(el=>{
    if(!exceptId || el.id !== exceptId) el.classList.remove('open');
  });
  document.querySelectorAll('.tw-wrap.open').forEach(el=>{
    if(!exceptId || el.id !== exceptId) el.classList.remove('open');
  });
}
function toggleDatePickerSys(sysId) {
  const dp = document.getElementById('datePicker-'+sysId);
  if(!dp) return;
  const isOpen = dp.classList.contains('open');
  closeAllSysPickers('datePicker-'+sysId);
  if(!isOpen) dp.classList.add('open');
}

// Track which sys drums have been initialized
const _sysDrumInit = {};

function initSysTimePicker(sysId) {
  const hourInner = document.getElementById('twHourInner-'+sysId);
  const minInner  = document.getElementById('twMinInner-'+sysId);
  if(!hourInner||!minInner) return;
  if(_sysDrumInit[sysId]) return;
  _sysDrumInit[sysId] = true;

  // Use buildDrum so _current, _count are set correctly (same as legacy drums)
  buildDrum('twHourInner-'+sysId, 24, v=>String(v).padStart(2,'0'), 7);
  buildDrum('twMinInner-'+sysId,  60, v=>String(v).padStart(2,'0'), 30);

  // Setup drag + wheel AFTER DOM is ready
  requestAnimationFrame(()=>{
    setupDrumDrag('twHourDrum-'+sysId, 'twHourInner-'+sysId, 24, ()=>{});
    setupDrumDrag('twMinDrum-'+sysId,  'twMinInner-'+sysId,  60, ()=>{});
  });
}

function toggleTWSys(sysId) {
  const tw = document.getElementById('twWrap-'+sysId);
  if(!tw) return;
  const isOpen = tw.classList.contains('open');
  closeAllSysPickers('twWrap-'+sysId);
  if(!isOpen) {
    tw.classList.add('open');
    initSysTimePicker(sysId);
  }
}

function confirmTWSys(sysId) {
  const hi=document.getElementById('twHourInner-'+sysId);
  const mi=document.getElementById('twMinInner-'+sysId);
  if(!hi||!mi) return;
  const h = Math.min(23, hi._current||0);
  const m = Math.min(59, mi._current||0);
  const hStr=String(h).padStart(2,'0');
  const mStr=String(m).padStart(2,'0');
  const disp=document.getElementById('twDisplay-'+sysId);
  const inp=document.getElementById('iTime-'+sysId);
  if(disp) disp.textContent=`${hStr} : ${mStr}`;
  if(inp) inp.value=`${hStr}:${mStr}`;
  const tw=document.getElementById('twWrap-'+sysId);
  if(tw) tw.classList.remove('open');
}

// City autocomplete for system forms
function onCityInputSys(sysId) {
  const inp = document.getElementById('iCity-'+sysId);
  if(!inp) return;
  onCityInput_Generic(inp.value, sysId);
}
function onCityBlurSys(sysId) {
  // Only hide if user didn't click on a dropdown item
  setTimeout(()=>{
    const dd=document.getElementById('cityDropdown-'+sysId);
    if(dd && !dd._selecting) dd.classList.remove('show');
  }, 300);
}

// Store city results per sysId to avoid inline string issues
const _cityResults = {};

// Reuse the city database from original
function onCityInput_Generic(val, sysId) {
  const dd = document.getElementById('cityDropdown-'+sysId);
  const st = document.getElementById('cityStatus-'+sysId);
  if(!dd) return;
  const v = val.trim().toLowerCase();
  if(v.length < 1){ dd.classList.remove('show'); return; }

  // CITY_DB uses {n, lat, lon, tz} object format
  const db = typeof CITY_DB !== 'undefined' ? CITY_DB : [];
  const results = db.filter(c => c.n.toLowerCase().includes(v)).slice(0, 8);

  if(!results.length){ dd.classList.remove('show'); return; }

  // Store results by index to avoid special char issues in HTML attrs
  _cityResults[sysId] = results;

  dd.innerHTML = results.map((c, idx) => {
    const tzStr = c.tz >= 0 ? 'UTC+'+c.tz : 'UTC'+c.tz;
    const latStr = (c.lat >= 0 ? '+' : '') + c.lat.toFixed(4);
    const lonStr = (c.lon >= 0 ? '+' : '') + c.lon.toFixed(4);
    return `<div class="city-opt" data-idx="${idx}" data-sysid="${sysId}"
      onmousedown="cityOptMouseDown(event,this)">
      <span class="city-opt-name">${c.n}</span>
      <span class="city-opt-meta">${latStr} ${lonStr} · ${tzStr}</span>
    </div>`;
  }).join('');
  dd.classList.add('show');
}

function cityOptMouseDown(e, el) {
  // Prevent blur from firing before we can process the selection
  e.preventDefault();
  const sysId = el.dataset.sysid;
  const idx   = parseInt(el.dataset.idx);
  const city  = (_cityResults[sysId] || [])[idx];
  if(!city) return;
  selectCitySys(sysId, city.n, city.lat, city.lon, city.tz);
}

function selectCitySys(sysId, name, lat, lon, tz) {
  const inp=document.getElementById('iCity-'+sysId);
  const dd=document.getElementById('cityDropdown-'+sysId);
  const st=document.getElementById('cityStatus-'+sysId);
  if(inp) { inp.value=name; inp.classList.remove('error'); inp.classList.add('confirmed'); }
  if(dd) dd.classList.remove('show');
  document.getElementById('iCityLat-'+sysId).value=lat;
  document.getElementById('iCityLon-'+sysId).value=lon;
  document.getElementById('iCityTz-'+sysId).value=tz;
  document.getElementById('iCityConfirmed-'+sysId).value='1';
  if(st){ st.className='city-status'; st.textContent=''; }
  // Close chint update
  updateConfSys(sysId);
}

