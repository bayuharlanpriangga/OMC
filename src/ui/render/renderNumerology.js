function renderNumContent(container, D, name, dateStr) {
  // No tabs for numerology - uses its own internal layout
  container.innerHTML = `
    <div style="margin-bottom:28px">
      <div style="font-family:var(--font-mono);font-size:8px;letter-spacing:.38em;color:var(--gold);text-transform:uppercase;margin-bottom:16px;display:flex;align-items:center;gap:10px">Core Numbers <span style="flex:1;height:1px;background:var(--b1);display:block"></span></div>
      <div class="nxgrid" id="num-cards"></div>
    </div>
    <div id="num-detail-panel" class="num-detail-panel" style="margin-bottom:28px;display:none"></div>
    <div class="g2" style="margin-bottom:28px">
      <div class="panel"><div class="plabel">Cara Kalkulasi</div><div id="num-calc-breakdown"><div style="font-size:13px;color:var(--muted)">Klik angka di atas untuk detail.</div></div></div>
      <div style="display:flex;flex-direction:column;gap:20px">
        <div class="panel"><div class="plabel">Personal Year Number</div><div id="num-personal-year"></div></div>
        <div class="panel"><div class="plabel">Karmic Debt & Birthday</div><div id="num-karmic-birthday"></div></div>
      </div>
    </div>
    <div class="panel" style="margin-bottom:28px">
      <div class="plabel">Pinnacle Cycles — Empat Babak Kehidupan</div>
      <div id="num-pinnacles" style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:4px"></div>
    </div>
    <div class="g2">
      <div class="panel"><div class="plabel">Challenge Numbers</div><div id="num-challenges"></div></div>
      <div class="panel"><div class="plabel">Keselarasan Antar Angka</div><div id="num-harmony"></div></div>
    </div>`;
  setTimeout(()=>{ try { renderNumSectionFull(D); } catch(e){console.warn('num render:',e.message);} }, 100);
}

// ── ANALYSIS PAGE RENDERER ──
