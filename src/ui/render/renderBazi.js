function renderBaziContent(container, D, name) {
  const tabsEl = document.getElementById('bazi-tabs');
  if(tabsEl) {
    tabsEl.innerHTML = `
      <button class="sit on" onclick="ssit('bazi','pillars',this)">Four Pillars</button>
      <button class="sit" onclick="ssit('bazi','elements',this)">Elements</button>
      <button class="sit" onclick="ssit('bazi','luck',this)">Luck Pillars</button>
      <button class="sit" onclick="ssit('bazi','stars',this)">Stars & Kua</button>`;
  }
  container.innerHTML = `
    <div class="sitp on" id="sitp-bazi-pillars">
      <div style="font-family:var(--font-mono);font-size:8px;letter-spacing:.38em;color:var(--gold);text-transform:uppercase;margin-bottom:16px">Four Pillars · 四柱命理</div>
      <div class="bpillars" id="bz-pillars"></div>
      <div class="g2" style="margin-top:20px">
        <div class="panel"><div class="plabel">Day Master · 日主</div><div id="bz-dm-hero"></div><div id="bz-10gods"></div></div>
        <div class="panel"><div class="plabel">Pembacaan</div><div class="iq" id="bz-insight">—</div><div class="sbox" style="margin-top:12px"><div class="slabel">Element Challenge</div><div class="stext" id="bz-shadow">—</div></div></div>
      </div>
    </div>
    <div class="sitp" id="sitp-bazi-elements">
      <div class="g2">
        <div class="panel"><div class="plabel">Five Elements · 五行 Balance</div><div id="bz-el-bars" style="margin-bottom:14px"></div><div style="display:flex;justify-content:center"><canvas id="baziElemC" width="200" height="200"></canvas></div><div class="epills" id="bz-epills"></div></div>
        <div class="panel"><div class="plabel">Kua Number · 卦數 & Arah</div><div id="bz-kua"></div></div>
      </div>
    </div>
    <div class="sitp" id="sitp-bazi-luck">
      <div class="panel"><div class="plabel">Luck Pillars · 大運 (Da Yun)</div><div id="bz-luck"></div></div>
    </div>
    <div class="sitp" id="sitp-bazi-stars">
      <div class="panel"><div class="plabel">Symbolic Stars · 神煞</div><div id="bz-stars"></div></div>
    </div>`;
  setTimeout(()=>{ try { renderBaziSectionFull(D); setTimeout(()=>drawBaziElem(document.getElementById('baziElemC'),D.bazi.baziEls,D.bazi.favEl),300); } catch(e){console.warn('bazi render:',e.message);} }, 100);
}

