function renderHDFull(D) {
  // Guard: only run if key elements exist in DOM
  if(!document.getElementById('hd-type-hero')) return;
  const {type:hdt,auth,prof,strategy,notSelf,definedCenters,undefinedCenters,
         sunGate:sg,moonGate:mg,ascGate:ag,earthGate:eg,designGate:dg,
         pPlanetData,dPlanetData,definedChannels} = D.hd;
  // Call the main HD section renderer (defined earlier in the file)
  // It already has all the gate data, profile data, authority data etc.
  renderHDSection(D);
}

// Safe wrapper — calls renderHDSection if it exists, else renderHDSectionFull
function renderHDSection(D) {
  try {
    // The main HD renderer is the big block that sets hd-type-hero, hd-cards etc.
    // We call it here after the DOM elements are injected by renderHDContent
    const hd = D.hd;
    renderHDSectionFull(D);
  } catch(e) {
    console.warn('renderHDSection error:', e.message);
  }
}

function renderHDContent(container, D, name) {
  const tabsEl = document.getElementById('hd-tabs');
  if(tabsEl) {
    tabsEl.innerHTML = `
      <button class="sit on" onclick="ssit('hd','overview',this)">Type & Profile</button>
      <button class="sit" onclick="ssit('hd','bodygraph',this)">Bodygraph</button>
      <button class="sit" onclick="ssit('hd','gates',this)">Gates</button>
      <button class="sit" onclick="ssit('hd','planets',this)">Planets</button>`;
  }

  container.innerHTML = `
    <!-- Tab: Type & Profile -->
    <div class="sitp on" id="sitp-hd-overview">
      <div class="g2" style="margin-bottom:20px">
        <div class="panel" style="padding:0;overflow:hidden">
          <div id="hd-type-hero"></div>
          <div style="padding:20px 24px">
            <div class="plabel" style="margin-bottom:12px">Core Numbers</div>
            <div class="hdcards" id="hd-cards"></div>
          </div>
        </div>
        <div class="panel">
          <div class="plabel">Profile</div>
          <div id="hd-profile-detail"></div>
        </div>
      </div>
      <div class="g2">
        <div class="panel">
          <div class="plabel">Authority — Cara Membuat Keputusan</div>
          <div id="hd-authority-detail"></div>
        </div>
        <div class="panel">
          <div class="plabel">Not-Self Theme & Shadow</div>
          <div id="hd-notself-detail"></div>
        </div>
      </div>
    </div>
    <!-- Tab: Bodygraph -->
    <div class="sitp" id="sitp-hd-bodygraph">
      <div class="g2">
        <div class="panel">
          <div class="plabel">Human Design Bodygraph</div>
          <div id="hdBodgraphSVG" style="display:flex;justify-content:center;padding:8px 0"></div>
          <div style="margin-top:12px">
            <div class="plabel" style="margin-bottom:10px">Centers</div>
            <div class="hd-center-grid" id="hd-center-grid"></div>
          </div>
        </div>
        <div class="panel">
          <div class="plabel">Active Channels</div>
          <div id="hd-channels" style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px"></div>
          <div style="margin-top:14px">
            <div class="plabel" style="margin-bottom:8px">Definition Type</div>
            <div id="hd-definition"></div>
          </div>
        </div>
      </div>
    </div>
    <!-- Tab: Gates -->
    <div class="sitp" id="sitp-hd-gates">
      <div style="font-family:var(--font-mono);font-size:8px;letter-spacing:.3em;color:var(--gold);text-transform:uppercase;margin-bottom:16px;display:flex;align-items:center;gap:10px">
        Gerbang Aktif <span style="flex:1;height:1px;background:var(--b1);display:block"></span>
        <span style="color:var(--muted);letter-spacing:.1em">klik untuk expand</span>
      </div>
      <div id="hd-gate-detail-cards"></div>
    </div>
    <!-- Tab: Planets -->
    <div class="sitp" id="sitp-hd-planets">
      <div class="g2">
        <div class="panel">
          <div class="plabel">Planetary Gates — Conscious ☉</div>
          <div style="font-family:var(--font-mono);font-size:8px;color:rgba(107,127,212,.6);letter-spacing:.15em;margin-bottom:10px">WARNA HITAM — YANG KAMU SADARI</div>
          <div id="hd-pgates"></div>
        </div>
        <div class="panel">
          <div class="plabel">Planetary Gates — Unconscious ◗</div>
          <div style="font-family:var(--font-mono);font-size:8px;color:rgba(107,127,212,.35);letter-spacing:.15em;margin-bottom:10px">WARNA MERAH — TIDAK DISADARI</div>
          <div id="hd-dgates"></div>
        </div>
      </div>
    </div>`;

  setTimeout(()=>{
    // Trigger HD section full renderer which sets all the innerHTML above
    const hdRenderer = window._renderHD || renderHDFull;
    if(typeof renderHDFull === 'function') renderHDFull(D);
    // Draw bodygraph after layout settles
    setTimeout(()=>{
      const allGates=[...new Set([...D.hd.pPlanetData.map(p=>p.gate),...D.hd.dPlanetData.map(p=>p.gate)])];
      renderHDBodygraph(document.getElementById('hdBodgraphSVG'),D.hd.definedCenters,allGates,D.hd.type);
    },300);
  }, 100);
}

