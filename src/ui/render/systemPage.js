function updateConfSys(sysId) {
  const t=!!document.getElementById('iTime-'+sysId)?.value;
  const confirmed=document.getElementById('iCityConfirmed-'+sysId)?.value==='1';
  const d=!!document.getElementById('iDate-'+sysId)?.value;
  const ch=document.getElementById('chint-'+sysId);
  const dot=document.getElementById('cdot-'+sysId);
  const txt=document.getElementById('ctxt-'+sysId);
  if(!d||!ch) return;
  ch.style.display='flex';
  if(t&&confirmed){dot.style.background='var(--green)';txt.textContent='Presisi tinggi';}
  else if(confirmed){dot.style.background='var(--gold)';txt.textContent='Sedang · Tambahkan jam lahir';}
  else{dot.style.background='var(--red)';txt.textContent='Pilih kota dari daftar';}
}

// ── MAIN RUN CALCULATION ──
function runSysCalc(sysId) {
  const name=(document.getElementById('iName-'+sysId)?.value||'').trim()||'Unknown';
  const date=document.getElementById('iDate-'+sysId)?.value||'';
  const time=document.getElementById('iTime-'+sysId)?.value||'';
  const cityRaw=(document.getElementById('iCity-'+sysId)?.value||'').trim();
  const confirmed=document.getElementById('iCityConfirmed-'+sysId)?.value==='1';
  const gen=document.getElementById('iGen-'+sysId)?.value||'m';

  if(!date){ alert('Pilih tanggal lahir terlebih dahulu.'); return; }
  if(!cityRaw||!confirmed){
    const inp=document.getElementById('iCity-'+sysId);
    if(inp) inp.classList.add('error');
    const st=document.getElementById('cityStatus-'+sysId);
    if(st){ st.className='city-status err'; st.textContent='⚠ Pilih kota dari daftar dropdown'; }
    return;
  }

  const lat=parseFloat(document.getElementById('iCityLat-'+sysId)?.value||0);
  const lon=parseFloat(document.getElementById('iCityLon-'+sysId)?.value||0);
  const tz=parseFloat(document.getElementById('iCityTz-'+sysId)?.value||7);

  // Show loading
  document.getElementById('loading').classList.add('on');
  const steps=document.querySelectorAll('.ls');
  let i=0;
  steps.forEach(s=>{s.classList.remove('go','ok');});
  const iv=setInterval(()=>{
    if(i>0){steps[i-1].classList.remove('go');steps[i-1].classList.add('ok');}
    if(i<steps.length){steps[i].classList.add('go');i++;}
    else{
      clearInterval(iv);
      setTimeout(()=>{
        try{
          // Build city string with gender for BaZi
          const cityFull = gen==='f' ? cityRaw+' female' : cityRaw;
          const D = computeChart(name,date,time,cityFull,lat,lon,tz);
          _globalD = D;
          _globalRaw = {name,dateStr:date,timeStr:time,city:cityRaw,gen,lat,lon,tz};
          document.getElementById('loading').classList.remove('on');
          renderSystemPage(sysId, name, date, time, cityRaw, D);
          updateAllExistingButtons();
        }catch(err){
          document.getElementById('loading').classList.remove('on');
          console.error('Compute error:',err);
          alert('Terjadi kesalahan saat menghitung. Coba lagi.');
        }
      },500);
    }
  },280);
}

function useExistingData(sysId) {
  if(!_globalD||!_globalRaw) return;
  renderSystemPage(sysId,_globalRaw.name,_globalRaw.dateStr,_globalRaw.timeStr,_globalRaw.city,_globalD);
}

function updateAllExistingButtons() {
  if(!_globalD||!_globalRaw) return;
  ['astro','hd','bazi','ziwei','num'].forEach(sid => {
    const eu=document.getElementById('use-existing-'+sid);
    const en=document.getElementById('existing-name-'+sid);
    if(eu&&en) {
      eu.style.display='block';
      en.textContent=`${_globalRaw.name} · ${_globalRaw.dateStr} · ${_globalRaw.city}`;
    }
  });
}

// ── RENDER SYSTEM PAGE RESULTS ──
function renderSystemPage(sysId, name, dateStr, timeStr, city, D) {
  // Show output, hide empty state
  document.getElementById(sysId+'-empty').style.display='none';
  const out=document.getElementById(sysId+'-output');
  if(out) {out.classList.add('visible'); out.style.display='block';}

  // Render header
  const dd=new Date(dateStr);
  const dateFmt=dd.toLocaleDateString('id-ID',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
  const hdr=document.getElementById(sysId+'-result-header');
  if(hdr) {
    const badges = getSystemBadges(sysId, D);
    hdr.innerHTML=`
      <div class="srh-name">${name}</div>
      <div class="srh-meta">${dateFmt}${timeStr?' · '+timeStr:''} · ${city}</div>
      <div class="srh-badges">${badges}</div>`;
  }

  // Render content based on system
  const content = document.getElementById(sysId+'-content');
  if(!content) return;

  switch(sysId) {
    case 'astro':
      renderAstroContent(content, D, name, dateStr);
      break;
    case 'hd':
      renderHDContent(content, D, name);
      break;
    case 'bazi':
      renderBaziContent(content, D, name);
      break;
    case 'ziwei':
      renderZiweiContent(content, D, name);
      break;
    case 'num':
      renderNumContent(content, D, name, dateStr);
      break;
  }

  setTimeout(()=>triggerCanvasRedraw(sysId),300);
}

function getSystemBadges(sysId, D) {
  const lp = D.numerology?.lp;
  const bdg = (text,cls) => `<span class="badge ${cls}">${text}</span>`;
  switch(sysId) {
    case 'astro': return bdg(D.sunSign+' ☉','bg')+bdg(D.moonSign+' ☽','bb')+bdg(D.ascSign+' ↑','bp');
    case 'hd':   return bdg(D.hd.type,'bb')+bdg(D.hd.auth+' Auth','bp')+bdg(D.hd.prof+' Profile','bt');
    case 'bazi': return bdg(D.bazi.dayMaster,'br')+bdg('Fav: '+D.bazi.favEl,'bg')+bdg('Kua '+D.bazi.kuaNum,'bt');
    case 'ziwei': return bdg(D.zw.main.split(' ').slice(1).join(' '),'bg')+bdg('Palace '+( D.zw.life+1),'bb');
    case 'num':  return bdg('LP '+lp,'bg')+bdg('Dest '+D.numerology?.dest,'bb')+bdg('Soul '+D.numerology?.soul,'bp');
    default: return '';
  }
}

// ── SYSTEM CONTENT RENDERERS ──
// These wrap the existing panel HTML

