function renderZiweiContent(container, D, name) {
  const tabsEl = document.getElementById('ziwei-tabs');
  if(tabsEl) tabsEl.innerHTML = `<button class="sit on" onclick="ssit('ziwei','main',this)">Palace Map</button><button class="sit" onclick="ssit('ziwei','stars',this)">Stars</button>`;
  container.innerHTML = `
    <div class="sitp on" id="sitp-ziwei-main">
      <div class="g2">
        <div class="panel"><div class="plabel">紫微斗數 Palace Map</div><canvas id="zwC" width="400" height="400" style="display:block;margin:0 auto"></canvas></div>
        <div style="display:flex;flex-direction:column;gap:18px">
          <div class="panel"><div class="plabel">Main Star</div><div class="ptitle" id="zw-title">—</div><div class="psub" id="zw-sub">—</div></div>
          <div class="panel"><div class="plabel">Palace Grid</div><div id="zw-palaces" class="zw-grid"></div></div>
        </div>
      </div>
    </div>
    <div class="sitp" id="sitp-ziwei-stars">
      <div class="panel"><div class="plabel">Star Reading</div><div class="iq" id="zw-insight">—</div><div class="iq" id="zw-desc" style="margin-top:8px">—</div></div>
    </div>`;
  setTimeout(()=>{ try { renderZiweiSectionFull(D); } catch(e){console.warn('ziwei render:',e.message);} }, 100);
}

