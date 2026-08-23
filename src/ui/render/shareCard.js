// ═══════════════════════════════════════════════════════════
//  SHARE CARD
// ═══════════════════════════════════════════════════════════
let _shareType = 'soul';
function setShareType(type, btn) {
  _shareType = type;
  document.querySelectorAll('#t-share .tb-btn').forEach(b=>b.classList.remove('on'));
  btn.classList.add('on');
  renderShareCard();
}
function renderShareCard() {
  const D = _D, n = _raw.name;
  if(!D.sunSign) return;
  const lp = D.numerology.lp;
  const LP_MEANING2={1:'Pemimpin',2:'Diplomat',3:'Kreator',4:'Builder',5:'Petualang',6:'Pemelihara',7:'Pencari',8:'Penguasa',9:'Humanis',11:'Master Intuitif',22:'Master Builder',33:'Master Teacher'};
  const card = document.getElementById('shareCardContent');
  if(_shareType === 'soul') {
    card.innerHTML = `
      <div style="font-family:var(--font-mono);font-size:8px;letter-spacing:.4em;color:rgba(201,168,76,0.5);margin-bottom:20px">SOUL SCORE</div>
      <div style="font-family:var(--font-serif);font-size:80px;font-weight:300;color:var(--gold);line-height:1;margin-bottom:4px">${D.soulScore}</div>
      <div style="font-family:var(--font-mono);font-size:9px;letter-spacing:.3em;color:var(--muted);margin-bottom:24px">${D.soulLabel.toUpperCase()}</div>
      <div style="font-family:var(--font-serif);font-size:22px;font-weight:300;color:var(--text);margin-bottom:6px">${n}</div>
      <div style="font-family:var(--font-mono);font-size:9px;letter-spacing:.2em;color:var(--muted)">${D.sunSign} ☉ · ${D.hd.type} · LP${lp}</div>`;
  } else if(_shareType === 'blueprint') {
    card.innerHTML = `
      <div style="font-family:var(--font-mono);font-size:8px;letter-spacing:.4em;color:rgba(201,168,76,0.5);margin-bottom:20px">ENERGETIC BLUEPRINT</div>
      <div style="font-family:var(--font-serif);font-size:26px;font-weight:300;color:var(--text);margin-bottom:20px">${n}</div>
      ${[
        ['☉ Sun', D.sunSign],['☽ Moon', D.moonSign],['↑ Ascendant', D.ascSign],
        ['HD Type', D.hd.type],['Authority', D.hd.auth],['Life Path', String(lp)+' · '+LP_MEANING2[lp]],
        ['Day Master', D.bazi.dayMaster],['Soul Score', String(D.soulScore)],
      ].map(([l,v])=>`<div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid rgba(255,255,255,0.05)"><span style="font-family:var(--font-mono);font-size:9px;letter-spacing:.15em;color:var(--muted)">${l}</span><span style="font-family:var(--font-serif);font-size:14px;color:var(--text)">${v}</span></div>`).join('')}`;
  } else if(_shareType === 'shadow') {
    const sh = D.shadows[0];
    card.innerHTML = `
      <div style="font-family:var(--font-mono);font-size:8px;letter-spacing:.4em;color:rgba(196,96,74,0.6);margin-bottom:16px">SHADOW ARCHETYPE</div>
      <div style="font-size:28px;margin-bottom:12px">${sh.icon}</div>
      <div style="font-family:var(--font-serif);font-size:20px;font-weight:400;color:var(--text);margin-bottom:14px">${sh.title}</div>
      <div style="font-family:var(--font-serif);font-size:15px;font-style:italic;color:var(--dim);line-height:1.75;margin-bottom:20px">"${sh.body.slice(0,120)}..."</div>
      <div style="font-family:var(--font-mono);font-size:9px;letter-spacing:.2em;color:var(--muted)">${n} · ${D.sunSign} ☉ · ${D.hd.type}</div>`;
  } else if(_shareType === 'daily') {
    const jdNow = toJD(new Date().getFullYear(), new Date().getMonth()+1, new Date().getDate(), 12);
    const ms = lonToSign(moonLongitude(jdNow));
    const today = new Date().toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'});
    card.innerHTML = `
      <div style="font-family:var(--font-mono);font-size:8px;letter-spacing:.4em;color:rgba(201,168,76,0.5);margin-bottom:16px">DAILY ENERGY · ${today.toUpperCase()}</div>
      <div style="font-family:var(--font-serif);font-size:42px;font-weight:300;color:var(--gold);line-height:1;margin-bottom:8px">☽ ${ms.sign}</div>
      <div style="font-family:var(--font-sans);font-size:13px;color:var(--dim);line-height:1.7;margin-bottom:18px">Moon transit ${ms.sign} ${ms.deg}° — hari ini favors ${{'Fire':'action & inisiasi','Earth':'detail & eksekusi','Air':'komunikasi & ide','Water':'refleksi & koneksi'}[{'Aries':'Fire','Taurus':'Earth','Gemini':'Air','Cancer':'Water','Leo':'Fire','Virgo':'Earth','Libra':'Air','Scorpio':'Water','Sagittarius':'Fire','Capricorn':'Earth','Aquarius':'Air','Pisces':'Water'}[ms.sign]]||'balance'}.</div>
      <div style="font-family:var(--font-mono);font-size:9px;letter-spacing:.2em;color:var(--muted)">${n} · Soul Score ${D.soulScore}</div>`;
  }
}

// Stars bg — reduced on mobile for performance
(()=>{
  const isMobile = window.innerWidth < 768;
  const count = isMobile ? 90 : 200;
  const bg=document.createElement('div');
  bg.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden';
  document.body.insertBefore(bg,document.body.firstChild);
  const sty=document.createElement('style');
  sty.textContent='@keyframes st0{0%,100%{opacity:.04}50%{opacity:.95}}@keyframes st1{0%,100%{opacity:.08}50%{opacity:.7}}@keyframes st2{0%,100%{opacity:.02}50%{opacity:.5}}';
  document.head.appendChild(sty);
  for(let i=0;i<count;i++){
    const s=document.createElement('div');
    const sz=Math.random()*2.2+0.3;
    const isGlowing=Math.random()>.85;
    const glow=isGlowing?`0 0 ${Math.round(sz*3)}px rgba(255,255,255,0.9)`:'none';
    s.style.cssText=`position:absolute;width:${sz}px;height:${sz}px;border-radius:50%;background:#fff;box-shadow:${glow};left:${Math.random()*100}%;top:${Math.random()*100}%;animation:st${i%3} ${(Math.random()*9+4).toFixed(1)}s ${(Math.random()*8).toFixed(1)}s ease-in-out infinite`;
    bg.appendChild(s);
  }
})();


