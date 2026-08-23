// ═══════════════════════════════════════════════════════════
//  FLOW
// ═══════════════════════════════════════════════════════════
function toStep2(){
  if(!document.getElementById('iName').value.trim()){document.getElementById('iName').focus();return;}
  document.getElementById('fs1').classList.remove('on');
  document.getElementById('fs2').classList.add('on');
}

var _iCityInput = document.getElementById('iCity'); if(_iCityInput) _iCityInput.addEventListener('input', updateConf);
function updateConf(){
  const iTimeEl=document.getElementById('iTime');
  const iCityConfEl=document.getElementById('iCityConfirmed');
  const iDateEl=document.getElementById('iDate');
  if(!iTimeEl||!iCityConfEl||!iDateEl) return; // Guard: legacy form elements may not exist
  const t=!!iTimeEl.value;
  const confirmed=iCityConfEl.value==='1';
  const d=!!iDateEl.value;
  const ch=document.getElementById('chint'),dot=document.getElementById('cdot'),txt=document.getElementById('ctxt');
  if(!d) return;
  ch.style.display='flex';
  if(t&&confirmed){dot.style.background='var(--green)';txt.textContent='Presisi tinggi · Koordinat akurat, Ascendant & BaZi Hour tersedia.';}
  else if(!t&&confirmed){dot.style.background='var(--gold)';txt.textContent='Sedang · Koordinat kota OK, tapi jam lahir diperlukan untuk Ascendant & BaZi Hour.';}
  else if(t&&!confirmed){dot.style.background='var(--gold)';txt.textContent='Sedang · Pilih kota dari daftar untuk koordinat akurat.';}
  else{dot.style.background='var(--red)';txt.textContent='Rendah · Pilih kota dari daftar & tambahkan jam lahir untuk hasil akurat.';}
}

function runCalc(){
  const name=document.getElementById('iName').value.trim()||'Unknown';
  const date=document.getElementById('iDate').value;
  const time=document.getElementById('iTime').value;
  const cityRaw=document.getElementById('iCity').value.trim();
  const confirmed=document.getElementById('iCityConfirmed').value==='1';

  if(!date||date===''){alert('Pilih tanggal lahir terlebih dahulu.');return;}

  if(!cityRaw){
    document.getElementById('iCity').focus();
    document.getElementById('iCity').classList.add('error');
    const st=document.getElementById('cityStatus');
    st.className='city-status err';
    st.textContent='⚠ Kota kelahiran wajib diisi untuk akurasi Ascendant & BaZi.';
    return;
  }
  if(!confirmed){
    document.getElementById('iCity').classList.add('error');
    const st=document.getElementById('cityStatus');
    st.className='city-status err';
    st.textContent='⚠ Pilih kota dari daftar dropdown agar koordinat tersimpan akurat.';
    document.getElementById('iCity').focus();
    return;
  }

  const lat=parseFloat(document.getElementById('iCityLat').value);
  const lon=parseFloat(document.getElementById('iCityLon').value);
  const tz=parseFloat(document.getElementById('iCityTz').value);

  document.getElementById('landing').style.display='none';
  document.getElementById('loading').classList.add('on');
  const steps=document.querySelectorAll('.ls');
  let i=0;
  const iv=setInterval(()=>{
    if(i>0){steps[i-1].classList.remove('go');steps[i-1].classList.add('ok');}
    if(i<steps.length){steps[i].classList.add('go');i++;}
    else{
      clearInterval(iv);
      setTimeout(()=>{
        try {
          const D=computeChart(name,date,time,cityRaw,lat,lon,tz);
          markDirty();
          document.getElementById('loading').classList.remove('on');
          document.getElementById('dash').classList.add('on');
          render(name,date,time,cityRaw,D);
          setTimeout(()=>{
            document.querySelectorAll('.tfill,.soul-dim-fill').forEach(e=>{
              const s=e.dataset.s; if(s) e.style.width=s+'%';
            });
          },400);
        } catch(err) {
          document.getElementById('loading').classList.remove('on');
          document.getElementById('landing').style.display='';
          console.error('OMC compute error:', err);
          alert('Terjadi kesalahan saat menghitung chart. Coba lagi.');
        }
      },500);
    }
  },280);
}

// Dirty flags — prevent redundant redraws
const _rendered = {};
function markDirty() { Object.keys(_rendered).forEach(k=>delete _rendered[k]); }

function stab(id,btn){
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('on'));
  document.querySelectorAll('.tp').forEach(p=>p.classList.remove('on'));
  btn.classList.add('on');
  document.getElementById('t-'+id).classList.add('on');
  setTimeout(()=>{
    if((id==='overview'||id==='astro') && _D.lons) {
      const nc=document.getElementById('natalC');
      const tt=document.getElementById('natalTT');
      if(!_rendered.natal){ drawNatal(nc,_D,tt); setupNatalHover(nc,_D,tt); _rendered.natal=1; }
      if(!_rendered.elem){ drawElemPie(document.getElementById('elemC'),_D.elCounts,null); _rendered.elem=1; }
    }
    if(id==='bazi'&&_D.bazi&&!_rendered.baziElem){
      drawBaziElem(document.getElementById('baziElemC'),_D.bazi.baziEls,_D.bazi.favEl);
      _rendered.baziElem=1;
    }
    if(id==='hd'&&_D.hd&&!_rendered.hd){
      renderHDBodygraph(document.getElementById('hdBodgraphSVG'),_D.hd.definedCenters,[...(new Set([..._D.hd.pPlanetData.map(p=>p.gate),..._D.hd.dPlanetData.map(p=>p.gate)]))],_D.hd.type);
      _rendered.hd=1;
    }
    if(id==='ziwei'&&_D.zw&&!_rendered.ziwei){
      drawZiWei(document.getElementById('zwC'),_D.zw.life,_D.zw.career,_D.zw.wealth);
      _rendered.ziwei=1;
    }
    if(id==='transit'&&!_rendered.transRadar){
      drawRadar(document.getElementById('transRadarC'),_D.traits);
      _rendered.transRadar=1;
    }
    if(id==='compat') { initDatePicker2(); initWheels2(); }
    if(id==='share'&&_D.sunSign) renderShareCard();
    document.querySelectorAll('.tfill').forEach(e=>{const s=e.dataset.s;if(s&&!e.style.width)e.style.width=s+'%';});
  },60);
}

function reset(){
  markDirty();
  _cityConfirmed = false;
  document.getElementById('iCityConfirmed').value='0';
  document.getElementById('iCity').value='';
  document.getElementById('iCity').classList.remove('confirmed','error');
  document.getElementById('cityStatus').textContent='';
  document.getElementById('cityStatus').className='city-status';
  document.getElementById('dash').classList.remove('on');
  document.getElementById('landing').style.display='';
  document.getElementById('fs2').classList.remove('on');
  document.getElementById('fs1').classList.add('on');
  document.querySelectorAll('.ls').forEach(s=>s.classList.remove('go','ok'));
  _c2Confirmed=false; _c2TimeSet=false; _c2CityConfirmed=false;
  document.getElementById('ccConfirmed').value='0';
  document.getElementById('compat-res').style.display='none';
  document.querySelectorAll('.tab').forEach((t,i)=>t.classList.toggle('on',i===0));
  document.querySelectorAll('.tp').forEach((p,i)=>p.classList.toggle('on',i===0));
}

